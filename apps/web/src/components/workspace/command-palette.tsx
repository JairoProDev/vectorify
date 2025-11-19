'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FileIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Rocket,
  BookOpen,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/workspace/new?stack=yc-startup'))}
          >
            <Rocket className="mr-2 h-4 w-4" />
            <span>New YC Startup Project</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/workspace/new?stack=book-author'))}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>New Book Author Project</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/workspace/new'))}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>New Custom Project</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/workspace'))}>
            <FolderIcon className="mr-2 h-4 w-4" />
            <span>Go to Workspace</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <SearchIcon className="mr-2 h-4 w-4" />
            <span>Go to Home</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => console.log('Settings'))}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </CommandItem>
        </CommandGroup>

        {/* TODO: Add recent files, artifacts, etc. based on search */}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    toggle: () => setOpen((prev) => !prev),
  };
}
