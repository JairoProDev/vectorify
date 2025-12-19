'use client';

import { Terminal, Activity, ListTodo, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function BottomPanel() {
    const [activeTab, setActiveTab] = useState<'terminal' | 'roadmap' | 'tasks'>('terminal');

    return (
        <div className="h-48 border-t border-border bg-card/50 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center px-4 border-b border-border">
                <PanelTab
                    label="Terminal"
                    icon={Terminal}
                    active={activeTab === 'terminal'}
                    onClick={() => setActiveTab('terminal')}
                />
                <PanelTab
                    label="Roadmap"
                    icon={Activity}
                    active={activeTab === 'roadmap'}
                    onClick={() => setActiveTab('roadmap')}
                />
                <PanelTab
                    label="Tasks"
                    icon={ListTodo}
                    active={activeTab === 'tasks'}
                    onClick={() => setActiveTab('tasks')}
                />

                <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                        <Zap className="h-3 w-3 fill-current" />
                        Saved: 12h
                    </span>
                    <span className="opacity-50">v0.1.0</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                {activeTab === 'terminal' && (
                    <div className="space-y-1 text-muted-foreground">
                        <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> Initializing workspace...</p>
                        <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> AI Agent ready.</p>
                        <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> Waiting for user input...</p>
                    </div>
                )}
                {activeTab === 'roadmap' && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No active roadmap. Start a project to generate one.
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No active tasks.
                    </div>
                )}
            </div>
        </div>
    );
}

function PanelTab({ label, icon: Icon, active, onClick }: { label: string, icon: any, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors hover:text-foreground hover:bg-white/5",
                active ? "border-primary text-foreground" : "border-transparent text-muted-foreground"
            )}
        >
            <Icon className="h-3 w-3" />
            {label}
        </button>
    )
}
