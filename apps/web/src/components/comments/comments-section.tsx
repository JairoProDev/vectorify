'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, MessageSquare, Trash2, Edit2, X } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

interface CommentsSectionProps {
  artifactId?: string;
  taskId?: string;
}

export function CommentsSection({ artifactId, taskId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { user, addNotification } = useWorkspaceStore();

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [artifactId, taskId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const endpoint = artifactId
        ? `${process.env.NEXT_PUBLIC_API_URL}/comments/artifact/${artifactId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/comments/task/${taskId}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load comments',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'You must be logged in to comment',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newComment,
            artifactId,
            taskId,
            authorId: user.id,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create comment');

      const comment = await response.json();
      setComments((prev) => [...prev, comment]);
      setNewComment('');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Comment added',
      });
    } catch (error) {
      console.error('Failed to create comment:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add comment',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (!response.ok) throw new Error('Failed to update comment');

      const updatedComment = await response.json();
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingId(null);
      setEditContent('');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Comment updated',
      });
    } catch (error) {
      console.error('Failed to update comment:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update comment',
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments((prev) => prev.filter((c) => c.id !== commentId));

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Comment deleted',
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete comment',
      });
    }
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
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <CardTitle>Comments ({comments.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment */}
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              size="sm"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.author.name, comment.author.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.author.name || comment.author.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.createdAt !== comment.updatedAt && (
                        <span className="text-xs text-muted-foreground italic">
                          (edited)
                        </span>
                      )}
                    </div>
                    {user && user.id === comment.author.id && (
                      <div className="flex gap-1">
                        {editingId === comment.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEdit(comment.id)}
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingId(null);
                                setEditContent('');
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditContent(comment.content);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {editingId === comment.id ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
