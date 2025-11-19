'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  FileIcon,
  Plus,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Sidebar() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['estrategia']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Mock folder structure
  const folders = [
    {
      id: 'estrategia',
      name: 'Estrategia',
      icon: '🎯',
      artifacts: [
        { id: '1', name: 'Lean Canvas', type: 'lean-canvas', icon: '📊' },
        { id: '2', name: 'Vision & Mission', type: 'document', icon: '📝' },
      ],
    },
    {
      id: 'producto',
      name: 'Producto',
      icon: '🚀',
      artifacts: [
        { id: '3', name: 'Product Roadmap', type: 'roadmap', icon: '🗺️' },
      ],
    },
    {
      id: 'mercado',
      name: 'Mercado',
      icon: '📊',
      artifacts: [],
    },
    {
      id: 'finanzas',
      name: 'Finanzas',
      icon: '💰',
      artifacts: [],
    },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-8" />
        </div>
      </div>

      {/* Project Name */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold">Demo Startup</h3>
        <p className="text-xs text-muted-foreground">YC Startup Stack</p>
      </div>

      <Separator className="my-2" />

      {/* Folder Tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {folders.map((folder) => {
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
                  <span className="mr-1">{folder.icon}</span>
                  <span className="flex-1 text-left text-sm">{folder.name}</span>
                </Button>

                {isExpanded && folder.artifacts.length > 0 && (
                  <div className="ml-6 space-y-1 border-l pl-2">
                    {folder.artifacts.map((artifact) => (
                      <Button
                        key={artifact.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 px-2"
                      >
                        <span>{artifact.icon}</span>
                        <span className="flex-1 text-left text-xs">{artifact.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Quick Actions */}
      <div className="space-y-1">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Artifact
        </Button>
      </div>
    </div>
  );
}
