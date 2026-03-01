import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
    let messages, files, apiKey;
    try {
        const body = await req.json();
        messages = body.messages;
        files = body.files;
        apiKey = body.apiKey;
    } catch (e) {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Initialize custom OpenAI provider if an API key is provided
    let aiProvider = openai;
    try {
        if (apiKey && apiKey.trim() !== '') {
            aiProvider = createOpenAI({ apiKey: apiKey.trim() });
        }
    } catch (e) {
        console.warn("Could not create custom OpenAI instance, falling back to default.", e);
    }

    const fileContext = files && files.length > 0 ?
        `\nArchivos actuales en tu workspace:\n${files.map((f: any) => `- ${f.name}`).join('\n')}\n` :
        '\nNo hay archivos en el workspace todavía.\n';

    const systemPrompt = `Eres Vectorify AI, un co-fundador técnico y estratega de negocios para startups.
Tu usuario NO es un programador ni experto técnico, es un emprendedor con una pura idea. Tu interfaz es súper sencilla. Tu tono debe ser inspirador, simple, directo y muy colaborativo.

REGLAS ESTRICTAS:
1. NUNCA despliegues muros de texto largos en el chat. EN SU LUGAR, DEBES usar la tool 'create_file' para guardar la información clave y extensa en documentos modulares (ej. 'estrategia.md', 'stack_tecnologico.md', 'plan_accion.md').
2. Luego de ejecutar las tools para guardar/actualizar la información, diles en el chat un breve resumen de lo que generaste ("¡He creado tu modelo de negocio en el archivo estrategia.md!").
3. SIEMPRE, en cada iteración, hazle 1 o 2 preguntas clave para avanzar, y DALE OPCIONES DE SELECCIÓN (A, B, C) o dile que puede escribir lo que quiera. Esto le quita la carga mental de saber qué responder.
4. Adopta sus ideas, pero guíalo. Si pide una "app tipo Uber", recomiéndale el camino óptimo en tus archivos y adapta tus recomendaciones.

${fileContext}
`;

    try {
        const result = streamText({
            model: aiProvider('gpt-4o'), // Defaulting to gpt-4o as it's typically highly capable
            messages,
            system: systemPrompt,
            tools: {
                create_file: tool({
                    description: 'Crea un nuevo archivo en el lienzo del proyecto (ej. "modelo_negocio.md"). Úsalo siempre para documentos o planes.',
                    parameters: z.object({
                        path: z.string().describe('Nombre descriptivo del archivo con extensión, ej. "idea_principal.md"'),
                        content: z.string().describe('El contenido inicial del archivo, en MarkDown limpio.'),
                    }),
                    execute: async ({ path, content }) => {
                        return { success: true, message: `Archivo ${path} guardado con éxito.` };
                    },
                }),
                update_file: tool({
                    description: 'Actualiza el contenido de un documento que el usuario ya tiene en su workspace.',
                    parameters: z.object({
                        path: z.string().describe('El nombre exacto del archivo a actualizar.'),
                        content: z.string().describe('Todo el nuevo contenido completo del archivo.'),
                    }),
                    execute: async ({ path, content }) => {
                        return { success: true, message: `Archivo ${path} actualizado.` };
                    },
                })
            },
        });

        // Sending standard AI SDK response stream
        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
