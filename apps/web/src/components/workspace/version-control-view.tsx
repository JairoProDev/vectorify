'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    GitBranch,
    GitCommit,
    GitGraph,
    GitMerge,
    History,
    Clock,
    MoreHorizontal,
    Plus,
    ArrowRight,
} from 'lucide-react';

interface Commit {
    id: string;
    message: string;
    author: string;
    date: Date;
    hash: string;
}

interface Branch {
    id: string;
    name: string;
    current: boolean;
}

export function VersionControlView() {
    const { currentProject } = useWorkspaceStore();
    const [branches, setBranches] = useState<Branch[]>([
        { id: '1', name: 'main', current: true },
        { id: '2', name: 'dev/pivot-b2b', current: false },
        { id: '3', name: 'feature/marketing-q1', current: false },
    ]);
    const [commits, setCommits] = useState<Commit[]>([
        {
            id: '1',
            message: 'Initial strategy definition',
            author: 'You',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24),
            hash: '8f2d1a',
        },
        {
            id: '2',
            message: 'Update revenue model to SaaS',
            author: 'Vector (AI)',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            hash: '3c4b2e',
        },
        {
            id: '3',
            message: 'Add customer personas',
            author: 'You',
            date: new Date(Date.now() - 1000 * 60 * 30),
            hash: '9a1f5c',
        },
    ]);

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Source Control
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <GitGraph className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Action Button */}
                    <Button className="w-full gap-2" size="sm">
                        <GitCommit className="h-4 w-4" />
                        Commit Changes
                    </Button>

                    {/* Branches */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <GitBranch className="h-3 w-3" />
                                Branches
                            </h3>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            {branches.map(branch => (
                                <div
                                    key={branch.id}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-muted/50 ${branch.current ? 'bg-muted font-medium' : ''
                                        }`}
                                >
                                    <GitBranch className={`h-3.5 w-3.5 ${branch.current ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span>{branch.name}</span>
                                    {branch.current && (
                                        <Badge variant="secondary" className="ml-auto text-[10px] h-4">
                                            Current
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* History / Commits */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            <History className="h-3 w-3" />
                            History
                        </h3>
                        <div className="space-y-4">
                            {commits.map((commit, index) => (
                                <div key={commit.id} className="relative pl-4 border-l border-border/50 pb-4 last:pb-0">
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border border-background bg-muted-foreground/30 ring-2 ring-background" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium leading-none">{commit.message}</span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                {commit.author}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                2h ago
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] h-4 font-mono text-muted-foreground">
                                                {commit.hash}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
