// src/app/components/[slug]/page.tsx
import { allComponents } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { MDXContent } from '../../../components/MDXContents';

// 페이지 파라미터 타입 정의
interface PageProps {
  params: {
    slug: string;
  };
}

// 정적 경로 생성 (빌드 시 실행)
export async function generateStaticParams() {
  return allComponents.map((component) => ({
    slug: component.slug,
  }));
}

export default function ComponentPage({ params }: PageProps) {
  // slug로 컴포넌트 찾기
  const component = allComponents.find((c) => c.slug === params.slug);
  
  if (!component) {
    notFound();
  }

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
        <MDXContent code={component.body.code} />
      </div>
    </div>
  );
}