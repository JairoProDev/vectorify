'use client';

import { Files, Search, GitBranch, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface ActivityBarProps {
    className?: string;
}

export function ActivityBar({ className }: ActivityBarProps) {
    const { sidebarOpen, toggleSidebar } = useWorkspaceStore();

    return (
        <div className={cn("w-12 flex flex-col items-center py-4 border-r border-border bg-card/50", className)}>
            <div className="flex-1 flex flex-col gap-2 w-full px-2">
                <ActivityButton
                    icon={Files}
                    label="Explorer"
                    active={sidebarOpen}
                    onClick={toggleSidebar}
                />
                <ActivityButton icon={Search} label="Search" />
                <ActivityButton icon={GitBranch} label="Version Control" />
                <ActivityButton icon={MessageSquare} label="Chat History" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2">
                <ActivityButton icon={Settings} label="Settings" />
            </div>
        </div>
    );
}

function ActivityButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
                "w-full h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 relative group",
                active && "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
            )}
            title={label}
        >
            <Icon className="h-5 w-5" />
            {active && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />
            )}
        </Button>
    )
}
