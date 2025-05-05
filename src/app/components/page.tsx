// src/app/components/page.tsx
import Link from 'next/link';
import { allComponents } from 'contentlayer/generated';

export default function ComponentsPage() {
  // 타입 안전하게 컴포넌트 그룹화
  const componentsByCategory = allComponents.reduce((acc, component) => {
    const category = component.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof allComponents>);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">컴포넌트</h1>
      <p className="text-xl mb-10">
        Ruler 디자인 시스템의 컴포넌트 라이브러리입니다. 각 컴포넌트는 29CM의 디자인 원칙을 따라 설계되었습니다.
      </p>
      
      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium">{component.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    component.status === 'stable' ? 'bg-green-100 text-green-700' : 
                    component.status === 'beta' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {component.status}
                  </span>
                </div>
                <p className="text-gray-600">
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