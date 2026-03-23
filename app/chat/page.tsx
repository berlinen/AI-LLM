'use client';

import { useState, useEffect } from 'react';
import { saveConversation, getConversations, deleteConversation, generateId, generateTitle, type Message, type Conversation } from '../lib/storage';

export default function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 初始化：加载历史对话
  useEffect(() => {
    const saved = getConversations();
    setConversations(saved);
    if (saved.length > 0) {
      setCurrentId(saved[0].id);
      setMessages(saved[0].messages);
    } else {
      const newId = generateId();
      setCurrentId(newId);
    }
  }, []);

  // 自动保存当前对话
  useEffect(() => {
    if (!currentId || messages.length === 0) return;

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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          temperature: 0.7,
          maxTokens: 1000
        })
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
      setMessages(prev => [...prev, { role: 'assistant', content: '请求失败：' + (error as Error).message }]);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold">AI 聊天助手</h1>
          <p className="text-sm text-blue-100">类似 ChatGPT 的对话应用</p>
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
              <div className={`max-w-[70%] p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border'
              }`}>
                <div className="text-xs mb-1 opacity-70">
                  {msg.role === 'user' ? '👤 你' : '🤖 AI'}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
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
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
