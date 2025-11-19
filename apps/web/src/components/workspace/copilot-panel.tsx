'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Brain, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export function CopilotPanel() {
  const [message, setMessage] = useState('');

  // Mock suggestions and alerts
  const suggestions = [
    {
      id: '1',
      type: 'alert',
      title: 'Inconsistency Detected',
      description:
        'Your target audience is "students" but pricing is set to $99/month. Consider adjusting.',
      priority: 'high',
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Add User Personas',
      description:
        'Based on your Lean Canvas, you should define detailed user personas in the Mercado folder.',
      priority: 'medium',
    },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Vector AI Copilot</h3>
      </div>

      <Separator className="mb-4" />

      {/* Status */}
      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Analyzing your project...</span>
        </div>
      </div>

      {/* Suggestions & Alerts */}
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Insights & Suggestions
          </h4>
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="mb-2 p-3">
              <div className="flex gap-2">
                {suggestion.type === 'alert' ? (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{suggestion.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Fix Now
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Chat Input */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Ask Vector</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about your project..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Handle send message
                setMessage('');
              }
            }}
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => setMessage('What should I work on next?')}
          >
            What's next?
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => setMessage('Analyze my Lean Canvas')}
          >
            Analyze Canvas
          </Button>
        </div>
      </div>
    </div>
  );
}
