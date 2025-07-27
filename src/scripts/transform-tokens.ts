// src/scripts/transform-tokens.ts
const fs = require("fs");
const path = require("path");

// 기본 경로 설정
const rulerTokensDir = path.join(process.cwd(), "src/ruler-tokens");
const outputDir = path.join(process.cwd(), "src/tokens");

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(path.join(outputDir, "processed"))) {
  fs.mkdirSync(path.join(outputDir, "processed"), { recursive: true });
}

// 색상을 hexadecimal에서 rgba로 변환하는 함수
function hexToRgba(hex: string | number, alpha = 1) {
  // 숫자를 문자열로 변환
  const hexString = typeof hex === "number" ? hex.toString() : hex;

  // HEX 값에서 # 기호 제거
  const cleanHex = hexString.replace("#", "");

  // RGB 값 추출
  let r, g, b;
  if (cleanHex.length === 3) {
    // 3자리 HEX 색상인 경우 (예: #FFF)
    r = parseInt(cleanHex.charAt(0) + cleanHex.charAt(0), 16);
    g = parseInt(cleanHex.charAt(1) + cleanHex.charAt(1), 16);
    b = parseInt(cleanHex.charAt(2) + cleanHex.charAt(2), 16);
  } else {
    // 6자리 HEX 색상인 경우 (예: #FFFFFF)
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  // rgba 문자열 반환
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// px를 rem으로 변환하는 함수 (기본값: 1rem = 16px)
function pxToRem(pxValue: string | number, base = 16) {
  if (typeof pxValue !== "string" && typeof pxValue !== "number")
    return pxValue;

  // px 단위 확인 및 제거
  let value = pxValue;
  if (typeof value === "string") {
    value = value.replace("px", "");
  }

  // 숫자로 변환
  const num = parseFloat(String(value));
  if (isNaN(num)) return pxValue;

  // rem 값 계산 (소수점 4자리까지 반올림)
  const remValue = Math.round((num / base) * 10000) / 10000;
  return `${remValue}rem`;
}

// 참조 변수 처리 함수 (예: "{scale.gray-900}" -> "#f4f4f4")
function resolveReference(value, lightColors, darkColors, staticColors) {
  if (!value || typeof value !== "string") return value;

  // 참조 문법 체크 (예: "{scale.gray-900}")
  const referenceMatch = value.match(/^\{(.*)\}$/);
  if (!referenceMatch) return value;

  const reference = referenceMatch[1];
  const parts = reference.split(".");

  // 첫 번째 부분이 'scale'인 경우
  if (parts[0] === "scale") {
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
  if (parts[0] === "static") {
    const staticKey = parts[1];
    if (staticColors && staticColors.static && staticColors.static[staticKey]) {
      return staticColors.static[staticKey].value;
    }
  }

  // 참조를 해결할 수 없는 경우 원본 값 반환
  return value;
}

// 백분율 값 처리 함수 (예: "100%" -> 1, "150%" -> 1.5)
function processPercentageValue(value) {
  if (typeof value !== "string" || !value.endsWith("%")) return value;

  // % 기호 제거하고 숫자로 변환 후 100으로 나누기
  const numValue = parseFloat(value.replace("%", "")) / 100;
  return numValue.toString();
}

// 단위가 있는 값 처리 함수 (예: "150ms" 처리)
function processUnitValue(value, keepUnit = true) {
  if (typeof value !== "string") return value;

  // 숫자와 단위 분리 정규식 (예: "150ms" -> ["150", "ms"])
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return value;

  const [, numStr, unit] = match;
  const numValue = parseFloat(numStr);

  if (!keepUnit) {
    return numValue.toString();
  }

  return `${numValue}${unit}`;
}

// 중첩된 객체 값 추출 함수
function extractDeepValue(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // value 속성이 있는 경우
  if ("value" in obj) {
    // value가 객체인 경우 재귀적으로 처리
    if (typeof obj.value === "object" && obj.value !== null) {
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

// 중복 접두사 제거 함수 (예: "font-size-font-size-100" -> "font-size-100")
function removeDuplicatePrefix(varName) {
  // 변수명 분리
  const parts = varName.split("-");

  if (parts.length < 3) return varName; // 최소 3개 이상의 부분이 있어야 함

  // 특수 케이스 처리: color-static-static-X -> color-static-X
  if (parts[0] === "color" && parts[1] === "static" && parts[2] === "static") {
    return "color-static-" + parts.slice(3).join("-");
  }

  // 특수 케이스 처리: radius-corner-radius-X -> corner-radius-X
  if (parts[0] === "radius" && parts[1] === "corner" && parts[2] === "radius") {
    return parts.slice(1).join("-"); // corner-radius-X 형태로 변환
  }

  // 특수 케이스 처리: font-weight-X-Y -> X-Y (thin-100, bold-700 등)
  if (parts[0] === "font" && parts[1] === "weight" && parts.length >= 4) {
    return parts.slice(2).join("-"); // thin-100, bold-700 등의 형태로 변환
  }

  // 기존 코드는 그대로 유지
  // 첫 번째 부분과 두 번째 이상의 부분이 일치하는지 확인
  const prefix = parts[0];

  // 두 번째 부분이 첫 번째 부분과 같은지 확인
  if (parts[1] === prefix) {
    // 중복 제거 (예: "font-size-font-size-100" -> "font-size-100")
    return prefix + "-" + parts.slice(2).join("-");
  }

  // corner-radius 같은 복합 접두사 처리
  if (
    parts.length >= 4 &&
    parts[0] + "-" + parts[1] === parts[2] + "-" + parts[3]
  ) {
    // 중복 제거 (예: "radius-corner-radius-corner-radius-100" -> "radius-corner-radius-100")
    return parts[0] + "-" + parts[1] + "-" + parts.slice(4).join("-");
  }

  // line-height와 같은 특수 케이스
  if (parts[0] === "line" && parts[1] === "height") {
    const prefix = parts[0] + "-" + parts[1];
    if (parts[2] === "line" && parts[3] === "height") {
      // 중복 제거 (예: "line-height-line-height-1" -> "line-height-1")
      return prefix + "-" + parts.slice(4).join("-");
    }
  }

  // duration 처리
  if (parts[0] === "duration") {
    if (parts[1] === "duration") {
      // 중복 제거 (예: "duration-duration-150" -> "duration-150")
      return parts[0] + "-" + parts.slice(2).join("-");
    }
  }

  return varName; // 중복이 없는 경우 그대로 반환
}

// 색상 토큰 처리
function processColorTokens() {
  const lightColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "scale/color/light.json"), "utf8")
  );
  const darkColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "scale/color/dark.json"), "utf8")
  );
  const staticColors = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "static-scale/color.json"),
      "utf8"
    )
  );
  const semanticColors = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "semantic/color.json"), "utf8")
  );

  // 참조 변수 해결을 위한 처리
  function processColorObject(obj) {
    if (!obj || typeof obj !== "object") return obj;

    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          // 중첩된 객체인 경우 재귀적으로 처리
          result[key] = processColorObject(obj[key]);
        } else if (
          typeof obj[key] === "string" &&
          obj[key].startsWith("{") &&
          obj[key].endsWith("}")
        ) {
          // 참조 문법인 경우 해결
          result[key] = resolveReference(
            obj[key],
            lightColors,
            darkColors,
            staticColors
          );
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
    path.join(outputDir, "processed/colors.json"),
    JSON.stringify(tailwindColors, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "processed/theme-colors.json"),
    JSON.stringify(themeColors, null, 2)
  );

  return { tailwindColors, lightColors, darkColors };
}

// 타이포그래피 토큰 처리
function processTypographyTokens() {
  const fontSizes = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "scale/dimension-font-size.json"),
      "utf8"
    )
  );
  const fontWeights = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "scale/font-weight.json"), "utf8")
  );
  const lineHeights = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "scale/line-height.json"), "utf8")
  );
  const letterSpacings = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "scale/letter-spacing.json"),
      "utf8"
    )
  );
  const fontFamilies = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "static-scale/font-family.json"),
      "utf8"
    )
  );
  const semanticTypography = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "semantic/typography.json"),
      "utf8"
    )
  );

  // 값 추출 및 변환 함수
  function extractAndProcessValues(obj, valueType = null) {
    if (!obj || typeof obj !== "object") return obj;

    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if ("value" in obj[key]) {
            let extractedValue = obj[key].value;

            // 값의 유형에 따라 추가 처리
            if (
              valueType === "lineHeight" &&
              typeof extractedValue === "string"
            ) {
              extractedValue = processPercentageValue(extractedValue);
            } else if (
              valueType === "fontSize" &&
              (typeof extractedValue === "string" ||
                typeof extractedValue === "number")
            ) {
              // 폰트 사이즈는 rem으로 변환
              extractedValue = pxToRem(extractedValue);
            }

            result[key] = extractedValue;
          } else {
            result[key] = extractAndProcessValues(obj[key], valueType);
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 타이포그래피 토큰을 Tailwind 형식으로 변환 (특별 처리 추가)
  const tailwindTypography = {
    fontSize: extractAndProcessValues(fontSizes, "fontSize"), // 폰트 사이즈는 rem으로 변환
    fontWeight: extractAndProcessValues(fontWeights),
    lineHeight: extractAndProcessValues(lineHeights, "lineHeight"), // 백분율 값 처리를 위한 유형 지정
    letterSpacing: extractAndProcessValues(letterSpacings),
    fontFamily: extractAndProcessValues(fontFamilies),
  };

  // 시맨틱 타이포그래피 스타일
  const typographyStyles = extractAndProcessValues(semanticTypography);

  // 처리된 타이포그래피 토큰 저장
  fs.writeFileSync(
    path.join(outputDir, "processed/typography.json"),
    JSON.stringify(tailwindTypography, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "processed/typography-styles.json"),
    JSON.stringify(typographyStyles, null, 2)
  );

  return tailwindTypography;
}

// 스페이싱 및 기타 토큰 처리
function processOtherTokens() {
  const spacing = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "scale/dimension-size.json"),
      "utf8"
    )
  );
  const cornerRadius = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "scale/corner-radius.json"),
      "utf8"
    )
  );
  const duration = JSON.parse(
    fs.readFileSync(path.join(rulerTokensDir, "scale/duration.json"), "utf8")
  );
  const breakpoints = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "semantic/breakpoints.json"),
      "utf8"
    )
  );

  // 값 추출 및 변환 함수
  function extractAndProcessValues(obj, valueType = null) {
    if (!obj || typeof obj !== "object") return obj;

    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if ("value" in obj[key]) {
            let extractedValue = obj[key].value;

            // 값의 유형에 따라 추가 처리
            if (
              valueType === "duration" &&
              typeof extractedValue === "string"
            ) {
              // duration 값은 단위를 유지
              extractedValue = processUnitValue(extractedValue, true);
            }

            result[key] = extractedValue;
          } else {
            result[key] = extractAndProcessValues(obj[key], valueType);
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 기타 토큰을 Tailwind 형식으로 변환 (duration 특별 처리 추가)
  const tailwindOther = {
    spacing: extractAndProcessValues(spacing),
    borderRadius: extractAndProcessValues(cornerRadius),
    transitionDuration: extractAndProcessValues(duration, "duration"), // 단위 값 처리를 위한 유형 지정
    screens: extractAndProcessValues(breakpoints),
  };

  // 처리된 기타 토큰 저장
  fs.writeFileSync(
    path.join(outputDir, "processed/spacing.json"),
    JSON.stringify(extractAndProcessValues(spacing), null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "processed/other.json"),
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
    path.join(outputDir, "processed/tailwind-theme.json"),
    JSON.stringify(tailwindTheme, null, 2)
  );

  console.log("Ruler 디자인 토큰이 성공적으로 변환되었습니다!");
  return { tailwindTheme, lightColors, darkColors };
}

// CSS 변수 생성 (수정된 부분 - 중복 접두사 제거 개선)
function generateCSSVariables(tailwindTheme, lightColors, darkColors) {
  // 정적 색상 불러오기
  const staticColors = JSON.parse(
    fs.readFileSync(
      path.join(rulerTokensDir, "static-scale/color.json"),
      "utf8"
    )
  );

  let css = ":root {\n";

  // 색상 변수 - 객체에서 value 속성이나 참조 값 추출
  function processValue(value) {
    if (value === undefined || value === null) return "";

    // 객체인 경우
    if (typeof value === "object") {
      if ("value" in value) {
        return processValue(value.value);
      }

      // 객체 형태의 값은 플랫한 CSS 변수로 변환하지 않음
      return "";
    }

    // 참조 문법 처리
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      return (
        resolveReference(value, lightColors, darkColors, staticColors) || value
      );
    }

    return value;
  }

  // 시맨틱 색상용 새 함수
  function processSemanticValue(value) {
    if (value === undefined || value === null) return "";

    // 객체인 경우
    if (typeof value === "object") {
      if ("value" in value) {
        return processSemanticValue(value.value);
      }
      return "";
    }

    // 참조 문법 처리 - CSS 변수 참조로 변환
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const referenceMatch = value.match(/^\{(.*)\}$/);
      if (referenceMatch) {
        const reference = referenceMatch[1];
        const parts = reference.split(".");

        // 참조 경로 생성 후 중복 접두사 제거
        if (parts[0] === "scale") {
          return `var(--color-scale-${parts[1]})`;
        }

        if (parts[0] === "static") {
          // 중복 접두사가 제거된 변수명 사용
          return `var(--color-static-${parts[1]})`;
        }
      }
    }

    // 직접 색상값인 경우 해당 값과 일치하는 스케일/정적 변수 찾기
    if (typeof value === "string" && value.startsWith("#")) {
      // 스케일 색상 검색
      for (const key in lightColors.scale) {
        if (lightColors.scale[key].value === value) {
          return `var(--color-scale-${key})`;
        }
      }

      // 정적 색상 검색
      if (staticColors.static) {
        for (const key in staticColors.static) {
          if (staticColors.static[key].value === value) {
            return `var(--color-static-${key})`;
          }
        }
      }
    }

    return value;
  }

  // 색상 변수 추가 - 중첩 객체 플랫하게 처리
  function addColorVariables(prefix, obj) {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        let varName = `${prefix}-${key}`;

        // 중복 접두사 제거
        varName = removeDuplicatePrefix(varName);

        if (
          typeof value === "object" &&
          value !== null &&
          !("value" in value)
        ) {
          // 중첩 객체인 경우 재귀적으로 처리
          addColorVariables(varName, value);
        } else {
          const processedValue = processValue(value);
          // 값이 빈 문자열이 아닌 경우에만 추가
          if (processedValue !== "") {
            css += `  --${varName}: ${processedValue};\n`;
          }
        }
      }
    }
  }

  // 시맨틱 색상 변수 추가 함수 - addColorVariables 다음에 추가
  function addSemanticColorVariables(prefix, obj) {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        let varName = `${prefix}-${key}`;

        // 중복 접두사 제거
        varName = removeDuplicatePrefix(varName);

        if (
          typeof value === "object" &&
          value !== null &&
          !("value" in value)
        ) {
          // 중첩 객체인 경우 재귀적으로 처리
          addSemanticColorVariables(varName, value);
        } else {
          const processedValue = processSemanticValue(value);
          // 값이 빈 문자열이 아닌 경우에만 추가
          if (processedValue !== "") {
            // 변수명에서 중복 접두사 제거
            const varNameCleaned = removeDuplicatePrefix(varName);

            // 참조 경로에서도 static-static 중복 제거
            let fixedValue = processedValue;
            if (
              typeof fixedValue === "string" &&
              fixedValue.includes("--color-static-static-")
            ) {
              fixedValue = fixedValue.replace(
                "--color-static-static-",
                "--color-static-"
              );
            }

            css += `  --${varName}: ${fixedValue};\n`;
          }
        }
      }
    }
  }

  // 색상 변수 생성
  if (tailwindTheme.colors) {
    for (const category in tailwindTheme.colors) {
      if (
        Object.prototype.hasOwnProperty.call(tailwindTheme.colors, category)
      ) {
        // semantic 카테고리는 건너뛰고 별도 처리
        if (category === "semantic") continue;

        const values = tailwindTheme.colors[category];
        if (typeof values === "object" && values !== null) {
          // 중첩 객체 처리
          addColorVariables(`color-${category}`, values);
        } else {
          let varName = `color-${category}`;
          varName = removeDuplicatePrefix(varName);

          const processedValue = processValue(values);
          if (processedValue !== "") {
            css += `  --${varName}: ${processedValue};\n`;
          }
        }
      }
    }
    if (tailwindTheme.colors.semantic) {
      // 시맨틱 색상은 CSS 변수 참조로 변환
      addSemanticColorVariables(
        "color-semantic",
        tailwindTheme.colors.semantic
      );
    }
  }

  // 글꼴 크기 변수 부분
  if (tailwindTheme.fontSize) {
    for (const key in tailwindTheme.fontSize) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.fontSize, key)) {
        const fontSize = processValue(tailwindTheme.fontSize[key]);
        if (fontSize !== "") {
          let varName = `font-size-${key}`;
          varName = removeDuplicatePrefix(varName);

          // 이미 rem 단위가 있으면 그대로 사용
          if (typeof fontSize === "string" && fontSize.endsWith("rem")) {
            css += `  --${varName}: ${fontSize};\n`;
          } else {
            // 그렇지 않으면 px 단위 추가 후 rem으로 변환
            let fontSizeWithUnit = fontSize;
            if (
              typeof fontSize === "number" ||
              (typeof fontSize === "string" &&
                !fontSize.endsWith("px") &&
                !fontSize.endsWith("em"))
            ) {
              fontSizeWithUnit = parseFloat(String(fontSize)) + "px";
            }

            // px 값을 rem으로 변환
            const remValue = pxToRem(fontSizeWithUnit);
            css += `  --${varName}: ${remValue};\n`;
          }
        }
      }
    }
  }

  // 글꼴 두께 변수
  if (tailwindTheme.fontWeight) {
    for (const key in tailwindTheme.fontWeight) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.fontWeight, key)) {
        const fontWeight = processValue(tailwindTheme.fontWeight[key]);
        if (fontWeight !== "") {
          let varName = `font-weight-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${fontWeight};\n`;
        }
      }
    }
  }

  // 라인 높이 변수
  if (tailwindTheme.lineHeight) {
    for (const key in tailwindTheme.lineHeight) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.lineHeight, key)) {
        // 백분율 값을 소수점으로 변환 (예: "150%" -> "1.5")
        let lineHeight = processValue(tailwindTheme.lineHeight[key]);
        if (typeof lineHeight === "string" && lineHeight.endsWith("%")) {
          lineHeight = processPercentageValue(lineHeight);
        }
        if (lineHeight !== "") {
          let varName = `line-height-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${lineHeight};\n`;
        }
      }
    }
  }

  // 트랜지션 듀레이션 변수
  if (tailwindTheme.transitionDuration) {
    for (const key in tailwindTheme.transitionDuration) {
      if (
        Object.prototype.hasOwnProperty.call(
          tailwindTheme.transitionDuration,
          key
        )
      ) {
        // duration 값은 단위 유지 (예: "150ms")
        const duration = processValue(tailwindTheme.transitionDuration[key]);
        if (duration !== "") {
          let varName = `duration-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${duration};\n`;
        }
      }
    }
  }

  // 스페이싱 변수 - 단위 처리 개선
  if (tailwindTheme.spacing) {
    for (const key in tailwindTheme.spacing) {
      if (Object.prototype.hasOwnProperty.call(tailwindTheme.spacing, key)) {
        const spacing = processValue(tailwindTheme.spacing[key]);
        if (spacing !== "") {
          let varName = `spacing-${key}`;
          varName = removeDuplicatePrefix(varName);

          // 이미 rem 단위가 있으면 그대로 사용
          if (typeof spacing === "string" && spacing.endsWith("rem")) {
            css += `  --${varName}: ${spacing};\n`;
          } else {
            // 숫자만 있는 경우 px 단위 추가 후 rem으로 변환
            let spacingWithUnit = spacing;
            // 0은 특별 케이스로 그대로 유지
            if (spacingWithUnit !== "0" && spacingWithUnit !== 0) {
              if (
                typeof spacingWithUnit === "number" ||
                (typeof spacingWithUnit === "string" &&
                  !spacingWithUnit.endsWith("px") &&
                  !spacingWithUnit.endsWith("em") &&
                  !spacingWithUnit.endsWith("%"))
              ) {
                spacingWithUnit = parseFloat(String(spacingWithUnit)) + "px";
              }

              // px 값만 rem으로 변환
              if (
                typeof spacingWithUnit === "string" &&
                spacingWithUnit.endsWith("px")
              ) {
                spacingWithUnit = pxToRem(spacingWithUnit);
              }
            }

            css += `  --${varName}: ${spacingWithUnit};\n`;
          }
        }
      }
    }
  }

  // 모서리 반경 변수
  if (tailwindTheme.borderRadius) {
    for (const key in tailwindTheme.borderRadius) {
      if (
        Object.prototype.hasOwnProperty.call(tailwindTheme.borderRadius, key)
      ) {
        const radius = processValue(tailwindTheme.borderRadius[key]);
        if (radius !== "") {
          let varName = `radius-${key}`;
          varName = removeDuplicatePrefix(varName);

          // 단위 처리
          let radiusWithUnit = radius;
          // 0은 특별 케이스로 그대로 유지
          if (radiusWithUnit !== "0" && radiusWithUnit !== 0) {
            // 이미 단위가 있는지 확인
            if (
              typeof radiusWithUnit === "number" ||
              (typeof radiusWithUnit === "string" &&
                !radiusWithUnit.endsWith("px") &&
                !radiusWithUnit.endsWith("rem") &&
                !radiusWithUnit.endsWith("em") &&
                !radiusWithUnit.endsWith("%"))
            ) {
              // 단위가 없으면 px 추가
              radiusWithUnit = parseFloat(String(radiusWithUnit)) + "px";
            }
          }

          css += `  --${varName}: ${radiusWithUnit};\n`;
        }
      }
    }
  }

  // 라이트 모드 스케일 색상 추가
  if (lightColors && lightColors.scale) {
    for (const key in lightColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(lightColors.scale, key) &&
        !key.includes("alpha")
      ) {
        const colorValue = processValue(lightColors.scale[key].value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // 라이트 모드 알파 색상 처리
  if (lightColors && lightColors.scale) {
    for (const key in lightColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(lightColors.scale, key) &&
        key.includes("alpha")
      ) {
        const colorObj = lightColors.scale[key];

        if (
          colorObj.$extensions &&
          colorObj.$extensions["studio.tokens"] &&
          colorObj.$extensions["studio.tokens"].modify &&
          colorObj.$extensions["studio.tokens"].modify.type === "alpha"
        ) {
          const alpha = parseFloat(
            colorObj.$extensions["studio.tokens"].modify.value
          );

          // 참조 값 처리
          let baseColor = colorObj.value;
          if (
            typeof baseColor === "string" &&
            baseColor.startsWith("{") &&
            baseColor.endsWith("}")
          ) {
            // 참조 값을 해결
            const resolvedColor = resolveReference(
              baseColor,
              lightColors,
              darkColors,
              staticColors
            );
            if (
              resolvedColor &&
              typeof resolvedColor === "string" &&
              resolvedColor.startsWith("#")
            ) {
              let varName = `color-scale-${key}`;
              varName = removeDuplicatePrefix(varName);
              css += `  --${varName}: ${hexToRgba(resolvedColor, alpha)};\n`;
              continue;
            }
          }

          // 직접 값인 경우
          if (typeof baseColor === "string" && baseColor.startsWith("#")) {
            let varName = `color-scale-${key}`;
            varName = removeDuplicatePrefix(varName);
            css += `  --${varName}: ${hexToRgba(baseColor, alpha)};\n`;
            continue;
          }
        }

        // 알파값이 없는 경우 또는 처리할 수 없는 경우
        const colorValue = processValue(colorObj.value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  css += "}\n\n";
  // 미디어 쿼리 다크 모드
  css += "/* 시스템 설정에 따른 다크 모드 */\n";
  css += "@media (prefers-color-scheme: dark) {\n";
  css += "  :root {\n";

  // 다크 모드 일반 스케일 색상
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(darkColors.scale, key) &&
        !key.includes("alpha")
      ) {
        const colorValue = processValue(darkColors.scale[key].value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `    --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // 다크 모드 알파 색상 별도 처리
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(darkColors.scale, key) &&
        key.includes("alpha")
      ) {
        const colorObj = darkColors.scale[key];

        if (
          colorObj.$extensions &&
          colorObj.$extensions["studio.tokens"] &&
          colorObj.$extensions["studio.tokens"].modify &&
          colorObj.$extensions["studio.tokens"].modify.type === "alpha"
        ) {
          const alpha = parseFloat(
            colorObj.$extensions["studio.tokens"].modify.value
          );

          // 참조 값 처리
          let baseColor = colorObj.value;
          if (
            typeof baseColor === "string" &&
            baseColor.startsWith("{") &&
            baseColor.endsWith("}")
          ) {
            // 참조 값을 해결
            const resolvedColor = resolveReference(
              baseColor,
              lightColors,
              darkColors,
              staticColors
            );
            if (
              resolvedColor &&
              typeof resolvedColor === "string" &&
              resolvedColor.startsWith("#")
            ) {
              let varName = `color-scale-${key}`;
              varName = removeDuplicatePrefix(varName);
              css += `    --${varName}: ${hexToRgba(resolvedColor, alpha)};\n`;
              continue;
            }
          }

          // 직접 값인 경우
          if (typeof baseColor === "string" && baseColor.startsWith("#")) {
            let varName = `color-scale-${key}`;
            varName = removeDuplicatePrefix(varName);
            css += `    --${varName}: ${hexToRgba(baseColor, alpha)};\n`;
            continue;
          }
        }

        // 알파값이 없는 경우 또는 처리할 수 없는 경우
        const colorValue = processValue(colorObj.value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `    --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // 다크 모드 미디어 쿼리 블록 닫기
  css += "  }\n"; // :root 블록 닫기
  css += "}\n\n"; // @media 블록 닫기

  // .light 클래스 기반 라이트 모드 (next-themes 지원)
  css += "/* next-themes 라이트 모드 지원 */\n";
  css += ".light {\n";

  // 라이트 모드(root)와 동일한 변수 복사
  if (lightColors && lightColors.scale) {
    for (const key in lightColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(lightColors.scale, key) &&
        !key.includes("alpha")
      ) {
        const colorValue = processValue(lightColors.scale[key].value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }

    // 라이트 모드 알파 색상도 복사
    for (const key in lightColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(lightColors.scale, key) &&
        key.includes("alpha")
      ) {
        const colorObj = lightColors.scale[key];

        if (
          colorObj.$extensions &&
          colorObj.$extensions["studio.tokens"] &&
          colorObj.$extensions["studio.tokens"].modify &&
          colorObj.$extensions["studio.tokens"].modify.type === "alpha"
        ) {
          const alpha = parseFloat(
            colorObj.$extensions["studio.tokens"].modify.value
          );

          // 참조 값 처리
          let baseColor = colorObj.value;
          if (
            typeof baseColor === "string" &&
            baseColor.startsWith("{") &&
            baseColor.endsWith("}")
          ) {
            const resolvedColor = resolveReference(
              baseColor,
              lightColors,
              darkColors,
              staticColors
            );
            if (
              resolvedColor &&
              typeof resolvedColor === "string" &&
              resolvedColor.startsWith("#")
            ) {
              let varName = `color-scale-${key}`;
              varName = removeDuplicatePrefix(varName);
              css += `  --${varName}: ${hexToRgba(resolvedColor, alpha)};\n`;
              continue;
            }
          }

          // 직접 값인 경우
          if (typeof baseColor === "string" && baseColor.startsWith("#")) {
            let varName = `color-scale-${key}`;
            varName = removeDuplicatePrefix(varName);
            css += `  --${varName}: ${hexToRgba(baseColor, alpha)};\n`;
            continue;
          }
        }

        // 알파값이 없는 경우 또는 처리할 수 없는 경우
        const colorValue = processValue(colorObj.value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // .light 클래스 블록 닫기
  css += "}\n\n";

  // 클래스 기반 다크 모드 (.dark)
  css += "/* 클래스 기반 다크 모드 */\n";
  css += ".dark {\n";

  // 다크 모드 일반 스케일 색상 - .dark 클래스용
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(darkColors.scale, key) &&
        !key.includes("alpha")
      ) {
        const colorValue = processValue(darkColors.scale[key].value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // 다크 모드 알파 색상 별도 처리 - .dark 클래스용
  if (darkColors && darkColors.scale) {
    for (const key in darkColors.scale) {
      if (
        Object.prototype.hasOwnProperty.call(darkColors.scale, key) &&
        key.includes("alpha")
      ) {
        const colorObj = darkColors.scale[key];

        if (
          colorObj.$extensions &&
          colorObj.$extensions["studio.tokens"] &&
          colorObj.$extensions["studio.tokens"].modify &&
          colorObj.$extensions["studio.tokens"].modify.type === "alpha"
        ) {
          const alpha = parseFloat(
            colorObj.$extensions["studio.tokens"].modify.value
          );

          // 참조 값 처리
          let baseColor = colorObj.value;
          if (
            typeof baseColor === "string" &&
            baseColor.startsWith("{") &&
            baseColor.endsWith("}")
          ) {
            // 참조 값을 해결
            const resolvedColor = resolveReference(
              baseColor,
              lightColors,
              darkColors,
              staticColors
            );
            if (
              resolvedColor &&
              typeof resolvedColor === "string" &&
              resolvedColor.startsWith("#")
            ) {
              let varName = `color-scale-${key}`;
              varName = removeDuplicatePrefix(varName);
              css += `  --${varName}: ${hexToRgba(resolvedColor, alpha)};\n`;
              continue;
            }
          }

          // 직접 값인 경우
          if (typeof baseColor === "string" && baseColor.startsWith("#")) {
            let varName = `color-scale-${key}`;
            varName = removeDuplicatePrefix(varName);
            css += `  --${varName}: ${hexToRgba(baseColor, alpha)};\n`;
            continue;
          }
        }

        // 알파값이 없는 경우 또는 처리할 수 없는 경우
        const colorValue = processValue(colorObj.value);
        if (colorValue !== "") {
          let varName = `color-scale-${key}`;
          varName = removeDuplicatePrefix(varName);
          css += `  --${varName}: ${colorValue};\n`;
        }
      }
    }
  }

  // .dark 클래스 블록 닫기
  css += "}\n";

  fs.writeFileSync(path.join(outputDir, "tokens.css"), css);
  console.log("CSS 변수가 성공적으로 생성되었습니다!");
}

// 메인 함수 실행
function main() {
  const { tailwindTheme, lightColors, darkColors } = generateTailwindTheme();
  generateCSSVariables(tailwindTheme, lightColors, darkColors);
}

main();

// ---------------------------------------------------------------------
// ✅ 추가: VSCode 자동완성용 tokens.custom-data.json 생성
// ---------------------------------------------------------------------

try {
  const tokensCssPath = path.resolve(__dirname, "../tokens/tokens.css");
  const customDataPath = path.resolve(
    __dirname,
    "../styles/tokens/processed/tokens.custom-data.json"
  );

  const css = fs.readFileSync(tokensCssPath, "utf-8");
  const matches = Array.from(css.matchAll(/--([a-zA-Z0-9-_]+)\s*:/g));

  const properties = matches.map((match) => ({
    name: `--${match[1]}`,
    description: `Design Token: ${match[1]}`,
  }));

  fs.writeFileSync(
    customDataPath,
    JSON.stringify({ version: 1.1, properties }, null, 2)
  );

  console.log("✅ tokens.custom-data.json 자동완성 파일이 생성되었습니다.");
} catch (err) {
  console.error("❌ 자동완성용 custom-data.json 생성 중 오류 발생:", err);
}
