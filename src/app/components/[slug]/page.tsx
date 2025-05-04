// src/app/components/[slug]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import React from 'react';


interface PageProps {
  params: {
    slug: string;
  };
}

export default function ComponentPage({ params }: PageProps) {
  // 임시로 하드코딩된 데이터 사용
  const componentData = {
    title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, ' '),
    description: '컴포넌트 설명이 여기에 표시됩니다.',
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">{componentData.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{componentData.description}</p>
      
      <div className="text-sm text-gray-500 mb-8">
        마지막 업데이트: {new Date(componentData.lastUpdated).toLocaleDateString()}
      </div>
      
      <div className="prose prose-slate max-w-none">
        <p>컴포넌트 내용은 준비 중입니다...</p>
      </div>
    </div>
  );
}