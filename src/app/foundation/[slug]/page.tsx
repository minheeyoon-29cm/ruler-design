// src/app/foundation/[slug]/page.tsx

import { allFoundations } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { MDXContent } from '../../../components/MDXContents';
import { StatusBadge } from '@/components/docs/StatusBadge';
import TableOfContents from '../../../components/docs/TableOfContents';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allFoundations.map((foundation) => ({
    slug: foundation.slug,
  }));
}

export default function FoundationPage({ params }: PageProps) {
  const foundation = allFoundations.find((f) => f.slug === params.slug);

  if (!foundation) {
    notFound();
  }

  return (
    <div className="container">
      {/* === 본문 === */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold">{foundation.title}</h1>
          <StatusBadge status={foundation.status} />
          <span>v{foundation.version}</span>
        </div>

        <p className="text-xl text-gray-600 mb-4">{foundation.description}</p>

        <div className="text-sm text-gray-500 mb-8">
          마지막 업데이트: {new Date(foundation.updated).toLocaleDateString()}
        </div>

        <div className="prose prose-slate max-w-none">
          <MDXContent code={foundation.body.code} />
        </div>
      </div>

      {/* === TOC === */}
      <div className="hidden xl:block w-64 shrink-0">
        <TableOfContents />
      </div>
    </div>
  );
}
