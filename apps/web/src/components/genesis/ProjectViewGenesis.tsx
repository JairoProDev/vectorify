'use client';

import { useState, useEffect } from 'react';
import { StrategyEditor } from '../editor/StrategyEditor';
import { TaskList, Task } from '../tasks/TaskList';
import { Composer } from './Composer';
import { Button } from '@/components/ui/button';
import { Sparkles, Save, FileText, CheckSquare, Lightbulb, ArrowRight } from 'lucide-react';

export default function ProjectViewGenesis() {
    const [activeTab, setActiveTab] = useState<'strategy' | 'tasks'>('strategy');
    const [strategyContent, setStrategyContent] = useState<string>('<h2>Your Business Strategy</h2><p>Start by describing your vision, goals, and key initiatives...</p>');
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

    const isEmpty = strategyContent.includes('Start by describing') && tasks.length === 0;

    return (
        <div className="flex h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20 overflow-hidden">
            {/* Modern Header */}
            <header className="flex h-16 items-center justify-between px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-base text-slate-900 dark:text-white">My Project</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Last edited today</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                        <kbd className="text-xs font-mono text-slate-600 dark:text-slate-400">⌘K</kbd>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Ask AI</span>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/30"
                        onClick={() => setIsComposerOpen(true)}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">Ask AI Assistant</span>
                        <span className="sm:hidden">AI</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 dark:border-zinc-700"
                    >
                        <Save className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Save</span>
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

            {/* Welcome State - Show when empty */}
            {isEmpty && (
                <div className="absolute inset-0 top-16 flex items-center justify-center z-10 bg-gradient-to-br from-slate-50/95 via-white/95 to-indigo-50/95 dark:from-zinc-950/95 dark:via-zinc-900/95 dark:to-indigo-950/95 backdrop-blur-sm">
                    <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                            <Lightbulb className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                Turn your ideas into reality
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                                Start by sharing your business idea with our AI assistant. We'll help you create a strategy, generate tasks, and bring your vision to life.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-indigo-500/30 text-base px-6"
                                onClick={() => setIsComposerOpen(true)}
                            >
                                <Sparkles className="w-5 h-5" />
                                Start with AI Assistant
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
                            <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 mx-auto">
                                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">Smart Documents</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">AI-powered strategy docs that evolve with your business</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 mx-auto">
                                    <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">Auto Task Planning</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Get actionable tasks generated from your ideas instantly</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3 mx-auto">
                                    <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">AI Collaboration</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Work alongside AI to refine and execute your vision</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Workspace - Two Column Layout */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Strategy Documents */}
                <div className="flex-1 flex flex-col border-r border-slate-200/60 dark:border-zinc-800/60 min-w-[320px] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">Strategy & Documentation</h2>
                    </div>
                    <div className="flex-1 relative p-6 overflow-y-auto">
                        <div className="max-w-3xl mx-auto">
                            <StrategyEditor
                                content={strategyContent}
                                onChange={setStrategyContent}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Action Items & Tasks */}
                <div className="w-[420px] flex flex-col bg-slate-50/80 dark:bg-zinc-950/40 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200/60 dark:border-zinc-800/60">
                        <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">Action Items</h2>
                        {tasks.length > 0 && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                                {tasks.filter(t => t.status === 'done').length}/{tasks.length}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <TaskList tasks={tasks} onToggleStatus={toggleTaskStatus} />
                    </div>
                </div>
            </main>

            {/* Floating AI Assistant Button - Mobile Only */}
            <button
                onClick={() => setIsComposerOpen(true)}
                className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/50 flex items-center justify-center z-50 active:scale-95 transition-transform"
            >
                <Sparkles className="w-6 h-6" />
            </button>
        </div>
    );
}
