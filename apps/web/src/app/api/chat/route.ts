import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, files } = await req.json();

    const fileContext = files ?
        `\nCurrent Files:\n${JSON.stringify(files.map((f: any) => ({ path: f.path, type: f.type })), null, 2)}` : '';

    const result = streamText({
        model: openai('gpt-4o'),
        messages,
        system: `You are Vectorify, an intelligent business co-founder and senior engineer. 
    Your goal is to help the user structure their business strategy, execution plan, and codebase.
    
    You have access to a virtual file system. You can create, update, and organize files and folders.
    ${fileContext}
    
    When the user gives you "chaos" (random ideas, text, documents), your job is to:
    1. Analyze the information.
    2. Create a structured file system to organize it (e.g., "strategy/lean-canvas.md", "products/mvp-spec.md").
    3. Write the content into these files.
    
    Always use the 'create_file' or 'update_file' tools to save your work. Do not just chat.
    If you need to know what files exist, use 'request_files'.
    `,
        tools: {
            create_file: tool({
                description: 'Create a new file in the project workspace.',
                parameters: z.object({
                    path: z.string().describe('The path of the file to create (e.g., "src/components/Button.tsx").'),
                    content: z.string().describe('The content of the file.'),
                }),
                execute: async ({ path, content }) => {
                    return { success: true, message: `File ${path} created.` };
                },
            }),
            update_file: tool({
                description: 'Update the content of an existing file.',
                parameters: z.object({
                    path: z.string().describe('The path of the file to update.'),
                    content: z.string().describe('The new content of the file.'),
                }),
                execute: async ({ path, content }) => {
                    return { success: true, message: `File ${path} updated.` };
                },
            }),
            create_folder: tool({
                description: 'Create a new folder.',
                parameters: z.object({
                    path: z.string().describe('The path of the folder to create.'),
                }),
                execute: async ({ path }) => {
                    return { success: true, message: `Folder ${path} created.` };
                },
            }),
            request_files: tool({
                description: 'Request the list of current files in the workspace to understand the structure.',
                parameters: z.object({}),
                execute: async () => {
                    return { success: true, message: "File list requested." };
                }
            })
        },
    });

    return result.toTextStreamResponse();
}
