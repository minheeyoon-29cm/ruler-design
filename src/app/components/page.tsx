import Link from 'next/link';
import { allComponents } from 'contentlayer/generated';
import { StatusBadge } from '../../components/docs/StatusBadge';


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
      <h2>Component</h2>
      <p>
        Ruler 디자인 시스템의 컴포넌트 라이브러리입니다. 각 컴포넌트는 29CM의 디자인 원칙을 따라 설계되었습니다.
      </p>

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
               
                  <StatusBadge status={component.status as 'draft' | 'beta' | 'active' | 'deprecated'} />

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
