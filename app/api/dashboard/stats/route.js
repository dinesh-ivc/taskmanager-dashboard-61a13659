import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for the authenticated user
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify and decode JWT
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Get total tasks
    const totalTasksQuery = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`);
    const totalTasksResult = await totalTasksQuery;

    // Get completed tasks
    const completedTasksQuery = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`)
      .eq('status', 'completed');
    const completedTasksResult = await completedTasksQuery;

    // Get pending tasks (not started/completed)
    const pendingTasksQuery = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`)
      .neq('status', 'completed');
    const pendingTasksResult = await pendingTasksQuery;

    // Get overdue tasks
    const dueDate = new Date().toISOString();
    const overdueTasksQuery = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`)
      .lt('due_date', dueDate)
      .neq('status', 'completed');
    const overdueTasksResult = await overdueTasksQuery;

    if (
      totalTasksResult.error ||
      completedTasksResult.error ||
      pendingTasksResult.error ||
      overdueTasksResult.error
    ) {
      const error = totalTasksResult.error ||
                    completedTasksResult.error ||
                    pendingTasksResult.error ||
                    overdueTasksResult.error;
      throw new Error(error.message);
    }

    const stats = {
      totalTasks: totalTasksResult.count || 0,
      completedTasks: completedTasksResult.count || 0,
      pendingTasks: pendingTasksResult.count || 0,
      overdueTasks: overdueTasksResult.count || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}