// src/app/tokens/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function TokensPage() {
  const tokenCategories = [
    {
      title: '컬러',
      description: 'Ruler의 색상 시스템과 의미론적 컬러 토큰',
      slug: 'colors',
      tokens: ['semantic.text.primary', 'semantic.text.secondary', 'scale.gray-100', 'scale.blue-500']
    },
    {
      title: '타이포그래피',
      description: '타이틀, 본문 등 텍스트 스타일 정의',
      slug: 'typography',
      tokens: ['title-xxl', 'title-xl-bold', 'text-l', 'text-m-medium']
    },
    {
      title: '스페이싱',
      description: '여백, 간격을 위한 크기 정의',
      slug: 'spacing',
      tokens: ['dimension-100', 'dimension-200', 'dimension-300']
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">디자인 토큰</h1>
      <p className="text-xl mb-8">
        Ruler의 디자인 시스템은 semantic, scale, static-scale 세 가지 계층으로 구성된 토큰 시스템을 사용합니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tokenCategories.map((category) => (
          <div key={category.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">예시 토큰:</h3>
              <ul className="text-sm text-gray-500">
                {category.tokens.map((token) => (
                  <li key={token} className="mb-1">{token}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">디자인 토큰 구조</h2>
        <p className="mb-4">
          Ruler의 디자인 토큰은 크게 `semantic`, `scale`, `static-scale` 세 가지 계층으로 구성되며, 테마(`$themes.json`)와 메타데이터(`$metadata.json`)를 통해 Figma 연동 및 토큰 세트를 관리합니다.
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          {`
├── semantic/
│ ├── color/ # 시멘틱 컬러 (라이트/다크 모드 포함)
│ ├── typography/ # 시멘틱 타이포그라피 스타일
│ └── breakpoints/ # 반응형 기준점
├── scale/
│ ├── color/ # 컬러 스케일 (라이트/다크)
│ ├── corner-radius/ # 모서리 반경
│ ├── dimension-font-size/
│ ├── dimension-size/ # spacing 단위
│ ├── font-weight/ # 폰트 굵기
│ ├── letter-spacing/ # 자간
│ ├── line-height/ # 행간
│ ├── duration/ # 모션 지속 시간
│ └── materials(임시)/ # Blur 등의 컴포지션 요소
├── static-scale/
│ ├── color/ # 고정 색상 (white, black 등)
│ └── font-family/ # 폰트 패밀리
          `}
        </pre>
      </div>
    </div>
  );
}