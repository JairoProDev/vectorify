'use client';

import { Sidebar } from '@/components/workspace/sidebar';
import { CopilotPanel } from '@/components/workspace/copilot-panel';
import { ExtensionsView } from '@/components/workspace/extensions-view';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ActivityBar } from '@/components/workspace/activity-bar';
import { BottomPanel } from '@/components/workspace/bottom-panel';
import { Toaster } from '@/components/ui/toaster';
import { CommandPalette } from '@/components/workspace/command-palette';
import { QuickCreateDialog } from '@/components/workspace/quick-create-dialog';
import { KeyboardShortcutsDialog } from '@/components/workspace/keyboard-shortcuts-dialog';
import { VersionControlView } from '@/components/workspace/version-control-view';
import { SearchView } from '@/components/workspace/search-view';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { useState, useEffect } from 'react';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, copilotOpen, activeSidebarView, toggleSidebar, toggleCopilot } = useWorkspaceStore();
  const [commandOpen, setCommandOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick Create (Ctrl+N / Cmd+N)
      if (e.key === 'n' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        setQuickCreateOpen(true);
      }

      // Keyboard Shortcuts Help (Ctrl+/ / Cmd+/)
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShortcutsOpen(true);
      }

      // Toggle Sidebar (Ctrl+B / Cmd+B)
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }

      // Toggle Copilot (Ctrl+\ / Cmd+\)
      if (e.key === '\\' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCopilot();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleCopilot]);

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <WorkspaceHeader
          onToggleSidebar={toggleSidebar}
          onToggleCopilot={toggleCopilot}
          sidebarOpen={sidebarOpen}
          copilotOpen={copilotOpen}
        />

        {/* Main IDE Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Activity Bar (Far Left) */}
          <ActivityBar />

          {/* Left Sidebar - File Navigator */}
          {sidebarOpen && (
            <div className="w-64 border-r border-border flex flex-col bg-card/30">
              {activeSidebarView === 'market' ? (
                <ExtensionsView />
              ) : activeSidebarView === 'explorer' ? (
                <Sidebar />
              ) : activeSidebarView === 'git' ? (
                <VersionControlView />
              ) : activeSidebarView === 'search' ? (
                <SearchView />
              ) : (
                <div className="p-4 text-sm text-muted-foreground flex flex-col items-center justify-center h-full text-center">
                  <span className="mb-2 block">Icon for {activeSidebarView}</span>
                  View not implemented
                </div>
              )}
            </div>
          )}

          {/* Center Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background/50">
            {/* Editor Panel */}
            <div className="flex-1 overflow-hidden relative">
              {children}
            </div>

            {/* Bottom Panel */}
            <BottomPanel />
          </div>

          {/* Right Sidebar - AI Copilot */}
          {copilotOpen && (
            <div className="w-96 border-l border-border bg-card/30 flex flex-col">
              <CopilotPanel />
            </div>
          )}
        </div>
      </div>

      {/* Global Components */}
      <Toaster />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <QuickCreateDialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  );
}
