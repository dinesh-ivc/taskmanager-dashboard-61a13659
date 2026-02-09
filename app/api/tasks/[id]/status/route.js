import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [todo, in-progress, review, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

export async function PATCH(request, { params }) {
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

    const taskId = params.id;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['todo', 'in-progress', 'review', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // First check if the task exists and user has permission to update it
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { success: false, error: 'Task not found' },
          { status: 404 }
        );
      }
      throw new Error(fetchError.message);
    }

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update the status
    const updates = { status };
    
    // Update completed_at based on status
    if (status === 'completed' && !existingTask.completed_at) {
      updates.completed_at = new Date().toISOString();
    } else if (status !== 'completed') {
      updates.completed_at = null;
    }

    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      success: true,
      data: updatedTask
    });

  } catch (error) {
    console.error('Update task status error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}