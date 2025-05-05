// src/app/components/[slug]/page.tsx
'use client';

import React from 'react';
import { notFound } from 'next/navigation';

// 임시 데이터 - 나중에 contentlayer로 대체
const componentsData = {
  'product-card-v2': {
    title: '프로덕트 카드 v2',
    description: '프로덕트 카드는 상품 정보와 이미지를 효과적으로 보여주는 컴포넌트입니다.',
    content: `
# 프로덕트 카드 v2

프로덕트 카드는 상품 정보와 이미지를 효과적으로 보여주는 컴포넌트입니다. v2 버전에서는 이미지 비율, 할인률 표시, 재고 상태 등 다양한 옵션을 지원합니다.

## 사용 가이드

프로덕트 카드는 상품 목록, 추천 상품, 관련 상품 등 다양한 영역에서 사용할 수 있습니다. 상품의 주요 정보를 빠르게 파악할 수 있도록 설계되었습니다.

### 주요 기능

- 다양한 이미지 비율 지원 (1:1, 4:3, 3:4)
- 할인률 및 프로모션 뱃지 표시
- 재고 상태 표시 (품절, 매진 임박 등)
- 위시리스트 버튼 옵션
- 빠른 구매 버튼 옵션
    `,
    status: 'new',
    version: '2.0.0',
    lastUpdated: '2025-05-04'
  },
  'ticket-card': {
    title: '티켓 카드',
    description: '티켓 카드는 이벤트나 프로모션 정보를 티켓 형태로 보여주는 컴포넌트입니다.',
    content: `
# 티켓 카드

티켓 카드는 이벤트나 프로모션 정보를 티켓 형태로 보여주는 컴포넌트입니다. 전시, 공연, 할인 이벤트 등 다양한 정보를 티켓 형태로 표현하여 사용자의 주목도를 높입니다.

## 사용 가이드

티켓 카드는 이벤트 목록, 프로모션 배너, 혜택 안내 등 다양한 영역에서 사용할 수 있습니다. 사용자가 참여할 수 있는 이벤트나 혜택을 직관적으로 보여줍니다.

### 주요 기능

- 다양한 티켓 형태 지원 (기본형, 절취선형, 물결형)
- 이벤트 기간 표시
- 남은 시간 카운트다운 옵션
- 참여 가능 여부 표시
- 색상 테마 적용 가능
    `,
    status: 'beta',
    version: '1.0.0',
    lastUpdated: '2025-05-04'
  },
  'filter-tag': {
    title: '필터 태그',
    description: '필터 태그는 하나의 키워드가 가지고있는 하위 속성이나 옵션이 있거나, 더 세분화된 분류가 필요할 때 사용할 수 있습니다.',
    content: `
# 필터 태그

필터 태그는 하나의 키워드가 가지고있는 하위 속성이나 옵션이 있거나, 더 세분화된 분류가 필요할 때 사용할 수 있습니다.

## 최신 업데이트

**customColor**

기획전, 프로모션 성격에 맞는 색상을 주입할 수 있는 옵션입니다. 이는 특수한 경우에만 사용될 수 있으며 오남용을 엄격히 금합니다.

- custumColor옵션은 toggled:true 상태에서 반영됩니다.
- custumColor옵션은 hover, pressed시에 opacity로 표현됩니다.
    `,
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2025-05-04'
  }
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ComponentPage({ params }: PageProps) {
  const component = componentsData[params.slug];
  
  if (!component) {
    notFound();
  }

  // 간단한 마크다운 변환 (임시 구현)
  const contentHtml = component.content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^\- (.*$)/gm, '<li class="ml-6 mb-1">• $1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">');

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-wrap items-center gap-4 mb-2">
        <h1 className="text-4xl font-bold">{component.title}</h1>
        <span className={`text-sm px-3 py-1 rounded-full ${
          component.status === 'stable' ? 'bg-green-100 text-green-700' : 
          component.status === 'beta' ? 'bg-yellow-100 text-yellow-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {component.status} v{component.version}
        </span>
      </div>
      
      <p className="text-xl text-gray-600 mb-4">{component.description}</p>
      
      <div className="text-sm text-gray-500 mb-8">
        마지막 업데이트: {new Date(component.lastUpdated).toLocaleDateString()}
      </div>
      
      <div className="prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
}