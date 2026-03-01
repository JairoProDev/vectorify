'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Sparkles, Send, X, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ComposerProps {
    onUpdateStrategy: (content: string) => void;
    onAddTasks: (tasks: string[]) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Composer({ onUpdateStrategy, onAddTasks, isOpen, onClose }: ComposerProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // @ts-ignore
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        maxSteps: 5,
        onToolCall: async ({ toolCall }: { toolCall: any }) => {
            if (toolCall.toolName === 'update_strategy') {
                const { content } = toolCall.args as { content: string };
                onUpdateStrategy(content);
                return 'Strategy updated successfully.';
            }
            if (toolCall.toolName === 'create_tasks') {
                const { tasks } = toolCall.args as { tasks: string[] };
                onAddTasks(tasks);
                return `Created ${tasks.length} tasks successfully.`;
            }
        },
    } as any);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full sm:max-w-3xl bg-white dark:bg-zinc-900 sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[90vh] sm:h-[85vh] sm:max-h-[700px]">
                {/* Modern Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-zinc-800/60 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base text-slate-900 dark:text-white">AI Assistant</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Your business strategist</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                <Wand2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="max-w-md space-y-2">
                                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    What would you like to create?
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Describe your business idea, project, or goal. I'll help you create a strategy document and action plan.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 w-full max-w-md pt-4">
                                <button
                                    onClick={() => {
                                        const event = { target: { value: "I want to launch a B2B SaaS product for small businesses" } };
                                        handleInputChange(event as any);
                                    }}
                                    className="p-3 text-left rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                                >
                                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        💡 Launch a B2B SaaS product
                                    </p>
                                </button>
                                <button
                                    onClick={() => {
                                        const event = { target: { value: "Help me pivot my business from B2C to B2B" } };
                                        handleInputChange(event as any);
                                    }}
                                    className="p-3 text-left rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                                >
                                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        🔄 Pivot from B2C to B2B
                                    </p>
                                </button>
                                <button
                                    onClick={() => {
                                        const event = { target: { value: "Create a marketing campaign for holiday season" } };
                                        handleInputChange(event as any);
                                    }}
                                    className="p-3 text-left rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                                >
                                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        🎯 Plan a marketing campaign
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {messages.map((m: any, index: number) => (
                        <div key={m.id} className="space-y-2">
                            {m.role === 'user' ? (
                                <div className="flex justify-end">
                                    <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                                        <p className="text-sm leading-relaxed">{m.content}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
                                        <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 shadow-sm">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                        </div>
                                        {m.toolInvocations?.map((tool: any) => (
                                            <div key={tool.toolCallId} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                                {tool.toolName === 'update_strategy' && (
                                                    <>
                                                        <span className="text-lg">📝</span>
                                                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Strategy document updated!</span>
                                                    </>
                                                )}
                                                {tool.toolName === 'create_tasks' && (
                                                    <>
                                                        <span className="text-lg">✅</span>
                                                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Tasks created successfully!</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-zinc-800">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Input Area */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-200/60 dark:border-zinc-800/60">
                    <form onSubmit={handleSubmit} className="relative">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your idea or ask a question..."
                            className="min-h-[56px] max-h-[120px] pr-14 py-3 px-4 text-base resize-none rounded-xl border-slate-300 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            disabled={isLoading}
                            rows={1}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-2 bottom-2 h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
