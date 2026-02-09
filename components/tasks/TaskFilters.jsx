'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export function TaskFilters({ filters, onFilterChange, onClear }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange('status', value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.priority}
        onValueChange={(value) => onFilterChange('priority', value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      
      {(filters.status || filters.priority || filters.search) && (
        <Button
          variant="outline"
          onClick={() => {
            onFilterChange('', '');
            onFilterChange('search', '');
            onFilterChange('status', '');
            onFilterChange('priority', '');
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}