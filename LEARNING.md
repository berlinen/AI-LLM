# LLM API 学习指南

## 第一部分：核心概念

### 1. Token 和 Context

**Token（令牌）**
- Token 是 LLM 处理文本的最小单位
- 1 个 token ≈ 0.75 个英文单词，或 1-2 个中文字符
- 例如："Hello World" ≈ 2 tokens，"你好世界" ≈ 4 tokens
- API 按 token 数量计费

**Context（上下文）**
- Context 是模型一次能处理的最大 token 数量
- 包括：输入（prompt）+ 输出（response）
- 例如：GPT-4 支持 8K/32K/128K context
- Claude 支持 200K context

### 2. System Prompt 和 User Prompt

**System Prompt（系统提示词）**
- 定义 AI 的角色、行为和规则
- 例如："你是一个专业的编程助手"
- 在整个对话中保持不变

**User Prompt（用户提示词）**
- 用户的具体问题或指令
- 每次对话都可以不同

### 3. Temperature 和 Max Tokens

**Temperature（温度）**
- 范围：0-2（OpenAI）或 0-1（Anthropic）
- 0 = 确定性输出，适合代码、数学
- 1 = 创造性输出，适合写作、头脑风暴
- 越高越随机

**Max Tokens（最大令牌数）**
- 限制 AI 回复的最大长度
- 防止超出预算或过长回复

### 4. Streaming Response（流式输出）

- 实时逐字返回 AI 的回复
- 类似 ChatGPT 的打字效果
- 提升用户体验，无需等待完整回复

## 第二部分：实践项目

我们将构建一个 AI 聊天网站，包含：
1. 基础聊天界面
2. OpenAI API 集成
3. Claude API 集成
4. 流式输出效果
5. 参数调节面板
