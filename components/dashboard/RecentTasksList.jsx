'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';

export function RecentTasksList({ tasks, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No recent tasks found
      </p>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">{task.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={
                      task.status === 'todo' ? 'secondary' :
                      task.status === 'in-progress' ? 'default' :
                      task.status === 'review' ? 'warning' :
                      'success'
                    }>
                      {task.status}
                    </Badge>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}