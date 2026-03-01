'use client';

import { useWorkspaceStore } from '@/lib/store/use-workspace-store';
import { Sidebar } from '@/components/workspace/sidebar';
import { CopilotPanel } from '@/components/workspace/copilot-panel';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';

export default function PrototypePage() {
    const { files, activeFileId, updateFile, sidebarOpen, copilotOpen, toggleSidebar, toggleCopilot } = useWorkspaceStore();

    const activeFile = files.find(f => f.id === activeFileId);
    const [content, setContent] = useState(activeFile?.content || '');

    // Synchronize internal state when active file changes
    useEffect(() => {
        setContent(activeFile?.content || '');
    }, [activeFile?.id, activeFile?.content]);

    const handleSave = () => {
        if (activeFileId) {
            updateFile(activeFileId, { content, updatedAt: Date.now() });
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            <WorkspaceHeader
                onToggleSidebar={toggleSidebar}
                onToggleCopilot={toggleCopilot}
                sidebarOpen={sidebarOpen}
                copilotOpen={copilotOpen}
            />
            <div className="flex-1 flex overflow-hidden">
                {/* Left pane: File System */}
                {sidebarOpen && (
                    <div className="w-64 border-r border-border flex flex-col bg-card/30">
                        <Sidebar />
                    </div>
                )}

                {/* Middle pane: Canvas / Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-background/50 overflow-hidden relative">
                    {activeFile ? (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Editor Header */}
                            <div className="flex items-center justify-between border-b px-4 py-2 bg-card/50">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium">{activeFile.path}</span>
                                </div>
                                <Button size="sm" variant="ghost" className="gap-2" onClick={handleSave}>
                                    <Save className="w-4 h-4" /> Save
                                </Button>
                            </div>

                            {/* Editor Content Area */}
                            <div className="flex-1 overflow-auto p-4 sm:p-8">
                                <div className="max-w-4xl mx-auto h-full">
                                    <textarea
                                        className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Escribe el contenido aquí..."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                            <FileText className="w-12 h-12 opacity-20" />
                            <p>Selecciona un archivo del panel izquierdo para editarlo.</p>
                            <p className="text-sm opacity-60">O pide a Copilot que genere uno.</p>
                        </div>
                    )}
                </div>

                {/* Right pane: Chat Input */}
                {copilotOpen && (
                    <CopilotPanel />
                )}
            </div>
        </div>
    );
}
