'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { projectsAPI, type Project } from '@/lib/api/projects';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
        {project.stack && (
          <div className="mt-2">
            <span className="text-sm rounded-full bg-primary/10 px-3 py-1 text-primary">
              {project.stack}
            </span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Project!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your project structure has been created based on the{' '}
            <strong>{project.stack || 'custom'}</strong> stack.
          </p>
          <p className="mt-4 text-muted-foreground">
            Use the sidebar to navigate through your project folders and start creating artifacts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
