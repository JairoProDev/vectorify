'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FileIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Rocket,
  BookOpen,
  FileText,
  CheckSquare,
  Loader2,
  Home,
  LayoutDashboard,
  Target,
  Mail,
  Briefcase,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { useDebounce } from '@/hooks/use-debounce';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  type: 'artifact' | 'task' | 'folder';
  name: string;
  description?: string;
  projectId?: string;
  icon?: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { currentProject, setPendingAgentMessage, setCopilotOpen } = useWorkspaceStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const executeAgentTask = (taskName: string, prompt: string) => {
    onOpenChange(false);
    setCopilotOpen(true);
    setPendingAgentMessage(prompt); // We can just send the prompt directly
  };

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Perform search when debounced search changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 2) {
      performSearch(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, currentProject]);

  const performSearch = async (query: string) => {
    if (!currentProject?.id) return;

    setIsSearching(true);
    try {
      const results: SearchResult[] = [];

      // Search artifacts
      const artifactsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artifacts?projectId=${currentProject.id}`
      );
      if (artifactsResponse.ok) {
        const artifacts = await artifactsResponse.json();
        const filteredArtifacts = artifacts
          .filter((a: any) =>
            a.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map((a: any) => ({
            id: a.id,
            type: 'artifact' as const,
            name: a.name,
            description: a.type.replace('-', ' '),
            projectId: currentProject.id,
            icon: a.icon,
          }));
        results.push(...filteredArtifacts);
      }

      // Search tasks
      const tasksResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks?projectId=${currentProject.id}`
      );
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        const filteredTasks = tasks
          .filter((t: any) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(query.toLowerCase()))
          )
          .slice(0, 5)
          .map((t: any) => ({
            id: t.id,
            type: 'task' as const,
            name: t.title,
            description: `${t.status} • ${t.priority}`,
            projectId: currentProject.id,
            icon: t.icon,
          }));
        results.push(...filteredTasks);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    setSearch('');
    setSearchResults([]);
    command();
  };

  const getResultIcon = (result: SearchResult) => {
    if (result.type === 'artifact') return <FileText className="mr-2 h-4 w-4 text-blue-600" />;
    if (result.type === 'task') return <CheckSquare className="mr-2 h-4 w-4 text-green-600" />;
    if (result.type === 'folder') return <FolderIcon className="mr-2 h-4 w-4 text-yellow-600" />;
    return <FileIcon className="mr-2 h-4 w-4" />;
  };

  const navigateToResult = (result: SearchResult) => {
    if (result.type === 'artifact' && result.projectId) {
      runCommand(() => router.push(`/workspace/projects/${result.projectId}/artifacts/${result.id}`));
    } else if (result.type === 'task' && result.projectId) {
      runCommand(() => router.push(`/workspace/projects/${result.projectId}/tasks/${result.id}`));
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search artifacts, tasks, or type a command..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="py-6 text-center text-sm">
              <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {search ? 'No results found.' : 'Type to search or choose a command below'}
              </p>
            </div>
          )}
        </CommandEmpty>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            {searchResults.filter(r => r.type === 'artifact').length > 0 && (
              <CommandGroup heading="Artifacts">
                {searchResults
                  .filter(r => r.type === 'artifact')
                  .map(result => (
                    <CommandItem
                      key={result.id}
                      value={`artifact-${result.id}`}
                      onSelect={() => navigateToResult(result)}
                    >
                      {result.icon ? (
                        <span className="mr-2">{result.icon}</span>
                      ) : (
                        getResultIcon(result)
                      )}
                      <div className="flex-1">
                        <div>{result.name}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {result.description}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {searchResults.filter(r => r.type === 'task').length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Tasks">
                  {searchResults
                    .filter(r => r.type === 'task')
                    .map(result => (
                      <CommandItem
                        key={result.id}
                        value={`task-${result.id}`}
                        onSelect={() => navigateToResult(result)}
                      >
                        {getResultIcon(result)}
                        <div className="flex-1">
                          <div>{result.name}</div>
                          {result.description && (
                            <div className="text-xs text-muted-foreground capitalize">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />
          </>
        )}

        {/* Quick Actions - Only show when no search */}
        {!search && (
          <>
            <CommandGroup heading="Business Tasks">
              <CommandItem onSelect={() => runCommand(() => executeAgentTask('Marketing: Audit Competitors', 'Perform a comprehensive competitive audit for our niche. Identify top 3 competitors, their strengths/weaknesses, and our opportunity gaps.'))}>
                <Target className="mr-2 h-4 w-4 text-red-500" />
                <span>Marketing: Audit Competitors</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => executeAgentTask('Marketing: Generate Content Plan', 'Create a 4-week content marketing plan focusing on high-intent keywords. Include blog topics, social media posts, and distribution channels.'))}>
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                <span>Marketing: Generate Content Plan</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => executeAgentTask('Sales: Draft Outreach Email', 'Draft a high-converting cold outreach email for potential B2B partners. Focus on value proposition and clear CTA.'))}>
                <Mail className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Sales: Draft Outreach Email</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => executeAgentTask('Business: SWOT Analysis', 'Conduct a detailed SWOT analysis for the current project state. Focus on actionable insights for the next quarter.'))}>
                <Briefcase className="mr-2 h-4 w-4 text-purple-500" />
                <span>Business: SWOT Analysis</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={() => runCommand(() => router.push('/workspace/new?stack=yc-startup'))}
              >
                <Rocket className="mr-2 h-4 w-4 text-orange-600" />
                <span>New YC Startup Project</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push('/workspace/new?stack=book-author'))}
              >
                <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                <span>New Book Author Project</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/workspace/new'))}>
                <PlusIcon className="mr-2 h-4 w-4 text-green-600" />
                <span>New Custom Project</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => router.push('/workspace'))}>
                <Home className="mr-2 h-4 w-4" />
                <span>Go to Workspace</span>
              </CommandItem>
              {currentProject && (
                <CommandItem onSelect={() => runCommand(() => router.push('/workspace/dashboard'))}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Go to Dashboard</span>
                </CommandItem>
              )}
              <CommandItem onSelect={() => runCommand(() => router.push('/workspace/settings'))}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    toggle: () => setOpen((prev) => !prev),
  };
}
