'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn
import { Input } from '@/components/ui/input'; // Assuming shadcn

interface ComposerProps {
    onUpdateStrategy: (content: string) => void;
    onAddTasks: (tasks: string[]) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Composer({ onUpdateStrategy, onAddTasks, isOpen, onClose }: ComposerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    // @ts-ignore
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        maxSteps: 5, // Allow multi-step tool calls
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
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Vectorify Composer</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Chat History (Optional for MVP, good for context) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-zinc-500 mt-10">
                            <p>Describe your business goal.</p>
                            <p className="text-sm">e.g. "Pivot to B2B" or "Plan a product launch"</p>
                        </div>
                    )}
                    {messages.map((m: any) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                                }`}>
                                {m.content}
                                {m.toolInvocations?.map((tool: any) => (
                                    <div key={tool.toolCallId} className="mt-2 text-xs opacity-70 border-t border-white/20 pt-2">
                                        {tool.toolName === 'update_strategy' ? '📝 Updating Strategy Doc...' : ''}
                                        {tool.toolName === 'create_tasks' ? '✅ Creating Tasks...' : ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50">
                    <form onSubmit={handleSubmit} className="relative">
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            placeholder="What do you want to build?"
                            className="pr-12 h-12 text-lg shadow-sm"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1 top-1 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={isLoading || !input.trim()}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
