'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { EditIcon, Trash2Icon } from 'lucide-react';

export function TaskCard({ task, onEdit, onDelete }) {
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-none truncate">{task.title}</h3>
          <Badge variant={getStatusBadgeVariant(task.status)}>
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 h-12">
          {task.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3">
        <div className="flex gap-2">
          <Badge variant={getPriorityBadgeVariant(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onEdit(task)}
            className="h-8 px-2"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(task.id)}
            className="h-8 px-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}