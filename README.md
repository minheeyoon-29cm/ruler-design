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

| 경로                                | 설명                                          | 액션                                       |
| --------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `src/ruler-tokens/`               | 📌 Figma에서 추출한 디자인 토큰 원본 저장소                | Figma → JSON 파일 내보내기 후 이곳에 저장            |
| ├─ `scale/`                       | 📌 색상, 여백, 폰트 등 **기본 디자인 값**                   | Figma에서 수정한 후 덮어쓰기                       |
| ├─ `semantic/`                    | 📌 버튼, 배경 등 **의미 기반 시맨틱 토큰**                   | 역할별 토큰 정의 및 갱신                           |
| └─ `static-scale/`                | 📌 폰트 패밀리 등 **고정값**                            | 거의 수정 없음 (필요 시 업데이트)                     |
| `src/scripts/transform-tokens.ts` | 토큰을 CSS 변수 및 Tailwind 설정으로 **자동 변환하는 스크립트** | 토큰 수정 후 `npm run transform-tokens` 실행  |
| `src/tokens/`                     | 변환된 디자인 토큰 결과물 저장소                          | 토큰 변환 결과 확인 (`tokens.css`)               |
| ├─ `processed/`                   | Tailwind에서 사용하는 JSON 구조                     | 필요 시 Tailwind 설정 확인                      |
| └─ `tokens.css`                   | 최종 CSS 변수 (웹에 반영되는 실제 스타일)                  | 웹 스타일 적용 결과 확인                           |
| `src/content/`                    | 📌 디자인 시스템 설명 및 문서화 콘텐츠                        | 각 토큰/컴포넌트에 대한 설명 문서 작성                   |
| ├─ `components/`                  | 📌 컴포넌트별 MDX 문서 (예: `Button.mdx`)              | 사용법, 구조 설명 문서 작성                         |
| └─ `tokens/`                      | 📌 토큰 설명 문서 (예: `Color.mdx`)                   | 스케일/시맨틱 토큰 설명 문서 작성                      |
| `src/components/`                 | 문서 사이트에서 사용되는 공통 UI 컴포넌트                    | 필요 시 커스터마이징 요청                           |
| ├─ `ui/`                          | 버튼, 뱃지 등 공통 UI 요소들                          | UI 변경 사항 정리하여 개발 요청                      |
| ├─ `docs/`                        | 코드 블록, 타이틀 등 문서화 전용 컴포넌트                    | 변경 필요 시 요청 또는 협업                         |
| └─ `MDXContents.tsx`              | MDX 렌더링용 Wrapper 컴포넌트                       | 별도 액션 없음                                 |
| `src/app/`                        | Next.js App Router 기반 페이지 구조                | 페이지 구조 변경 시 협의 필요                        |
| ├─ `components/`                  | `/components` 문서 페이지                        | 컴포넌트 정렬, 설명 구조 피드백                       |
| ├─ `tokens/`                      | `/tokens` 문서 페이지                            | 토큰 분류 및 UI 구조 개선 피드백                     |
| └─ `layout.tsx`                   | 전체 레이아웃 구조 정의                               | 메뉴 구조나 페이지 구조 변경 요청                      |
| `src/styles/globals.css`          | 전역 스타일 및 `.dark`, `.light` 테마 설정 포함         | 라이트/다크 테마 적용 결과 확인                       |
| `tailwind.config.js`              | Tailwind에 디자인 토큰을 연결하는 설정 파일                | 토큰 매핑 구조 이해 및 요청 가능                      |
| `contentlayer.config.ts`          | MDX 파일 자동 처리 설정                             | 문서화 오류 시 확인 요청 가능                        |
| `next.config.js`                  | Next.js 전역 설정                               | 일반적으로 수정 불필요                             |


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

| 예시       | 설명          | 작성 기준 및 가이드                                                                                              |
| -------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `Button` | 컴포넌트의 공식 명칭 | - UpperCamelCase로 작성 (예: `ProductCard`, `TagBadge`) <br> - 파일명은 자동으로 kebab-case 변환됨 (`product-card.mdx`) |


**2. 설명 `description`**

| 예시                       | 설명                  | 작성 기준 및 가이드                                                                 |
| ------------------------ | ------------------- | --------------------------------------------------------------------------- |
| `"상품 정보를 카드 형태로 시각화합니다"` | 이 컴포넌트의 역할을 한 줄로 요약 | - 마케팅 문구 ❌ <br> - 실제 역할 기반으로 명확하게 작성 ✅ <br> - 예: `"경고 메시지를 강조된 스타일로 노출합니다"` |


**3. 상태 `status`**

| 값            | 의미    | 작성 기준 및 가이드                                                                 |
| ------------ | ----- | --------------------------------------------------------------------------- |
| `draft`      | 초안    | - 디자인 또는 개발 완료되지 않음 <br> - 문서화는 시작 가능 <br> - 실제 서비스 미적용 <br> - 리뷰 전 단계      |
| `beta`       | 검증 중  | - 일부 서비스에 A/B 또는 테스트 적용 또는 QA 중,  <br> - 피드백 수집 및 수정 가능성 존재                         |
| `active`     | 안정화   | - 실 서비스에 안정적으로 적용 중 <br> - 누구나 사용 가능 <br> - 수정 시 `version` 업데이트 필수 (SemVer) |
| `deprecated` | 폐기 예정 | - 신규 적용 금지 <br> - 기존 화면에서만 유지 <br> - 대체 컴포넌트가 있다면 반드시 명시, 대체 가이드 필요 (`→ AlertV2 등`)    |


**4. 버전 `version`**

| 예시      | 설명          | 작성 기준 및 가이드                                                                                               |
| ------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `1.0.0` | 현재 컴포넌트의 버전 | - [SemVer](https://semver.org/lang/ko/) 형식 사용<br>- MAJOR.MINOR.PATCH 구조 준수<br>- ex: `2.1.3` (마이너 수정 포함 시) |



**5. 카테고리 `category`(수정예정)**

| 값           | 설명                  | 작성 기준 및 가이드                                                       |
| ----------- | ------------------- | ----------------------------------------------------------------- |
| `component` | 최소 단위 UI 컴포넌트       | 예: `Button`, `Checkbox`, `Badge`                                  |
| `pattern`   | 구조적으로 묶인 컴포넌트 패턴    | 예: `ProductCard`, `ListItem`                         |
| `module`    | 기능 단위 묶음 (서비스 기능 등) | 예: `CouponModule`, `AddressSelector`, `ReviewModule` (복합 로직 포함 시) |


**6. 태그 `tags`**

| 예시                        | 설명               | 작성 기준 및 가이드                                                                                    |
| ------------------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| `card, product, commerce` | 검색 및 필터링을 위한 키워드 | - 쉼표로 구분된 단어들로 작성 <br> - **사용자 검색어 기반으로 실제 유용한 키워드 사용** <br> - 예: `form, input, accessibility` |


**7. 플랫폼 `platforms`**

| 예시                      | 설명             | 작성 기준 및 가이드                                                                     |
| ----------------------- | -------------- | ------------------------------------------------------------------------------- |
| `web`, `ios`, `android` | 컴포넌트가 지원되는 플랫폼 | - 쉼표로 구분하여 중복 작성 가능 <br> - 기본값: `web` <br> - 앱 공용일 경우 `web, ios, android` 모두 포함 |


**8. 대상 디렉토리 `targetDir`**

| 예시                       | 설명              | 작성 기준 및 가이드                                                        |
| ------------------------ | --------------- | ------------------------------------------------------------------ |
| `src/content/components` | `.mdx` 파일 저장 위치 | - 기본값으로 사용 가능 <br>  `src/content/tokens` 등으로 변경 가능 |




**결과**

- `ex:src/content/components/button.mdx` 파일이 자동 생성됩니다.

- 프론트매터와 예제 코드, Props 설명 섹션이 포함된 기본 템플릿이 생성됩니다.


```
ruler-design
├─ .next
│  ├─ app-build-manifest.json
│  ├─ build-manifest.json
│  ├─ cache
│  │  ├─ swc
│  │  │  └─ plugins
│  │  │     └─ v7_macos_aarch64_0.102.1
│  │  └─ webpack
│  │     ├─ client-development
│  │     │  ├─ 0.pack.gz
│  │     │  ├─ 1.pack.gz
│  │     │  ├─ 2.pack.gz
│  │     │  ├─ 3.pack.gz
│  │     │  ├─ index.pack.gz
│  │     │  └─ index.pack.gz.old
│  │     └─ server-development
│  │        ├─ 0.pack.gz
│  │        ├─ 1.pack.gz
│  │        ├─ 2.pack.gz
│  │        ├─ index.pack.gz
│  │        └─ index.pack.gz.old
│  ├─ package.json
│  ├─ react-loadable-manifest.json
│  ├─ server
│  │  ├─ app-paths-manifest.json
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ middleware-react-loadable-manifest.js
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ pages-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  └─ server-reference-manifest.json
│  ├─ static
│  │  ├─ chunks
│  │  │  └─ polyfills.js
│  │  └─ development
│  │     ├─ _buildManifest.js
│  │     └─ _ssgManifest.js
│  ├─ trace
│  └─ types
│     └─ package.json
├─ README.md
├─ contentlayer.config.ts
├─ next-env.d.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ images
│     └─ components
│        ├─ alert-dialog
│        │  ├─ preview
│        │  │  ├─ alert-dialog-preview-01-title.jpg
│        │  │  ├─ alert-dialog-preview-02-text.jpg
│        │  │  ├─ alert-dialog-preview-03-primary-action.jpg
│        │  │  ├─ alert-dialog-preview-04-primary-action.jpg
│        │  │  ├─ alert-dialog-preview-05-secondary-action.jpg
│        │  │  ├─ alert-dialog-preview-06-secondary-action.jpg
│        │  │  ├─ alert-dialog-preview-07-error.jpg
│        │  │  ├─ alert-dialog-preview-08-destructive.jpg
│        │  │  ├─ alert-dialog-preview-09-behavior.jpg
│        │  │  ├─ alert-dialog-preview-10-behavior.jpg
│        │  │  ├─ alert-dialog-preview-11-behavior.jpg
│        │  │  └─ alert-dialog-preview-12-behavior.jpg
│        │  ├─ states
│        │  │  └─ alert-dialog-anatomy.jpg
│        │  ├─ style-varient
│        │  │  ├─ alert-dialog-style-01-spec-01.jpg
│        │  │  ├─ alert-dialog-style-01-spec-02.jpg
│        │  │  ├─ alert-dialog-style-02-spec.jpg
│        │  │  └─ alert-dialog-style-03-spec.jpg
│        │  └─ usage
│        │     ├─ ad-01-do.jpg
│        │     ├─ ad-01-dont.jpg
│        │     ├─ ad-02.jpg
│        │     ├─ ad-03-do.jpg
│        │     ├─ ad-03-dont.jpg
│        │     ├─ ad-04-do.jpg
│        │     ├─ ad-04-dont.jpg
│        │     ├─ ad-05-do.jpg
│        │     ├─ ad-05-dont.jpg
│        │     └─ alert-dialog-desision-tree.jpg
│        ├─ badge
│        │  ├─ preview
│        │  │  ├─ pv-badge-00.jpg
│        │  │  ├─ pv-badge-01.jpg
│        │  │  ├─ pv-badge-03.jpg
│        │  │  ├─ pv-badge-04.jpg
│        │  │  ├─ pv-badge-05.jpg
│        │  │  ├─ pv-badge-06.jpg
│        │  │  ├─ pv-badge-07.jpg
│        │  │  ├─ pv-badge-08.jpg
│        │  │  └─ pv-badge-09.jpg
│        │  ├─ states
│        │  │  └─ state-badge-00.jpg
│        │  ├─ style-variant
│        │  │  ├─ sv-badge-01.jpg
│        │  │  ├─ sv-badge-02.jpg
│        │  │  ├─ sv-badge-03.jpg
│        │  │  ├─ sv-badge-04.jpg
│        │  │  ├─ sv-badge-05.jpg
│        │  │  ├─ sv-badge-06.jpg
│        │  │  └─ sv-badge-07.jpg
│        │  └─ usage
│        │     ├─ usage-badge-00.jpg
│        │     ├─ usage-badge-01.jpg
│        │     ├─ usage-badge-02.jpg
│        │     ├─ usage-bg-do-01.jpg
│        │     ├─ usage-bg-do-02.jpg
│        │     ├─ usage-bg-do-03.jpg
│        │     ├─ usage-bg-dont-01.jpg
│        │     ├─ usage-bg-dont-02.jpg
│        │     └─ usage-bg-dont-03.jpg
│        ├─ bottom-sheet
│        │  ├─ preview
│        │  │  ├─ preview-bs-01.jpg
│        │  │  ├─ preview-bs-02.jpg
│        │  │  ├─ preview-bs-03.jpg
│        │  │  ├─ preview-bs-04.jpg
│        │  │  ├─ preview-bs-05.jpg
│        │  │  ├─ preview-bs-06.gif
│        │  │  ├─ preview-bs-07.jpg
│        │  │  ├─ preview-bs-08.jpg
│        │  │  ├─ preview-bs-09.jpg
│        │  │  ├─ preview-bs-10.jpg
│        │  │  ├─ preview-bs-11-custom.gif
│        │  │  └─ preview-bs-11.jpg
│        │  ├─ states
│        │  │  └─ state-bottom-sheet.jpg
│        │  ├─ style-varient
│        │  │  └─ sv-bt-spec-00.jpg
│        │  └─ usage
│        │     ├─ usage-bs-01-tree.jpg
│        │     ├─ usage-bs-02.jpg
│        │     ├─ usage-bs-03.jpg
│        │     ├─ usage-bs-04.jpg
│        │     ├─ usage-bs-05.jpg
│        │     ├─ usage-bs-06.jpg
│        │     ├─ usage-bs-07.gif
│        │     └─ usage-bs-08.jpg
│        ├─ brand-card
│        │  ├─ preview
│        │  │  ├─ brand-card-00.jpg
│        │  │  ├─ brand-card-01.jpg
│        │  │  └─ brand-card-02.jpg
│        │  ├─ states
│        │  │  └─ product-card-anatomy-00.jpg
│        │  ├─ style-varient
│        │  │  ├─ sv-product-card-spec-01.jpg
│        │  │  └─ sv-product-card-spec-02.jpg
│        │  └─ usage
│        │     ├─ us-product-card-01.jpg
│        │     ├─ us-product-card-02.jpg
│        │     ├─ us-product-card-03-02.jpg
│        │     ├─ us-product-card-03.jpg
│        │     ├─ us-product-card-04.jpg
│        │     ├─ us-product-card-05-02-do.jpg
│        │     ├─ us-product-card-05-02-dont.jpg
│        │     ├─ us-product-card-05-do.jpg
│        │     ├─ us-product-card-05-dont.jpg
│        │     ├─ us-product-card-05-dont.png
│        │     ├─ us-product-card-06-do.jpg
│        │     ├─ us-product-card-06-dont.jpg
│        │     ├─ us-product-card-07-do.jpg
│        │     └─ us-product-card-07-dont.jpg
│        ├─ button
│        │  ├─ preview
│        │  │  ├─ button-preview-00-cover.jpg
│        │  │  ├─ button-preview-01-hierarchy.jpg
│        │  │  ├─ button-preview-02-disabled.jpg
│        │  │  ├─ button-preview-03-pending.jpg
│        │  │  ├─ button-preview-04-negative.jpg
│        │  │  ├─ button-preview-05-size.jpg
│        │  │  ├─ button-preview-06-adtionicon.jpg
│        │  │  ├─ button-preview-06-prefixicon.jpg
│        │  │  ├─ button-preview-07-prefixicon.jpg
│        │  │  ├─ button-preview-08-actionicon.jpg
│        │  │  ├─ button-preview-09-layout01.jpg
│        │  │  ├─ button-preview-09-layout02.jpg
│        │  │  ├─ button-preview-10-behavior01.jpg
│        │  │  ├─ button-preview-10-behavior02.jpg
│        │  │  ├─ button-preview-10-behavior03.jpg
│        │  │  ├─ button-preview-11-behavior01.jpg
│        │  │  ├─ button-preview-11-behavior02.jpg
│        │  │  └─ button-preview-12-behavior.jpg
│        │  ├─ states
│        │  │  └─ button-state-01.jpg
│        │  ├─ style-variant
│        │  │  ├─ button-01-primary01.jpg
│        │  │  ├─ button-01-primary02.jpg
│        │  │  ├─ button-01-primary03.jpg
│        │  │  ├─ button-01-primary04.jpg
│        │  │  ├─ button-01-primary05.jpg
│        │  │  ├─ button-02-secondary01.jpg
│        │  │  ├─ button-02-secondary02.jpg
│        │  │  ├─ button-02-secondary03.jpg
│        │  │  ├─ button-02-secondary04.jpg
│        │  │  ├─ button-02-secondary05.jpg
│        │  │  ├─ button-03-tertiary01.jpg
│        │  │  ├─ button-03-tertiary02.jpg
│        │  │  ├─ button-03-tertiary03.jpg
│        │  │  ├─ button-03-tertiary04.jpg
│        │  │  ├─ button-03-tertiary05.jpg
│        │  │  ├─ button-04-negative01.jpg
│        │  │  ├─ button-04-negative02.jpg
│        │  │  ├─ button-04-negative03.jpg
│        │  │  ├─ button-04-negative04.jpg
│        │  │  ├─ button-04-negative05.jpg
│        │  │  ├─ button-05-size01.jpg
│        │  │  ├─ button-05-size02.jpg
│        │  │  ├─ button-05-size03.jpg
│        │  │  └─ button-05-size04.jpg
│        │  └─ usage
│        │     ├─ contents-guide-1-do.jpg
│        │     ├─ contents-guide-1-dont.jpg
│        │     ├─ contents-guide-2-do.jpg
│        │     ├─ contents-guide-2-dont.jpg
│        │     ├─ contents-guide-3-do.jpg
│        │     └─ contents-guide-3-dont.jpg
│        ├─ checkbox
│        │  ├─ preview
│        │  │  ├─ checkbox-behavior-multi-1.jpg
│        │  │  ├─ checkbox-behavior-multi-2.jpg
│        │  │  ├─ checkbox-context-1.jpg
│        │  │  ├─ checkbox-context-2.jpg
│        │  │  ├─ checkbox-disabled.jpg
│        │  │  ├─ checkbox-layout-2.jpg
│        │  │  ├─ checkbox-layout-3.jpg
│        │  │  ├─ checkbox-layout-multi-1.jpg
│        │  │  ├─ checkbox-layout-multi-2.jpg
│        │  │  ├─ checkbox-mobile-multi-1.jpg
│        │  │  ├─ checkbox-mobile-multi-2.jpg
│        │  │  ├─ checkbox-preview.jpg
│        │  │  ├─ checkbox-select.jpg
│        │  │  ├─ checkbox-size.jpg
│        │  │  ├─ checkbox-touch-targets-multi-1.jpg
│        │  │  ├─ checkbox-touch-targets-multi-2.jpg
│        │  │  ├─ checkbox-touch-targets-multi-3.jpg
│        │  │  ├─ checkbox-touch-targets-multi-4.jpg
│        │  │  ├─ checkbox-web-multi-1.jpg
│        │  │  ├─ checkbox-web-multi-2.jpg
│        │  │  └─ checkbox-web-multi-3.jpg
│        │  ├─ states
│        │  │  └─ checkbox-anatomy.jpg
│        │  ├─ style-varient
│        │  │  ├─ color-spec-1.jpg
│        │  │  ├─ color-spec-2.jpg
│        │  │  ├─ color-spec-3.jpg
│        │  │  ├─ color-spec-4.jpg
│        │  │  ├─ color-spec-5.jpg
│        │  │  ├─ color-spec-6.jpg
│        │  │  ├─ size-typography-spec-1.jpg
│        │  │  └─ size-typography-spec-2.jpg
│        │  └─ usage
│        │     ├─ checkbox-contents-guide-context-do.jpg
│        │     ├─ checkbox-contents-guide-context-dont.jpg
│        │     ├─ checkbox-contents-guide-negative-do.jpg
│        │     ├─ checkbox-contents-guide-negative-dont.jpg
│        │     └─ checkbox-decision-tree.jpg
│        ├─ icon-button
│        │  ├─ preview
│        │  │  ├─ icon-button-01-hierarchy.jpg
│        │  │  ├─ icon-button-02-appearance.jpg
│        │  │  ├─ icon-button-03-disabled.jpg
│        │  │  ├─ icon-button-04-size.jpg
│        │  │  ├─ icon-button-05-behavior01.jpg
│        │  │  ├─ icon-button-05-behavior02.jpg
│        │  │  ├─ icon-button-05-behavior03.jpg
│        │  │  ├─ icon-button-05-behavior04.jpg
│        │  │  ├─ icon-button-05-behavior05.jpg
│        │  │  └─ icon-button-05-behavior06.jpg
│        │  ├─ states
│        │  │  └─ icon-button-state01.jpg
│        │  ├─ style-variant
│        │  │  ├─ icon-button-01-primary01.jpg
│        │  │  ├─ icon-button-01-primary02.jpg
│        │  │  ├─ icon-button-01-primary03.jpg
│        │  │  ├─ icon-button-01-primary04.jpg
│        │  │  ├─ icon-button-02-secondary01.jpg
│        │  │  ├─ icon-button-02-secondary02.jpg
│        │  │  ├─ icon-button-02-secondary03.jpg
│        │  │  ├─ icon-button-02-secondary04.jpg
│        │  │  ├─ icon-button-03-tertiary01.jpg
│        │  │  ├─ icon-button-03-tertiary02.jpg
│        │  │  ├─ icon-button-03-tertiary03.jpg
│        │  │  ├─ icon-button-03-tertiary04.jpg
│        │  │  ├─ icon-button-04-is-transparent01.jpg
│        │  │  ├─ icon-button-04-is-transparent02.jpg
│        │  │  ├─ icon-button-04-is-transparent03.jpg
│        │  │  ├─ icon-button-04-is-transparent04.jpg
│        │  │  ├─ icon-button-05-size01.jpg
│        │  │  ├─ icon-button-05-size02.jpg
│        │  │  ├─ icon-button-05-size03.jpg
│        │  │  └─ icon-button-05-size04.jpg
│        │  └─ usage
│        │     ├─ icon-button-usage-01-do.jpg
│        │     ├─ icon-button-usage-01-dont.jpg
│        │     ├─ icon-button-usage-02-do.jpg
│        │     └─ icon-button-usage-02-dont.jpg
│        ├─ product-card
│        │  ├─ preview
│        │  │  ├─ prev-product-card-01.jpg
│        │  │  ├─ prev-product-card-02.jpg
│        │  │  ├─ prev-product-card-03.jpg
│        │  │  ├─ prev-product-card-04.jpg
│        │  │  ├─ prev-product-card-05.jpg
│        │  │  ├─ prev-product-card-06-01.gif
│        │  │  ├─ prev-product-card-06-02.jpg
│        │  │  ├─ prev-product-card-06.gif
│        │  │  ├─ prev-product-card-07.jpg
│        │  │  ├─ prev-product-card-08.jpg
│        │  │  ├─ prev-product-card-09.jpg
│        │  │  ├─ prev-product-card-10.jpg
│        │  │  ├─ prev-product-card-11.jpg
│        │  │  ├─ prev-product-card-12.jpg
│        │  │  └─ prev-product-card-13.jpg
│        │  ├─ states
│        │  │  └─ product-card-anatomy-00.jpg
│        │  ├─ style-varient
│        │  │  ├─ sv-product-card-spec-01.jpg
│        │  │  └─ sv-product-card-spec-02.jpg
│        │  └─ usage
│        │     ├─ us-product-card-01.jpg
│        │     ├─ us-product-card-02.jpg
│        │     ├─ us-product-card-03-02.jpg
│        │     ├─ us-product-card-03.jpg
│        │     ├─ us-product-card-04.jpg
│        │     ├─ us-product-card-05-02-do.jpg
│        │     ├─ us-product-card-05-02-dont.jpg
│        │     ├─ us-product-card-05-do.jpg
│        │     ├─ us-product-card-05-dont.jpg
│        │     ├─ us-product-card-05-dont.png
│        │     ├─ us-product-card-06-do.jpg
│        │     ├─ us-product-card-06-dont.jpg
│        │     ├─ us-product-card-07-do.jpg
│        │     └─ us-product-card-07-dont.jpg
│        ├─ radio-group
│        │  ├─ preview
│        │  │  ├─ rg-preview-01.jpg
│        │  │  ├─ rg-preview-02.jpg
│        │  │  ├─ rg-preview-03.jpg
│        │  │  ├─ rg-preview-04.jpg
│        │  │  ├─ rg-preview-05.jpg
│        │  │  ├─ rg-preview-06.jpg
│        │  │  ├─ rg-preview-07-01.jpg
│        │  │  ├─ rg-preview-07-02.jpg
│        │  │  ├─ rg-preview-08.jpg
│        │  │  ├─ rg-preview-09.jpg
│        │  │  ├─ rg-preview-10.jpg
│        │  │  ├─ rg-preview-11-01.jpg
│        │  │  ├─ rg-preview-11-02.jpg
│        │  │  ├─ rg-preview-12-01.jpg
│        │  │  ├─ rg-preview-12-02.jpg
│        │  │  ├─ rg-preview-12-03.jpg
│        │  │  ├─ rg-preview-12-04.jpg
│        │  │  ├─ rg-preview-13-01.jpg
│        │  │  ├─ rg-preview-13-02.jpg
│        │  │  ├─ rg-preview-13-03.jpg
│        │  │  ├─ rg-preview-14-01.jpg
│        │  │  └─ rg-preview-14-02.jpg
│        │  ├─ states
│        │  │  └─ rg-states-01.jpg
│        │  ├─ style-varient
│        │  │  ├─ rg-sv-colorspec-01.jpg
│        │  │  ├─ rg-sv-colorspec-02.jpg
│        │  │  ├─ rg-sv-colorspec-03.jpg
│        │  │  ├─ rg-sv-colorspec-04.jpg
│        │  │  ├─ rg-sv-colorspec-05.jpg
│        │  │  ├─ rg-sv-colorspec-06.jpg
│        │  │  ├─ rg-sv-sizespec-01.jpg
│        │  │  └─ rg-sv-sizespec-02.jpg
│        │  └─ usage
│        │     ├─ radio-group-usage-01.jpg
│        │     ├─ radio-group-usage-02-do01.jpg
│        │     ├─ radio-group-usage-02-do02.jpg
│        │     ├─ radio-group-usage-02-dont01.jpg
│        │     └─ radio-group-usage-02-dont02.jpg
│        ├─ search-field
│        │  ├─ preview
│        │  │  ├─ search-field-preview-00-part.jpg
│        │  │  ├─ search-field-preview-01-state01.jpg
│        │  │  ├─ search-field-preview-01-state02.jpg
│        │  │  ├─ search-field-preview-02-behavior01.gif
│        │  │  ├─ search-field-preview-02-behavior02.jpg
│        │  │  ├─ search-field-preview-02-behavior03.jpg
│        │  │  ├─ search-field-preview-02-behavior04-1.jpg
│        │  │  ├─ search-field-preview-02-behavior04.jpg
│        │  │  ├─ search-field-preview-02-behavior05.jpg
│        │  │  ├─ search-field-preview-02-behavior06.jpg
│        │  │  ├─ search-field-preview-02-behavior07.jpg
│        │  │  ├─ search-field-preview-02-behavior08.jpg
│        │  │  └─ search-field-preview-02-behavior09.jpg
│        │  ├─ states
│        │  │  └─ search-field-states-01.jpg
│        │  ├─ style-varient
│        │  │  ├─ search-field-sv-01.jpg
│        │  │  ├─ search-field-sv-02.jpg
│        │  │  ├─ search-field-sv-03.jpg
│        │  │  ├─ search-field-sv-04.jpg
│        │  │  ├─ search-field-sv-05.jpg
│        │  │  ├─ search-field-sv-06.jpg
│        │  │  ├─ search-field-sv-07.jpg
│        │  │  └─ search-field-sv-08.jpg
│        │  └─ usage
│        │     ├─ search-field-do-01.jpg
│        │     ├─ search-field-do-02.jpg
│        │     ├─ search-field-do-03.jpg
│        │     ├─ search-field-do-04.jpg
│        │     ├─ search-field-dont-01.jpg
│        │     ├─ search-field-dont-02.jpg
│        │     └─ search-field-dont-03.jpg
│        ├─ snack-bar
│        │  ├─ preview
│        │  │  ├─ pv-snack-bar-00.gif
│        │  │  ├─ pv-snack-bar-01.gif
│        │  │  ├─ pv-snackbar-00.jpg
│        │  │  ├─ pv-snackbar-01.jpg
│        │  │  └─ pv-snackbar-02.jpg
│        │  └─ usage
│        │     ├─ us-snack-bar-00.jpg
│        │     ├─ us-snack-bar-01-dt.jpg
│        │     ├─ us-snack-bar-03-do.jpg
│        │     ├─ us-snack-bar-03-dont.jpg
│        │     ├─ us-snack-bar-04-do.jpg
│        │     ├─ us-snack-bar-04-dont.jpg
│        │     ├─ us-snack-bar-05-do.jpg
│        │     ├─ us-snack-bar-05-dont.jpg
│        │     ├─ us-snack-bar-06-do.jpg
│        │     └─ us-snack-bar-06-dont.jpg
│        ├─ spinner
│        │  ├─ preview
│        │  │  ├─ spinner-preview-01-appearance01.jpg
│        │  │  ├─ spinner-preview-01-appearance02.jpg
│        │  │  ├─ spinner-preview-02-default.gif
│        │  │  └─ spinner-preview-03-oncolor.gif
│        │  ├─ states
│        │  │  └─ spinner-state-anatomy.jpg
│        │  ├─ style-varient
│        │  │  ├─ spinner-sv-01.jpg
│        │  │  ├─ spinner-sv-02.jpg
│        │  │  ├─ spinner-sv-03.jpg
│        │  │  ├─ spinner-sv-04.jpg
│        │  │  ├─ spinner-sv-05.jpg
│        │  │  └─ spinner-sv-06.jpg
│        │  └─ usage
│        │     ├─ spinner-usage-do-01.jpg
│        │     ├─ spinner-usage-do-02.jpg
│        │     └─ spinner-usage-dont-02.jpg
│        ├─ tag
│        │  ├─ preview
│        │  │  ├─ tag-preview-00-tagtype01.jpg
│        │  │  ├─ tag-preview-00-tagtype02.jpg
│        │  │  ├─ tag-preview-00-tagtype03.jpg
│        │  │  ├─ tag-preview-00.gif
│        │  │  ├─ tag-preview-01-toggled01.jpg
│        │  │  ├─ tag-preview-01-toggled02.jpg
│        │  │  ├─ tag-preview-02-filter.gif
│        │  │  ├─ tag-preview-03-remove01.jpg
│        │  │  ├─ tag-preview-03-remove02.jpg
│        │  │  ├─ tag-preview-04-pending.gif
│        │  │  ├─ tag-preview-05-disabled.jpg
│        │  │  ├─ tag-preview-06-behavior01.jpg
│        │  │  ├─ tag-preview-06-behavior02.jpg
│        │  │  ├─ tag-preview-06-behavior03.jpg
│        │  │  ├─ tag-preview-06-behavior04.jpg
│        │  │  ├─ tag-preview-07-behavior01.jpg
│        │  │  ├─ tag-preview-07-behavior02.jpg
│        │  │  ├─ tag-preview-07-behavior03.jpg
│        │  │  ├─ tag-preview-08-behavior01.jpg
│        │  │  ├─ tag-preview-08-behavior02.jpg
│        │  │  └─ tag-preview-08-behavior03.jpg
│        │  ├─ states
│        │  │  └─ tag-state-01.jpg
│        │  ├─ style-varient
│        │  │  ├─ tag-01-toggled01.jpg
│        │  │  ├─ tag-01-toggled02.jpg
│        │  │  ├─ tag-01-toggled03.jpg
│        │  │  ├─ tag-01-toggled04.jpg
│        │  │  ├─ tag-01-toggled05.jpg
│        │  │  ├─ tag-01-toggled06.jpg
│        │  │  ├─ tag-01-toggled07.jpg
│        │  │  ├─ tag-02-remove01.jpg
│        │  │  ├─ tag-02-remove02.jpg
│        │  │  ├─ tag-02-remove03.jpg
│        │  │  ├─ tag-02-remove04.jpg
│        │  │  ├─ tag-03-filter01.jpg
│        │  │  ├─ tag-03-filter02.jpg
│        │  │  ├─ tag-03-filter03.jpg
│        │  │  ├─ tag-03-filter04.jpg
│        │  │  ├─ tag-03-filter05.jpg
│        │  │  ├─ tag-03-filter06.jpg
│        │  │  └─ tag-03-filter07.jpg
│        │  └─ usage
│        │     ├─ tag-usage-01-kind.jpg
│        │     ├─ tag-usage-02-decision-tree.jpg
│        │     ├─ tag-usage-03-do-00.jpg
│        │     ├─ tag-usage-03-do-01.jpg
│        │     ├─ tag-usage-03-do-02.jpg
│        │     ├─ tag-usage-03-do-03.jpg
│        │     ├─ tag-usage-03-dont-01.jpg
│        │     ├─ tag-usage-03-dont-02.jpg
│        │     └─ tag-usage-03-dont-03.jpg
│        ├─ text-button
│        │  ├─ preview
│        │  │  ├─ text-button-preview-00-hierarchy.jpg
│        │  │  ├─ text-button-preview-01-style.jpg
│        │  │  ├─ text-button-preview-02-style.jpg
│        │  │  ├─ text-button-preview-03-disabled.jpg
│        │  │  ├─ text-button-preview-04-size.jpg
│        │  │  ├─ text-button-preview-05-icon.jpg
│        │  │  ├─ text-button-preview-06-icon.jpg
│        │  │  ├─ text-button-preview-07-prefix.jpg
│        │  │  ├─ text-button-preview-08-action.jpg
│        │  │  ├─ text-button-preview-09-begavior01.jpg
│        │  │  ├─ text-button-preview-09-begavior02.jpg
│        │  │  ├─ text-button-preview-09-begavior03.jpg
│        │  │  ├─ text-button-preview-09-begavior04.jpg
│        │  │  ├─ text-button-preview-09-begavior05.jpg
│        │  │  ├─ text-button-preview-09-begavior06.jpg
│        │  │  └─ text-button-preview-09-begavior07.jpg
│        │  ├─ states
│        │  │  └─ text-button-state-01.jpg
│        │  ├─ style-variant
│        │  │  ├─ text-button-01-primary01.jpg
│        │  │  ├─ text-button-01-primary02.jpg
│        │  │  ├─ text-button-01-primary03.jpg
│        │  │  ├─ text-button-01-primary04.jpg
│        │  │  ├─ text-button-02-secondary01.jpg
│        │  │  ├─ text-button-02-secondary02.jpg
│        │  │  ├─ text-button-02-secondary03.jpg
│        │  │  ├─ text-button-02-secondary04.jpg
│        │  │  ├─ text-button-03-tertiary01.jpg
│        │  │  ├─ text-button-03-tertiary02.jpg
│        │  │  ├─ text-button-03-tertiary03.jpg
│        │  │  ├─ text-button-03-tertiary04.jpg
│        │  │  ├─ text-button-04-isWhite01.jpg
│        │  │  ├─ text-button-04-isWhite02.jpg
│        │  │  ├─ text-button-04-isWhite03.jpg
│        │  │  ├─ text-button-04-isWhite04.jpg
│        │  │  ├─ text-button-05-size01.jpg
│        │  │  ├─ text-button-05-size02.jpg
│        │  │  └─ text-button-05-size03.jpg
│        │  └─ usage
│        │     ├─ text-button-usage-00.png
│        │     ├─ text-button-usage-01-do.png
│        │     ├─ text-button-usage-01-dont.png
│        │     ├─ text-button-usage-02-do.png
│        │     └─ text-button-usage-02-dont.png
│        ├─ text-field
│        │  ├─ preview
│        │  │  ├─ pv-text-field-00.jpg
│        │  │  ├─ pv-text-field-01-01.jpg
│        │  │  ├─ pv-text-field-01-02.jpg
│        │  │  ├─ pv-text-field-02-01.jpg
│        │  │  ├─ pv-text-field-02-02.jpg
│        │  │  ├─ pv-text-field-02-03.jpg
│        │  │  ├─ pv-text-field-02-04.jpg
│        │  │  ├─ pv-text-field-03-01.jpg
│        │  │  ├─ pv-text-field-03-02.jpg
│        │  │  ├─ pv-text-field-03-03.jpg
│        │  │  ├─ pv-text-field-04-01.jpg
│        │  │  ├─ pv-text-field-04-02.jpg
│        │  │  ├─ pv-text-field-05-01.jpg
│        │  │  ├─ pv-text-field-05-02.jpg
│        │  │  ├─ pv-text-field-05-03.jpg
│        │  │  ├─ pv-text-field-05-04.jpg
│        │  │  ├─ pv-text-field-05-05.jpg
│        │  │  ├─ pv-text-field-06-01.jpg
│        │  │  ├─ pv-text-field-06-02.jpg
│        │  │  ├─ pv-text-field-06-03.jpg
│        │  │  ├─ pv-text-field-07-01.jpg
│        │  │  ├─ pv-text-field-07-02.jpg
│        │  │  ├─ pv-text-field-07-03.jpg
│        │  │  ├─ pv-text-field-07-04.jpg
│        │  │  ├─ pv-text-field-07-05.jpg
│        │  │  ├─ pv-text-field-07-06.jpg
│        │  │  └─ pv-text-field-07-07.jpg
│        │  ├─ states
│        │  │  └─ text-field-states-00.jpg
│        │  ├─ style-varient
│        │  │  ├─ sv-text-field-01.jpg
│        │  │  ├─ sv-text-field-02.jpg
│        │  │  ├─ sv-text-field-03.jpg
│        │  │  ├─ sv-text-field-04.jpg
│        │  │  ├─ sv-text-field-05.jpg
│        │  │  ├─ sv-text-field-06.jpg
│        │  │  ├─ sv-text-field-07.jpg
│        │  │  └─ sv-text-field-08.jpg
│        │  └─ usage
│        │     ├─ text-field-00-do-01.jpg
│        │     ├─ text-field-00-do-04.jpg
│        │     ├─ text-field-00-do-05.jpg
│        │     ├─ text-field-00-do-06.jpg
│        │     ├─ text-field-00-dont-01.jpg
│        │     ├─ text-field-00-dont-04.jpg
│        │     ├─ text-field-00-dont-05.jpg
│        │     ├─ text-field-00-dont-06.jpg
│        │     ├─ text-field-00.jpg
│        │     └─ text-field-01.jpg
│        ├─ toggle-button
│        │  ├─ preview
│        │  │  ├─ preview-toggle-button-01.jpg
│        │  │  ├─ preview-toggle-button-02.jpg
│        │  │  ├─ preview-toggle-button-03.jpg
│        │  │  ├─ preview-toggle-button-04.jpg
│        │  │  ├─ preview-toggle-button-05.jpg
│        │  │  ├─ preview-toggle-button-06.jpg
│        │  │  ├─ preview-toggle-button-07.jpg
│        │  │  └─ preview-toggle-button-08.jpg
│        │  ├─ states
│        │  │  └─ states-toogle-button-00.jpg
│        │  ├─ style-varient
│        │  │  ├─ sv-toggle-button-01.jpg
│        │  │  ├─ sv-toggle-button-02.jpg
│        │  │  ├─ sv-toggle-button-03.jpg
│        │  │  ├─ sv-toggle-button-04.jpg
│        │  │  ├─ sv-toggle-button-05-size.jpg
│        │  │  ├─ sv-toggle-button-06-size.jpg
│        │  │  ├─ sv-toggle-button-07-size.jpg
│        │  │  └─ sv-toggle-button-08-size.jpg
│        │  └─ usage
│        │     ├─ us-togglebtn-00.jpg
│        │     ├─ us-togglebtn-02-do.jpg
│        │     ├─ us-togglebtn-02-dont.jpg
│        │     ├─ us-togglebtn-03-do.jpg
│        │     └─ us-togglebtn-03-dont.jpg
│        ├─ toggle-icon-button
│        │  ├─ preview
│        │  │  ├─ preview-toggle-ic-btn-00-01.jpg
│        │  │  ├─ preview-toggle-ic-btn-00-02.gif
│        │  │  ├─ preview-toggle-ic-btn-00.jpg
│        │  │  ├─ preview-toggle-ic-btn-01.jpg
│        │  │  ├─ preview-toggle-ic-btn-02.jpg
│        │  │  ├─ preview-toggle-ic-btn-03.jpg
│        │  │  ├─ preview-toggle-ic-btn-04.jpg
│        │  │  ├─ preview-toggle-ic-btn-05.jpg
│        │  │  └─ preview-toggle-ic-btn-06.jpg
│        │  ├─ states
│        │  │  └─ state-toggle-icon-button.jpg
│        │  ├─ style-varient
│        │  │  ├─ toggle-icon-button-01-default01.jpg
│        │  │  ├─ toggle-icon-button-01-default02.jpg
│        │  │  ├─ toggle-icon-button-01-default03.jpg
│        │  │  ├─ toggle-icon-button-01-default04.jpg
│        │  │  ├─ toggle-icon-button-01-df-white01.jpg
│        │  │  ├─ toggle-icon-button-01-df-white02.jpg
│        │  │  ├─ toggle-icon-button-01-df-white03.jpg
│        │  │  ├─ toggle-icon-button-01-df-white04.jpg
│        │  │  ├─ toggle-icon-button-02-black01.jpg
│        │  │  ├─ toggle-icon-button-02-black02.jpg
│        │  │  ├─ toggle-icon-button-02-black03.jpg
│        │  │  ├─ toggle-icon-button-02-black04.jpg
│        │  │  ├─ toggle-icon-button-02-white01.jpg
│        │  │  ├─ toggle-icon-button-02-white02.jpg
│        │  │  ├─ toggle-icon-button-02-white03.jpg
│        │  │  ├─ toggle-icon-button-02-white04.jpg
│        │  │  ├─ toggled-icon-button-03-size01.jpg
│        │  │  ├─ toggled-icon-button-03-size02.jpg
│        │  │  ├─ toggled-icon-button-03-size03.jpg
│        │  │  └─ toggled-icon-button-03-size04.jpg
│        │  └─ usage
│        │     ├─ us-togglebtn-00.jpg
│        │     ├─ us-togglebtn-01.jpg
│        │     ├─ us-togglebtn-02-do.jpg
│        │     ├─ us-togglebtn-02-dont.jpg
│        │     ├─ us-togglebtn-03-do.jpg
│        │     └─ us-togglebtn-03-dont.jpg
│        └─ top-navigation
│           ├─ preview
│           │  ├─ topnav-preview-00-part.jpg
│           │  ├─ topnav-preview-01-prefix01.jpg
│           │  ├─ topnav-preview-01-prefix02.jpg
│           │  ├─ topnav-preview-01-prefix03.jpg
│           │  ├─ topnav-preview-01-prefix04.gif
│           │  ├─ topnav-preview-02-title.jpg
│           │  ├─ topnav-preview-03-action.jpg
│           │  └─ topnav-preview-04-appearance.jpg
│           ├─ states
│           │  └─ topnav-state-00.jpg
│           ├─ style-varient
│           │  ├─ topnav-style-00-29play.gif
│           │  ├─ topnav-style-00-size.jpg
│           │  ├─ topnav-style-01.jpg
│           │  ├─ topnav-style-02.jpg
│           │  ├─ topnav-style-03.jpg
│           │  └─ topnav-style-04.jpg
│           └─ usage
│              ├─ topnav-usage-00-back.jpg
│              ├─ topnav-usage-00-close.jpg
│              ├─ topnav-usage-01-back.gif
│              ├─ topnav-usage-01-close.gif
│              ├─ topnav-usage-do-01.jpg
│              ├─ topnav-usage-do-02.jpg
│              ├─ topnav-usage-do-03.jpg
│              ├─ topnav-usage-do-04.jpg
│              ├─ topnav-usage-do-05.jpg
│              ├─ topnav-usage-dont-01.jpg
│              ├─ topnav-usage-dont-02.jpg
│              ├─ topnav-usage-dont-03.jpg
│              ├─ topnav-usage-dont-04.jpg
│              └─ topnav-usage-dont-05.jpg
├─ src
│  ├─ app
│  │  ├─ components
│  │  │  ├─ [slug]
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ pageThemeToggle.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ tokens
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ MDXContents.tsx
│  │  └─ docs
│  │     └─ StatusBadge.tsx
│  ├─ content
│  │  └─ components
│  │     ├─ alert-dialog.mdx
│  │     ├─ badge.mdx
│  │     ├─ bottom-sheet.mdx
│  │     ├─ brand-card.mdx
│  │     ├─ button.mdx
│  │     ├─ check-box.mdx
│  │     ├─ compact-product-card.mdx
│  │     ├─ compact-ticket-card.mdx
│  │     ├─ icon-button.mdx
│  │     ├─ product-card-v2.mdx
│  │     ├─ product-card.mdx
│  │     ├─ radio-group.mdx
│  │     ├─ search-field.mdx
│  │     ├─ snack-bar.mdx
│  │     ├─ spinner.mdx
│  │     ├─ tag.mdx
│  │     ├─ text-button.mdx
│  │     ├─ text-field.mdx
│  │     ├─ ticket-card.mdx
│  │     ├─ toggle-button.mdx
│  │     ├─ toggle-icon-button.mdx
│  │     └─ top-navigation.mdx
│  ├─ ruler-tokens
│  │  ├─ $metadata.json
│  │  ├─ $themes.json
│  │  ├─ scale
│  │  │  ├─ color
│  │  │  │  ├─ dark.json
│  │  │  │  └─ light.json
│  │  │  ├─ corner-radius.json
│  │  │  ├─ dimension-font-size.json
│  │  │  ├─ dimension-size.json
│  │  │  ├─ duration.json
│  │  │  ├─ font-weight.json
│  │  │  ├─ letter-spacing.json
│  │  │  ├─ line-height.json
│  │  │  └─ materials(임시).json
│  │  ├─ semantic
│  │  │  ├─ breakpoints.json
│  │  │  ├─ color
│  │  │  │  └─ dark.json
│  │  │  ├─ color.json
│  │  │  └─ typography.json
│  │  └─ static-scale
│  │     ├─ color.json
│  │     └─ font-family.json
│  ├─ scripts
│  │  ├─ convert-components-to-mdx.js
│  │  ├─ fix-broken-mdx.js
│  │  ├─ generate-mdx.js
│  │  └─ transform-tokens.ts
│  ├─ styles
│  │  ├─ components
│  │  │  └─ status-badge.css
│  │  └─ globals.css
│  └─ tokens
│     ├─ processed
│     │  ├─ colors.json
│     │  ├─ other.json
│     │  ├─ spacing.json
│     │  ├─ tailwind-theme.json
│     │  ├─ theme-colors.json
│     │  ├─ typography-styles.json
│     │  └─ typography.json
│     └─ tokens.css
├─ tailwind.config.js
└─ tsconfig.json

```