'use client';

import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/hooks';
import { useState } from 'react';

export default function WorkspacePage() {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background/50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {t('workspace.hero.title') || "What do you want to build?"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('workspace.hero.subtitle') || "Describe your business idea, and Vectorify will help you plan and execute it."}
          </p>
        </div>

        <div className="relative">
          <div className="relative rounded-xl overflow-hidden bg-card border border-white/10 shadow-2xl ring-1 ring-white/5 focus-within:ring-primary/50 transition-all duration-300">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A marketplace for local artisans..."
              className="w-full h-32 p-6 bg-transparent text-lg resize-none focus:outline-none placeholder:text-muted-foreground/50"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <Button
                size="icon"
                className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (prompt.trim()) {
                    window.location.href = `/workspace/new?stack=custom&description=${encodeURIComponent(prompt)}`;
                  }
                }}
              >
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <button
            onClick={() => window.location.href = '/workspace/new'}
            className="hover:text-foreground transition-colors"
          >
            Start from scratch
          </button>
          <span>•</span>
          <button className="hover:text-foreground transition-colors">Import existing project</button>
        </div>
      </div>
    </div>
  );
}
