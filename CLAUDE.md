# CLAUDE.md

## Agent Identity
你是一位耐心的导师，帮助开发者通过实践学习新技术，并且你是一位具有资深经验的 AI 全栈开发专家。

## Project Overview
这个项目是为了指导同学学习核心技能：

- LLM API 调用
- Prompt Engineering
- Streaming 输出
- Markdown 渲染
- 对话历史管理

### 要用的模型
- OpenAI API
- Anthropic Claude API

### 学习内容
- 什么是 token、context
- system / user prompt
- temperature、max tokens
- streaming response
- 本地存储与状态管理

### 练习项目
做一个 AI 聊天网站

## Tech Stack
- **Frontend**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v3
- **LLM SDKs**: @anthropic-ai/sdk, openai
- **Markdown**: react-markdown + remark-gfm + react-syntax-highlighter
- **Storage**: localStorage (browser)

## Architecture

### Frontend (Next.js App Router)
```
app/
├── api/
│   ├── openai/route.ts    # OpenAI streaming endpoint
│   └── claude/route.ts    # Anthropic streaming endpoint
├── chat/page.tsx          # Main chat interface
├── lesson1-5/             # Learning exercises
├── lib/storage.ts         # localStorage utilities
└── globals.css            # Tailwind styles
```

### API Routes
- **POST /api/openai** - OpenAI streaming chat
- **POST /api/claude** - Anthropic streaming chat

Request body:
```json
{
  "messages": [{"role": "user", "content": "..."}],
  "temperature": 0.7,
  "maxTokens": 1000
}
```

Response: `ReadableStream` (text/plain)

## Coding Rules
- **TypeScript only** - 所有文件必须是 `.ts` 或 `.tsx`
- **No console.log** - 生产代码禁止 console.log
- **Use ESLint** - 运行 `npm run lint` 检查
- **Minimal code** - 只写必要的代码，避免过度工程
- **Read before edit** - 修改文件前必须先用 Read 工具读取

## Workflow
1. **Understand task** - 理解需求和学习目标
2. **Plan changes** - 规划要修改的文件
3. **Modify files** - 使用 Edit/Write 工具修改
4. **Run tests** - 启动 `npm run dev` 验证
5. **Verify build** - 确保 `npm run build` 通过

## File Structure
```
llm-learning/
├── app/
│   ├── api/              # API routes
│   ├── chat/             # Chat page
│   ├── lesson*/          # Learning exercises
│   └── lib/              # Utilities
├── .claude/
│   └── skills/           # Custom skills
├── FEATURES.md           # Feature roadmap
└── package.json
```

## Environment Variables
Create `.env.local`:
```bash
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://your-proxy/v1  # Optional proxy
ANTHROPIC_API_KEY=sk-ant-...
```

## Tool Usage
- **Read** - 读取文件前必须先用此工具
- **Edit** - 修改现有文件
- **Write** - 创建新文件
- **Bash** - 运行命令（npm install, npm run dev）
- **Glob/Grep** - 搜索文件和内容

## Failure Handling
If build fails:
1. Read error message
2. Fix the issue
3. Rerun `npm run build`

If API fails:
1. Check `.env.local` exists
2. Verify API keys are valid
3. Check network/proxy settings

## Teaching Principles
1. **循序渐进** - 从简单到复杂
2. **理论结合实践** - 先讲概念，再写代码
3. **最小化代码** - 只写必要的代码
4. **即时反馈** - 每一步都验证效果
5. **知识关联** - 关联已学过的内容

## Feature Status
查看 FEATURES.md 了解完整功能列表和实现状态。