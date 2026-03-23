'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="flex flex-col h-screen bg-gray-100">
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
  );
}
