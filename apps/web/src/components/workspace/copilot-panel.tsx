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
  X,
  Image as ImageIcon,
  FileCode,
  FileText
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface Attachment {
  name: string;
  type: 'image' | 'text' | 'other';
  content: string; // Base64 for images, text for others
  preview?: string; // Data URL for images
}

export function CopilotPanel() {
  const {
    copilotOpen,
    toggleCopilot,
    files,
    addFile,
    updateFile,
    addNotification
  } = useWorkspaceStore();
  // const { toast } = useToast();

  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  // Local state for input and attachments
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { messages, isLoading, toolInvocations, append } = useChat({
    api: '/api/chat',
    body: {
      files: files,
    },
    onError: (error) => {
      console.error('Chat error:', error);
      addNotification({
        type: 'error',
        title: "Error sending message",
        message: error.message || "Please check your connection and try again."
      });
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync tool invocations to workspace store
  useEffect(() => {
    if (!toolInvocations) return;

    for (const toolInvocation of toolInvocations) {
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
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const isImage = file.type.startsWith('image/');

      let content = '';
      let preview = '';

      if (isImage) {
        // Read as Data URL for preview and potentially content
        try {
          preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          content = preview; // For now sending base64 as content
        } catch (err) {
          console.error("Error reading image", err);
        }
      } else {
        // Read as Text
        try {
          content = await file.text();
        } catch (err) {
          console.error("Error reading text file", err);
          content = "[Binary or Unreadable Content]";
        }
      }

      newAttachments.push({
        name: file.name,
        type: isImage ? 'image' : 'text',
        content: content,
        preview: preview
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    const currentInput = inputValue;
    const currentAttachments = [...attachments];

    // Optimistic UI updates are handled by useChat append usually, 
    // but we want to ensure we format the message correctly.

    let finalContent = currentInput;

    // Append attachment info to the prompt
    // Ideally we would use the experimental_attachments from ai/react 
    // but for stability with current setup, we'll append to text.
    if (currentAttachments.length > 0) {
      const attachmentText = currentAttachments.map(att => {
        if (att.type === 'image') {
          return `\n\n[Attached Image: ${att.name}]\n(Image content omitted for text-only model compatibility, treat as placeholder)`;
        }
        return `\n\n--- Attached File: ${att.name} ---\n${att.content}\n--- End Attachment ---`;
      }).join('');
      finalContent = `${finalContent}${attachmentText}`;
    }

    // Clear state
    setInputValue('');
    setAttachments([]);

    try {
      await append({
        role: 'user',
        content: finalContent
      });
    } catch (err) {
      console.error("Failed to send message", err);
      // Restore state if failed
      setInputValue(currentInput);
      setAttachments(currentAttachments);
      toast({
        title: "Failed to send",
        description: "Could not send your message. Restored your input.",
        variant: "destructive"
      });
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
              {/* Render Tool Results (Files Created) */}
              {m.toolInvocations?.map((toolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                if (toolInvocation.toolName === 'create_file') {
                  return (
                    <div key={toolCallId} className="mt-2 p-2 bg-background/50 rounded text-xs border border-border flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-semibold">Created file</div>
                        <span className="font-mono opacity-80">{toolInvocation.args.path}</span>
                      </div>
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

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex items-center justify-center border rounded-md bg-muted/50 overflow-hidden w-20 h-20">
                {att.type === 'image' && att.preview ? (
                  <img src={att.preview} alt={att.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <FileText className="h-6 w-6 mb-1 opacity-50" />
                    <span className="text-[10px] leading-tight truncate w-full px-1">{att.name}</span>
                  </div>
                )}

                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="relative flex items-end gap-2">
          {/* File Upload Button */}
          <div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          {/* Text Input */}
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your idea or attach files..."
            className="min-h-[40px] max-h-[120px] resize-none py-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCustomSubmit();
              }
            }}
          />

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full shrink-0"
            disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
