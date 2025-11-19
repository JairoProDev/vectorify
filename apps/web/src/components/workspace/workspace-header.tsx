'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface WorkspaceHeaderProps {
  onToggleSidebar: () => void;
  onToggleCopilot: () => void;
  sidebarOpen: boolean;
  copilotOpen: boolean;
}

export function WorkspaceHeader({
  onToggleSidebar,
  onToggleCopilot,
  sidebarOpen,
  copilotOpen,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex h-14 items-center border-b px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        <Link href="/workspace" className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-semibold">Vectorify</span>
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <span className="text-sm text-muted-foreground">Demo Workspace</span>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <Link href="/workspace/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>

        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" size="icon" onClick={onToggleCopilot}>
          {copilotOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
