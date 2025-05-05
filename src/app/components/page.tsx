// src/app/components/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function ComponentsPage() {
  // 임시 컴포넌트 데이터
  const components = [
    {
      title: '필터 태그',
      description: '필터 태그는 하나의 키워드가 가지고있는 하위 속성이나 옵션이 있거나, 더 세분화된 분류가 필요할 때 사용할 수 있습니다.',
      slug: 'filter-tag',
      category: '코어',
      status: 'stable'
    },
    {
      title: '알림 다이얼로그',
      description: '알림 다이얼로그는 사용자의 여정에서 중요한 정보를 표시합니다. 사용자가 알림 다이얼로그에서의 작업을 완료할 때까지 다른 상호작용을 차단합니다.',
      slug: 'alert-dialog',
      category: '코어',
      status: 'stable'
    },
    {
      title: '프로덕트 카드 v2',
      description: '프로덕트 카드는 상품 정보와 이미지를 효과적으로 보여주는 컴포넌트입니다.',
      slug: 'product-card-v2',
      category: '패턴',
      status: 'new'
    },
    {
      title: '티켓 카드',
      description: '티켓 카드는 이벤트나 프로모션 정보를 티켓 형태로 보여주는 컴포넌트입니다.',
      slug: 'ticket-card',
      category: '패턴',
      status: 'beta'
    }
  ];
  
  // 카테고리별로 컴포넌트 그룹화
  const componentsByCategory = components.reduce((acc, component) => {
    const category = component.category || '기타';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof components>);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">컴포넌트</h1>
      <p className="text-xl text-gray-600 mb-8">
        Ruler 디자인 시스템의 UI 컴포넌트를 탐색하세요. 코어 컴포넌트부터 복합적인 패턴까지 다양한 요소를 제공합니다.
      </p>
      
      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link key={component.slug} href={`/components/${component.slug}`}>
                <div className="border rounded-lg hover:shadow-md transition-shadow h-full p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{component.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      component.status === 'stable' ? 'bg-green-100 text-green-700' : 
                      component.status === 'beta' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {component.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{component.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}