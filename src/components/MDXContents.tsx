'use client';
// src/components/MDXContent.tsx

import { useMDXComponent } from 'next-contentlayer/hooks';
import Link from 'next/link';
import * as RulerUI from '@29cm/ruler-ui';
import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';

interface MDXProps {
  code: string;
}

const isRenderableComponent = (val: unknown): val is ComponentType<any> => {
  if (typeof val === 'function') return true;
  if (val && typeof val === 'object' && '$$typeof' in (val as any)) return true; // forwardRef, memo 등
  return false;
};

const rulerComponents = Object.fromEntries(
  Object.entries(RulerUI).filter(([, val]) => isRenderableComponent(val))
) as Record<string, ComponentType<any>>;

const components: MDXComponents = {
  ...rulerComponents,
  // 명시적으로 Button을 매핑해 MDX 내부에서 바로 사용할 수 있게 한다.
  Button: RulerUI.Button as ComponentType<any>,
  a: ({ href, ...props }: any) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />;
    }

    if (href?.startsWith('#')) {
      return <a href={href} {...props} />;
    }

    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  },

  img: ({ src, alt, ...props }: any) => {
    if (!src) return null;

    const isExternal = src.startsWith('http');

    const className = ['rounded-md', props.className].filter(Boolean).join(' ');

    // 외부/내부 모두 단순 <img>로 렌더링하여 p 내부 중첩 문제를 방지
    return (
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        className={className}
        {...props}
      />
    );
  },

  TokenColor: ({ name }: { name: string }) => {
    return (
      <div className="flex items-center space-x-2 my-2">
        <div
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: `var(--color-${name})` }}
        />
        <code>{name}</code>
      </div>
    );
  },

  TokenTypography: ({ name }: { name: string }) => {
    return (
      <div className="my-2">
        <div
          style={{
            fontFamily: `var(--font-${name})`,
            fontSize: `var(--font-size-${name})`,
            fontWeight: `var(--font-weight-${name})`,
            lineHeight: `var(--line-height-${name})`,
          }}
        >
          타이포그래피 샘플 - {name}
        </div>
        <code className="text-sm">{name}</code>
      </div>
    );
  },
};

export function MDXContent({ code }: MDXProps) {
  // contentlayer가 생성한 코드가 CommonJS 형태(`exports`, `module`, `require`)를 기대하므로
  // 브라우저 실행 시 참조 에러를 막기 위해 명시적으로 주입한다.
  const noopRequire: any = () => ({});
  (noopRequire as any).resolve = () => ({});

  // __require가 함수가 아니라고 하는 케이스가 있어, fallback으로 noop 함수를 함께 전달
  const Component = useMDXComponent(code, {
    exports: {},
    module: { exports: {}, __esModule: true },
    require: noopRequire,
    __require: noopRequire,
  });
  return <Component components={components} />;
}
