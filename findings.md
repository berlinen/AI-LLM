# 研究发现：停止生成功能

## 技术调研

### AbortController API
- 浏览器内置 API（无需额外依赖）
- 创建：`const controller = new AbortController()`
- 使用：`fetch(url, { signal: controller.signal })`
- 中断：`controller.abort()`
- 错误：抛出 `AbortError`（name: 'AbortError'）

### 当前实现分析
**流式请求模式：**
```typescript
const response = await fetch('/api/openai', {
  method: 'POST',
  body: JSON.stringify({ messages, temperature, maxTokens })
});
const reader = response.body.getReader();
// 读取流式数据块...
```

**注入点：**
在 fetch options 中添加 `signal`：
```typescript
const response = await fetch('/api/openai', {
  method: 'POST',
  body: JSON.stringify({ messages, temperature, maxTokens }),
  signal: abortController.signal  // ← 添加这行
});
```

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
