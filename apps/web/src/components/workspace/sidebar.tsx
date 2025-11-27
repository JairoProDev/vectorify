'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  FileIcon,
  Plus,
  Search,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { useI18n } from '@/i18n/hooks';

interface Folder {
  id: string;
  name: string;
  icon: string | null;
  path: string;
  artifacts: Artifact[];
}

interface Artifact {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

export function Sidebar() {
  const router = useRouter();
  const { currentProject, addNotification } = useWorkspaceStore();
  const { t } = useI18n();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentProject?.id) {
      fetchProjectStructure();
    }
  }, [currentProject?.id]);

  const fetchProjectStructure = async () => {
    if (!currentProject?.id) return;

    setLoading(true);
    try {
      // Fetch folders
      const foldersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${currentProject.id}/folders`
      );
      if (!foldersResponse.ok) throw new Error('Failed to fetch folders');
      const foldersData = await foldersResponse.json();

      // Fetch artifacts
      const artifactsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artifacts?projectId=${currentProject.id}`
      );
      if (!artifactsResponse.ok) throw new Error('Failed to fetch artifacts');
      const artifactsData = await artifactsResponse.json();

      // Group artifacts by folder
      const foldersWithArtifacts = foldersData.map((folder: any) => ({
        ...folder,
        artifacts: artifactsData.filter(
          (artifact: any) => artifact.folderId === folder.id
        ),
      }));

      setFolders(foldersWithArtifacts);

      // Expand first folder by default
      if (foldersWithArtifacts.length > 0) {
        setExpandedFolders(new Set([foldersWithArtifacts[0].id]));
      }
    } catch (error) {
      console.error('Failed to fetch project structure:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load project structure',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleArtifactClick = (artifactId: string) => {
    if (currentProject?.id) {
      router.push(`/workspace/projects/${currentProject.id}/artifacts/${artifactId}`);
    }
  };

  const filteredFolders = searchQuery
    ? folders.map((folder) => ({
        ...folder,
        artifacts: folder.artifacts.filter((artifact) =>
          artifact.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
    : folders;

  return (
    <div className="flex h-full flex-col p-4">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('workspace.searchFiles')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Project Name */}
      {currentProject && (
        <>
          <div className="mb-2">
            <h3 className="text-sm font-semibold">{currentProject.name}</h3>
            <p className="text-xs text-muted-foreground">
              {currentProject.stack || 'Custom Project'}
            </p>
          </div>

          <Separator className="my-2" />
        </>
      )}

      {/* Folder Tree */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredFolders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <FolderIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No folders found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFolders.map((folder) => {
              const isExpanded = expandedFolders.has(folder.id);

              return (
                <div key={folder.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-1 px-2"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="mr-1">{folder.icon || '📁'}</span>
                    <span className="flex-1 text-left text-sm">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {folder.artifacts.length}
                    </span>
                  </Button>

                  {isExpanded && folder.artifacts.length > 0 && (
                    <div className="ml-6 space-y-1 border-l pl-2">
                      {folder.artifacts.map((artifact) => (
                        <Button
                          key={artifact.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 px-2 hover:bg-accent"
                          onClick={() => handleArtifactClick(artifact.id)}
                        >
                          <span>{artifact.icon || '📄'}</span>
                          <span className="flex-1 text-left text-xs truncate">
                            {artifact.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Quick Actions */}
      <div className="space-y-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => router.push('/workspace/projects/new')}
        >
          <Plus className="h-4 w-4" />
          {t('workspace.newArtifact')}
        </Button>
      </div>
    </div>
  );
}
