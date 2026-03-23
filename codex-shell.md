# Claude Code CLI 使用手册（工程版）

## 一、概述

Claude Code 是一个基于命令驱动的 AI Agent 开发工具。

命令格式：

```
/<command> [参数]
```

---

## 二、核心命令

### /init（初始化项目上下文）

功能：

* 扫描代码仓库
* 生成 CLAUDE.md
* 建立长期记忆

示例：

```bash
/init
```

---

### /compact（压缩上下文）

功能：

* 降低 token 消耗
* 保留关键上下文

示例：

```bash
/compact
/compact 仅保留架构信息
```

---

### /clear（重置上下文）

```bash
/clear
```

---

### /agents（多 Agent 管理）

功能：

* 创建多个 AI Agent
* 分配不同职责

---

## 三、项目管理

### /add-dir

```bash
/add-dir ./src
```

---

### /memory（编辑项目记忆）

```bash
/memory
```

---

### /config（配置系统）

---

## 四、开发与调试

### /review（代码评审）

### /doctor（环境检测）

### /status（系统状态）

---

## 五、上下文与成本

### /cost（Token 使用）

### /usage（额度）

---

## 六、高级能力

### /sandbox（安全执行环境）

用于运行代码、测试脚本

---

### /mcp（工具接入）

连接：

* API
* 数据库
* 外部服务

---

## 七、工作流模式

### 1. 标准开发流程

```bash
/init
→ 定义任务
→ 执行
→ /compact
```

---

### 2. 可控执行流程

```bash
/init
→ 明确范围
→ 分步骤执行
→ /compact
→ 循环迭代
```

---

## 八、最佳实践

* 所有项目必须先 `/init`
* 长任务必须 `/compact`
* 使用 CLAUDE.md 存储上下文
* 大任务拆小执行
* 多任务使用 `/agents`

---

## 九、核心认知

Claude Code ≠ 编辑器

Claude Code =

Agent运行时 + 上下文记忆 + 工具执行系统
