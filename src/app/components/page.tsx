'use client';

import React from 'react';
import Link from 'next/link';

export default function ComponentsPage() {
  // 임시 데이터
  const components = [
    {
      slug: 'filter-tag',
      title: 'Filter Tag',
      description: 'Filter Tag는 하나의 키워드가 가지고있는 하위 속성이나 옵션이 있거나, 더 세분화된 분류가 필요할 때 사용할 수 있습니다.',
      category: 'Components'
    },
    {
      slug: 'alert-dialog',
      title: 'Alert Dialog',
      description: 'Alert Dialog는 사용자의 여정에서 중요한 정보를 표시합니다. 사용자가 Alert Dialog에서의 작업을 완료할 때까지 다른 상호작용을 차단합니다.',
      category: 'Components'
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
      <h1 className="text-4xl font-bold mb-8">컴포넌트</h1>
      
      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link key={component.slug} href={`/components/${component.slug}`}>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow h-full">
                  <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{component.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}