// src/scripts/convert-components-to-mdx.js
const fs = require('fs');
const path = require('path');

class JsonToMdxConverter {
  constructor(jsonFilePath, outputDir = 'src/content/components') {
    this.jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    this.outputDir = outputDir;
  }

  // 컴포넌트 이름을 kebab-case로 변환
  toKebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  // 마크다운 특수 문자 이스케이프
  escapeMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/`/g, '\\`')
      .replace(/~/g, '\\~')
      .replace(/>/g, '\\>')
      .replace(/#/g, '\\#')
      .replace(/\|/g, '\\|');
  }

  // URL 안전성 처리
  escapeUrl(url) {
    if (!url) return '';
    // URL에 공백이나 특수 문자가 있으면 인코딩
    return encodeURI(url);
  }

  // 안전한 텍스트 처리
  safeText(text) {
    if (!text) return '';
    // 기본적인 HTML 이스케이프
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // 프론트매터 생성
  generateFrontmatter() {
    const title = this.jsonData.page_name.replace('Component - ', '');
    const description = this.extractDescription();
    
    return `---
title: "${this.safeText(title)}"
description: "${this.safeText(description)}"
status: "draft"
version: "1.0.0"
category: "component"
tags: ["ui", "component"]
platforms: ["web", "ios", "android"]
updated: "${new Date().toISOString().split('T')[0]}"
---

`;
  }

  // Description 추출
  extractDescription() {
    const coverComponent = this.jsonData.components.find(
      comp => comp.type === 'component_cover'
    );
    return coverComponent?.contents?.description || '컴포넌트 설명';
  }

  // 이미지 컴포넌트 변환
  convertImage(imageComponent) {
    const { image } = imageComponent.contents;
    const webImage = image.web || image.mobile;
    
    // 이미지 설명에서 특수 문자 이스케이프
    const safeDescription = this.escapeMarkdown(image.description || 'Image');
    const safeUrl = this.escapeUrl(webImage.image_url);
    
    return `<img src="${safeUrl}" alt="${safeDescription}" />

`;
  }

  // 텍스트 컴포넌트 변환
  convertText(textComponent) {
    const { text } = textComponent.contents;
    const safeText = text || '';
    
    switch (textComponent.type) {
      case 'text_title_h3':
        return `## ${safeText}

`;
      case 'text_title_h4':
        return `### ${safeText}

`;
      case 'text_body':
        return `${safeText}

`;
      default:
        return `${safeText}

`;
    }
  }

  // Do/Don't 이미지 변환
  convertDoDontImage(component) {
    const { do_image, dont_image } = component.contents;
    
    const doImageUrl = this.escapeUrl(do_image.web?.image_url || do_image.mobile?.image_url || '');
    const dontImageUrl = this.escapeUrl(dont_image.web?.image_url || dont_image.mobile?.image_url || '');
    
    const doDescription = this.safeText(do_image.description || 'Do example');
    const dontDescription = this.safeText(dont_image.description || 'Don\'t example');
    
    return `### ✅ Do

<img src="${doImageUrl}" alt="${doDescription}" />

### ❌ Don't

<img src="${dontImageUrl}" alt="${dontDescription}" />

`;
  }

  // 테이블 변환
  convertTable(tableComponent) {
    const { head, body } = tableComponent.contents;
    
    if (!head || !body || !Array.isArray(head) || !Array.isArray(body)) {
      return '<!-- 테이블 데이터가 올바르지 않습니다 -->\n\n';
    }
    
    // 테이블 헤더
    let markdown = '| ' + head.map(h => this.safeText(h.title || '')).join(' | ') + ' |\n';
    markdown += '| ' + head.map(() => '---').join(' | ') + ' |\n';
    
    // 테이블 바디
    body.forEach(row => {
      if (Array.isArray(row)) {
        markdown += '| ' + row.map(cell => this.safeText(cell.content || '')).join(' | ') + ' |\n';
      }
    });
    
    return markdown + '\n';
  }

  // 불릿 리스트 변환
  convertBulletList(listComponent) {
    const { list_items, bullet_style } = listComponent.contents;
    
    if (!Array.isArray(list_items)) {
      return '<!-- 리스트 데이터가 올바르지 않습니다 -->\n\n';
    }
    
    let markdown = '';
    list_items.forEach((item, index) => {
      const prefix = bullet_style === 'alphabet' 
        ? `${String.fromCharCode(97 + index)}. ` 
        : `${index + 1}. `;
      markdown += `${prefix}${this.safeText(item)}\n`;
    });
    
    return markdown + '\n';
  }

  // 개별 컴포넌트 변환
  convertComponent(component) {
    switch (component.type) {
      case 'text_title_h3':
      case 'text_title_h4':
      case 'text_body':
        return this.convertText(component);
      
      case 'image':
        return this.convertImage(component);
      
      case 'do_dont_image':
        return this.convertDoDontImage(component);
      
      case 'component_table_plain':
        return this.convertTable(component);
      
      case 'bullet_list':
        return this.convertBulletList(component);
      
      case 'spacing':
        return '\n'; // 스페이싱은 간단한 줄바꿈으로
      
      default:
        return `<!-- ${component.type} 컴포넌트는 수동 변환 필요 -->\n\n`;
    }
  }

  // 피드 컴포넌트들을 탭별로 변환
  convertFeedComponents() {
    let markdown = '';
    
    if (!this.jsonData.feed_components || typeof this.jsonData.feed_components !== 'object') {
      return '<!-- 피드 컴포넌트 데이터가 올바르지 않습니다 -->\n\n';
    }
    
    Object.entries(this.jsonData.feed_components).forEach(([tabId, components]) => {
      // 탭 제목
      const tabTitles = {
        usage: '## 사용법',
        preview: '## 미리보기', 
        style_variant: '## 스타일 가이드',
        states: '## 상태'
      };
      
      markdown += `${tabTitles[tabId] || `## ${tabId}`}\n\n`;
      
      // 각 컴포넌트 변환
      if (Array.isArray(components)) {
        components.forEach(component => {
          try {
            markdown += this.convertComponent(component);
          } catch (error) {
            console.warn(`컴포넌트 변환 중 오류: ${error.message}`);
            markdown += `<!-- 컴포넌트 변환 오류: ${component.type} -->\n\n`;
          }
        });
      }
    });
    
    return markdown;
  }

  // 메인 변환 함수
  convert() {
    let mdxContent = '';
    
    // 프론트매터 추가
    mdxContent += this.generateFrontmatter();
    
    // 컴포넌트 제목
    const title = this.jsonData.page_name.replace('Component - ', '');
    mdxContent += `# ${title}\n\n`;
    
    // 컴포넌트 설명
    const description = this.extractDescription();
    if (description && description !== '컴포넌트 설명') {
      mdxContent += `${description}\n\n`;
    }
    
    // 피드 컴포넌트들 변환
    if (this.jsonData.feed_components) {
      mdxContent += this.convertFeedComponents();
    } else {
      mdxContent += '<!-- 피드 컴포넌트 데이터가 없습니다 -->\n\n';
    }
    
    return mdxContent;
  }

  // 파일로 저장
  saveToFile() {
    const title = this.jsonData.page_name.replace('Component - ', '');
    const fileName = this.toKebabCase(title) + '.mdx';
    const filePath = path.join(this.outputDir, fileName);
    
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    const mdxContent = this.convert();
    fs.writeFileSync(filePath, mdxContent, 'utf8');
    
    console.log(`✅ MDX 파일이 생성되었습니다: ${filePath}`);
    return filePath;
  }
}

// 일괄 변환 클래스
class BatchConverter {
  constructor(sourceDir, outputDir) {
    this.sourceDir = sourceDir; // /Users/minhee/Desktop/ruler-static-contents-main/pages/component
    this.outputDir = outputDir; // /Users/minhee/Documents/29cm/ruler-design/src/content/components
  }

  // 모든 컴포넌트 폴더 찾기
  findComponentDirectories() {
    if (!fs.existsSync(this.sourceDir)) {
      throw new Error(`소스 디렉토리가 존재하지 않습니다: ${this.sourceDir}`);
    }

    const componentDirs = [];
    const items = fs.readdirSync(this.sourceDir);

    items.forEach(item => {
      const itemPath = path.join(this.sourceDir, item);
      const contentsJsonPath = path.join(itemPath, 'contents.json');

      // 디렉토리이고 contents.json이 있는 경우만
      if (fs.statSync(itemPath).isDirectory() && fs.existsSync(contentsJsonPath)) {
        componentDirs.push({
          name: item,
          contentsJsonPath: contentsJsonPath
        });
      }
    });

    return componentDirs;
  }

  // 단일 컴포넌트 변환
  convertSingleComponent(componentDir) {
    try {
      console.log(`🔄 변환 중: ${componentDir.name}`);
      const converter = new JsonToMdxConverter(componentDir.contentsJsonPath, this.outputDir);
      const outputPath = converter.saveToFile();
      return { success: true, component: componentDir.name, outputPath };
    } catch (error) {
      console.error(`❌ ${componentDir.name} 변환 실패:`, error.message);
      return { success: false, component: componentDir.name, error: error.message };
    }
  }

  // 모든 컴포넌트 일괄 변환
  convertAll() {
    console.log(`📂 소스 디렉토리: ${this.sourceDir}`);
    console.log(`📁 출력 디렉토리: ${this.outputDir}`);
    console.log();

    const componentDirs = this.findComponentDirectories();
    console.log(`📋 발견된 컴포넌트: ${componentDirs.length}개`);
    console.log();

    const results = [];

    componentDirs.forEach((componentDir, index) => {
      console.log(`[${index + 1}/${componentDirs.length}]`);
      const result = this.convertSingleComponent(componentDir);
      results.push(result);
    });

    // 결과 요약
    console.log();
    console.log('🎉 변환 완료!');
    console.log(`✅ 성공: ${results.filter(r => r.success).length}개`);
    console.log(`❌ 실패: ${results.filter(r => !r.success).length}개`);

    // 실패한 컴포넌트 목록
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.log();
      console.log('❌ 실패한 컴포넌트:');
      failures.forEach(failure => {
        console.log(`  - ${failure.component}: ${failure.error}`);
      });
    }

    return results;
  }
}

// 단일 파일 변환 함수
function convertSingleFile(jsonFilePath, outputDir = 'src/content/components') {
  try {
    console.log(`🔄 단일 파일 변환: ${jsonFilePath}`);
    const converter = new JsonToMdxConverter(jsonFilePath, outputDir);
    return converter.saveToFile();
  } catch (error) {
    console.error('❌ 변환 중 오류 발생:', error);
    return null;
  }
}

// CLI 실행 부분
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'single':
      // 단일 파일 변환: node convert-components-to-mdx.js single <json파일경로> [출력디렉토리]
      const jsonFile = args[0];
      const outputDir = args[1] || 'src/content/components';
      
      if (!jsonFile) {
        console.log('사용법: node convert-components-to-mdx.js single <json파일경로> [출력디렉토리]');
        console.log('예시: node convert-components-to-mdx.js single /path/to/contents.json src/content/components');
        process.exit(1);
      }
      
      convertSingleFile(jsonFile, outputDir);
      break;

    case 'batch':
      // 일괄 변환: node convert-components-to-mdx.js batch <소스디렉토리> [출력디렉토리]
      const sourceDir = args[0];
      const batchOutputDir = args[1] || 'src/content/components';
      
      if (!sourceDir) {
        console.log('사용법: node convert-components-to-mdx.js batch <소스디렉토리> [출력디렉토리]');
        console.log('예시: node convert-components-to-mdx.js batch /Users/minhee/Desktop/ruler-static-contents-main/pages/component src/content/components');
        process.exit(1);
      }
      
      const batchConverter = new BatchConverter(sourceDir, batchOutputDir);
      batchConverter.convertAll();
      break;

    case 'alert-dialog':
      // 특정 alert-dialog 변환
      const alertDialogPath = '/Users/minhee/Desktop/ruler-static-contents-main/pages/component/alert-dialog/contents.json';
      const rulerOutputDir = '/Users/minhee/Documents/29cm/ruler-design/src/content/components';
      
      console.log('🔄 Alert Dialog 컴포넌트 변환 시작...');
      convertSingleFile(alertDialogPath, rulerOutputDir);
      break;

    default:
      console.log('📖 JSON to MDX 변환기');
      console.log();
      console.log('사용법:');
      console.log('  node convert-components-to-mdx.js single <json파일경로> [출력디렉토리]');
      console.log('  node convert-components-to-mdx.js batch <소스디렉토리> [출력디렉토리]');
      console.log('  node convert-components-to-mdx.js alert-dialog');
      console.log();
      console.log('예시:');
      console.log('  # 단일 파일 변환');
      console.log('  node convert-components-to-mdx.js single /path/to/contents.json');
      console.log();
      console.log('  # 모든 컴포넌트 일괄 변환');
      console.log('  node convert-components-to-mdx.js batch /Users/minhee/Desktop/ruler-static-contents-main/pages/component');
      console.log();
      console.log('  # Alert Dialog만 변환');
      console.log('  node convert-components-to-mdx.js alert-dialog');
      break;
  }
}

module.exports = { JsonToMdxConverter, BatchConverter, convertSingleFile };