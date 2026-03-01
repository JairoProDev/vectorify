import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, files } = await req.json();

    const fileContext = files ?
        `\nCurrent Files in Workspace:\n${JSON.stringify(files.map((f: any) => ({ path: f.path, type: f.type })), null, 2)}` : '';

    const result = streamText({
        model: openai.chat('gpt-4o'),
        messages,
        system: `You are Vectorify, an intelligent business co-founder and senior engineer for startups.
Your goal is to help the user structure their business strategy, execution plan, branding, and codebase.

You have access to a virtual file system. You can create, update, and organize files and folders.
${fileContext}

When the user gives you an idea, your job is to:
1. Analyze the information and organize it modularly into files (e.g., "branding/brand-guidelines.md", "strategy/business-model-canvas.md", "tech/stack-recommendation.md").
2. DO NOT put everything in one document. Modularize it.
3. ALWAYS ask clarifying questions to get more context about the idea.
4. Provide multiple-choice options for your questions to make it easy to answer, but always allow the user to provide a custom answer.
5. Pivot and adapt based on the user's answers.

Example interaction:
- User: "I want to build an Uber-like app for pet sitting."
- You: Create some initial files (e.g., "strategy/initial-concept.md").
- You: Ask questions like "What platform should we build this for? A) iOS/Android Native B) React Native/Expo (Cross-platform) C) Web App (PWA). Reply with a letter or your own idea."

Always use the 'create_file' or 'update_file' tools to save your work. 
If you need to know what files exist, use 'request_files'.
`,
        tools: {
            create_file: tool({
                description: 'Create a new file in the project workspace.',
                parameters: z.object({
                    path: z.string().describe('File path, e.g. "strategy/bmc.md"'),
                    content: z.string().describe('File content (markdown usually)'),
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
                parameters: z.object({
                    reason: z.string().describe('The reason for requesting the file list.')
                }),
                execute: async () => {
                    return { success: true, message: "File list requested." };
                }
            })
        },
    });

    return result.toDataStreamResponse();
}