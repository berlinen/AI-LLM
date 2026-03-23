# LLM API 学习项目

循序渐进学习大模型 API 调用，包含 OpenAI 和 Anthropic Claude API。

## 🎯 学习目标

- ✅ 理解 Token 和 Context 概念
- ✅ 掌握 System/User Prompt 使用
- ✅ 学会调整 Temperature 和 Max Tokens 参数
- ✅ 实现 Streaming Response（流式输出）
- ✅ 对比 OpenAI 和 Claude API
- ✅ 构建完整的 AI 聊天应用

## 📚 课程内容

### 第一课：什么是 Token？
- Token 是 AI 处理文本的最小单位
- 1 个英文单词 ≈ 1-2 tokens
- 1 个中文字 ≈ 0.5-1 token
- API 按 token 计费

### 第二课：System Prompt vs User Prompt
- **System Prompt**：定义 AI 的角色和行为规则
- **User Prompt**：用户的具体问题或指令
- 实时体验流式输出效果

### 第三课：Temperature 和 Max Tokens
- **Temperature (0-2)**：控制输出的随机性
  - 0.0 = 精确、一致（适合翻译、代码）
  - 1.0 = 平衡
  - 2.0 = 创造、随机（适合创意写作）
- **Max Tokens**：限制输出的最大长度

### 第五课：OpenAI vs Claude API 对比
- 同时调用两个 API，对比响应速度和质量
- 观察不同模型的回答风格差异

### 实战项目：AI 聊天应用
- 完整的 ChatGPT 风格对话界面
- 支持多轮对话上下文
- 流式输出显示

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://your-proxy-url/v1  # 可选，国内需要代理

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
app/
├── api/
│   ├── openai/route.ts      # OpenAI API 路由
│   └── claude/route.ts      # Claude API 路由
├── lesson1/page.tsx         # 第一课：Token
├── lesson2/page.tsx         # 第二课：Prompt
├── lesson3/page.tsx         # 第三课：参数
├── lesson5/page.tsx         # 第五课：API 对比
├── chat/page.tsx            # 聊天应用
└── page.tsx                 # 首页
```

## 🔑 核心技术点

### 1. Streaming Response（流式输出）

```typescript
const res = await fetch('/api/openai', {
  method: 'POST',
  body: JSON.stringify({ messages, temperature, maxTokens })
});

const reader = res.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  setResponse(prev => prev + text);
}
```

### 2. OpenAI API 调用

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages,
  temperature,
  max_tokens: maxTokens,
  stream: true,
});
```

### 3. Claude API 调用

```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: maxTokens,
  temperature,
  messages,
});
```

## 💡 学习建议

1. **按顺序学习**：从第一课开始，逐步理解概念
2. **动手实验**：修改参数，观察输出变化
3. **对比测试**：使用第五课对比不同模型的表现
4. **实战练习**：在聊天应用中应用所学知识

## 🛠️ 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS v3
- **API SDK**：
  - `openai` - OpenAI SDK
  - `@anthropic-ai/sdk` - Anthropic SDK

## 📝 注意事项

- 需要有效的 OpenAI 和 Anthropic API 密钥
- 国内访问 OpenAI API 需要配置代理（OPENAI_BASE_URL）
- API 调用会产生费用，注意控制 max_tokens
- 建议使用较小的模型进行学习（如 gpt-4o-mini）

## 🎓 下一步学习

- Function Calling（函数调用）
- Embeddings（向量嵌入）
- Fine-tuning（模型微调）
- RAG（检索增强生成）
- Multi-modal（多模态：图像、语音）
