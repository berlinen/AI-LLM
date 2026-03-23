'use client';

import { useState } from 'react';

export default function TokenDemo() {
  const [text, setText] = useState('');

  const estimateTokens = (str: string) => {
    const englishWords = str.match(/[a-zA-Z]+/g)?.length || 0;
    const chineseChars = str.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    return Math.ceil(englishWords * 1.3 + chineseChars * 0.5);
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">第一课：什么是 Token？</h1>

      <div className="bg-gray-50 p-6 rounded-lg border mb-4">
        <p className="mb-4 text-gray-900">
          Token 是 AI 模型处理文本的最小单位。输入文字试试：
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-3 border rounded text-gray-900"
          placeholder="输入一些文字..."
        />

        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p className="text-lg text-gray-900">
            估算 Token 数：<span className="font-bold text-blue-700 text-2xl">{estimateTokens(text)}</span>
          </p>
          <p className="text-sm text-gray-900 mt-2">
            字符数：<span className="font-bold text-green-700 text-lg">{text.length}</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
        <h3 className="font-bold mb-2 text-gray-900">💡 关键点：</h3>
        <ul className="list-disc ml-6 space-y-1 text-gray-900">
          <li>1 个英文单词 ≈ <span className="font-bold text-purple-700">1-2 tokens</span></li>
          <li>1 个中文字 ≈ <span className="font-bold text-purple-700">0.5-1 token</span></li>
          <li>API 按 token 计费，不是按字符</li>
        </ul>
      </div>
    </div>
  );
}
