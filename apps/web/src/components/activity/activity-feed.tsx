'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Activity, FileText, CheckSquare, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

interface ActivityFeedProps {
  projectId: string;
  limit?: number;
}

export function ActivityFeed({ projectId, limit = 50 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useWorkspaceStore();

  useEffect(() => {
    fetchActivities();
  }, [projectId]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/project/${projectId}?limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load activity feed',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getActionIcon = (action: string, entityType: string) => {
    if (action === 'created') return <Plus className="h-4 w-4 text-green-600" />;
    if (action === 'updated') return <Edit className="h-4 w-4 text-blue-600" />;
    if (action === 'deleted') return <Trash2 className="h-4 w-4 text-red-600" />;
    if (action === 'commented') return <MessageSquare className="h-4 w-4 text-purple-600" />;
    if (action === 'completed') return <CheckSquare className="h-4 w-4 text-green-600" />;

    return <Activity className="h-4 w-4" />;
  };

  const getEntityIcon = (entityType: string) => {
    if (entityType === 'artifact') return <FileText className="h-4 w-4" />;
    if (entityType === 'task') return <CheckSquare className="h-4 w-4" />;
    if (entityType === 'comment') return <MessageSquare className="h-4 w-4" />;

    return <Activity className="h-4 w-4" />;
  };

  const getActivityDescription = (activity: ActivityLog) => {
    const { action, entityType, changes } = activity;
    const userName = activity.user.name || activity.user.email;

    if (action === 'created' && entityType === 'artifact') {
      return (
        <>
          <span className="font-medium">{userName}</span> created artifact{' '}
          <span className="font-medium">{changes.name || 'Untitled'}</span>
        </>
      );
    }

    if (action === 'updated' && entityType === 'artifact') {
      return (
        <>
          <span className="font-medium">{userName}</span> updated artifact{' '}
          <span className="font-medium">{changes.name || 'Untitled'}</span>
        </>
      );
    }

    if (action === 'deleted' && entityType === 'artifact') {
      return (
        <>
          <span className="font-medium">{userName}</span> deleted an artifact
        </>
      );
    }

    if (action === 'created' && entityType === 'task') {
      return (
        <>
          <span className="font-medium">{userName}</span> created task{' '}
          <span className="font-medium">{changes.title || 'Untitled'}</span>
        </>
      );
    }

    if (action === 'updated' && entityType === 'task') {
      return (
        <>
          <span className="font-medium">{userName}</span> updated task{' '}
          <span className="font-medium">{changes.title || 'Untitled'}</span>
        </>
      );
    }

    if (action === 'completed' && entityType === 'task') {
      return (
        <>
          <span className="font-medium">{userName}</span> completed task{' '}
          <span className="font-medium">{changes.title || 'Untitled'}</span>
        </>
      );
    }

    if (action === 'commented') {
      return (
        <>
          <span className="font-medium">{userName}</span> commented on {entityType}
        </>
      );
    }

    return (
      <>
        <span className="font-medium">{userName}</span> {action} {entityType}
      </>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <CardTitle>Activity Feed</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm">Start creating artifacts and tasks!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10">
                      {getInitials(activity.user.name, activity.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  {index < activities.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {getActionIcon(activity.action, activity.entityType)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
