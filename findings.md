# 研究发现：停止生成功能

## 技术调研

### AbortController API
- 浏览器内置 API（无需额外依赖）
- 创建：`const controller = new AbortController()`
- 使用：`fetch(url, { signal: controller.signal })`
- 中断：`controller.abort()`
- 错误：抛出 `AbortError`（name: 'AbortError'）

### 当前实现分析（已完成代码审查）

**两个 fetch 调用位置：**
1. `handleSend()` - 第 140 行：发送新消息
2. `handleRegenerate()` - 第 97 行：重新生成回复

**流式请求模式：**
```typescript
// handleSend 中（第 140-168 行）
const res = await fetch('/api/openai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages, temperature, maxTokens })
});
const reader = res.body?.getReader();
const decoder = new TextDecoder();
let assistantContent = '';

setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  assistantContent += text;
  setMessages(prev => {
    const newMessages = [...prev];
    newMessages[newMessages.length - 1].content = assistantContent;
    return newMessages;
  });
}
```

**注入点确认：**
需要在两处 fetch 调用中添加 `signal`：
- 第 140 行的 fetch（handleSend）
- 第 97 行的 fetch（handleRegenerate）

**关键发现：**
- 部分内容已经在 `assistantContent` 变量中累积
- 中断时自动保留已累积的内容（无需额外处理）
- `finally` 块会清理 loading 状态

### 错误处理模式
```typescript
try {
  // fetch 和 stream
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('用户中断了请求');
    // 保留部分内容
  } else {
    // 处理其他错误
  }
}
```

### UI 设计方案
**停止按钮位置选项：**
1. 在消息气泡中（流式文本旁边）✓ 推荐
2. 在输入区域（替换发送按钮）
3. 浮动按钮

**推荐方案：** 在消息区域显示，更清晰

## 代码片段

### 状态管理
```typescript
const [abortController, setAbortController] = useState<AbortController | null>(null);
```

### 创建控制器
```typescript
const controller = new AbortController();
setAbortController(controller);
```

### 清理
```typescript
// 完成或出错后
setAbortController(null);
```

### 停止处理函数
```typescript
const handleStop = () => {
  if (abortController) {
    abortController.abort();
    setAbortController(null);
  }
};
```

## 技术决策

### 决策 1: 控制器生命周期
**选项：**
- A) 全局控制器（复用）
- B) 每次请求新建控制器 ✓

**选择：** B - 避免过期引用

### 决策 2: 部分内容处理
**选项：**
- A) 丢弃部分内容
- B) 保留部分内容 ✓

**选择：** B - 更好的用户体验，用户可以看到已生成的内容

### 决策 3: 按钮可见性
**选项：**
- A) 始终显示（空闲时禁用）
- B) 仅在生成时显示 ✓

**选择：** B - 更简洁的 UI

## 参考资料
- MDN AbortController: https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController
- Fetch API signal: https://developer.mozilla.org/zh-CN/docs/Web/API/fetch#signal
