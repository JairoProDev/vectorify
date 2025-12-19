'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  PanelRightClose,
  Paperclip,
  File,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export function CopilotPanel() {
  const {
    copilotOpen,
    toggleCopilot,
    files,
    addFile,
    updateFile
  } = useWorkspaceStore();

  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const [fileAttachment, setFileAttachment] = useState<{ name: string, content: string } | null>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, toolInvocations, append } = useChat({
    api: '/api/chat',
    initialInput: initialPrompt,
    body: {
      files: files,
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync tool invocations to workspace store
  useEffect(() => {
    if (!toolInvocations) return;

    for (const toolInvocation of toolInvocations) {
      // We only care if the tool call has been executed by the server (or at least proposed)
      // Since we are using server-side execution for the "logic" part, the state is 'result'.
      // We use this confirmation to update our Client Store.

      if (toolInvocation.state === 'result') {
        const { toolName, args } = toolInvocation;

        if (toolName === 'create_file') {
          const { path, content } = args;
          const exists = files.find(f => f.path === path);
          if (!exists) {
            addFile({
              id: `file-${Date.now()}-${Math.random()}`,
              name: path.split('/').pop() || 'file',
              path: path,
              type: 'file',
              content: content,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
          }
        }
        if (toolName === 'update_file') {
          const { path, content } = args;
          const existing = files.find(f => f.path === path);
          if (existing) {
            updateFile(existing.id, { content, updatedAt: Date.now() });
          }
        }
        if (toolName === 'create_folder') {
          const { path } = args;
          const exists = files.find(f => f.path === path);
          if (!exists) {
            addFile({
              id: `folder-${Date.now()}`,
              name: path.split('/').pop() || 'folder',
              path: path,
              type: 'folder',
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
          }
        }
      }
    }
  }, [toolInvocations, files, addFile, updateFile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileAttachment({
        name: file.name,
        content: content
      });
    };
    reader.readAsText(file);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim() && !fileAttachment) return;

    let finalInput = input || '';
    if (fileAttachment) {
      finalInput = `${input}\n\n--- Attached File: ${fileAttachment.name} ---\n${fileAttachment.content}\n--- End Attachment ---`;
      setInput('');
      setFileAttachment(null);
      append({ role: 'user', content: finalInput });
    } else {
      handleSubmit(e, { body: { files } });
    }
  };

  if (!copilotOpen) return null;

  return (
    <div className="flex h-full w-[400px] flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Vector AI Copilot</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleCopilot}>
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">
              <Sparkles className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>I can help you build your project.</p>
              <p className="text-sm">Try uploading a document or describing your idea.</p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex w-full flex-col gap-1 rounded-lg p-3 text-sm',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto max-w-[90%]'
                  : 'bg-muted mr-auto max-w-[90%]'
              )}
            >
              <div className="font-semibold text-xs opacity-70 mb-1">
                {m.role === 'user' ? 'You' : 'Vector'}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.toolInvocations?.map((toolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                if (toolInvocation.toolName === 'create_file') {
                  return (
                    <div key={toolCallId} className="mt-2 p-2 bg-background/50 rounded text-xs border border-border">
                      <File className="inline-block w-3 h-3 mr-1" />
                      Created file: <span className="font-mono">{toolInvocation.args.path}</span>
                    </div>
                  );
                }
                if (toolInvocation.toolName === 'create_folder') return (
                  <div key={toolCallId} className="mt-2 p-2 bg-background/50 rounded text-xs border border-border">
                    Created folder: <span className="font-mono">{toolInvocation.args.path}</span>
                  </div>
                );
                return null;
              })}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Vector is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        {fileAttachment && (
          <div className="mb-2 flex items-center gap-2 rounded bg-muted p-2 text-xs">
            <File className="h-3 w-3" />
            <span className="truncate max-w-[200px]">{fileAttachment.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-auto"
              onClick={() => setFileAttachment(null)}
            >
              <PanelRightClose className="h-3 w-3 rotate-45" />
            </Button>
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="relative flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Describe your idea or attach a file..."
            className="min-h-[40px] max-h-[120px] resize-none pr-10"
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // We need to cast e to any or construct a synthetic form event, 
                // but handleCustomSubmit takes React.FormEvent. 
                // Since FormEvent is compatible with KeyboardEvent in some contexts (both have preventDefault),
                // we can just cast it or wrap it.
                handleCustomSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1 h-8 w-8"
            disabled={(!input?.trim() && !fileAttachment) || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
