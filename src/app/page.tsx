
import React from 'react';

export default function HomePage() {
  return (
    <section className="px-md py-md max-w-4xl mx-auto">
      <h1 className="title-xxl-bold text-primary font-bold mb-lg leading-tight text-left">
        A system designed<br />for clarity, not memory.
      </h1>
      <p className="text-size-md text-secondary mb-md text-left">
        The design system isn’t just how we build —<br />
        it’s how we stay aligned.
      </p>
      <p className="text-size-md text-secondary mb-md text-left">
        <strong className="text-on-color">
          Ruler
        </strong> enables designers and developers to work in their own tools,<br />
        while thinking in the same structure and speaking the same language.
      </p>
      <p className="text-size-md text-secondary mb-md text-left">
        Freedom in expression begins with shared rules.<br />
        Efficiency comes from clear principles.
      </p>
      <p className="text-size-md text-secondary mb-lg text-left">
        This document is <strong className="text-on-color">Ruler’s Single Source of Truth</strong> —<br />
        a shared foundation for consistent, scalable, and brand-aligned UI.
      </p>
      <div className="flex gap-4">
        <a href="/components" className="px-md py-md bg-primary text-on-color radius-md hover:bg-primary-hover">
          컴포넌트 보러가기
        </a>
        <a href="/tokens" className="px-md py-md border-default text-primary radius-md hover:bg-surface-contents">
          디자인 토큰
        </a>
      </div>
    </section>
  );
}
