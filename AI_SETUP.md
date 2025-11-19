# Vectorify - AI Configuration Guide

Vectorify supports multiple AI providers out of the box. This guide will help you configure and use them.

## Supported AI Providers

1. **OpenAI** (GPT-4, GPT-3.5)
2. **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
3. **Google** (Gemini Pro)
4. **OpenRouter** (Access to Mixtral, Llama, and other open-source models)

---

## Configuration

### Option 1: System-Wide API Keys (Backend)

Configure API keys in the backend for all users:

**File: `apps/api/.env`**

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Google
GOOGLE_API_KEY=your-google-api-key-here

# OpenRouter
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key-here
```

### Option 2: User-Provided API Keys (Frontend)

Users can provide their own API keys through the UI (more secure, pay-per-use).

The frontend will send the API key in the `Authorization` header:

```typescript
import { aiService } from '@/lib/ai/ai-service';

// Set user's API key
aiService.setApiKey('sk-user-api-key');

// Use AI
const response = await aiService.complete({
  provider: 'openai',
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Hello!' }
  ]
});
```

---

## Getting API Keys

### 1. OpenAI

**Best for:** High-quality general-purpose AI, complex reasoning

**Steps:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to `apps/api/.env`: `OPENAI_API_KEY=sk-...`

**Recommended models:**
- `gpt-4-turbo` - Best quality, most expensive
- `gpt-4` - Good quality
- `gpt-3.5-turbo` - Fast and cheap

**Pricing:** ~$0.01 - $0.03 per 1K tokens

### 2. Anthropic (Claude)

**Best for:** Long context, detailed analysis, safety

**Steps:**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

**Recommended models:**
- `claude-3-opus` - Highest intelligence
- `claude-3-sonnet` - Balanced
- `claude-3-haiku` - Fastest, cheapest

**Pricing:** ~$0.003 - $0.015 per 1K tokens

**Implementation:**

To use Anthropic, you need to install the SDK:

```bash
cd apps/api
pnpm add @anthropic-ai/sdk
```

Then update `apps/api/src/modules/ai/ai.service.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

private async completeAnthropic(
  model: string,
  messages: any[],
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    messages: messages.map(m => ({
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content
    }))
  });

  return {
    content: response.content[0].text,
    model,
    usage: {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    },
  };
}
```

### 3. Google (Gemini)

**Best for:** Multimodal (images + text), fast responses

**Steps:**
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env`: `GOOGLE_API_KEY=your-key`

**Recommended models:**
- `gemini-pro` - Text only
- `gemini-pro-vision` - Text + Images

**Pricing:** Free tier available, then ~$0.0005 per 1K tokens

**Implementation:**

```bash
cd apps/api
pnpm add @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

private async completeGoogle(
  model: string,
  messages: any[],
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelInstance = genAI.getGenerativeModel({ model });

  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');

  const result = await modelInstance.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  });

  const response = result.response;

  return {
    content: response.text(),
    model,
    usage: {
      promptTokens: 0, // Google doesn't provide this
      completionTokens: 0,
      totalTokens: 0,
    },
  };
}
```

### 4. OpenRouter (Open Source Models)

**Best for:** Cost-effective, access to many models, privacy

**Steps:**
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up and create an API key
3. Add to `.env`: `OPENROUTER_API_KEY=sk-or-...`

**Available models:**
- `mistralai/mixtral-8x7b-instruct`
- `meta-llama/llama-2-70b-chat`
- `google/palm-2-chat-bison`
- Many more!

**Pricing:** Varies by model, usually $0.0001 - $0.001 per 1K tokens

**Implementation:**

OpenRouter uses OpenAI-compatible API:

```typescript
private async completeOpenRouter(
  model: string,
  messages: any[],
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://vectorify.io',
      'X-Title': 'Vectorify',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    model,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    },
  };
}
```

---

## Using AI in Frontend

### Example: Analyze a Lean Canvas

```typescript
import { aiService } from '@/lib/ai/ai-service';

async function analyzeLeanCanvas(canvasData: any) {
  const analysis = await aiService.analyzeArtifact('lean-canvas', canvasData);
  console.log(analysis);
}
```

### Example: Get Project Suggestions

```typescript
import { aiService } from '@/lib/ai/ai-service';

async function getSuggestions(projectContext: any) {
  const suggestions = await aiService.suggestImprovements(projectContext);
  console.log(suggestions);
}
```

### Example: Chat with Custom Prompt

```typescript
import { aiService } from '@/lib/ai/ai-service';

async function chat(userMessage: string) {
  const response = await aiService.complete({
    provider: 'openai', // or 'anthropic', 'google', 'openrouter'
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are Vector, a strategic AI advisor for Vectorify.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    maxTokens: 500
  });

  return response.content;
}
```

---

## Best Practices

### 1. **Use Different Models for Different Tasks**

- **Complex Analysis:** GPT-4 or Claude Opus
- **Quick Suggestions:** GPT-3.5 or Claude Haiku
- **Cost-Sensitive:** Gemini or Mixtral (via OpenRouter)

### 2. **Implement Rate Limiting**

Add rate limiting to prevent abuse:

```typescript
// apps/api/src/modules/ai/ai.controller.ts
import { Throttle } from '@nestjs/throttler';

@Throttle(10, 60) // 10 requests per minute
@Post('complete')
async complete(@Body() dto: AICompletionDto) {
  // ...
}
```

Install throttler:

```bash
cd apps/api
pnpm add @nestjs/throttler
```

### 3. **Cache Responses**

Cache common queries to save API costs:

```typescript
// Use Redis for caching
const cachedResponse = await redis.get(cacheKey);
if (cachedResponse) return cachedResponse;

const response = await aiService.complete(...);
await redis.set(cacheKey, response, 'EX', 3600); // 1 hour
```

### 4. **Stream Responses for Better UX**

```typescript
await aiService.streamComplete(
  {
    provider: 'openai',
    model: 'gpt-4-turbo',
    messages: [...]
  },
  (chunk) => {
    console.log(chunk); // Display incrementally
  }
);
```

---

## Security Considerations

1. **Never expose API keys in frontend code**
   - Always proxy through backend
   - Use environment variables

2. **Validate user input**
   - Prevent prompt injection
   - Limit message length

3. **Monitor usage**
   - Track API costs per user
   - Set spending limits

4. **Use user-provided keys when possible**
   - Users pay for their own usage
   - More scalable business model

---

## Troubleshooting

### Error: "No API key provided"

**Solution:** Add the API key to `apps/api/.env` or pass it in the Authorization header.

### Error: "Rate limit exceeded"

**Solution:** Implement caching and rate limiting. Consider upgrading API plan.

### Error: "Invalid model"

**Solution:** Check the model name. Each provider has different model names.

### High costs

**Solution:**
1. Use cheaper models (GPT-3.5, Claude Haiku)
2. Implement caching
3. Reduce max_tokens
4. Use OpenRouter for cost-effective alternatives

---

## Next Steps

1. **Get API keys** from at least one provider
2. **Configure .env** files
3. **Install SDKs** (`pnpm add @anthropic-ai/sdk @google/generative-ai`)
4. **Implement real completions** in `ai.service.ts`
5. **Test** the AI features in the Copilot panel

---

**Need Help?**

- OpenAI Docs: https://platform.openai.com/docs
- Anthropic Docs: https://docs.anthropic.com
- Google AI Docs: https://ai.google.dev/docs
- OpenRouter Docs: https://openrouter.ai/docs
