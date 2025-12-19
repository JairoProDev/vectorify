'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from '@/components/activity/activity-feed';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Loader2,
  Plus,
  ArrowRight,
  FolderOpen,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectStats {
  totalArtifacts: number;
  totalTasks: number;
  completedTasks: number;
  totalComments: number;
  recentActivity: number;
}

export default function DashboardPage() {
  const { currentProject, addNotification } = useWorkspaceStore();

  const [stats, setStats] = useState<ProjectStats>({
    totalArtifacts: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalComments: 0,
    recentActivity: 0,
  });
  const [recentArtifacts, setRecentArtifacts] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentProject?.id) {
      fetchDashboardData();
    }
  }, [currentProject?.id]);

  const fetchDashboardData = async () => {
    if (!currentProject?.id) return;

    setLoading(true);
    try {
      // Fetch artifacts
      const artifactsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artifacts?projectId=${currentProject.id}`
      );
      const artifactsData = await artifactsResponse.json();
      setRecentArtifacts(artifactsData.slice(0, 5));

      // Fetch tasks
      const tasksResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks?projectId=${currentProject.id}`
      );
      const tasksData = await tasksResponse.json();
      setRecentTasks(tasksData.slice(0, 5));

      // Calculate stats
      const completedCount = tasksData.filter((t: any) => t.status === 'done').length;

      setStats({
        totalArtifacts: artifactsData.length,
        totalTasks: tasksData.length,
        completedTasks: completedCount,
        totalComments: 0,
        recentActivity: 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (!currentProject) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <h2 className="text-xl font-semibold">No Project Selected</h2>
            <p className="text-muted-foreground mt-2">Select or create a project to view its dashboard</p>
          </div>
          <Link href="/workspace/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentProject.name}</h1>
          <p className="text-muted-foreground mt-1">
            {currentProject.description || 'Project Dashboard'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            New Artifact
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artifacts</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtifacts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Documents & canvases
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedTasks} completed
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${getCompletionRate()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Team discussions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompletionRate()}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Artifacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Artifacts</CardTitle>
                <CardDescription>Latest documents and canvases</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentArtifacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No artifacts yet</p>
                <p className="text-sm mt-1">Create your first artifact to get started</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Artifact
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentArtifacts.map((artifact) => (
                  <Link
                    key={artifact.id}
                    href={`/workspace/projects/${currentProject.id}/artifacts/${artifact.id}`}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer border">
                      <div className="text-2xl">{artifact.icon || '📄'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{artifact.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="capitalize">{artifact.type.replace('-', ' ')}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(artifact.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest action items</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tasks yet</p>
                <p className="text-sm mt-1">Create your first task to track progress</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors border"
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      readOnly
                      className="h-4 w-4 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${task.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
                              task.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                          {task.priority}
                        </span>
                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      {currentProject.id && <ActivityFeed projectId={currentProject.id} limit={15} />}

      {/* Project Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stack</p>
              <p className="font-medium">{currentProject.stack || 'Custom'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${currentProject.status === 'active' ? 'bg-green-600' : 'bg-gray-400'}`} />
                <p className="font-medium capitalize">{currentProject.status}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(currentProject.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{getTimeAgo(currentProject.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
