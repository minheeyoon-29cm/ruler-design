import { notFound } from 'next/navigation';

// Foundation 항목 정의
const foundationItems = [
  { slug: 'colors', title: '컬러' },
  { slug: 'typography', title: '타이포' },
  { slug: 'spacing', title: '스페이싱' },
  // 필요 시 추가
];

// 정적 경로 생성
export function generateStaticParams() {
  return foundationItems.map((item) => ({
    slug: item.slug,
  }));
}

export default function FoundationItemPage({ params }: { params: { slug: string } }) {
  const item = foundationItems.find((i) => i.slug === params.slug);
  if (!item) {
    notFound();
  }

  return (
    <div className="prose dark:prose-invert">
      <h1>{item!.title}</h1>
      <p>이 페이지는 {item!.title}에 대한 내용을 설명할 예정입니다. 추후 MDX 문서로 내용을 추가해 주세요.</p>
    </div>
  );
}
