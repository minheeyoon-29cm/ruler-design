'use client';

import Link from 'next/link';
import { useState } from 'react';
import { allComponents } from 'contentlayer/generated';
import { StatusBadge } from '../../components/docs/StatusBadge';
import { VersionBadge } from '../../components/docs/VersionBadge';
import { ToggleTag } from '../../components/docs/ToggleTag'; // 추가

type StatusFilter = 'all' | 'draft' | 'review' | 'active' | 'deprecated' ;

export default function ComponentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');

  const componentsData = [...allComponents].sort((a, b) => a.title.localeCompare(b.title, 'ko'));

  // 상태별 필터링
  const filteredComponents = selectedStatus === 'all' 
    ? componentsData
    : componentsData.filter(component => component.status === selectedStatus);

  const componentsByCategory = filteredComponents.reduce((acc, component) => {
    const category = component.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof allComponents>);

  return (
    <div className="px-md py-md">
      <h2>Component</h2>
      <p>
        Ruler 디자인 시스템의 컴포넌트 라이브러리입니다. 각 컴포넌트는 29CM의 디자인 원칙을 따라 설계되었습니다.
      </p>

      {/* 필터 태그들 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <ToggleTag 
          label={`All (${componentsData.length})`}
          isSelected={selectedStatus === 'all'}
          onClick={() => setSelectedStatus('all')}
        />
        
        {(['draft', 'review', 'active', 'deprecated'] as const).map((status) => {
          const count = componentsData.filter(c => c.status === status).length;
          return (
            <ToggleTag
              key={status}
              label={`${status} (${count})`}
              isSelected={selectedStatus === status}
              onClick={() => setSelectedStatus(status)}
              size="medium"
            />
          );
        })}
      </div>

      {/* 기존 컴포넌트 리스트 */}
      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category}>
          <h2>{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component) => (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="componentPatternCard"
              >
                <div className="flex justify-between items-start mb-md">
                  <h3 className="title-l-bold">{component.title}</h3>
                  
                  <div className="flex gap-2">
                    <StatusBadge status={component.status as 'draft' | 'review' | 'active' | 'deprecated' } />
                    <VersionBadge version={component.version} size="small" />
                  </div>
                </div>
                <p className="text-secondary">
                  {component.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
