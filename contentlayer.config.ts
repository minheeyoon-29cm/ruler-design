import { defineDocumentType, makeSource } from "contentlayer/source-files";
// import remarkGfm from 'remark-gfm' // 필요시 GFM 마크다운 테이블 등 지원

// ------------------------------
// 컴포넌트 문서 타입 정의
// ------------------------------
export const Component = defineDocumentType(() => ({
  name: "Component",
  filePathPattern: "components/**/*.mdx", // components 폴더 내 모든 MDX 파일
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true }, // 컴포넌트 이름
    description: { type: "string", required: true }, // 설명
    status: {
      type: "enum",
      required: true,
      options: ["draft", "review", "active", "deprecated"], // 컴포넌트 상태
    },
    version: { type: "string", required: true }, // 버전 (예: 1.0)
    category: {
      type: "enum",
      required: true,
      options: ["foundation", "component", "pattern", "module"], // 텍소노미 카테고리
    },
    tags: { type: "list", of: { type: "string" }, required: false }, // 검색용 태그
    platforms: { type: "list", of: { type: "string" }, required: false }, // Web, App 등
    updated: { type: "date", required: true }, // 마지막 수정일
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""), // 예: alert.mdx → "alert"
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^components\//, ""), // URL 라우팅용
    },
  },
}));

// ------------------------------
// Foundation 문서 타입 정의
// ------------------------------
export const Foundation = defineDocumentType(() => ({
  name: "Foundation",
  filePathPattern: "foundation/**/*.mdx", // foundation 폴더 하위 MDX (assets 포함)
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true }, // 파운데이션 이름
    description: { type: "string", required: true }, // 설명
    status: {
      type: "enum",
      required: true,
      options: ["draft", "review", "active", "deprecated"], // 파운데이션 상태
    },
    version: { type: "string", required: true }, // 버전 (예: 1.0)
    category: {
      type: "enum",
      required: true,
      options: ["foundation", "component", "pattern", "module"], // 텍소노미 카테고리
    },
    tags: { type: "list", of: { type: "string" }, required: false }, // 검색용 태그
    platforms: { type: "list", of: { type: "string" }, required: false }, // Web, App 등
    updated: { type: "date", required: true }, // 마지막 수정일
    order: { type: "number", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""), // 예: alert.mdx → "alert"
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^foundation\//, ""), // URL 라우팅용
    },
  },
}));

// ------------------------------
// Contentlayer 설정 진입점
// ------------------------------
export default makeSource({
  contentDirPath: "src/content", // MDX 문서들이 위치한 폴더
  documentTypes: [Component, Foundation], // 등록된 문서 타입들
  mdx: {
    remarkPlugins: [], // 필요한 경우 마크다운 확장 플러그인 등록
    rehypePlugins: [], // HTML 렌더링 후 처리 플러그인
  },
});
