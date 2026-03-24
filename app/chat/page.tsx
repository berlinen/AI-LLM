'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveConversation, getConversations, deleteConversation, generateId, generateTitle, type Message, type Conversation } from '../lib/storage';

const MODELS = [
  { id: 'gpt-4.1-mini', name: 'gpt-4.1-mini', provider: 'openai' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'claude-sonnet-4-5-20250929-thinking', name: 'claude-sonnet-4-5-20250929-thinking', provider: 'claude' },
];

export default function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getApiRoute = (modelId: string) => {
    const model = MODELS.find(m => m.id === modelId);
    return model?.provider === 'claude' ? '/api/claude' : '/api/openai';
  };

  // 初始化：加载历史对话
  useEffect(() => {
    if (!mounted) return;
    const saved = getConversations();
    setConversations(saved);
    if (saved.length > 0) {
      setCurrentId(saved[0].id);
      setMessages(saved[0].messages);
    } else {
      const newId = generateId();
      setCurrentId(newId);
    }
  }, [mounted]);

  // 自动保存当前对话
  useEffect(() => {
    if (!mounted || !currentId || messages.length === 0) return;

    const conversation: Conversation = {
      id: currentId,
      title: generateTitle(messages),
      messages,
      createdAt: conversations.find(c => c.id === currentId)?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    saveConversation(conversation);
    setConversations(getConversations());
  }, [messages, currentId]);

  const handleNewChat = () => {
    const newId = generateId();
    setCurrentId(newId);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentId(id);
      setMessages(conv.messages);
    }
  };

  const handleDeleteChat = (id: string) => {
    deleteConversation(id);
    const updated = getConversations();
    setConversations(updated);

    if (id === currentId) {
      if (updated.length > 0) {
        setCurrentId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        const newId = generateId();
        setCurrentId(newId);
        setMessages([]);
      }
    }
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || loading) return;

    // 删除最后一条 AI 回复
    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch(getApiRoute(selectedModel), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
          temperature: 0.7,
          maxTokens: 1000
        }),
        signal: controller.signal
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
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // 用户中断，保留部分内容
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '请求失败：' + (error as Error).message }]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch(getApiRoute(selectedModel), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
          temperature: 0.7,
          maxTokens: 1000
        }),
        signal: controller.signal
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
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // 用户中断，保留部分内容
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '请求失败：' + (error as Error).message }]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧边栏 */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-bold"
          >
            + 新建对话
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800 flex justify-between items-center ${
                conv.id === currentId ? 'bg-gray-800' : ''
              }`}
              onClick={() => handleSelectChat(conv.id)}
            >
              <div className="flex-1 truncate">
                <div className="text-sm truncate">{conv.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(conv.id);
                }}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-600 text-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI 聊天助手</h1>
              <p className="text-sm text-blue-100">类似 ChatGPT 的对话应用</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">模型：</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-blue-400 focus:outline-none focus:border-blue-300"
              >
                {MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-4">💬</div>
              <p>开始你的第一个对话吧！</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border'
              } p-4 rounded-lg`}>
                <div className="text-xs mb-1 opacity-70">
                  {msg.role === 'user' ? '👤 你' : '🤖 AI'}
                </div>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const isBlock = !!match;
                          return isBlock ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-red-600" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {msg.role === 'assistant' && msg.content && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    >
                      {copied === idx ? '✓ 已复制' : '📋 复制'}
                    </button>
                    {idx === messages.length - 1 && !loading && (
                      <button
                        onClick={handleRegenerate}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                      >
                        🔄 重新生成
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="flex-1 p-3 border rounded-lg text-gray-900"
              disabled={loading}
            />
            {loading ? (
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                ⏹ 停止
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
              >
                发送
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
