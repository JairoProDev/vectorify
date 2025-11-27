'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
  Lightbulb,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { useI18n } from '@/i18n/hooks';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  type: 'alert' | 'suggestion' | 'insight';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action?: () => void;
}

export function CopilotPanel() {
  const { currentProject, addNotification } = useWorkspaceStore();
  const { t } = useI18n();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial suggestions when project changes
    if (currentProject) {
      loadSuggestions();
    }
  }, [currentProject]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSuggestions = async () => {
    if (!currentProject?.id) return;

    setIsAnalyzing(true);
    try {
      // In a real implementation, this would call the AI backend
      // For now, we'll generate contextual suggestions
      const contextualSuggestions: Suggestion[] = [
        {
          id: '1',
          type: 'suggestion',
          title: 'Complete Your Lean Canvas',
          description:
            'Your Lean Canvas is missing key metrics. Add specific KPIs to track your progress.',
          priority: 'high',
        },
        {
          id: '2',
          type: 'insight',
          title: 'Define User Personas',
          description:
            'Based on your target market, create detailed user personas to better understand your customers.',
          priority: 'medium',
        },
        {
          id: '3',
          type: 'alert',
          title: 'Competitor Analysis Needed',
          description:
            'You have not created a competitor analysis yet. This is crucial for understanding your market position.',
          priority: 'high',
        },
      ];

      setSuggestions(contextualSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isSending || !currentProject) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      // Call AI backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/api/v1'}/ai/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are Vector, an AI assistant helping with project development.
              Current project: ${currentProject.name}
              Project type: ${currentProject.stack || 'Custom'}
              You help with strategy, planning, and execution. Be concise and actionable.`,
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: userMessage.content },
          ],
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.message || 'I apologize, but I encountered an error.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      addNotification({
        type: 'error',
        title: 'AI Error',
        message: 'Failed to get AI response. Please check your AI settings.',
      });

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'I apologize, but I\'m having trouble connecting right now. Please make sure your AI provider is configured in Settings.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { icon: Target, text: t('copilot.suggestions.focus'), color: 'text-blue-600' },
    { icon: Lightbulb, text: t('copilot.suggestions.ideas'), color: 'text-yellow-600' },
    { icon: TrendingUp, text: t('copilot.suggestions.strategy'), color: 'text-green-600' },
    { icon: Zap, text: t('copilot.suggestions.prioritize'), color: 'text-purple-600' },
  ];

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20';
      case 'medium':
        return 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'insight':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t('copilot.title')}</h3>
        {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <Separator className="mb-4" />

      {/* Status */}
      {currentProject ? (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <span className="text-sm font-medium">Analyzing {currentProject.name}</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentProject.stack || t('project.customProject')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-muted p-3 text-center">
          <p className="text-sm text-muted-foreground">{t('copilot.noProjectSelected')}</p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">
            AI Insights
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className={`p-3 ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex gap-2">
                  {getTypeIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{suggestion.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 -mt-1"
                        onClick={() => dismissSuggestion(suggestion.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator className="mb-4" />

      {/* Chat Messages */}
      <div className="flex-1 mb-4 min-h-0">
        <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
          {t('copilot.chatTitle')}
        </h4>
        <ScrollArea className="h-full rounded-lg border p-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                {t('copilot.greeting')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('copilot.greetingDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {quickPrompts.map((prompt, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              className="h-auto py-2 text-left justify-start"
              onClick={() => setMessage(prompt.text)}
            >
              <prompt.icon className={`h-3 w-3 mr-2 ${prompt.color}`} />
              <span className="text-xs">{prompt.text}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea
            placeholder={t('copilot.placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isSending || !currentProject}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!message.trim() || isSending || !currentProject}
            className="h-[60px]"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('copilot.sendHint')}
        </p>
      </div>
    </div>
  );
}
