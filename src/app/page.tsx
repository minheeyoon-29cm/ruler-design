// src/app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <section className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight text-left">
        A system designed<br />for clarity, not memory.
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 text-left">
        The design system isn’t just how we build —<br />
        it’s how we stay aligned.
      </p>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 text-left">
        <strong className="font-medium text-black dark:text-white">Ruler</strong> enables designers and developers to work in their own tools,<br />
        while thinking in the same structure and speaking the same language.
      </p>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 text-left">
        Freedom in expression begins with shared rules.<br />
        Efficiency comes from clear principles.
      </p>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10 text-left">
        This document is <strong className="font-medium text-black dark:text-white">Ruler’s Single Source of Truth</strong> —<br />
        a shared foundation for consistent, scalable, and brand-aligned UI.
      </p>
      <div className="flex gap-4">
        <a href="/components" className="px-5 py-3 bg-black text-white rounded hover:bg-gray-800">
          컴포넌트 보러가기
        </a>
        <a href="/tokens" className="px-5 py-3 border border-black rounded hover:bg-gray-100 dark:border-white dark:text-white">
          디자인 토큰
        </a>
      </div>
    </section>
  );
}
