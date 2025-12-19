import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        messages,
        system: `You are Vectorify, an intelligent business co-founder. 
    Your goal is to help the user structure their business strategy and execution plan.
    
    When the user has an idea (e.g., "Pivot to B2B"), you should:
    1. Update the Strategy Document to reflect the new direction.
    2. Create actionable Tasks for the execution.
    
    Always be proactive. Instead of just chatting, use the tools to modify the project state.
    `,
        // tools: {
        //     update_strategy: tool({
        //         description: 'Update the strategy document content. Use markdown.',
        //         parameters: z.object({
        //             content: z.string().describe('The new or updated markdown content for the strategy document.'),
        //             rationale: z.string().describe('Short explanation of why this change was made.'),
        //         }),
        //         execute: async ({ content, rationale }: { content: string, rationale: string }) => {
        //             return { content, rationale };
        //         },
        //     }),
        //     create_tasks: tool({
        //         description: 'Create a list of execution tasks.',
        //         parameters: z.object({
        //             tasks: z.array(z.string()).describe('List of task titles to create.'),
        //         }),
        //     }),
        // },
    });

    return result.toTextStreamResponse();
}
