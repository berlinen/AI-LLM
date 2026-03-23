import Link from 'next/link';

export default function Home() {
  const lessons = [
    { href: '/lesson1', title: '第一课：什么是 Token？', desc: '了解 AI 处理文本的最小单位' },
    { href: '/lesson2', title: '第二课：System Prompt vs User Prompt', desc: '定义 AI 角色与行为' },
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
