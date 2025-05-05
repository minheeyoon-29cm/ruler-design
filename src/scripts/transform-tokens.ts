// src/scripts/transform-tokens.ts
const fs = require('fs');
const path = require('path');

// 기본 경로 설정
const rulerTokensDir = path.join(process.cwd(), 'src/ruler-tokens');
const outputDir = path.join(process.cwd(), 'src/tokens');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(path.join(outputDir, 'processed'))) {
  fs.mkdirSync(path.join(outputDir, 'processed'), { recursive: true });
}

// 색상을 hexadecimal에서 rgba로 변환하는 함수
function hexToRgba(hex, alpha = 1) {
  // HEX 값에서 # 기호 제거
  hex = hex.replace('#', '');
  
  // RGB 값 추출
  let r, g, b;
  if (hex.length === 3) {
    // 3자리 HEX 색상인 경우 (예: #FFF)
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    // 6자리 HEX 색상인 경우 (예: #FFFFFF)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // rgba 문자열 반환
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 참조 변수 처리 함수 (예: "{scale.gray-900}" -> "#f4f4f4")
function resolveReference(value, lightColors, darkColors, staticColors) {
  if (!value || typeof value !== 'string') return value;
  
  // 참조 문법 체크 (예: "{scale.gray-900}")
  const referenceMatch = value.match(/^\{(.*)\}$/);
  if (!referenceMatch) return value;
  
  const reference = referenceMatch[1];
  const parts = reference.split('.');
  
  // 첫 번째 부분이 'scale'인 경우
  if (parts[0] === 'scale') {
    const colorKey = parts[1];
    // light 색상 우선 체크
    if (lightColors && lightColors.scale && lightColors.scale[colorKey]) {
      return lightColors.scale[colorKey].value;
    }
    // dark 색상 체크
    if (darkColors && darkColors.scale && darkColors.scale[colorKey]) {
      return darkColors.scale[colorKey].value;
    }
  }
  
  // 첫 번째 부분이 'static'인 경우
  if (parts[0] === 'static') {
    const staticKey = parts[1];
    if (staticColors && staticColors.static && staticColors.static[staticKey]) {
      return staticColors.static[staticKey].value;
    }
  }
  
  // 참조를 해결할 수 없는 경우 원본 값 반환
  return value;
}

// 중첩된 객체 값 추출 함수
function extractDeepValue(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  // value 속성이 있는 경우
  if ('value' in obj) {
    // value가 객체인 경우 재귀적으로 처리
    if (typeof obj.value === 'object' && obj.value !== null) {
      return extractDeepValue(obj.value);
    }
    return obj.value;
  }
  
  // 객체에 value 속성이 없는 경우
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = extractDeepValue(obj[key]);
    }
  }
  return result;
}

// 색상 토큰 처리
function processColorTokens() {
  const lightColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/color/light.json'), 'utf8')
  );
  const darkColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/color/dark.json'), 'utf8')
  );
  const staticColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'static-scale/color.json'), 'utf8')
  );
  const semanticColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'semantic/color.json'), 'utf8')
  );

  // 참조 변수 해결을 위한 처리
  function processColorObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // 중첩된 객체인 경우 재귀적으로 처리
          result[key] = processColorObject(obj[key]);
        } else if (typeof obj[key] === 'string' && obj[key].startsWith('{') && obj[key].endsWith('}')) {
          // 참조 문법인 경우 해결
          result[key] = resolveReference(obj[key], lightColors, darkColors, staticColors);
        } else {
          // 그 외 경우 그대로 사용
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 색상 토큰 처리
  const processedStaticColors = processColorObject(staticColors);
  const processedSemanticColors = processColorObject(semanticColors);

  // 색상 토큰을 Tailwind 형식으로 변환
  const tailwindColors = {
    // 기본 색상
    ...processedStaticColors,
    // 시맨틱 색상
    ...processedSemanticColors,
  };

  // 라이트/다크 모드 색상 구분
  const themeColors = {
    light: processColorObject(lightColors),
    dark: processColorObject(darkColors),
  };

  // 처리된 색상 토큰 저장
  fs.writeFileSync(
    path.join(outputDir, 'processed/colors.json'),
    JSON.stringify(tailwindColors, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'processed/theme-colors.json'),
    JSON.stringify(themeColors, null, 2)
  );

  return { tailwindColors, lightColors, darkColors };
}

// 타이포그래피 토큰 처리
function processTypographyTokens() {
  const fontSizes = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/dimension-font-size.json'), 'utf8')
  );
  const fontWeights = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/font-weight.json'), 'utf8')
  );
  const lineHeights = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/line-height.json'), 'utf8')
  );
  const letterSpacings = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/letter-spacing.json'), 'utf8')
  );
  const fontFamilies = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'static-scale/font-family.json'), 'utf8')
  );
  const semanticTypography = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'semantic/typography.json'), 'utf8')
  );

  // 값 추출 함수
  function extractValues(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if ('value' in obj[key]) {
            result[key] = obj[key].value;
          } else {
            result[key] = extractValues(obj[key]);
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 타이포그래피 토큰을 Tailwind 형식으로 변환
  const tailwindTypography = {
    fontSize: extractValues(fontSizes),
    fontWeight: extractValues(fontWeights),
    lineHeight: extractValues(lineHeights),
    letterSpacing: extractValues(letterSpacings),
    fontFamily: extractValues(fontFamilies),
  };

  // 시맨틱 타이포그래피 스타일
  const typographyStyles = extractValues(semanticTypography);

  // 처리된 타이포그래피 토큰 저장
  fs.writeFileSync(
    path.join(outputDir, 'processed/typography.json'),
    JSON.stringify(tailwindTypography, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'processed/typography-styles.json'),
    JSON.stringify(typographyStyles, null, 2)
  );

  return tailwindTypography;
}

// 스페이싱 및 기타 토큰 처리
function processOtherTokens() {
  const spacing = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/dimension-size.json'), 'utf8')
  );
  const cornerRadius = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/corner-radius.json'), 'utf8')
  );
  const duration = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'scale/duration.json'), 'utf8')
  );
  const breakpoints = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'semantic/breakpoints.json'), 'utf8')
  );

  // 값 추출 함수
  function extractValues(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if ('value' in obj[key]) {
            result[key] = obj[key].value;
          } else {
            result[key] = extractValues(obj[key]);
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 기타 토큰을 Tailwind 형식으로 변환
  const tailwindOther = {
    spacing: extractValues(spacing),
    borderRadius: extractValues(cornerRadius),
    transitionDuration: extractValues(duration),
    screens: extractValues(breakpoints),
  };

  // 처리된 기타 토큰 저장
  fs.writeFileSync(
    path.join(outputDir, 'processed/spacing.json'),
    JSON.stringify(extractValues(spacing), null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'processed/other.json'),
    JSON.stringify(tailwindOther, null, 2)
  );

  return tailwindOther;
}

// Tailwind 테마 설정 생성
function generateTailwindTheme() {
  const { tailwindColors, lightColors, darkColors } = processColorTokens();
  const typography = processTypographyTokens();
  const other = processOtherTokens();

  const tailwindTheme = {
    colors: tailwindColors,
    ...typography,
    ...other,
  };

  fs.writeFileSync(
    path.join(outputDir, 'processed/tailwind-theme.json'),
    JSON.stringify(tailwindTheme, null, 2)
  );

  console.log('Ruler 디자인 토큰이 성공적으로 변환되었습니다!');
  return { tailwindTheme, lightColors, darkColors };
}

// CSS 변수 생성 (수정된 부분)
function generateCSSVariables(tailwindTheme, lightColors, darkColors) {
  // 정적 색상 불러오기
  const staticColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, 'static-scale/color.json'), 'utf8')
  );

  let css = ':root {\n';
  
  // 색상 변수 - 객체에서 value 속성이나 참조 값 추출
  function processValue(value) {
    if (value === undefined || value === null) return '';
    
    // 객체인 경우
    if (typeof value === 'object') {
      if ('value' in value) {
        return processValue(value.value);
      }
      
      // 객체 형태의 값은 플랫한 CSS 변수로 변환하지 않음
      // 이 부분은 별도의 중첩 변수로 처리가 필요할 수 있음
      return '';
    }
    
    // 참조 문법 처리
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      return resolveReference(value, lightColors, darkColors, staticColors) || value;
    }
    
    return value;
  }
  
  // 색상 변수 추가 - 중첩 객체 플랫하게 처리
  function addColorVariables(prefix, obj) {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const varName = `${prefix}-${key}`;
        
        if (typeof value === 'object' && value !== null && !('value' in value)) {
          // 중첩 객체인 경우 재귀적으로 처리
          addColorVariables(varName, value);
        } else {
          const processedValue = processValue(value);
          // 값이 빈 문자열이 아닌 경우에만 추가
          if (processedValue !== '') {
            css += `  --${varName}: ${processedValue};\n`;
          }
        }
      }
    }
  }
  
  // 색상 변수 생성
  if (tailwindTheme.colors) {
    for (const category in tailwindTheme.colors) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.colors, category)) {
        const values = tailwindTheme.colors[category];
        if (typeof values === 'object' && values !== null) {
          // 중첩 객체 처리
          addColorVariables(`color-${category}`, values);
        } else {
          const processedValue = processValue(values);
          if (processedValue !== '') {
            css += `  --color-${category}: ${processedValue};\n`;
          }
        }
      }
    }
  }
  
  // 글꼴 크기 변수
  if (tailwindTheme.fontSize) {
    for (const key in tailwindTheme.fontSize) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.fontSize, key)) {
        const fontSize = processValue(tailwindTheme.fontSize[key]);
        if (fontSize !== '') {
          css += `  --font-size-${key}: ${fontSize};\n`;
        }
      }
    }
  }
  
  // 스페이싱 변수
  if (tailwindTheme.spacing) {
    for (const key in tailwindTheme.spacing) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.spacing, key)) {
        const spacing = processValue(tailwindTheme.spacing[key]);
        if (spacing !== '') {
          css += `  --spacing-${key}: ${spacing};\n`;
        }
      }
    }
  }
  
  // 모서리 반경 변수
  if (tailwindTheme.borderRadius) {
    for (const key in tailwindTheme.borderRadius) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.borderRadius, key)) {
        const radius = processValue(tailwindTheme.borderRadius[key]);
        if (radius !== '') {
          css += `  --radius-${key}: ${radius};\n`;
        }
      }
    }
  }
  
  css += '}\n';
  
  // 다크 모드 변수
  css += '\n@media (prefers-color-scheme: dark) {\n';
  css += '  :root {\n';

  // 다크 모드 일반 스케일 색상
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (Object.prototype.hasOwnProperty.call(darkColors.scale, key) && !key.includes('alpha')) {
        const colorValue = processValue(darkColors.scale[key].value);
        if (colorValue !== '') {
          css += `    --color-scale-${key}: ${colorValue};\n`;
        }
      }
    }
  }

  // 다크 모드 알파 색상 별도 처리
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (Object.prototype.hasOwnProperty.call(darkColors.scale, key) && key.includes('alpha')) {
        const colorObj = darkColors.scale[key];
        
        if (colorObj.$extensions && 
            colorObj.$extensions['studio.tokens'] && 
            colorObj.$extensions['studio.tokens'].modify && 
            colorObj.$extensions['studio.tokens'].modify.type === 'alpha') {
          
          const alpha = parseFloat(colorObj.$extensions['studio.tokens'].modify.value);
          
          // 참조 값 처리
          let baseColor = colorObj.value;
          if (typeof baseColor === 'string' && baseColor.startsWith('{') && baseColor.endsWith('}')) {
            // 참조 값을 해결
            const resolvedColor = resolveReference(baseColor, lightColors, darkColors, staticColors);
            if (resolvedColor && typeof resolvedColor === 'string' && resolvedColor.startsWith('#')) {
              css += `    --color-scale-${key}: ${hexToRgba(resolvedColor, alpha)};\n`;
              continue;
            }
          }
          
          // 직접 값인 경우
          if (typeof baseColor === 'string' && baseColor.startsWith('#')) {
            css += `    --color-scale-${key}: ${hexToRgba(baseColor, alpha)};\n`;
            continue;
          }
        }
        
        // 알파값이 없는 경우 또는 처리할 수 없는 경우
        const colorValue = processValue(colorObj.value);
        if (colorValue !== '') {
          css += `    --color-scale-${key}: ${colorValue};\n`;
        }
      }
    }
  }
  
  css += '  }\n';
  css += '}\n';
  
  fs.writeFileSync(path.join(outputDir, 'tokens.css'), css);
  console.log('CSS 변수가 성공적으로 생성되었습니다!');
}

// 메인 함수 실행
function main() {
  const { tailwindTheme, lightColors, darkColors } = generateTailwindTheme();
  generateCSSVariables(tailwindTheme, lightColors, darkColors);
}

main();