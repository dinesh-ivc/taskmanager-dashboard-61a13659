'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, EditIcon, Trash2Icon } from 'lucide-react';

export function TaskTable({ tasks, isLoading, onTaskUpdated, onTaskDeleted, onStatusUpdate }) {
  const [editingTask, setEditingTask] = useState(null);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          onTaskDeleted(taskId);
        } else {
          const result = await response.json();
          alert(result.error || 'Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Network error occurred while deleting task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        onStatusUpdate(taskId, newStatus);
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'todo':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'review':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-xs truncate">{task.description}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(task.status)}>
                  {task.status.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityBadgeVariant(task.priority)}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(task.created_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingTask(task)}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Change Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                          Todo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'review')}>
                          Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                          Completed
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600">
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
}