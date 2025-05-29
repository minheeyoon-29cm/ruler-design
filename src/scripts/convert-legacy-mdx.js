// src/scripts/convert-legacy-mdx.js
const fs = require('fs');
const path = require('path');

class LegacyMdxConverter {
  constructor() {
    this.legacyDir = '/Users/minhee/Documents/29cm/frontend-29cm-ruler/packages/ruler/src';
    this.outputDir = '/Users/minhee/Documents/29cm/ruler-design/src/content/components';
    this.imageCounter = 1;
  }

  // PascalCase/camelCase를 kebab-case로 변환
  toKebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase → kebab-case
      .replace(/\s+/g, '-')                 // 공백 → 하이픈
      .toLowerCase();                       // 소문자로 변환
  }

  // 레거시 MDX 파일들 찾기
  findLegacyMdxFiles() {
    console.log('🔍 레거시 MDX 파일 스캔 중...\n');
    const mdxFiles = [];

    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.mdx')) {
          mdxFiles.push(itemPath);
        }
      });
    };

    scanDirectory(this.legacyDir);
    console.log(`📋 발견된 MDX 파일: ${mdxFiles.length}개`);
    mdxFiles.forEach(file => {
      const relativePath = file.replace(this.legacyDir, '');
      console.log(`  📄 ${relativePath}`);
    });

    return mdxFiles;
  }

  // 컴포넌트 이름 추출
  extractComponentName(content, filePath) {
    // 1. <Meta title="..." /> 에서 추출
    const metaMatch = content.match(/<Meta\s+title="([^"]*)"[^>]*>/);
    if (metaMatch) {
      return metaMatch[1];
    }

    // 2. # 제목에서 추출
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1];
    }

    // 3. 파일명에서 추출
    const fileName = path.basename(filePath, '.mdx');
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }

  // 설명 추출 (개선된 버전)
  extractDescription(content) {
    // # 제목 다음 첫 번째 문단 추출
    const match = content.match(/#\s+.+?\n\n([^#]*?)(?:\n\n|$)/s);
    if (match) {
      let description = match[1].trim()
        .replace(/\n/g, ' ')           // 줄바꿈을 공백으로
        .replace(/\s+/g, ' ')          // 연속 공백 정리
        .replace(/[<>]/g, '')          // HTML 태그 제거
        .substring(0, 200);            // 길이 제한
      return description;
    }
    
    // 대안: 첫 번째 줄에서 추출
    const firstLineMatch = content.match(/#\s+.+?\n([^#\n]+)/);
    if (firstLineMatch) {
      return firstLineMatch[1].trim().substring(0, 100);
    }
    
    return '';
  }

  // frontmatter 생성
  generateFrontmatter(componentName, description) {
    const today = new Date().toISOString().split('T')[0];
    
    return `---
title: "${this.safeText(componentName)}"
description: "${this.safeText(description)}"
status: "draft"
version: "1.0.0"
category: "component"
tags: ["ui", "component"]
platforms: ["web", "ios", "android"]
updated: "${today}"
---

`;
  }

  // YAML용 안전한 텍스트 처리 (개선된 버전)
  safeText(text) {
    if (!text) return '';
    return text
      .replace(/"/g, '\\"')                 // 따옴표 이스케이프
      .replace(/'/g, "\\'")                 // 작은따옴표 이스케이프
      .replace(/\n/g, ' ')                  // 줄바꿈 → 공백
      .replace(/\r/g, ' ')                  // 캐리지 리턴 → 공백
      .replace(/\s+/g, ' ')                 // 연속 공백 → 단일 공백
      .replace(/^\s+|\s+$/g, '')            // 앞뒤 공백 제거
      .substring(0, 300);                   // 길이 제한 (너무 긴 설명 방지)
  }

  // Storybook imports 및 모든 import문 제거 (개선된 버전)
  removeStorybookImports(content) {
    return content
      // 모든 import 구문 제거
      .replace(/import.*from\s+['"].*['"];?\n/g, '')
      .replace(/import\s+.*\n/g, '')
      // export 구문도 제거
      .replace(/export\s+.*\n/g, '')
      // Storybook 관련 컴포넌트 제거
      .replace(/<Meta.*\/>/g, '')
      .replace(/<Canvas.*?<\/Canvas>/gs, '<!-- Canvas 컴포넌트는 수동 변환 필요 -->')
      .replace(/<Story.*?<\/Story>/gs, '<!-- Story 컴포넌트는 수동 변환 필요 -->')
      .replace(/<ArgsTable.*?\/>/g, '<!-- ArgsTable 컴포넌트는 수동 변환 필요 -->')
      // const 선언 중에 import 관련된 것들 제거
      .replace(/const\s+\{[^}]*\}\s*=\s*require.*\n/g, '')
      .replace(/const.*=.*require.*\n/g, '')
      // 연속된 빈 줄 정리
      .replace(/\n{3,}/g, '\n\n');
  }

  // HTML img 태그를 마크다운으로 변환 (CDN URL 그대로 유지)
  convertImageTags(content) {
    // <img> 태그의 다양한 패턴 처리
    return content.replace(/<img\s+([^>]*)\/?>/gi, (match, attributes) => {
      // src와 alt 속성 추출
      const srcMatch = attributes.match(/src="([^"]*)"/i);
      const altMatch = attributes.match(/alt="([^"]*)"/i);
      
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : 'Image';
      
      if (src) {
        return `![${alt}](${src})`;
      }
      
      // src가 없으면 원본 유지
      return match;
    });
  }

  // 커스텀 Table 컴포넌트를 마크다운 표로 변환
  convertTables(content) {
    // <Table headers={[...]} rows={[...]} /> 패턴 찾기
    const tableRegex = /<Table\s+headers=\{(\[.*?\])\}\s+rows=\{(\[.*?\])\}\s*\/>/gs;
    
    return content.replace(tableRegex, (match, headersStr, rowsStr) => {
      try {
        // 안전한 eval 대신 정규식으로 파싱 시도
        const headers = this.parseArrayString(headersStr);
        const rows = this.parseArrayString(rowsStr);
        
        if (!headers || !rows) {
          return `\n수정필요: Table 컴포넌트 수동 변환 필요\n\`\`\`\n${match}\n\`\`\`\n`;
        }

        let markdown = '| ' + headers.join(' | ') + ' |\n';
        markdown += '|' + headers.map(() => '---').join('|') + '|\n';
        
        rows.forEach(row => {
          if (Array.isArray(row)) {
            markdown += '| ' + row.join(' | ') + ' |\n';
          }
        });
        
        return markdown;
      } catch (e) {
        return `\n수정필요: Table 컴포넌트 수동 변환 필요\n\`\`\`\n${match}\n\`\`\`\n`;
      }
    });
  }

  // 배열 문자열 파싱 (안전한 방법)
  parseArrayString(str) {
    // 간단한 배열만 파싱 (복잡한 경우는 수동 처리)
    if (str.includes('[') && str.includes(']')) {
      try {
        // 따옴표로 둘러싸인 문자열들 추출
        const matches = str.match(/'([^']*)'/g) || str.match(/"([^"]*)"/g);
        if (matches) {
          return matches.map(match => match.slice(1, -1));
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // CSS 클래스 참조 제거
  removeCSSReferences(content) {
    return content
      .replace(/className=\{[^}]*\}/g, '')
      .replace(/\{styles\.[^}]*\}/g, '');
  }

  // HTML 태그를 마크다운으로 변환
  convertHtmlTags(content) {
    return content
      .replace(/<br\s*\/?>/gi, '\n\n')
      .replace(/<\/br>/gi, '\n\n')
      .replace(/<p\s*>/gi, '\n\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '_$1_')
      .replace(/<i>(.*?)<\/i>/gi, '_$1_')
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')
      .replace(/<ul>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<li>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Do/Don't 패턴 표준화
  standardizeDosDonts(content) {
    return content
      .replace(/### ✅ Do\n/g, '### ✅ Do\n\n')
      .replace(/### ❌ Don't\n/g, '### ❌ Don\'t\n\n')
      .replace(/### ✅ 권장\n/g, '### ✅ Do\n\n')
      .replace(/### ❌ 비권장\n/g, '### ❌ Don\'t\n\n');
  }

  // 누락된 표준 섹션 추가
  addStandardSections(content, componentName) {
    // 기본 섹션들이 없으면 추가
    const sections = [];

    if (!content.includes('## Props')) {
      sections.push(`## Props

| name | value |
| --- | --- |
| 속성명 | 값 |

`);
    }

    if (!content.includes('## Color Spec')) {
      sections.push(`## Color Spec

수정필요: Color Spec 섹션 추가 필요

`);
    }

    if (!content.includes('## Size & Typography Spec')) {
      sections.push(`## Size & Typography Spec

수정필요: Size Spec 섹션 추가 필요

`);
    }

    if (!content.includes('## 상태')) {
      sections.push(`## 상태

## Anatomy

![${componentName} Anatomy](/images/components/${componentName.toLowerCase()}/states/${componentName.toLowerCase()}-anatomy.jpg)

## Programmatic State

| State | Value | Default | Description |
| --- | --- | --- | --- |
| isDisabled | boolean | false | 비활성화 상태 |

## Behavior State

| State | Value | Default | Description |
| --- | --- | --- | --- |
| hover | boolean | false | 마우스 오버 상태 |
| pressed | boolean | false | 클릭/탭 상태 |
| focus | boolean | false | 키보드 포커스 상태 |

`);
    }

    return content + sections.join('');
  }

  // 파일명을 kebab-case로 변환
  generateOutputFileName(inputPath) {
    const originalName = path.basename(inputPath, '.mdx');
    const kebabName = this.toKebabCase(originalName);
    return `${kebabName}.mdx`;
  }

  // 단일 파일 변환
  convertSingleFile(inputPath, outputPath = null) {
    try {
      console.log(`🔄 변환 중: ${path.basename(inputPath)}`);
      
      // outputPath가 제공되지 않으면 kebab-case로 자동 생성
      if (!outputPath) {
        const kebabFileName = this.generateOutputFileName(inputPath);
        outputPath = path.join(this.outputDir, kebabFileName);
      }
      
      const content = fs.readFileSync(inputPath, 'utf8');
      
      // 컴포넌트 이름과 설명 추출
      const componentName = this.extractComponentName(content, inputPath);
      const description = this.extractDescription(content);

      let convertedContent = content;

      // 1. Storybook imports 제거
      convertedContent = this.removeStorybookImports(convertedContent);
      
      // 2. HTML img 태그를 마크다운으로 변환 (CDN URL 유지)
      convertedContent = this.convertImageTags(convertedContent);
      
      // 3. 테이블 변환
      convertedContent = this.convertTables(convertedContent);
      
      // 4. CSS 참조 제거
      convertedContent = this.removeCSSReferences(convertedContent);
      
      // 5. HTML 태그 변환
      convertedContent = this.convertHtmlTags(convertedContent);
      
      // 6. Do/Don't 표준화
      convertedContent = this.standardizeDosDonts(convertedContent);
      
      // 7. 표준 섹션 추가
      convertedContent = this.addStandardSections(convertedContent, componentName);

      // 8. frontmatter 추가
      const frontmatter = this.generateFrontmatter(componentName, description);
      const finalContent = frontmatter + convertedContent;

      // 출력 디렉토리 생성
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 파일 저장
      fs.writeFileSync(outputPath, finalContent, 'utf8');
      
      console.log(`✅ 변환 완료: ${outputPath}`);
      return { success: true, componentName, outputPath };
      
    } catch (error) {
      console.error(`❌ 변환 실패: ${path.basename(inputPath)} - ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // 모든 레거시 MDX 파일 변환
  convertAllFiles() {
    console.log('🚀 레거시 MDX 변환 시작\n');
    console.log(`📂 소스: ${this.legacyDir}`);
    console.log(`📁 출력: ${this.outputDir}\n`);

    const legacyFiles = this.findLegacyMdxFiles();
    
    if (legacyFiles.length === 0) {
      console.log('❌ 변환할 MDX 파일을 찾을 수 없습니다.');
      return;
    }

    console.log('\n🔄 변환 시작...\n');
    
    const results = [];
    
    legacyFiles.forEach((inputPath, index) => {
      console.log(`[${index + 1}/${legacyFiles.length}]`);
      
      // kebab-case 파일명으로 자동 생성
      const kebabFileName = this.generateOutputFileName(inputPath);
      const outputPath = path.join(this.outputDir, kebabFileName);
      
      const result = this.convertSingleFile(inputPath, outputPath);
      results.push({ inputPath, outputFileName: kebabFileName, ...result });
    });

    // 결과 요약
    console.log('\n🎉 변환 완료!');
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failureCount}개`);

    if (failureCount > 0) {
      console.log('\n❌ 실패한 파일들:');
      results.filter(r => !r.success).forEach(result => {
        const fileName = path.basename(result.inputPath);
        console.log(`  - ${fileName}: ${result.error}`);
      });
    }

    console.log('\n📋 변환된 파일들:');
    results.filter(r => r.success).forEach(result => {
      const originalName = path.basename(result.inputPath);
      console.log(`  ✅ ${originalName} → ${result.outputFileName || 'converted'}`);
    });

    return results;
  }

  // 특정 파일만 변환
  convertSpecificFile(fileName) {
    console.log(`🔄 특정 파일 변환: ${fileName}`);
    
    // 파일 찾기
    const allFiles = this.findLegacyMdxFiles();
    const targetFile = allFiles.find(file => 
      path.basename(file).toLowerCase() === fileName.toLowerCase() ||
      path.basename(file, '.mdx').toLowerCase() === fileName.toLowerCase()
    );

    if (!targetFile) {
      console.log(`❌ 파일을 찾을 수 없습니다: ${fileName}`);
      return;
    }

    // kebab-case 파일명으로 변환
    const kebabFileName = this.generateOutputFileName(targetFile);
    const outputPath = path.join(this.outputDir, kebabFileName);
    
    console.log(`📝 변환: ${path.basename(targetFile)} → ${kebabFileName}`);
    
    return this.convertSingleFile(targetFile, outputPath);
  }

  // 디렉토리 구조 스캔 (디버깅용)
  scanDirectory() {
    console.log('🔍 디렉토리 구조 스캔...\n');
    
    const scanRecursive = (dir, depth = 0) => {
      if (!fs.existsSync(dir) || depth > 3) return;
      
      const indent = '  '.repeat(depth);
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          console.log(`${indent}📁 ${item}/`);
          scanRecursive(itemPath, depth + 1);
        } else if (item.endsWith('.mdx')) {
          console.log(`${indent}📄 ${item}`);
        }
      });
    };

    scanRecursive(this.legacyDir);
  }
}

// CLI 실행
if (require.main === module) {
  const [,, action, ...args] = process.argv;
  const converter = new LegacyMdxConverter();

  switch (action) {
    case 'scan':
      converter.scanDirectory();
      break;

    case 'find':
      converter.findLegacyMdxFiles();
      break;

    case 'all':
      converter.convertAllFiles();
      break;

    case 'single':
      const fileName = args[0];
      if (!fileName) {
        console.log('사용법: node convert-legacy-mdx.js single <파일명>');
        console.log('예시: node convert-legacy-mdx.js single tooltip.mdx');
        process.exit(1);
      }
      converter.convertSpecificFile(fileName);
      break;

    case 'test':
      // 테스트용: 첫 번째 파일만 변환
      const files = converter.findLegacyMdxFiles();
      if (files.length > 0) {
        const testFile = files[0];
        const kebabFileName = converter.generateOutputFileName(testFile);
        const outputPath = path.join(converter.outputDir, 'test-' + kebabFileName);
        converter.convertSingleFile(testFile, outputPath);
      }
      break;

    default:
      console.log('📖 레거시 MDX 변환 도구');
      console.log();
      console.log('사용법:');
      console.log('  node convert-legacy-mdx.js scan     # 디렉토리 구조 스캔');
      console.log('  node convert-legacy-mdx.js find     # MDX 파일 찾기');
      console.log('  node convert-legacy-mdx.js all      # 모든 파일 변환');
      console.log('  node convert-legacy-mdx.js single <파일명>  # 특정 파일만 변환');
      console.log('  node convert-legacy-mdx.js test     # 테스트 변환');
      console.log();
      console.log('예시:');
      console.log('  node convert-legacy-mdx.js find');
      console.log('  node convert-legacy-mdx.js single tooltip.mdx');
      console.log('  node convert-legacy-mdx.js all');
      break;
  }
}

module.exports = { LegacyMdxConverter };