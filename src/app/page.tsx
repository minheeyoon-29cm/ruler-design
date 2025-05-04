// src/app/page.tsx
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Ruler 디자인 시스템</h1>
      <p className="text-xl mb-8">
        29CM의 디자인 시스템으로, 브랜드의 일관성을 유지하면서도 효율적인 디자인·개발 협업을 가능하게 하는 시스템입니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/components" 
          className="block p-6 border rounded-lg hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-2">컴포넌트</h2>
          <p className="text-gray-600">
            버튼, 태그, 다이얼로그 등 Ruler의 기본 UI 컴포넌트입니다.
          </p>
        </Link>
        
        <Link href="/tokens" 
          className="block p-6 border rounded-lg hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-2">디자인 토큰</h2>
          <p className="text-gray-600">
            컬러, 타이포그래피, 스페이싱 등 Ruler의 디자인 토큰입니다.
          </p>
        </Link>
      </div>
    </div>
  );
}