'use client';

import { useState, useEffect } from 'react';
import { StrategyEditor } from '../editor/StrategyEditor';
import { TaskList, Task } from '../tasks/TaskList';
import { Composer } from './Composer';
import { Button } from '@/components/ui/button';
import { Sparkles, Save } from 'lucide-react';

export default function ProjectViewGenesis() {
    const [activeTab, setActiveTab] = useState<'strategy' | 'tasks'>('strategy'); // For mobile mainly
    const [strategyContent, setStrategyContent] = useState<string>('<h2>Project Strategy</h2><p>Describe your business goals here...</p>');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isComposerOpen, setIsComposerOpen] = useState(false);

    // Keyboard shortcut for Composer
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsComposerOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleUpdateStrategy = (content: string) => {
        // In MVP, we might want to append or replace. TipTap expects full content usually.
        // The AI tool should return the full markdown/html.
        setStrategyContent(content);
    };

    const handleAddTasks = (newTasks: string[]) => {
        const tasksObjects: Task[] = newTasks.map(t => ({
            id: crypto.randomUUID(),
            title: t,
            status: 'todo'
        }));
        setTasks(prev => [...prev, ...tasksObjects]);
    };

    const toggleTaskStatus = (id: string, status: Task['status']) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };

    return (
        <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-6 bg-white dark:bg-zinc-900">
                <h1 className="font-bold text-lg">Vectorify Genesis</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 mr-2">Cmd+K to AI</span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setIsComposerOpen(true)}
                    >
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        Composer
                    </Button>
                    <Button size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                    </Button>
                </div>
            </header>

            {/* Composer Modal */}
            <Composer
                isOpen={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                onUpdateStrategy={handleUpdateStrategy}
                onAddTasks={handleAddTasks}
            />

            {/* Main Split View */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Strategy (Editor) */}
                <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800 min-w-[300px]">
                    <div className="p-2 border-b bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-4">
                        Strategy & Docs
                    </div>
                    <div className="flex-1 relative">
                        <StrategyEditor
                            content={strategyContent}
                            onChange={setStrategyContent}
                        />
                    </div>
                </div>

                {/* Right: Execution (Tasks) */}
                <div className="w-[400px] flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="p-2 border-b bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-4">
                        Execution Plan
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <TaskList tasks={tasks} onToggleStatus={toggleTaskStatus} />
                    </div>
                </div>
            </main>
        </div>
    );
}
