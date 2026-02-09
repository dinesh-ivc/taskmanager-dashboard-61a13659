import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a specific task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved task
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

export async function GET(request, { params }) {
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
    const supabase = createAdminClient();

    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .or(`created_by.eq.${decodedToken.userId},assigned_to.eq.${decodedToken.userId}`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { success: false, error: 'Task not found' },
          { status: 404 }
        );
      }
      throw new Error(error.message);
    }

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a specific task
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               assigned_to:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

export async function PUT(request, { params }) {
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
    const { title, description, status, priority, due_date, assigned_to } = await request.json();

    const supabase = createAdminClient();

    // First check if the task exists and user has permission to edit it
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

    // Prepare updates
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) {
      // Validate status
      const validStatuses = ['todo', 'in-progress', 'review', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updates.status = status;
      
      // Update completed_at based on status
      if (status === 'completed' && !existingTask.completed_at) {
        updates.completed_at = new Date().toISOString();
      } else if (status !== 'completed') {
        updates.completed_at = null;
      }
    }
    if (priority !== undefined) {
      // Validate priority
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, error: 'Invalid priority value' },
          { status: 400 }
        );
      }
      updates.priority = priority;
    }
    if (due_date !== undefined) updates.due_date = due_date;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;

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
    console.error('Update task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a specific task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

export async function DELETE(request, { params }) {
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
    const supabase = createAdminClient();

    // First check if the task exists and user has permission to delete it
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

    // Delete the task
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}