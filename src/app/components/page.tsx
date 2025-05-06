
import Link from 'next/link';
import { allComponents } from 'contentlayer/generated';

export default function ComponentsPage() {
  const componentsByCategory = allComponents.reduce((acc, component) => {
    const category = component.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof allComponents>);

  return (
    <div className="px-md py-md">
      <h1 className="text-primary mb-lg">컴포넌트</h1>
      <p className="text-size-md text-secondary mb-lg">
        Ruler 디자인 시스템의 컴포넌트 라이브러리입니다. 각 컴포넌트는 29CM의 디자인 원칙을 따라 설계되었습니다.
      </p>

      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category} className="mb-lg">
          <h2 className="text-size-lg text-primary mb-md">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="block px-md py-md border-default radius-md hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-md">
                  <h3 className="text-size-md text-primary">{component.title}</h3>
                  <span className={`text-size-sm px-md py-0.5 radius-full ${
                    component.status === 'active' ? 'bg-surface text-primary' : 
                    component.status === 'beta' ? 'bg-surface-contents text-secondary' : 
                    'bg-primary-hover text-on-color'
                  }`}>
                    {component.status}
                  </span>
                </div>
                <p className="text-secondary text-size-sm">
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
