'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  Search,
  Plus,
  Save,
  FileText,
  CheckSquare,
  Settings,
  Zap,
  Keyboard,
} from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  key: string;
  description: string;
  icon?: React.ReactNode;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Shortcut[];
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    title: 'General',
    shortcuts: [
      {
        key: 'Cmd/Ctrl + K',
        description: 'Open command palette & global search',
        icon: <Search className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + N',
        description: 'Quick create artifact or task',
        icon: <Plus className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + S',
        description: 'Save current artifact',
        icon: <Save className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + /',
        description: 'Show keyboard shortcuts (this dialog)',
        icon: <Keyboard className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      {
        key: 'Cmd/Ctrl + B',
        description: 'Toggle sidebar',
      },
      {
        key: 'Cmd/Ctrl + \\',
        description: 'Toggle AI Copilot panel',
      },
      {
        key: 'Cmd/Ctrl + ,',
        description: 'Open settings',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'AI & Search',
    shortcuts: [
      {
        key: 'Cmd/Ctrl + J',
        description: 'Focus AI Copilot chat',
        icon: <Zap className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + Shift + K',
        description: 'Clear search',
      },
      {
        key: 'Enter',
        description: 'Send AI message (in chat)',
      },
      {
        key: 'Shift + Enter',
        description: 'New line (in chat)',
      },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      {
        key: 'Cmd/Ctrl + Z',
        description: 'Undo',
      },
      {
        key: 'Cmd/Ctrl + Shift + Z',
        description: 'Redo',
      },
      {
        key: 'Cmd/Ctrl + A',
        description: 'Select all',
      },
      {
        key: 'Cmd/Ctrl + C',
        description: 'Copy',
      },
      {
        key: 'Cmd/Ctrl + V',
        description: 'Paste',
      },
    ],
  },
  {
    title: 'Quick Actions',
    shortcuts: [
      {
        key: 'Cmd/Ctrl + Shift + A',
        description: 'Create new artifact',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + Shift + T',
        description: 'Create new task',
        icon: <CheckSquare className="h-4 w-4" />,
      },
      {
        key: 'Cmd/Ctrl + E',
        description: 'Export current artifact',
      },
      {
        key: 'Esc',
        description: 'Close dialog/modal',
      },
    ],
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  const isMac =
    typeof window !== 'undefined' &&
    navigator.userAgent.toLowerCase().includes('mac');

  const formatKey = (key: string) => {
    return key
      .replace('Cmd/Ctrl', isMac ? '⌘' : 'Ctrl')
      .replace('Shift', isMac ? '⇧' : 'Shift')
      .replace('Alt', isMac ? '⌥' : 'Alt')
      .replace('Enter', isMac ? '↵' : 'Enter')
      .replace('Esc', isMac ? 'Esc' : 'Esc');
  };

  const parseKeys = (keyString: string): string[] => {
    return keyString.split('+').map((k) => k.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Master Vectorify with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUTS.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, shortcutIdx) => (
                  <div
                    key={shortcutIdx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {shortcut.icon && (
                        <div className="text-muted-foreground">
                          {shortcut.icon}
                        </div>
                      )}
                      <span className="text-sm">{shortcut.description}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {parseKeys(shortcut.key).map((key, keyIdx) => (
                        <div key={keyIdx} className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-1 bg-background"
                          >
                            {formatKey(key)}
                          </Badge>
                          {keyIdx < parseKeys(shortcut.key).length - 1 && (
                            <span className="text-muted-foreground text-xs">
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {idx < SHORTCUTS.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Command className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Pro Tip</p>
              <p className="text-sm text-muted-foreground">
                Use <kbd className="px-2 py-1 bg-background rounded border text-xs">
                  {isMac ? '⌘' : 'Ctrl'} + K
                </kbd>{' '}
                to quickly search and navigate to any artifact, task, or command.
                It's the fastest way to move around Vectorify!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Press{' '}
            <kbd className="px-2 py-1 bg-background rounded border text-xs">
              Esc
            </kbd>{' '}
            or click outside to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
