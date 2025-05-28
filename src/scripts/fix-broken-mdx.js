// src/scripts/fix-broken-mdx.js
const fs = require('fs');
const path = require('path');

class MdxFixer {
  constructor(contentDir = 'src/content/components') {
    this.contentDir = contentDir;
  }

  // HTML 태그를 마크다운으로 변환
  fixHtmlTags(content) {
    return content
      // 문제가 되는 </br> 태그들 수정
      .replace(/<\/br>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n\n')
      .replace(/<p\s*>/gi, '\n\n')
      .replace(/<\/p>/gi, '\n\n')
      // HTML 태그를 마크다운으로 변환
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '_$1_')
      .replace(/<i>(.*?)<\/i>/gi, '_$1_')
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')
      .replace(/<ul>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<li>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      // 기타 HTML 태그 제거
      .replace(/<[^>]*>/g, '')
      // 연속된 줄바꿈 정리
      .replace(/\n{3,}/g, '\n\n')
      // 앞뒤 공백 정리
      .trim();
  }

  // 프론트매터 수정
  fixFrontmatter(content) {
    const frontmatterRegex = /^---([\s\S]*?)---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return content;
    
    let frontmatter = match[1];
    const restContent = content.replace(frontmatterRegex, '').trim();
    
    // 따옴표 문제 수정
    frontmatter = frontmatter
      .replace(/description:\s*"([^"]*?)$/gm, (match, desc) => {
        // 닫히지 않은 따옴표 수정
        return `description: "${desc.replace(/"/g, '\\"')}"`;
      })
      .replace(/title:\s*"([^"]*?)$/gm, (match, title) => {
        // 닫히지 않은 따옴표 수정
        return `title: "${title.replace(/"/g, '\\"')}"`;
      });
    
    return `---${frontmatter}---\n\n${restContent}`;
  }

  // 단일 파일 수정
  fixSingleFile(filePath) {
    try {
      console.log(`🔧 수정 중: ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 프론트매터 수정
      content = this.fixFrontmatter(content);
      
      // HTML 태그 수정
      content = this.fixHtmlTags(content);
      
      // 파일 저장
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`✅ 수정 완료: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ 수정 실패: ${filePath}`, error.message);
      return false;
    }
  }

  // 모든 MDX 파일 수정
  fixAllFiles() {
    if (!fs.existsSync(this.contentDir)) {
      console.error(`❌ 디렉토리가 존재하지 않습니다: ${this.contentDir}`);
      return;
    }

    const files = fs.readdirSync(this.contentDir)
      .filter(file => file.endsWith('.mdx'))
      .map(file => path.join(this.contentDir, file));

    console.log(`📋 총 ${files.length}개 MDX 파일 발견`);
    console.log();

    let fixedCount = 0;
    files.forEach((file, index) => {
      console.log(`[${index + 1}/${files.length}]`);
      if (this.fixSingleFile(file)) {
        fixedCount++;
      }
    });

    console.log();
    console.log(`🎉 수정 완료: ${fixedCount}/${files.length}개 파일`);
  }

  // 특정 파일들만 수정
  fixSpecificFiles(fileNames) {
    const fixedFiles = [];
    
    fileNames.forEach(fileName => {
      const filePath = path.join(this.contentDir, fileName.endsWith('.mdx') ? fileName : `${fileName}.mdx`);
      
      if (fs.existsSync(filePath)) {
        if (this.fixSingleFile(filePath)) {
          fixedFiles.push(fileName);
        }
      } else {
        console.log(`⚠️ 파일을 찾을 수 없습니다: ${filePath}`);
      }
    });

    return fixedFiles;
  }
}

// CLI 실행
if (require.main === module) {
  const [,, action, ...args] = process.argv;
  const fixer = new MdxFixer();

  switch (action) {
    case 'all':
      console.log('🔧 모든 MDX 파일 수정 시작...');
      fixer.fixAllFiles();
      break;

    case 'specific':
      if (args.length === 0) {
        console.log('사용법: node fix-broken-mdx.js specific <파일명1> [파일명2] [파일명3]...');
        console.log('예시: node fix-broken-mdx.js specific brand-card button tag');
        process.exit(1);
      }
      
      console.log(`🔧 특정 파일들 수정: ${args.join(', ')}`);
      const fixed = fixer.fixSpecificFiles(args);
      console.log(`✅ 수정 완료: ${fixed.length}개 파일`);
      break;

    case 'broken':
      // 알려진 깨진 파일들만 수정
      const brokenFiles = ['brand-card', 'button', 'tag'];
      console.log(`🔧 깨진 파일들 수정: ${brokenFiles.join(', ')}`);
      const fixedBroken = fixer.fixSpecificFiles(brokenFiles);
      console.log(`✅ 수정 완료: ${fixedBroken.length}개 파일`);
      break;

    default:
      console.log('📖 MDX 파일 수정 도구');
      console.log();
      console.log('사용법:');
      console.log('  node fix-broken-mdx.js all                    # 모든 MDX 파일 수정');
      console.log('  node fix-broken-mdx.js specific <파일명들>     # 특정 파일들만 수정');
      console.log('  node fix-broken-mdx.js broken                 # 알려진 깨진 파일들만 수정');
      console.log();
      console.log('예시:');
      console.log('  node fix-broken-mdx.js broken');
      console.log('  node fix-broken-mdx.js specific brand-card button tag');
      break;
  }
}

module.exports = { MdxFixer };