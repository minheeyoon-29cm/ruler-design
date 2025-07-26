export default function HomePage() {
  return (
    <section className="container">
      <h1>
        A system designed<br />for clarity, not memory.
      </h1>

      <p>
        The design system isn’t just how we build —<br />
        it’s how we stay aligned.
      </p>

      <p>
        <span className="font-bold">Ruler</span> enables designers and developers to work in their own tools,<br />
        while thinking in the same structure and speaking the same language.
      </p>

      <p>
        Freedom in expression begins with shared rules.<br />
        Efficiency comes from clear principles.
      </p>

      <p>
        This document is <span className="font-bold">Ruler’s Single Source of Truth</span> —<br />
        a shared foundation for consistent, scalable, and brand-aligned UI.
      </p>

      <div className="button-group"  style={{ display: 'flex', gap: '0.25rem' }}>
        <a href="/components" className="primary-button"
        >컴포넌트 보러가기
        </a>

        <a href="/tokens" className="secondary-button">디자인 토큰</a>
      </div>
    </section>
  );
}
