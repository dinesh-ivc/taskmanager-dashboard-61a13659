'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskAnalyticsCard } from '@/components/dashboard/TaskAnalyticsCard';
import { RecentTasksList } from '@/components/dashboard/RecentTasksList';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch user stats
      const [statsResponse, tasksResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        supabase
          .from('tasks')
          .select('*')
          .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const statsData = await statsResponse.json();
      if (statsResponse.ok) {
        setStats(statsData.data);
      }

      if (tasksResponse.error) {
        throw new Error(tasksResponse.error.message);
      }

      setRecentTasks(tasksResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueTasks || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasksList tasks={recentTasks} isLoading={isLoading} />
          </CardContent>
        </Card>

        <TaskAnalyticsCard />
      </div>
    </div>
  );
}