# ruler-design

**A system designed for clarity, not memory.**

The design system isn’t just how we build —
it’s how we stay aligned.

Ruler enables designers and developers to work in their own tools,
while thinking in the same structure and speaking the same language.

Freedom in expression begins with shared rules.
Efficiency comes from clear principles.

This document is Ruler’s Single Source of Truth —
a shared foundation for consistent, scalable, and brand-aligned UI.

---

**기억이 아닌 기준으로 정렬되는 시스템**

디자인 시스템은 단지 만드는 방식이 아니라,
팀이 어떻게 정렬되어 일하는가를 결정합니다.

Ruler는 디자이너와 개발자가 각자의 도구에서 작업하더라도
같은 구조로 사고하고, 같은 언어로 협업할 수 있도록 돕습니다.

표현의 자유는 공통된 규칙에서 시작되고,
효율은 명확한 원칙에서 만들어집니다.

이 문서는 바로 그 기준 —
Ruler의 Single Source of Truth입니다.
일관되고 확장 가능한 UI를 위한 팀의 공통 기반이 됩니다.

---

## Project Guide

| 경로                              | 설명                                                            | 액션                                         |
| --------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| `src/ruler-tokens/`               | 📌 Figma에서 추출한 디자인 토큰 원본 저장소                     | Figma → JSON 파일 내보내기 후 이곳에 저장    |
| ├─ `scale/`                       | 📌 색상, 여백, 폰트 등 **기본 디자인 값**                       | Figma에서 수정한 후 덮어쓰기                 |
| ├─ `semantic/`                    | 📌 버튼, 배경 등 **의미 기반 시맨틱 토큰**                      | 역할별 토큰 정의 및 갱신                     |
| └─ `static-scale/`                | 📌 폰트 패밀리 등 **고정값**                                    | 거의 수정 없음 (필요 시 업데이트)            |
| `src/scripts/transform-tokens.ts` | 토큰을 CSS 변수 및 Tailwind 설정으로 **자동 변환하는 스크립트** | 토큰 수정 후 `npm run transform-tokens` 실행 |
| `src/tokens/`                     | 변환된 디자인 토큰 결과물 저장소                                | 토큰 변환 결과 확인 (`tokens.css`)           |
| ├─ `processed/`                   | Tailwind에서 사용하는 JSON 구조                                 | 필요 시 Tailwind 설정 확인                   |
| └─ `tokens.css`                   | 최종 CSS 변수 (웹에 반영되는 실제 스타일)                       | 웹 스타일 적용 결과 확인                     |
| `src/content/`                    | 📌 디자인 시스템 설명 및 문서화 콘텐츠                          | 각 토큰/컴포넌트에 대한 설명 문서 작성       |
| ├─ `components/`                  | 📌 컴포넌트별 MDX 문서 (예: `Button.mdx`)                       | 사용법, 구조 설명 문서 작성                  |
| └─ `tokens/`                      | 📌 토큰 설명 문서 (예: `Color.mdx`)                             | 스케일/시맨틱 토큰 설명 문서 작성            |
| `src/components/`                 | 문서 사이트에서 사용되는 공통 UI 컴포넌트                       | 필요 시 커스터마이징 요청                    |
| ├─ `ui/`                          | 버튼, 뱃지 등 공통 UI 요소들                                    | UI 변경 사항 정리하여 개발 요청              |
| ├─ `docs/`                        | 코드 블록, 타이틀 등 문서화 전용 컴포넌트                       | 변경 필요 시 요청 또는 협업                  |
| └─ `MDXContents.tsx`              | MDX 렌더링용 Wrapper 컴포넌트                                   | 별도 액션 없음                               |
| `src/app/`                        | Next.js App Router 기반 페이지 구조                             | 페이지 구조 변경 시 협의 필요                |
| ├─ `components/`                  | `/components` 문서 페이지                                       | 컴포넌트 정렬, 설명 구조 피드백              |
| ├─ `tokens/`                      | `/tokens` 문서 페이지                                           | 토큰 분류 및 UI 구조 개선 피드백             |
| └─ `layout.tsx`                   | 전체 레이아웃 구조 정의                                         | 메뉴 구조나 페이지 구조 변경 요청            |
| `src/styles/globals.css`          | 전역 스타일 및 `.dark`, `.light` 테마 설정 포함                 | 라이트/다크 테마 적용 결과 확인              |
| `tailwind.config.js`              | Tailwind에 디자인 토큰을 연결하는 설정 파일                     | 토큰 매핑 구조 이해 및 요청 가능             |
| `contentlayer.config.ts`          | MDX 파일 자동 처리 설정                                         | 문서화 오류 시 확인 요청 가능                |
| `next.config.js`                  | Next.js 전역 설정                                               | 일반적으로 수정 불필요                       |

## Project Setup

**설치**

```
# 저장소 클론

gh repo clone 29CM-Developers/ruler-design
cd ruler-design

# 의존성 설치

npm install

```

**개발 서버 실행**

```

npm run dev

```

실행 후 `http://localhost:3000`에 접속하여 디자인 시스템 문서를 확인할 수 있습니다.

## 토큰 변환 스크립트 사용법

디자인 토큰을 Figma에서 수정한 뒤 JSON 파일로 내보낸 경우, 아래 스크립트를 실행하여 CSS 변수로 변환합니다.

```

npm run transform-tokens

```

- 변환된 결과는 `src/tokens/tokens.css`에 저장됩니다.

- Tailwind와 연결되는 JSON 구조는 `src/tokens/processed/`에 생성됩니다.

## MDX 문서 템플릿 생성 스크립트

컴포넌트 문서 초안을 쉽게 만들기 위해 MDX 파일을 자동 생성할 수 있습니다.

**스크립트 실행**

```

npm run generate-mdx

```

스크립트를 실행하면 아래와 같은 정보를 순차적으로 입력받습니다 - generate-mdx 입력 항목별 가이드 :

**1. 컴포넌트 이름 `name`**

| 예시     | 설명                 | 작성 기준 및 가이드                                                                                                     |
| -------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Button` | 컴포넌트의 공식 명칭 | - UpperCamelCase로 작성 (예: `ProductCard`, `TagBadge`) <br> - 파일명은 자동으로 kebab-case 변환됨 (`product-card.mdx`) |

**2. 설명 `description`**

| 예시                                     | 설명                              | 작성 기준 및 가이드                                                                                                 |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `"상품 정보를 카드 형태로 시각화합니다"` | 이 컴포넌트의 역할을 한 줄로 요약 | - 마케팅 문구 ❌ <br> - 실제 역할 기반으로 명확하게 작성 ✅ <br> - 예: `"경고 메시지를 강조된 스타일로 노출합니다"` |

**3. 상태 `status`**

| 값           | 의미      | 작성 기준 및 가이드                                                                                                       |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `draft`      | 초안      | - 디자인 또는 개발 완료되지 않음 <br> - 문서화는 시작 가능 <br> - 실제 서비스 미적용 <br> - 리뷰 전 단계                  |
| `review`     | 검증 중   | - 일부 서비스에 A/B 또는 테스트 적용 또는 QA 중, <br> - 피드백 수집 및 수정 가능성 존재                                   |
| `active`     | 안정화    | - 실 서비스에 안정적으로 적용 중 <br> - 누구나 사용 가능 <br> - 수정 시 `version` 업데이트 필수 (SemVer)                  |
| `deprecated` | 폐기 예정 | - 신규 적용 금지 <br> - 기존 화면에서만 유지 <br> - 대체 컴포넌트가 있다면 반드시 명시, 대체 가이드 필요 (`→ AlertV2 등`) |

**4. 버전 `version`**

| 예시    | 설명                 | 작성 기준 및 가이드                                                                                                       |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `1.0.0` | 현재 컴포넌트의 버전 | - [SemVer](https://semver.org/lang/ko/) 형식 사용<br>- MAJOR.MINOR.PATCH 구조 준수<br>- ex: `2.1.3` (마이너 수정 포함 시) |

**5. 카테고리 `category`(수정예정)**

| 값          | 설명                            | 작성 기준 및 가이드                                                       |
| ----------- | ------------------------------- | ------------------------------------------------------------------------- |
| `component` | 최소 단위 UI 컴포넌트           | 예: `Button`, `Checkbox`, `Badge`                                         |
| `pattern`   | 구조적으로 묶인 컴포넌트 패턴   | 예: `ProductCard`, `ListItem`                                             |
| `module`    | 기능 단위 묶음 (서비스 기능 등) | 예: `CouponModule`, `AddressSelector`, `ReviewModule` (복합 로직 포함 시) |

**6. 태그 `tags`**

| 예시                      | 설명                         | 작성 기준 및 가이드                                                                                                             |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `card, product, commerce` | 검색 및 필터링을 위한 키워드 | - 쉼표로 구분된 단어들로 작성 <br> - **사용자 검색어 기반으로 실제 유용한 키워드 사용** <br> - 예: `form, input, accessibility` |

**7. 플랫폼 `platforms`**

| 예시                    | 설명                       | 작성 기준 및 가이드                                                                                       |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `web`, `ios`, `android` | 컴포넌트가 지원되는 플랫폼 | - 쉼표로 구분하여 중복 작성 가능 <br> - 기본값: `web` <br> - 앱 공용일 경우 `web, ios, android` 모두 포함 |

**8. 대상 디렉토리 `targetDir`**

| 예시                     | 설명                  | 작성 기준 및 가이드                                               |
| ------------------------ | --------------------- | ----------------------------------------------------------------- |
| `src/content/components` | `.mdx` 파일 저장 위치 | - 기본값으로 사용 가능 <br> `src/content/tokens` 등으로 변경 가능 |

**결과**

- `ex:src/content/components/button.mdx` 파일이 자동 생성됩니다.

- 프론트매터와 예제 코드, Props 설명 섹션이 포함된 기본 템플릿이 생성됩니다.
