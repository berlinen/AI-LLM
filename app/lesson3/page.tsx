'use client';

import { useState } from 'react';

export default function ParametersDemo() {
  const [prompt, setPrompt] = useState('写一个关于春天的短句');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(100);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature,
          maxTokens
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">第三课：Temperature 和 Max Tokens</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-bold mb-2 text-gray-900">🌡️ Temperature（温度）</h3>
          <p className="text-sm mb-3 text-gray-700">控制输出的随机性和创造性</p>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-2xl font-bold text-orange-600 mt-2">{temperature}</div>
          <div className="text-xs text-gray-600 mt-2">
            <div>0.0 = 精确、一致</div>
            <div>1.0 = 平衡</div>
            <div>2.0 = 创造、随机</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold mb-2 text-gray-900">📏 Max Tokens（最大令牌数）</h3>
          <p className="text-sm mb-3 text-gray-700">限制输出的最大长度</p>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-2xl font-bold text-green-600 mt-2">{maxTokens}</div>
          <div className="text-xs text-gray-600 mt-2">
            <div>越小 = 越简短</div>
            <div>越大 = 越详细</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2 text-gray-900">💬 输入提示词：</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 p-3 border rounded text-gray-900"
          placeholder="输入你的问题..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 mb-4"
      >
        {loading ? '生成中...' : '生成回复'}
      </button>

      {response && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="font-bold mb-3 text-gray-900">🤖 AI 回复：</h3>
          <div className="text-gray-900 whitespace-pre-wrap">{response}</div>
        </div>
      )}

      <div className="mt-6 bg-yellow-100 p-4 rounded border border-yellow-300">
        <h3 className="font-bold mb-2 text-gray-900">💡 实验建议：</h3>
        <div className="space-y-2 text-sm text-gray-900">
          <div className="bg-white p-2 rounded">
            <strong>Temperature 0.0：</strong>多次运行，结果几乎相同（适合翻译、代码生成）
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Temperature 1.5：</strong>多次运行，结果差异很大（适合创意写作）
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Max Tokens 20：</strong>输出会被截断
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Max Tokens 500：</strong>输出更完整详细
          </div>
        </div>
      </div>
    </div>
  );
}
