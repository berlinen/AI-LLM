import Link from 'next/link';

export default function Home() {
  const lessons = [
    { href: '/lesson1', title: '第一课：什么是 Token？', desc: '了解 AI 处理文本的最小单位' },
    { href: '/lesson2', title: '第二课：System Prompt vs User Prompt', desc: '定义 AI 角色与行为' },
    { href: '/lesson3', title: '第三课：Temperature 和 Max Tokens', desc: '控制 AI 输出的随机性和长度' },
    { href: '/lesson5', title: '第五课：OpenAI vs Claude API 对比', desc: '同时体验两个主流 LLM API' },
    { href: '/chat', title: '🎯 实战项目：AI 聊天应用', desc: '完整的 ChatGPT 风格对话应用' },
  ];

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">LLM API 学习项目</h1>
      <p className="text-gray-500 mb-8">循序渐进掌握大模型 API 调用</p>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.href}
            href={lesson.href}
            className="block p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="font-bold text-gray-900">{lesson.title}</div>
            <div className="text-sm text-gray-500 mt-1">{lesson.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
