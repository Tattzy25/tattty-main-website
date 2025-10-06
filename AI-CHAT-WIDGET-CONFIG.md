# AI Chat Widget Configuration

## Drag & Resize Features

### Draggable Float Button
- **Drag the bubble**: Click and hold the floating button to drag it anywhere on screen
- **Position saves**: Location persists in localStorage between sessions
- **Boundary detection**: Prevents dragging outside viewport

### Draggable Chat Window
- **Move window**: Click and drag the header (with grip icon) to reposition
- **Grip indicator**: Visible handle shows draggable area

### Resizable Chat Window
- **Resize handle**: Bottom-right corner has a resize handle
- **Min/Max sizes**: 
  - Minimum: 320px × 400px
  - Maximum: Up to screen edges
- **Size persists**: Dimensions save to localStorage

### Saved Preferences
All settings auto-save to localStorage:
- `tattty_ai_providers` - Your providers and models
- `tattty_chat_position` - Float button/window position
- `tattty_chat_size` - Window dimensions

## Environment Variables

Add these to your `.env.local` file:

```bash
# Groq (Fast LLaMA models)
GROQ_API_KEY=your_groq_api_key_here

# Anthropic (Claude models)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenRouter (Multi-provider access)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Your app URL (for OpenRouter)
NEXT_PUBLIC_APP_URL=https://tattty.com
```

## Pre-configured Providers

### Groq
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Models**:
  - Llama 3.3 70B (8K tokens)
  - Llama 3.1 70B (8K tokens)
  - Mixtral 8x7B (32K tokens)

### Anthropic
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Models**:
  - Claude 3.5 Sonnet (8K tokens)
  - Claude 3 Opus (4K tokens)
  - Claude 3 Haiku (4K tokens)

### OpenRouter
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Models**:
  - Claude 3.5 Sonnet (8K tokens)
  - GPT-4 Turbo (4K tokens)
  - Gemini Pro 1.5 (8K tokens)

## Adding Custom Providers

Click the **Settings** icon in the chat widget to add custom providers:

1. **Provider Name**: Display name (e.g., "OpenAI", "Custom API")
2. **API Endpoint**: Full API URL (e.g., `https://api.openai.com/v1/chat/completions`)
3. **Environment Variable Name**: The env var holding your API key (e.g., `OPENAI_API_KEY`)
4. **Model ID**: The model identifier (e.g., `gpt-4-turbo-preview`)
5. **Model Display Name**: Human-readable name (e.g., "GPT-4 Turbo")
6. **Max Tokens**: Maximum response tokens (e.g., `4096`)
7. **Temperature**: Response randomness 0-2 (e.g., `0.7`)

## API Compatibility

The widget supports two API formats:

### OpenAI-Compatible (Default)
Used by: Groq, OpenRouter, OpenAI, most providers

Request format:
```json
{
  "model": "model-id",
  "messages": [{"role": "user", "content": "..."}],
  "temperature": 0.7,
  "max_tokens": 4096
}
```

Response format:
```json
{
  "choices": [
    {
      "message": {
        "content": "..."
      }
    }
  ]
}
```

### Anthropic Format
Used by: Anthropic Claude API

Request format:
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "messages": [{"role": "user", "content": "..."}],
  "max_tokens": 8192,
  "temperature": 0.7,
  "system": "System message"
}
```

Response format:
```json
{
  "content": [
    {
      "text": "..."
    }
  ]
}
```

## Features

✅ **Custom Providers**: Add unlimited AI providers
✅ **Multiple Models**: Switch between models per provider
✅ **Real API Calls**: No mock data, all production endpoints
✅ **Provider Management**: Add/remove providers dynamically
✅ **Chat History**: Track provider and model used per message
✅ **Error Handling**: Clear error messages with provider context
✅ **Security**: API keys stored in environment variables only

## Usage

1. Select a provider from the dropdown
2. Select a model from the available models
3. Type your message and press Enter or click Send
4. View responses with provider/model metadata
5. Manage providers in Settings

## Removing Providers

Click the Settings icon, then click the trash icon next to any provider to remove it.
