'use client';

import { useState } from 'react';

export default function PromptDemo() {
  const [systemPrompt, setSystemPrompt] = useState('你是一个专业的翻译助手，擅长中英文互译。');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          maxTokens: 500
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        setResponse(prev => prev + text);
      }
    } catch (error) {
      setResponse('请求失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">第二课：System Prompt vs User Prompt</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold mb-2 text-gray-900">🎭 System Prompt（系统提示词）</h3>
          <p className="text-sm mb-3 text-gray-700">定义 AI 的角色和行为规则</p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-32 p-3 border rounded text-gray-900 bg-white"
            placeholder="例如：你是一个专业的..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold mb-2 text-gray-900">💬 User Prompt（用户提示词）</h3>
          <p className="text-sm mb-3 text-gray-700">用户的具体问题或指令</p>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full h-32 p-3 border rounded text-gray-900 bg-white"
            placeholder="输入你的问题..."
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !userPrompt.trim()}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
      >
        {loading ? '生成中...' : '发送请求'}
      </button>

      {response && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="font-bold mb-3 text-gray-900">🤖 AI 回复：</h3>
          <div className="text-gray-900 whitespace-pre-wrap">{response}</div>
        </div>
      )}

      <div className="mt-6 bg-yellow-100 p-4 rounded border border-yellow-300">
        <h3 className="font-bold mb-2 text-gray-900">💡 试试这些例子：</h3>
        <div className="space-y-2 text-sm text-gray-900">
          <div className="bg-white p-2 rounded">
            <strong className="text-purple-700">System:</strong> 你是一个幽默的诗人
            <br />
            <strong className="text-blue-700">User:</strong> 写一首关于代码的诗
          </div>
          <div className="bg-white p-2 rounded">
            <strong className="text-purple-700">System:</strong> 你是一个严肃的科学家
            <br />
            <strong className="text-blue-700">User:</strong> 解释什么是黑洞
          </div>
        </div>
      </div>
    </div>
  );
}
