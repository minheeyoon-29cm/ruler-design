# AGENTS.md

Codex가 `ruler-design` 저장소에서 작업할 때 따라야 할 기본 지침입니다. 프로젝트 성격상 디자인 문서(MDX)와 Next.js UI 코드가 혼재하므로 아래 내용을 우선 확인하세요.

## 1. 실행 & 테스트

- **개발 서버**: `npm run dev` (Contentlayer가 변경사항을 자동 반영). 필요 시 `.contentlayer` 캐시를 지우지 말고 서버 재시작.
- **정적 빌드 확인**: `npm run build` 또는 `npm run export`.
- **린트/타입 검사**: 기본적으로 `npm run lint`. TypeScript 오류는 Next.js 빌드 단계에서 함께 확인.
- **토큰 변환**: 디자인 토큰 JSON을 갱신한 뒤에는 `npm run transform-tokens`를 실행해 `src/tokens` 산출물을 재생성.
- 테스트 스위트는 별도로 없으므로, 변경사항은 최소한 `npm run lint`와 핵심 페이지 수동 확인으로 검증.

## 2. 코딩 & 문서 스타일

- **언어**: 문서/커밋 메시지는 기본적으로 한국어, 코드 주석은 상황에 따라 한국어나 영어 사용.
- **형식**: 프로젝트는 Prettier 설정이 없으므로 기존 코드 스타일(ESLint/Tailwind 규칙 + TypeScript 기본 포맷)에 맞춰 수동 정렬.
- **주석**: README 지침처럼 “왜 이 변경이 필요한지” 중심으로 필요한 최소한만 작성.
- **MDX**:
  - Frontmatter 예시는 `README.md` 참고 (title/description/status/version/category/tags/platforms/updated).
  - 이미지 경로는 가급적 `public/images/...` 상대경로 사용. 외부 CDN 사용 시에도 alt 텍스트 필수.
  - 컴포넌트 문서 구조: Hero → Anatomy/Usage → Props/Spec → State/Behavior 순서를 유지하려고 노력.
- **React/TS**:
  - `src/components` 내 UI는 함수형 컴포넌트 + React 18 기준.
  - 디자인 토큰은 직접 하드코딩하지 말고 `tokens.css` 혹은 Tailwind 클래스 사용.

## 3. 콘텐츠 작성 흐름

1. 필요한 경우 `npm run generate-mdx <Component>` 명령으로 기본 템플릿 생성.
2. `src/content/components|foundation|patterns`에 문서를 작성하고, 예시는 실제 제품 정책(톤 & 매너)을 준수.
3. 불필요한 HTML/JSX 대신 MDX 컴포넌트(`src/components/docs`)를 적극 사용.
4. 이미지/자산을 추가했다면 `public` 이하에 경로를 명시하고, 용량이 큰 경우 CDN을 고려.

## 4. MCP 연동 정보

- `.claude/settings.local.json`에 따라 Figma MCP 서버만 허용:
  - `mcp__figma__get_design_context`
  - `mcp__figma__get_variable_defs`
- 추가 MCP가 필요할 경우 사용자에게 먼저 확인 후 설정 변경.

## 5. 합의되지 않은 작업 피하기

- Git 이력 정리는 사용자가 직접 하므로 `git reset --hard`, `git push` 등 파괴적 명령 금지.
- 캐시 또는 산출물 폴더(`.contentlayer`, `.next`, `node_modules`)는 읽기만.
- 토큰/문서 외 다른 시스템 설정(예: `tailwind.config.js`, `contentlayer.config.ts`) 수정 시 반드시 이유를 문서화.

## 6. PR 전 체크리스트

1. 문서나 코드 변경 요약 작성.
2. 관련 스크린샷 또는 스토리북/미리보기 링크가 있다면 첨부.
3. `npm run lint` 통과 여부 기록.
4. 디자인 시스템 가이드(톤, 우선순위, MDX 섹션 구성)를 준수했는지 자체 점검.

이 문서를 최신 상태로 유지하여, 새로운 에이전트나 협업자가 프로젝트 맥락을 빠르게 이해할 수 있도록 합니다.
