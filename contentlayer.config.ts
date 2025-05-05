import { defineDocumentType, makeSource } from 'contentlayer/source-files'
// ⚠️ GFM 테이블 문제 방지
// import remarkGfm from 'remark-gfm'

export const Component = defineDocumentType(() => ({
  name: 'Component',
  filePathPattern: 'components/**/*.mdx', // 전체 components 폴더 포함
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    status: { type: 'enum', required: true, options: ['draft', 'beta', 'active', 'deprecated'] },
    version: { type: 'string', required: true },
    category: { type: 'enum', required: true, options: ['component', 'pattern', 'module'] },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    platforms: { type: 'list', of: { type: 'string' }, required: false },
    updated: { type: 'date', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
    slugAsParams: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^components\//, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'src/content',
  documentTypes: [Component],
  mdx: {
    remarkPlugins: [], // remarkGfm 제거 (테이블 사용 안 하면 불필요)
    rehypePlugins: [],
  },
})
