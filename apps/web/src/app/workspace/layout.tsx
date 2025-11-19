'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/workspace/sidebar';
import { CopilotPanel } from '@/components/workspace/copilot-panel';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(true);

  return (
    <div className="ide-layout flex flex-col">
      {/* Header */}
      <WorkspaceHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
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
  );
}
