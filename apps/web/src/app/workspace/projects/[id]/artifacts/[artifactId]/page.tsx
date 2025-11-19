'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArtifactRenderer } from '@/components/artifacts/artifact-renderer';
import { CommentsSection } from '@/components/comments/comments-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface Artifact {
  id: string;
  name: string;
  type: string;
  content: any;
  projectId: string;
}

export default function ArtifactPage() {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useWorkspaceStore();

  const artifactId = params.artifactId as string;
  const projectId = params.id as string;

  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/artifacts/${artifactId}`
        );
        if (!response.ok) throw new Error('Failed to fetch artifact');

        const data = await response.json();
        setArtifact(data);
      } catch (error) {
        console.error('Failed to fetch artifact:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load artifact',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtifact();
  }, [artifactId, addNotification]);

  const handleSave = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artifacts/${artifactId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: data }),
        }
      );

      if (!response.ok) throw new Error('Failed to save artifact');

      addNotification({
        type: 'success',
        title: 'Saved',
        message: 'Artifact saved successfully',
      });

      // Update local state
      setArtifact((prev) => (prev ? { ...prev, content: data } : null));
    } catch (error) {
      console.error('Failed to save artifact:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save artifact',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Artifact not found</p>
          <Button
            variant="outline"
            onClick={() => router.push(`/workspace/projects/${projectId}`)}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/workspace/projects/${projectId}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Project
      </Button>

      <ArtifactRenderer
        type={artifact.type}
        data={artifact.content}
        onSave={handleSave}
      />

      {/* Comments Section */}
      <CommentsSection artifactId={artifactId} />
    </div>
  );
}
