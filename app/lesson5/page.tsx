'use client';

import { useState } from 'react';

export default function CompareAPIs() {
  const [prompt, setPrompt] = useState('用一句话介绍你自己');
  const [openaiResponse, setOpenaiResponse] = useState('');
  const [claudeResponse, setClaudeResponse] = useState('');
  const [loading, setLoading] = useState({ openai: false, claude: false });

  const callAPI = async (api: 'openai' | 'claude') => {
    setLoading(prev => ({ ...prev, [api]: true }));
    const setResponse = api === 'openai' ? setOpenaiResponse : setClaudeResponse;
    setResponse('');

    try {
      const res = await fetch(`/api/${api}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          maxTokens: 500
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse(prev => prev + decoder.decode(value));
      }
    } catch (error) {
      setResponse('请求失败：' + (error as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, [api]: false }));
    }
  };

  const callBoth = () => {
    callAPI('openai');
    callAPI('claude');
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">第五课：对比 OpenAI vs Claude API</h1>

      <div className="mb-6">
        <label className="block font-bold mb-2 text-gray-900">💬 输入提示词：</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 p-3 border rounded text-gray-900"
          placeholder="输入你的问题..."
        />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={callBoth}
          disabled={loading.openai || loading.claude}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-300"
        >
          同时调用两个 API
        </button>
        <button
          onClick={() => callAPI('openai')}
          disabled={loading.openai}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300"
        >
          {loading.openai ? '调用中...' : '只调用 OpenAI'}
        </button>
        <button
          onClick={() => callAPI('claude')}
          disabled={loading.claude}
          className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-300"
        >
          {loading.claude ? '调用中...' : '只调用 Claude'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold mb-3 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🟢</span>
            OpenAI GPT-4o-mini
          </h3>
          <div className="bg-white p-4 rounded border min-h-[200px]">
            {loading.openai && !openaiResponse && (
              <div className="text-gray-400">生成中...</div>
            )}
            <div className="text-gray-900 whitespace-pre-wrap">{openaiResponse}</div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-bold mb-3 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🟠</span>
            Anthropic Claude 3.5 Sonnet
          </h3>
          <div className="bg-white p-4 rounded border min-h-[200px]">
            {loading.claude && !claudeResponse && (
              <div className="text-gray-400">生成中...</div>
            )}
            <div className="text-gray-900 whitespace-pre-wrap">{claudeResponse}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-100 p-4 rounded border border-yellow-300">
        <h3 className="font-bold mb-2 text-gray-900">💡 对比要点：</h3>
        <div className="space-y-2 text-sm text-gray-900">
          <div className="bg-white p-2 rounded">
            <strong>响应速度：</strong>观察哪个 API 的流式输出更快
          </div>
          <div className="bg-white p-2 rounded">
            <strong>回答风格：</strong>注意两个模型的表达方式差异
          </div>
          <div className="bg-white p-2 rounded">
            <strong>准确性：</strong>对于事实性问题，对比答案的准确度
          </div>
          <div className="bg-white p-2 rounded">
            <strong>创造性：</strong>对于创意任务，对比输出的创新程度
          </div>
        </div>
      </div>
    </div>
  );
}
