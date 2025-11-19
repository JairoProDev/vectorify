'use client';

import { Sidebar } from '@/components/workspace/sidebar';
import { CopilotPanel } from '@/components/workspace/copilot-panel';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { Toaster } from '@/components/ui/toaster';
import { CommandPalette } from '@/components/workspace/command-palette';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { useState } from 'react';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, copilotOpen, toggleSidebar, toggleCopilot } = useWorkspaceStore();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <div className="ide-layout flex flex-col">
        {/* Header */}
        <WorkspaceHeader
          onToggleSidebar={toggleSidebar}
          onToggleCopilot={toggleCopilot}
          sidebarOpen={sidebarOpen}
          copilotOpen={copilotOpen}
        />

        {/* Main IDE Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - File Navigator */}
          {sidebarOpen && (
            <div className="sidebar w-64 overflow-y-auto">
              <Sidebar />
            </div>
          )}

          {/* Center - Editor Panel */}
          <div className="editor-panel flex-1 overflow-y-auto">{children}</div>

          {/* Right Sidebar - AI Copilot */}
          {copilotOpen && (
            <div className="copilot-panel w-96 overflow-y-auto">
              <CopilotPanel />
            </div>
          )}
        </div>
      </div>

      {/* Global Components */}
      <Toaster />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
