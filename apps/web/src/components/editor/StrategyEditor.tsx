'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface StrategyEditorProps {
    content: string;
    onChange: (content: string) => void;
    isReadOnly?: boolean;
}

export function StrategyEditor({ content, onChange, isReadOnly = false }: StrategyEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Describe your strategy here... (e.g., Target Audience, Value Proposition)',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content,
        editable: !isReadOnly,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[500px]',
            },
        },
        onUpdate: ({ editor }) => {
            // Get Markdown or HTML. For simplicity in MVP, we might stick to HTML for TipTap, 
            // but if we want Markdown, we technically need tiptap-markdown extension.
            // For now, let's just pass HTML content.
            onChange(editor.getHTML());
        },
    });

    // Sync content if it changes externally (e.g. from AI)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only set content if it's different to avoid cursor jumps
            // A more robust check is needed for real production, but this works for MVP
            // comparing text content might be better, but HTML is what we have.
            // To avoid loops, we might check if the editor is focused.
            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full h-full p-4 bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-y-auto">
            <EditorContent editor={editor} />
        </div>
    );
}
