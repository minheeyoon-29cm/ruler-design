// app/foundation/page.tsx

import { allFoundations } from 'contentlayer/generated';
import Link from 'next/link';

export default function FoundationOverviewPage() {
  const foundations = allFoundations.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-8">
      <h1>Foundation</h1>
      <p className="text-muted-foreground">디자인 시스템의 토대가 되는 기준들을 소개합니다.</p>

      <ul className="mt-6 space-y-3">
        {foundations.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/foundation/${item.slug}`}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <span className="font-medium">{item.title}</span>
              {item.description && (
                <span className="text-sm text-gray-500 dark:text-gray-400">— {item.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
