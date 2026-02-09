'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  }, []);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};