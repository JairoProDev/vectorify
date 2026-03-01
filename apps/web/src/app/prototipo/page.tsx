'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Send, FileText, Bot, Plus, Sparkles, Key, Loader2, ArrowRight } from 'lucide-react';

interface ProjectFile {
    id: string;
    path: string;
    content: string;
}

export default function PrototipoCleanPage() {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [showApiInput, setShowApiInput] = useState<boolean>(false);

    const activeFile = files.find(f => f.id === activeFileId);
    const lastToolCallProcessedRef = useRef<Set<string>>(new Set());

    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/prototipo-chat',
        body: {
            files,
            apiKey
        }
    });

    // Observe tool calls specifically to populate sidebar AND select new file automatically
    useEffect(() => {
        let filesChanged = false;
        const currentFiles = [...files];

        messages.forEach(m => {
            if (m.toolInvocations) {
                m.toolInvocations.forEach(tool => {
                    if (tool.state === 'result' && !lastToolCallProcessedRef.current.has(tool.toolCallId)) {
                        lastToolCallProcessedRef.current.add(tool.toolCallId);

                        if (tool.toolName === 'create_file') {
                            const { path, content } = tool.args;
                            // check if exists
                            const existingIdx = currentFiles.findIndex(f => f.path === path);
                            if (existingIdx === -1) {
                                currentFiles.push({
                                    id: tool.toolCallId,
                                    path,
                                    content
                                });
                                filesChanged = true;
                            }
                        } else if (tool.toolName === 'update_file') {
                            const { path, content } = tool.args;
                            const existingIdx = currentFiles.findIndex(f => f.path === path);
                            if (existingIdx !== -1) {
                                currentFiles[existingIdx].content = content;
                                filesChanged = true;
                            }
                        }
                    }
                });
            }
        });

        if (filesChanged) {
            setFiles(currentFiles);
            // Select newest file if no active file
            if (!activeFileId && currentFiles.length > 0) {
                setActiveFileId(currentFiles[currentFiles.length - 1].id);
            }
        }
    }, [messages, files, activeFileId]);


    const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!activeFileId) return;
        setFiles(files.map(f => f.id === activeFileId ? { ...f, content: e.target.value } : f));
    }


    return (
        <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
            {/* 1. Left Sidebar: Documentos */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-indigo-50/50">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h1 className="font-bold text-slate-800">Vectorify MVP</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Mis Documentos</h2>

                    {files.length === 0 ? (
                        <div className="px-2 text-sm text-slate-500 italic">
                            Aún no hay documentos.<br />
                            ¡Cuéntale tu idea al asistente!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {files.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFileId(f.id)}
                                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeFileId === f.id
                                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <FileText className={`w-4 h-4 ${activeFileId === f.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span className="truncate">{f.path}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Middle Panel: Lienzo del Documento */}
            <div className="flex-1 flex flex-col min-w-0 bg-white shadow-sm m-2 rounded-xl overflow-hidden border border-slate-200">
                {activeFile ? (
                    <>
                        <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50/50">
                            <h2 className="font-medium text-lg text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                {activeFile.path}
                            </h2>
                        </div>
                        <div className="flex-1 p-6 sm:p-10 overflow-auto bg-white">
                            <textarea
                                className="w-full h-full min-h-[500px] resize-none outline-none font-mono text-[15px] leading-relaxed text-slate-700 bg-transparent"
                                value={activeFile.content}
                                onChange={handleEditorChange}
                                placeholder="Escribe tu contenido aquí..."
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg">Ningún documento abierto</p>
                        <p className="text-sm">Inicia una conversación a la derecha para generar tu primer archivo.</p>
                    </div>
                )}
            </div>

            {/* 3. Right Sidebar: Asistente Chat */}
            <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-sm">
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-semibold text-slate-800">Vectorify AI</h2>
                    </div>
                    <button
                        onClick={() => setShowApiInput(!showApiInput)}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                        title="Configurar OpenAI API Key"
                    >
                        <Key className="w-4 h-4" />
                    </button>
                </div>

                {showApiInput && (
                    <div className="p-4 border-b border-slate-100 bg-indigo-50/50">
                        <label className="text-xs font-semibold text-indigo-800 mb-1 block">Tu API Key de OpenAI (Gpt-4o):</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-proj-..."
                            className="w-full text-sm p-2 rounded border border-indigo-200 focus:outline-none focus:ring-2 ring-indigo-500/20"
                        />
                        <p className="text-[10px] text-indigo-600 mt-1">Si la dejes vacía, usará la del sistema.</p>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/30">
                    {messages.length === 0 && (
                        <div className="text-center mt-10">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-medium text-slate-800 mb-2">¡Hola Emprendedor!</h3>
                            <p className="text-sm text-slate-500 px-6">
                                Cuéntame qué idea de negocio o app tienes en mente. Yo la estructuraré en documentos automáticamente.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            <span className="font-bold">Error:</span> {error.message}
                        </div>
                    )}

                    {messages.map(m => (
                        <div
                            key={m.id}
                            className={`flex flex-col max-w-[90%] gap-1 ${m.role === 'user'
                                ? 'ml-auto items-end'
                                : 'mr-auto items-start'
                                }`}
                        >
                            <span className="text-[11px] font-semibold text-slate-400 capitalize px-1">
                                {m.role === 'user' ? 'Tú' : 'Asistente'}
                            </span>
                            <div
                                className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                    }`}
                            >
                                {m.content && <span className="whitespace-pre-wrap">{m.content}</span>}

                                {/* Render UI for Tool Executions */}
                                {m.toolInvocations?.map((toolCall) => {
                                    if (toolCall.toolName === 'create_file' || toolCall.toolName === 'update_file') {
                                        return (
                                            <div key={toolCall.toolCallId} className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 flex items-center gap-2">
                                                <FileText className="w-3 h-3 text-indigo-500" />
                                                <span>
                                                    {toolCall.toolName === 'create_file' ? 'Creando' : 'Actualizando'}:
                                                    <strong className="ml-1 text-slate-800">{toolCall.args.path}</strong>
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Escribiendo...
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSubmit} className="relative flex items-end">
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ej. Quiero crear un Uber de mascotas..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-12 pl-4 py-3 min-h-[50px] max-h-[120px] resize-none outline-none focus:ring-2 ring-indigo-500/20 text-sm overflow-y-auto"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    e.currentTarget.form?.requestSubmit();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input?.trim() || isLoading}
                            className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
