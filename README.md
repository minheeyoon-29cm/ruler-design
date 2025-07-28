# Ruler Design System Documentation

**기억이 아닌 기준으로 정렬되는 시스템**

Ruler는 29CM의 디자인 시스템으로, 디자이너와 개발자가 각자의 도구에서 작업하더라도 같은 구조로 사고하고 같은 언어로 협업할 수 있도록 돕습니다. 이 문서는 Ruler의 Single Source of Truth입니다.

---

## 🚀 시작하기

### 설치 및 실행

```bash
# 저장소 클론
gh repo clone 29CM-Developers/ruler-design
cd ruler-design

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

실행 후 `http://localhost:3000`에서 디자인 시스템 문서를 확인할 수 있습니다.

---

## 📁 프로젝트 구조

### 디자인 토큰 관리

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/ruler-tokens/` | 📌 **Figma 디자인 토큰 원본 저장소** | Figma Token Studio에서 내보낸 JSON 파일 저장 |
| ├─ `scale/` | 기본 디자인 값 (색상, 크기, 간격 등) | Figma에서 수정 후 JSON 덮어쓰기 |
| ├─ `semantic/` | 의미 기반 토큰 (primary, secondary 등) | 컴포넌트 역할에 따른 토큰 정의 |
| ├─ `static-scale/` | 고정값 (폰트 패밀리 등) | 거의 수정 없음, 필요 시만 업데이트 |
| └─ `$metadata.json` | 토큰셋 순서 및 메타데이터 | 토큰 구조 변경 시 업데이트 |

### 토큰 변환 시스템

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/scripts/transform-tokens.ts` | **토큰 자동 변환 스크립트** | 토큰 수정 후 `npm run transform-tokens` 실행 |
| `src/tokens/` | 변환된 토큰 결과물 저장소 | 변환 결과 확인 및 검증 |
| ├─ `processed/` | Tailwind용 JSON 구조 | Tailwind 설정에서 자동 사용 |
| └─ `tokens.css` | 웹용 CSS 변수 | 전역 스타일에 자동 적용 |

### 문서 및 컨텐츠

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/content/` | 📌 **MDX 문서 작성 영역** | 컴포넌트/토큰 설명 문서 작성 |
| ├─ `components/` | 컴포넌트별 MDX 문서 | 사용법, 가이드라인, 예제 작성 |
| ├─ `foundation/` | 디자인 토큰 설명 문서 | 토큰 설명 및 사용 가이드 작성 |
| └─ `patterns/` | 패턴 컴포넌트 문서 | 복합 컴포넌트 사용법 작성 |

### UI 컴포넌트

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/components/` | 문서 사이트용 공통 UI | 문서화 전용 컴포넌트 개발 |
| ├─ `ui/` | 기본 UI 요소 (버튼, 뱃지 등) | 디자인 시스템 기반 UI 컴포넌트 |
| ├─ `docs/` | 문서화 전용 컴포넌트 | 코드 블록, 색상 팔레트, 미리보기 등 |
| ├─ `foundation/` | 토큰 시각화 컴포넌트 | 디자인 토큰을 시각적으로 표현 |
| └─ `MDXContents.tsx` | MDX 렌더링 래퍼 | MDX 문서 표시용 공통 컴포넌트 |

### 페이지 구조

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/app/` | Next.js App Router 페이지 | 라우팅 및 레이아웃 관리 |
| ├─ `foundation/` | `/foundation` 토큰 문서 페이지 | 토큰 분류별 페이지 구성 |
| ├─ `components/` | `/components` 컴포넌트 문서 페이지 | 컴포넌트별 상세 문서 |
| ├─ `patterns/` | `/patterns` 패턴 문서 페이지 | 패턴별 사용 가이드 |
| └─ `layout.tsx` | 전체 레이아웃 정의 | 네비게이션, 사이드바 구조 |

### 스타일 및 설정

| 경로 | 역할 | 액션 가이드 |
|------|------|-------------|
| `src/styles/globals.css` | 전역 스타일 + 테마 설정 | 라이트/다크 테마 및 기본 스타일 |
| `tailwind.config.js` | Tailwind 설정 | 디자인 토큰 자동 연결 설정 |
| `contentlayer.config.ts` | MDX 자동 처리 설정 | 문서 메타데이터 및 변환 규칙 |
| `next.config.js` | Next.js 전역 설정 | 빌드 및 최적화 설정 |

---

## 🔄 디자인 토큰 워크플로우

### 1. Figma에서 토큰 수정
```bash
# Figma Token Studio 플러그인 사용
1. 디자인 토큰 수정
2. JSON 형태로 Export
3. src/ruler-tokens/ 해당 경로에 저장
```

### 2. 토큰 변환 실행
```bash
# 토큰을 CSS 변수와 Tailwind 설정으로 변환
npm run transform-tokens
```

### 3. 자동 적용 확인
```bash
# 개발 서버에서 변경사항 확인
npm run dev
```

### 4. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# Vercel 자동 배포 (main 브랜치 push 시)
git push origin main
```

---

## 🤝 협업 가이드

### 디자이너 워크플로우

1. **토큰 수정**
   - Figma Token Studio에서 디자인 토큰 수정
   - JSON 파일을 `src/ruler-tokens/` 해당 디렉토리에 저장

2. **문서 작성**
   - `src/content/` 하위에 MDX 파일로 가이드라인 작성
   - 이미지는 `public/images/` 경로에 저장

3. **확인 및 피드백**
   - 개발 서버에서 실시간 미리보기
   - Slack #design_platform 채널에서 피드백

### 개발자 워크플로우

1. **토큰 변환**
   - 디자이너가 수정한 토큰을 `npm run transform-tokens`로 변환
   - 변환된 CSS 변수와 Tailwind 설정 확인

2. **컴포넌트 개발**
   - `src/components/` 하위에 문서화용 컴포넌트 개발
   - 디자인 토큰 기반으로 스타일링

3. **문서 개선**
   - MDX 템플릿 자동 생성: `npm run generate-mdx`
   - 컴포넌트 미리보기, 상호작용 기능 추가

---

## 📝 문서 작성 가이드

### MDX 파일 생성
```bash
# 대화형 템플릿 생성
npm run generate-mdx

# 특정 컴포넌트 템플릿 생성
npm run generate-mdx Button
```

### 프론트매터 구조
```yaml
---
title: "컴포넌트명"
description: "컴포넌트 설명"
status: "active" # draft, beta, active, deprecated
version: "1.0.0"
category: "component" # component, pattern, module
tags: ["ui", "interactive"]
platforms: ["web", "ios", "android"]
updated: "2025-01-28"
---
```

### 이미지 경로 규칙
```
public/images/
├── components/
│   ├── button/
│   │   ├── usage/
│   │   ├── states/
│   │   └── examples/
├── foundation/
│   ├── color/
│   ├── typography/
│   └── spacing/
└── patterns/
```

---

## 🛠️ 개발 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run transform-tokens` | 디자인 토큰 변환 |
| `npm run generate-mdx` | MDX 템플릿 생성 |
| `npm run lint` | 코드 품질 검사 |

---

## 🚀 배포

- **자동 배포**: `main` 브랜치에 push 시 Vercel에서 자동 배포
- **미리보기**: PR 생성 시 미리보기 URL 자동 생성
- **환경**: Production - [ruler-design.vercel.app](https://ruler-design.vercel.app)

---

## 📞 문의 및 지원

- **Slack**: #design_platform 채널
- **이슈 관리**: GitHub Issues
- **문서 기여**: Pull Request 환영

---

## 🔮 향후 계획

- [ ] Figma MCP 서버 연동으로 자동 동기화
- [ ] 컴포넌트 상태 및 Props 자동 추출
- [ ] 디자인 토큰 버전 관리 시스템
- [ ] 다국어 문서 지원
- [ ] 검색 기능 고도화


--- 

