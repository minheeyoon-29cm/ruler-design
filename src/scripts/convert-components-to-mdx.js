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

  // 마크다운 특수 문자 이스케이프 (HTML 태그 처리 포함)
  escapeMarkdown(text) {
    if (!text) return '';
    return text
      // HTML 태그 정리
      .replace(/<br\s*\/?>/gi, '\n\n')  // <br>, </br>, <br/> → 줄바꿈
      .replace(/<\/br>/gi, '\n\n')      // </br> → 줄바꿈
      .replace(/<p\s*>/gi, '\n\n')      // <p> → 줄바꿈
      .replace(/<\/p>/gi, '\n\n')       // </p> → 줄바꿈
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')  // <strong> → **bold**
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')            // <b> → **bold**
      .replace(/<em>(.*?)<\/em>/gi, '_$1_')            // <em> → _italic_
      .replace(/<i>(.*?)<\/i>/gi, '_$1_')              // <i> → _italic_
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')        // <code> → `code`
      // 기타 HTML 태그 제거
      .replace(/<[^>]*>/g, '')
      // 마크다운 특수 문자 이스케이프
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
      .replace(/\|/g, '\\|')
      // 연속된 줄바꿈 정리
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // URL 안전성 처리
  escapeUrl(url) {
    if (!url) return '';
    return encodeURI(url);
  }

  // 안전한 텍스트 처리 (프론트매터용)
  safeText(text) {
    if (!text) return '';
    return text
      // HTML 태그 정리 (escapeMarkdown과 동일)
      .replace(/<br\s*\/?>/gi, ' ')     // <br> → 공백
      .replace(/<\/br>/gi, ' ')         // </br> → 공백
      .replace(/<p\s*>/gi, ' ')         // <p> → 공백
      .replace(/<\/p>/gi, ' ')          // </p> → 공백
      .replace(/<strong>(.*?)<\/strong>/gi, '$1')  // <strong> 태그 제거
      .replace(/<b>(.*?)<\/b>/gi, '$1')            // <b> 태그 제거
      .replace(/<em>(.*?)<\/em>/gi, '$1')          // <em> 태그 제거
      .replace(/<i>(.*?)<\/i>/gi, '$1')            // <i> 태그 제거
      .replace(/<code>(.*?)<\/code>/gi, '$1')      // <code> 태그 제거
      .replace(/<[^>]*>/g, '')                     // 기타 HTML 태그 제거
      // YAML용 특수 문자 처리
      .replace(/"/g, '\\"')             // 따옴표 이스케이프
      .replace(/'/g, "\\'")             // 작은따옴표 이스케이프
      .replace(/\n/g, ' ')              // 줄바꿈 → 공백
      .replace(/\r/g, ' ')              // 캐리지 리턴 → 공백
      .replace(/\s+/g, ' ')             // 연속 공백 → 단일 공백
      .trim();
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

  // 이미지 URL을 로컬 경로로 변환 (개선된 버전)
  convertImageUrl(originalUrl, componentName) {
    if (!originalUrl) return '';
    
    // GitHub raw URL인 경우 로컬 경로로 변환
    if (originalUrl.includes('raw.githubusercontent.com')) {
      const urlParts = originalUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // 경로 구조: /images/components/component-name/filename
      return `/images/components/${componentName}/${fileName}`;
    }
    
    // 로컬 파일 시스템 경로인 경우 (file://)
    if (originalUrl.startsWith('file://')) {
      const urlParts = originalUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return `/images/components/${componentName}/${fileName}`;
    }
    
    // 상대 경로인 경우
    if (originalUrl.startsWith('./') || originalUrl.startsWith('../')) {
      const fileName = path.basename(originalUrl);
      return `/images/components/${componentName}/${fileName}`;
    }
    
    return originalUrl;
  }

  // 이미지 컴포넌트 변환
  convertImage(imageComponent) {
    const { image } = imageComponent.contents;
    const webImage = image.web || image.mobile;
    
    const componentName = this.extractComponentName();
    const safeDescription = this.escapeMarkdown(image.description || 'Image');
    const localImageUrl = this.convertImageUrl(webImage.image_url, componentName);
    
    return `![${safeDescription}](${localImageUrl})

`;
  }

  // 컴포넌트 이름 추출
  extractComponentName() {
    const title = this.jsonData.page_name.replace('Component - ', '');
    return this.toKebabCase(title);
  }

  // 텍스트 컴포넌트 변환 (HTML 태그 처리 개선)
  convertText(textComponent) {
    const { text } = textComponent.contents;
    
    // HTML 태그를 마크다운으로 변환
    let processedText = (text || '')
      .replace(/<br\s*\/?>/gi, '\n\n')           // <br> → 줄바꿈
      .replace(/<\/br>/gi, '\n\n')               // </br> → 줄바꿈
      .replace(/<p\s*>/gi, '\n\n')               // <p> → 줄바꿈
      .replace(/<\/p>/gi, '\n\n')                // </p> → 줄바꿈
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')  // <strong> → **bold**
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')            // <b> → **bold**
      .replace(/<em>(.*?)<\/em>/gi, '_$1_')            // <em> → _italic_
      .replace(/<i>(.*?)<\/i>/gi, '_$1_')              // <i> → _italic_
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')        // <code> → `code`
      .replace(/<ul>/gi, '')                           // <ul> 제거
      .replace(/<\/ul>/gi, '')                         // </ul> 제거
      .replace(/<li>/gi, '- ')                         // <li> → 리스트 아이템
      .replace(/<\/li>/gi, '\n')                       // </li> → 줄바꿈
      .replace(/<[^>]*>/g, '')                         // 기타 HTML 태그 제거
      .replace(/\n{3,}/g, '\n\n')                      // 연속 줄바꿈 정리
      .trim();
    
    switch (textComponent.type) {
      case 'text_title_h3':
        return `## ${processedText}\n\n`;
      case 'text_title_h4':
        return `### ${processedText}\n\n`;
      case 'text_body':
        return `${processedText}\n\n`;
      default:
        return `${processedText}\n\n`;
    }
  }

  // Do/Don't 이미지 변환
  convertDoDontImage(component) {
    const { do_image, dont_image } = component.contents;
    const componentName = this.extractComponentName();
    
    const doImageUrl = this.convertImageUrl(do_image.web?.image_url || do_image.mobile?.image_url || '', componentName);
    const dontImageUrl = this.convertImageUrl(dont_image.web?.image_url || dont_image.mobile?.image_url || '', componentName);
    
    const doDescription = this.safeText(do_image.description || 'Do example');
    const dontDescription = this.safeText(dont_image.description || 'Don\'t example');
    
    return `### ✅ Do

![${doDescription}](${doImageUrl})

### ❌ Don't

![${dontDescription}](${dontImageUrl})

`;
  }

  // 테이블 변환
  convertTable(tableComponent) {
    const { head, body } = tableComponent.contents;
    
    if (!head || !body || !Array.isArray(head) || !Array.isArray(body)) {
      return '<!-- 테이블 데이터가 올바르지 않습니다 -->\n\n';
    }
    
    let markdown = '| ' + head.map(h => this.safeText(h.title || '')).join(' | ') + ' |\n';
    markdown += '| ' + head.map(() => '---').join(' | ') + ' |\n';
    
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
        return '\n';
      
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
      const tabTitles = {
        usage: '## 사용법',
        preview: '## 미리보기', 
        style_variant: '## 스타일 가이드',
        states: '## 상태'
      };
      
      markdown += `${tabTitles[tabId] || `## ${tabId}`}\n\n`;
      
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
    
    mdxContent += this.generateFrontmatter();
    
    const title = this.jsonData.page_name.replace('Component - ', '');
    mdxContent += `# ${title}\n\n`;
    
    const description = this.extractDescription();
    if (description && description !== '컴포넌트 설명') {
      mdxContent += `${description}\n\n`;
    }
    
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
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    const mdxContent = this.convert();
    fs.writeFileSync(filePath, mdxContent, 'utf8');
    
    console.log(`✅ MDX 파일이 생성되었습니다: ${filePath}`);
    return filePath;
  }
}

// 이미지 복사 클래스 (개선된 버전)
class ImageCopier {
  constructor(sourceDir, outputDir) {
    this.sourceDir = sourceDir;
    this.outputDir = outputDir;
  }

  // 특정 컴포넌트의 이미지만 복사
  copySingleComponentImages(componentName) {
    const componentPath = path.join(this.sourceDir, componentName);
    const resourcesPath = path.join(componentPath, 'resources');
    
    if (!fs.existsSync(resourcesPath)) {
      console.log(`⚠️ ${componentName}에 이미지가 없습니다`);
      return false;
    }

    const targetPath = path.join(this.outputDir, componentName);
    
    try {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // web 폴더가 있으면 우선 복사
      const webPath = path.join(resourcesPath, 'web');
      if (fs.existsSync(webPath)) {
        this.copyDirectoryContents(webPath, targetPath);
      } else {
        // web 폴더가 없으면 전체 resources 복사
        this.copyDirectoryContents(resourcesPath, targetPath);
      }
      
      console.log(`✅ ${componentName} 이미지 복사 완료`);
      return true;
    } catch (error) {
      console.error(`❌ ${componentName} 이미지 복사 실패:`, error.message);
      return false;
    }
  }

  // 모든 이미지 복사
  copyAllImages() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const componentDirs = fs.readdirSync(this.sourceDir);
    let copiedCount = 0;

    componentDirs.forEach(componentName => {
      const componentPath = path.join(this.sourceDir, componentName);
      
      if (fs.statSync(componentPath).isDirectory()) {
        if (this.copySingleComponentImages(componentName)) {
          copiedCount++;
        }
      }
    });

    console.log(`🎉 총 ${copiedCount}개 컴포넌트의 이미지 복사 완료!`);
    return copiedCount;
  }

  // 디렉토리 내용 복사 (개선된 버전)
  copyDirectoryContents(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      const stats = fs.statSync(srcPath);
      
      if (stats.isDirectory()) {
        this.copyDirectoryContents(srcPath, destPath);
      } else {
        // 이미지 파일만 복사 (확장자 체크)
        const ext = path.extname(item).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    });
  }
}

// 통합 변환 클래스 (이미지 복사 + MDX 변환)
class IntegratedConverter {
  constructor(sourceDir, outputDir, imageOutputDir) {
    this.sourceDir = sourceDir;
    this.outputDir = outputDir;
    this.imageOutputDir = imageOutputDir;
  }

  // 이미지 복사와 MDX 변환을 한번에 실행
  convertWithImages() {
    console.log('🚀 통합 변환 시작: 이미지 복사 + MDX 변환');
    console.log();

    // 1. 이미지 복사
    console.log('📸 1단계: 이미지 복사');
    const imageCopier = new ImageCopier(this.sourceDir, this.imageOutputDir);
    const imagesCopied = imageCopier.copyAllImages();
    console.log();

    // 2. MDX 변환
    console.log('📝 2단계: MDX 변환');
    const batchConverter = new BatchConverter(this.sourceDir, this.outputDir);
    const conversionResults = batchConverter.convertAll();
    console.log();

    // 3. 결과 요약
    const successCount = conversionResults.filter(r => r.success).length;
    const failureCount = conversionResults.filter(r => !r.success).length;

    console.log('🎊 통합 변환 완료!');
    console.log(`📸 이미지 복사: ${imagesCopied}개 컴포넌트`);
    console.log(`📝 MDX 변환 성공: ${successCount}개`);
    console.log(`❌ MDX 변환 실패: ${failureCount}개`);

    return {
      imagesCopied,
      mdxSuccess: successCount,
      mdxFailure: failureCount,
      results: conversionResults
    };
  }

  // 특정 컴포넌트만 변환 (이미지 + MDX)
  convertSingleWithImages(componentName) {
    console.log(`🔄 단일 컴포넌트 통합 변환: ${componentName}`);

    const componentJsonPath = path.join(this.sourceDir, componentName, 'contents.json');
    
    if (!fs.existsSync(componentJsonPath)) {
      console.error(`❌ contents.json이 없습니다: ${componentJsonPath}`);
      return false;
    }

    // 1. 이미지 복사
    const imageCopier = new ImageCopier(this.sourceDir, this.imageOutputDir);
    imageCopier.copySingleComponentImages(componentName);

    // 2. MDX 변환
    try {
      const converter = new JsonToMdxConverter(componentJsonPath, this.outputDir);
      converter.saveToFile();
      console.log(`✅ ${componentName} 통합 변환 완료`);
      return true;
    } catch (error) {
      console.error(`❌ ${componentName} MDX 변환 실패:`, error.message);
      return false;
    }
  }
}

class BatchConverter {
  constructor(sourceDir, outputDir) {
    this.sourceDir = sourceDir;
    this.outputDir = outputDir;
  }

  findComponentDirectories() {
    if (!fs.existsSync(this.sourceDir)) {
      throw new Error(`소스 디렉토리가 존재하지 않습니다: ${this.sourceDir}`);
    }

    const componentDirs = [];
    const items = fs.readdirSync(this.sourceDir);

    items.forEach(item => {
      const itemPath = path.join(this.sourceDir, item);
      const contentsJsonPath = path.join(itemPath, 'contents.json');

      if (fs.statSync(itemPath).isDirectory() && fs.existsSync(contentsJsonPath)) {
        componentDirs.push({
          name: item,
          contentsJsonPath: contentsJsonPath
        });
      }
    });

    return componentDirs;
  }

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

    console.log();
    console.log('🎉 변환 완료!');
    console.log(`✅ 성공: ${results.filter(r => r.success).length}개`);
    console.log(`❌ 실패: ${results.filter(r => !r.success).length}개`);

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

// CLI 실행 부분 (확장된 버전)
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'single':
      const jsonFile = args[0];
      const outputDir = args[1] || 'src/content/components';
      
      if (!jsonFile) {
        console.log('사용법: node convert-components-to-mdx.js single <json파일경로> [출력디렉토리]');
        process.exit(1);
      }
      
      convertSingleFile(jsonFile, outputDir);
      break;

    case 'batch':
      const sourceDir = args[0];
      const batchOutputDir = args[1] || 'src/content/components';
      
      if (!sourceDir) {
        console.log('사용법: node convert-components-to-mdx.js batch <소스디렉토리> [출력디렉토리]');
        process.exit(1);
      }
      
      const batchConverter = new BatchConverter(sourceDir, batchOutputDir);
      batchConverter.convertAll();
      break;

    case 'copy-images':
      // 이미지만 복사
      const imgSourceDir = args[0];
      const imgOutputDir = args[1] || 'public/images/components';
      
      if (!imgSourceDir) {
        console.log('사용법: node convert-components-to-mdx.js copy-images <소스디렉토리> [이미지출력디렉토리]');
        console.log('예시: node convert-components-to-mdx.js copy-images /path/to/ruler-static-contents/pages/component public/images/components');
        process.exit(1);
      }
      
      const imageCopier = new ImageCopier(imgSourceDir, imgOutputDir);
      imageCopier.copyAllImages();
      break;

    case 'integrated':
      // 이미지 복사 + MDX 변환 통합
      const intSourceDir = args[0];
      const intMdxOutputDir = args[1] || 'src/content/components';
      const intImageOutputDir = args[2] || 'public/images/components';
      
      if (!intSourceDir) {
        console.log('사용법: node convert-components-to-mdx.js integrated <소스디렉토리> [MDX출력디렉토리] [이미지출력디렉토리]');
        console.log('예시: node convert-components-to-mdx.js integrated /path/to/ruler-static-contents/pages/component src/content/components public/images/components');
        process.exit(1);
      }
      
      const integratedConverter = new IntegratedConverter(intSourceDir, intMdxOutputDir, intImageOutputDir);
      integratedConverter.convertWithImages();
      break;

    case 'single-integrated':
      // 특정 컴포넌트만 통합 변환
      const singleSourceDir = args[0];
      const componentName = args[1];
      const singleMdxOutputDir = args[2] || 'src/content/components';
      const singleImageOutputDir = args[3] || 'public/images/components';
      
      if (!singleSourceDir || !componentName) {
        console.log('사용법: node convert-components-to-mdx.js single-integrated <소스디렉토리> <컴포넌트명> [MDX출력디렉토리] [이미지출력디렉토리]');
        console.log('예시: node convert-components-to-mdx.js single-integrated /path/to/ruler-static-contents/pages/component alert-dialog');
        process.exit(1);
      }
      
      const singleIntegratedConverter = new IntegratedConverter(singleSourceDir, singleMdxOutputDir, singleImageOutputDir);
      singleIntegratedConverter.convertSingleWithImages(componentName);
      break;

    case 'alert-dialog':
      // 빠른 테스트용
      const alertDialogPath = '/Users/minhee/Desktop/ruler-static-contents-main/pages/component/alert-dialog/contents.json';
      const rulerOutputDir = '/Users/minhee/Documents/29cm/ruler-design/src/content/components';
      const rulerImageDir = '/Users/minhee/Documents/29cm/ruler-design/public/images/components';
      
      console.log('🔄 Alert Dialog 컴포넌트 통합 변환 시작...');
      
      // 이미지 복사
      const testImageCopier = new ImageCopier('/Users/minhee/Desktop/ruler-static-contents-main/pages/component', rulerImageDir);
      testImageCopier.copySingleComponentImages('alert-dialog');
      
      // MDX 변환
      convertSingleFile(alertDialogPath, rulerOutputDir);
      break;

    default:
      console.log('📖 JSON to MDX 변환기 (이미지 복사 포함)');
      console.log();
      console.log('사용법:');
      console.log('  node convert-components-to-mdx.js single <json파일경로> [출력디렉토리]');
      console.log('  node convert-components-to-mdx.js batch <소스디렉토리> [출력디렉토리]');
      console.log('  node convert-components-to-mdx.js copy-images <소스디렉토리> [이미지출력디렉토리]');
      console.log('  node convert-components-to-mdx.js integrated <소스디렉토리> [MDX출력] [이미지출력]');
      console.log('  node convert-components-to-mdx.js single-integrated <소스디렉토리> <컴포넌트명> [MDX출력] [이미지출력]');
      console.log('  node convert-components-to-mdx.js alert-dialog');
      console.log();
      console.log('예시:');
      console.log('  # 이미지만 복사');
      console.log('  node convert-components-to-mdx.js copy-images /Users/minhee/Desktop/ruler-static-contents-main/pages/component');
      console.log();
      console.log('  # 이미지 복사 + MDX 변환 통합');
      console.log('  node convert-components-to-mdx.js integrated /Users/minhee/Desktop/ruler-static-contents-main/pages/component');
      console.log();
      console.log('  # 특정 컴포넌트만 통합 변환');
      console.log('  node convert-components-to-mdx.js single-integrated /path/to/source button');
      break;
  }
}

module.exports = { JsonToMdxConverter, BatchConverter, ImageCopier, IntegratedConverter, convertSingleFile };