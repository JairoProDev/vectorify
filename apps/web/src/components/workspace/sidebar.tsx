'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  FileIcon,
  Search,
  Plus,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWorkspaceStore, WorkspaceFile } from '@/lib/store/use-workspace-store';
import { useI18n } from '@/i18n/hooks';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { currentProject, files } = useWorkspaceStore();
  const { t } = useI18n();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to build tree structure from flat file list
  const buildTree = (files: WorkspaceFile[]) => {
    const root = {};

    files.forEach(file => {
      const parts = file.path.split('/');
      let current: any = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = { ...file, __type: 'file' };
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = { __type: 'folder', __children: {} };
          }
          current = current[part].__children;
        }
      });
    });
    return root;
  };

  const traverse = (node: any, path: string = ''): any[] => {
    return Object.entries(node).map(([key, value]: [string, any]) => {
      if (key === '__type' || key === '__children') return null;

      const fullPath = path ? `${path}/${key}` : key;

      if (value.__type === 'file') {
        // Check search filter
        if (searchQuery && !key.toLowerCase().includes(searchQuery.toLowerCase())) {
          return null;
        }

        return (
          <Button
            key={fullPath}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 px-2 pl-6 hover:bg-accent h-7"
            title={fullPath}
          >
            <FileText className="h-4 w-4 text-blue-400" />
            <span className="truncate text-xs">{key}</span>
          </Button>
        );
      } else if (value.__type === 'folder') {
        const matchesSearch = searchQuery
          ? JSON.stringify(traverse(value.__children, fullPath)).includes('Button') // Crude check if any child matches
          : true;

        // If searching, always expand if children match. If not searching, use state.
        // For simplicity in search, just show matching files flat? 
        // Let's keep tree but maybe auto-expand.

        const isExpanded = expandedFolders.has(fullPath) || !!searchQuery;
        const children = traverse(value.__children, fullPath).filter(Boolean);

        if (searchQuery && children.length === 0) return null;

        return (
          <div key={fullPath}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 px-2 h-7"
              onClick={() => {
                const newSet = new Set(expandedFolders);
                if (newSet.has(fullPath)) newSet.delete(fullPath);
                else newSet.add(fullPath);
                setExpandedFolders(newSet);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 opacity-50" />
              ) : (
                <ChevronRight className="h-4 w-4 opacity-50" />
              )}
              <FolderIcon className="h-4 w-4 text-yellow-500" />
              <span className="truncate text-sm">{key}</span>
            </Button>
            {isExpanded && (
              <div className="ml-4 border-l border-border/50">
                {children}
              </div>
            )}
          </div>
        );
      }
      return null;
    }).filter(Boolean);
  };

  const tree = buildTree(files);
  const renderedTree = traverse(tree);

  return (
    <div className="flex h-full flex-col p-2">
      {/* Search */}
      <div className="mb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder={t('workspace.searchFiles')}
            className="pl-7 h-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-2 px-2">
        <h3 className="text-xs font-bold uppercase text-muted-foreground">explorer</h3>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            <span className="block mb-2">No files yet</span>
            <p>Ask Vector to create some!</p>
          </div>
        ) : (
          <div className="space-y-[1px]">
            {renderedTree}
          </div>
        )}
      </div>

      <Separator className="my-2" />

      <div className="px-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs"
          onClick={() => { }} // TODO: Open file creation dialog
        >
          <Plus className="h-3 w-3" />
          New File
        </Button>
      </div>
    </div>
  );
}
