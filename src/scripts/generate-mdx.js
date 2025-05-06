// scripts/generate-mdx.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 프롬프트 함수
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// kebab-case 변환 함수
const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// 템플릿 함수
const getTemplate = (
  name,
  description,
  status,
  version,
  category,
  tags,
  platforms
) => {
  const today = new Date().toISOString().split('T')[0];
  
  return `---
title: "${name}"
description: "${description}"
status: "${status}"
version: "${version}"
category: "${category}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
platforms: [${platforms.map(platform => `"${platform}"`).join(', ')}]
updated: "${today}"
---

## 개요

${description}

## 사용 예시

\`\`\`jsx preview
import { ${name} } from '@/components/ui/${toKebabCase(name)}';

export default function Example() {
  return (
    <${name} />
  );
}
\`\`\`

## Props

**variant**
- 타입: 'primary' | 'secondary' | 'outline'
- 기본값: 'primary'
- 설명: ${name}의 시각적 스타일을 결정합니다.

**size**
- 타입: 'sm' | 'md' | 'lg'
- 기본값: 'md'
- 설명: ${name}의 크기를 결정합니다.

**disabled**
- 타입: boolean
- 기본값: false
- 설명: ${name}의 비활성화 상태를 결정합니다.

## 디자인 토큰

- 사용된 색상: \`--color-semantic-primary\`
- 여백: \`--spacing-4\`

## 상태 및 변형

- ✅ 기본
- ⚠️ hover
- 🚫 disabled
`;
};

// 메인 실행 함수
async function run() {
  try {
    console.log('📝 MDX 템플릿 생성기\n');
    
    // 기본 값 설정
    let componentName = process.argv[2];
    
    // 대화형 입력 받기
    if (!componentName) {
      componentName = await prompt('컴포넌트 이름: ');
      if (!componentName.trim()) {
        console.error('❌ 컴포넌트 이름은 필수입니다.');
        rl.close();
        process.exit(1);
      }
    }
    
    const description = await prompt(`설명 (기본값: ${componentName} 컴포넌트에 대한 설명입니다.): `) || 
      `${componentName} 컴포넌트에 대한 설명입니다.`;
    
    const statusOptions = ['draft', 'beta', 'active', 'deprecated'];
    console.log('상태 옵션:', statusOptions.join(', '));
    const status = await prompt('상태 (기본값: active): ') || 'active';
    
    const version = await prompt('버전 (기본값: 1.0.0): ') || '1.0.0';
    
    const categoryOptions = ['component', 'pattern', 'module'];
    console.log('카테고리 옵션:', categoryOptions.join(', '));
    const category = await prompt('카테고리 (기본값: component): ') || 'component';
    
    const tagsInput = await prompt('태그 (쉼표로 구분, 기본값: ui): ') || 'ui';
    const tags = tagsInput.split(',').map(tag => tag.trim());
    
    const platformsInput = await prompt('지원 플랫폼 (쉼표로 구분, 기본값: web): ') || 'web';
    const platforms = platformsInput.split(',').map(platform => platform.trim());
    
    // 대상 디렉토리 설정
    const rootDir = process.cwd();
    const defaultTargetDir = path.resolve(rootDir, 'src/content/components');
    const targetDirInput = await prompt(`대상 디렉토리 (기본값: ${defaultTargetDir}): `);
    const targetDir = targetDirInput ? path.resolve(rootDir, targetDirInput) : defaultTargetDir;
    
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`✅ 디렉토리 생성됨: ${targetDir}`);
    }
    
    // kebab-case 변환 및 파일 경로 설정
    const kebabName = toKebabCase(componentName);
    const filePath = path.join(targetDir, `${kebabName}.mdx`);
    
    // 파일 존재 여부 확인
    if (fs.existsSync(filePath)) {
      const overwrite = await prompt(`❓ 이미 ${kebabName}.mdx 파일이 존재합니다. 덮어쓰시겠습니까? (y/N): `);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ 파일 생성이 취소되었습니다.');
        rl.close();
        process.exit(0);
      }
    }
    
    // 템플릿 생성 및 파일 작성
    const template = getTemplate(componentName, description, status, version, category, tags, platforms);
    fs.writeFileSync(filePath, template.trim(), 'utf8');
    
    console.log(`\n✅ ${kebabName}.mdx 생성 완료: ${filePath}`);
    
    // 생성된 파일 내용 요약 출력
    console.log('\n📄 생성된 파일 정보:');
    console.log(`  - 이름: ${componentName}`);
    console.log(`  - 설명: ${description}`);
    console.log(`  - 상태: ${status}`);
    console.log(`  - 버전: ${version}`);
    console.log(`  - 카테고리: ${category}`);
    console.log(`  - 태그: ${tags.join(', ')}`);
    console.log(`  - 플랫폼: ${platforms.join(', ')}`);
    
    rl.close();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    rl.close();
    process.exit(1);
  }
}

// 스크립트 실행
run();