import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, files } = await req.json();

    const fileContext = files
        ? `\nCurrent Files in Workspace:\n${JSON.stringify(
            files.map((f: { path: string }) => ({ path: f.path })),
            null,
            2
        )}`
        : '';

    const result = streamText({
        model: openai('gpt-4o'),
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

Always use the 'create_file' or 'update_file' tools to save your work.
`,
        tools: {
            create_file: tool({
                description: 'Create a new file in the project workspace.',
                inputSchema: z.object({
                    path: z.string().describe('File path, e.g. "strategy/bmc.md"'),
                    content: z.string().describe('File content (markdown usually)'),
                }),
                execute: async ({ path, content }) => {
                    return { success: true, message: `File ${path} created.` };
                },
            }),
            update_file: tool({
                description: 'Update the content of an existing file.',
                inputSchema: z.object({
                    path: z.string().describe('The path of the file to update.'),
                    content: z.string().describe('The new content of the file.'),
                }),
                execute: async ({ path, content }) => {
                    return { success: true, message: `File ${path} updated.` };
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}