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
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">第一课：什么是 Token？</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <p className="mb-4 text-gray-700">
          Token 是 AI 模型处理文本的最小单位。输入文字试试：
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-3 border rounded"
          placeholder="输入一些文字..."
        />

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-lg">
            估算 Token 数：<span className="font-bold text-blue-600">{estimateTokens(text)}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            字符数：{text.length}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded">
        <h3 className="font-bold mb-2">💡 关键点：</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>1 个英文单词 ≈ 1-2 tokens</li>
          <li>1 个中文字 ≈ 0.5-1 token</li>
          <li>API 按 token 计费，不是按字符</li>
        </ul>
      </div>
    </div>
  );
}
