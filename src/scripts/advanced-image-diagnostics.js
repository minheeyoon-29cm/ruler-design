// src/scripts/advanced-image-diagnostics.js
const fs = require('fs');
const path = require('path');

class ImageDiagnostics {
  constructor() {
    this.contentDir = path.join(process.cwd(), 'src/content/components');
    this.publicDir = path.join(process.cwd(), 'public');
    this.imagesDir = path.join(this.publicDir, 'images/components');
  }

  // 실제 존재하는 이미지 파일들 스캔
  scanActualImages() {
    console.log('🔍 실제 이미지 파일 스캔 중...\n');
    const actualImages = {};

    if (!fs.existsSync(this.imagesDir)) {
      console.log('❌ images/components 폴더가 존재하지 않습니다.');
      return actualImages;
    }

    const components = fs.readdirSync(this.imagesDir);
    
    components.forEach(component => {
      const componentDir = path.join(this.imagesDir, component);
      if (!fs.statSync(componentDir).isDirectory()) return;

      actualImages[component] = {};
      console.log(`📁 ${component}/`);

      // 하위 폴더 스캔
      const subfolders = fs.readdirSync(componentDir);
      subfolders.forEach(subfolder => {
        const subfolderPath = path.join(componentDir, subfolder);
        if (!fs.statSync(subfolderPath).isDirectory()) return;

        const images = fs.readdirSync(subfolderPath)
          .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file));
        
        if (images.length > 0) {
          actualImages[component][subfolder] = images;
          console.log(`  📂 ${subfolder}/ (${images.length}개)`);
          images.forEach(img => console.log(`    📸 ${img}`));
        }
      });
      console.log('');
    });

    return actualImages;
  }

  // MDX에서 참조하는 이미지들 스캔
  scanMdxImages() {
    console.log('📝 MDX 파일에서 참조하는 이미지 스캔 중...\n');
    const mdxImages = {};

    const mdxFiles = fs.readdirSync(this.contentDir).filter(file => file.endsWith('.mdx'));
    
    mdxFiles.forEach(file => {
      const filePath = path.join(this.contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(file, '.mdx');

      mdxImages[componentName] = [];

      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;

      while ((match = imageRegex.exec(content)) !== null) {
        const [fullMatch, altText, imagePath] = match;
        mdxImages[componentName].push({
          altText,
          imagePath,
          fullMatch
        });
      }

      if (mdxImages[componentName].length > 0) {
        console.log(`📄 ${file} (${mdxImages[componentName].length}개 이미지)`);
        mdxImages[componentName].forEach(img => {
          console.log(`  🖼️  ${img.imagePath}`);
        });
        console.log('');
      }
    });

    return mdxImages;
  }

  // 매칭 분석 및 누락 이미지 찾기
  findMissingImages() {
    const actualImages = this.scanActualImages();
    const mdxImages = this.scanMdxImages();

    console.log('🔎 매칭 분석 중...\n');

    const missingImages = [];
    const foundImages = [];

    Object.keys(mdxImages).forEach(component => {
      mdxImages[component].forEach(img => {
        const imagePath = img.imagePath;
        let found = false;

        // /images/components/component/filename 형태 확인
        if (imagePath.startsWith('/images/components/')) {
          const pathParts = imagePath.split('/');
          if (pathParts.length >= 5) {
            const comp = pathParts[3];
            const filename = pathParts[pathParts.length - 1];
            
            // 하위 폴더까지 포함된 경우
            if (pathParts.length === 6) {
              const subfolder = pathParts[4];
              if (actualImages[comp] && actualImages[comp][subfolder] && 
                  actualImages[comp][subfolder].includes(filename)) {
                found = true;
              }
            } else {
              // 하위 폴더 없이 직접 참조하는 경우 - 모든 하위폴더에서 찾기
              if (actualImages[comp]) {
                Object.keys(actualImages[comp]).forEach(subfolder => {
                  if (actualImages[comp][subfolder].includes(filename)) {
                    found = true;
                  }
                });
              }
            }
          }
        }

        if (found) {
          foundImages.push({
            component,
            ...img
          });
        } else {
          missingImages.push({
            component,
            ...img
          });
        }
      });
    });

    console.log(`📊 결과 요약:`);
    console.log(`  ✅ 찾은 이미지: ${foundImages.length}개`);
    console.log(`  ❌ 누락된 이미지: ${missingImages.length}개\n`);

    if (missingImages.length > 0) {
      console.log('❌ 누락된 이미지 상세:');
      missingImages.forEach((img, index) => {
        console.log(`  ${index + 1}. ${img.component}: ${img.imagePath}`);
        console.log(`     Alt: "${img.altText}"`);
        
        // 비슷한 이름의 파일 찾기 제안
        const filename = path.basename(img.imagePath);
        const suggestions = this.findSimilarImages(actualImages, filename);
        if (suggestions.length > 0) {
          console.log(`     💡 비슷한 파일: ${suggestions.join(', ')}`);
        }
        console.log('');
      });
    }

    return { foundImages, missingImages, actualImages };
  }

  // 비슷한 이름의 이미지 파일 찾기
  findSimilarImages(actualImages, targetFilename) {
    const suggestions = [];
    const targetBase = path.basename(targetFilename, path.extname(targetFilename)).toLowerCase();

    Object.keys(actualImages).forEach(component => {
      Object.keys(actualImages[component]).forEach(subfolder => {
        actualImages[component][subfolder].forEach(filename => {
          const fileBase = path.basename(filename, path.extname(filename)).toLowerCase();
          
          // 유사도 체크 (간단한 포함 관계)
          if (fileBase.includes(targetBase) || targetBase.includes(fileBase)) {
            suggestions.push(`${component}/${subfolder}/${filename}`);
          }
        });
      });
    });

    return suggestions;
  }

  // 자동 수정 제안
  generateAutoFix() {
    const { missingImages, actualImages } = this.findMissingImages();
    
    if (missingImages.length === 0) {
      console.log('🎉 누락된 이미지가 없습니다!');
      return;
    }

    console.log('🔧 자동 수정 제안을 생성합니다...\n');

    const fixes = [];
    
    missingImages.forEach(img => {
      const filename = path.basename(img.imagePath);
      const component = img.component;

      // 해당 컴포넌트의 실제 이미지들에서 일치하는 파일 찾기
      if (actualImages[component]) {
        Object.keys(actualImages[component]).forEach(subfolder => {
          if (actualImages[component][subfolder].includes(filename)) {
            const correctPath = `/images/components/${component}/${subfolder}/${filename}`;
            fixes.push({
              component: img.component,
              oldPath: img.imagePath,
              newPath: correctPath,
              altText: img.altText
            });
          }
        });
      }
    });

    if (fixes.length > 0) {
      console.log(`💡 ${fixes.length}개의 자동 수정 가능한 경로를 찾았습니다:`);
      fixes.forEach((fix, index) => {
        console.log(`  ${index + 1}. ${fix.component}`);
        console.log(`     이전: ${fix.oldPath}`);
        console.log(`     수정: ${fix.newPath}`);
      });

      // 자동 수정 실행 여부 묻기
      console.log('\n자동 수정을 실행하시겠습니까? (y/n)');
      
      return fixes;
    } else {
      console.log('❌ 자동 수정할 수 있는 이미지를 찾지 못했습니다.');
      console.log('원본 소스에서 이미지를 다시 복사해야 할 수 있습니다.');
    }
  }
}

// 명령줄 인터페이스
const command = process.argv[2];
const diagnostics = new ImageDiagnostics();

switch (command) {
  case 'scan':
    diagnostics.scanActualImages();
    break;
  case 'mdx':
    diagnostics.scanMdxImages();
    break;
  case 'missing':
    diagnostics.findMissingImages();
    break;
  case 'fix':
    diagnostics.generateAutoFix();
    break;
  default:
    console.log('고급 이미지 진단 도구');
    console.log('사용법:');
    console.log('  node src/scripts/advanced-image-diagnostics.js scan     # 실제 이미지 파일 스캔');
    console.log('  node src/scripts/advanced-image-diagnostics.js mdx      # MDX에서 참조하는 이미지 스캔');
    console.log('  node src/scripts/advanced-image-diagnostics.js missing  # 누락된 이미지 찾기');
    console.log('  node src/scripts/advanced-image-diagnostics.js fix      # 자동 수정 제안');
}