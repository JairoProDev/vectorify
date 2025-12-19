'use client';

import { Search, UserPlus, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

const AGENTS = [
    {
        id: 'marketing-bundle',
        name: 'Marketing Team',
        description: 'Expert copywriters, strategists, and growth hackers.',
        author: 'Vectorify',
        rating: 4.9,
        downloads: '10k',
        agents: ['Luna (Copy)', 'Frank (Strategy)', 'Pablo (Ads)'],
    },
    {
        id: 'dev-bundle',
        name: 'DevOps Squad',
        description: 'Cloud architects, SREs, and CI/CD experts.',
        author: 'Vectorify',
        rating: 4.8,
        downloads: '5k',
        agents: ['Devin (Code)', 'Ops (Infra)'],
    },
    {
        id: 'finance-bundle',
        name: 'Finance & Legal',
        description: 'CFO, Accountant, and Legal Counsel.',
        author: 'Vectorify',
        rating: 4.7,
        downloads: '2k',
        agents: ['Penny (Finance)', 'Saul (Legal)'],
    },
];

export function ExtensionsView() {
    const { addNotification } = useWorkspaceStore();

    const handleInstall = (name: string) => {
        addNotification({
            type: 'success',
            title: "Agent Bundle Installed",
            message: `${name} has been added to your workspace.`,
        });
    };

    return (
        <div className="flex flex-col h-full bg-card/30">
            <div className="p-4 border-b border-border space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Marketplace</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        className="w-full bg-background/50 border border-border rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {AGENTS.map((bundle) => (
                        <div key={bundle.id} className="group border border-border rounded-lg p-3 bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-foreground">{bundle.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    {bundle.rating}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {bundle.description}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {bundle.agents.map(agent => (
                                    <span key={agent} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
                                        {agent}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-muted-foreground">{bundle.author} • {bundle.downloads}</span>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => handleInstall(bundle.name)}
                                >
                                    <UserPlus className="h-3 w-3" />
                                    Install
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
