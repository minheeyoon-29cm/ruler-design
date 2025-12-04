// src/components/LottieAssetList.tsx
'use client';
import React from 'react';
import { useEffect, useState, useRef } from 'react';

type LottieFile = {
  name: string;
  url: string;
};

const LOTTIE_FILES: LottieFile[] = [
  { name: 'ic_search', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_search.json' },
  { name: 'ic_heart', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_heart.json' },
  { name: 'ic_house', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_house.json' },
  { name: 'ic_bell_black', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_bell_black.json' },
  { name: 'ic_bell_white', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_bell_white.json' },
  { name: 'ic_my', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_my.json' },
  { name: 'ic_bag_white', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_bag_white.json' },
  { name: 'ic_bag_black', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_bag_black.json' },
  { name: 'ic_category', url: 'https://raw.githubusercontent.com/minheeyoon-29cm/ruler-design/main/src/content/foundation/assets/lottie/ic_category.json' },
];

const LottiePlayer = ({ src, file }: { src: string; file: LottieFile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsLoading(true);
      setHasError(false);
      
      // 기존 player 제거
      containerRef.current.innerHTML = '';
      
      // lottie-player 엘리먼트 생성
      const player = document.createElement('lottie-player');
      player.setAttribute('src', src);
      player.setAttribute('background', 'transparent');
      player.setAttribute('speed', '1');
      player.setAttribute('loop', 'true');
      player.setAttribute('autoplay', 'true');
      player.style.width = '80px';
      player.style.height = '80px';
      
      // 로딩 완료 이벤트
      player.addEventListener('ready', () => {
        setIsLoading(false);
      });
      
      // 에러 이벤트
      player.addEventListener('error', () => {
        setIsLoading(false);
        setHasError(true);
      });
      
      containerRef.current.appendChild(player);
    }
  }, [src]);

  return (
    <div className="lottie-player-container">
      {isLoading && (
        <div className="lottie-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      {hasError && (
        <div className="lottie-error">
          <div className="text-s">로드 실패</div>
        </div>
      )}
      <div ref={containerRef} className="lottie-content"></div>
    </div>
  );
};

export const LottieAssetListPublic = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 스크립트가 이미 로드되어 있는지 확인
    if (document.querySelector('script[src*="lottie-player"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Lottie player script 로드 실패');
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!scriptLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="text-m text-secondary">Lottie Player 로딩중...</div>
      </div>
    );
  }

  return (
    <div className="lottie-assets-container">
      <div className="assets-header">
        <h1 className="title-l-bold text-primary">Lottie Assets</h1>
        <p className="text-m text-secondary">
          29cm Ruler 디자인 시스템에서 사용하는 Lottie 애니메이션 자산들입니다.
          <br />
          각 애니메이션을 미리보기하고 JSON 파일을 다운로드할 수 있습니다.
        </p>
      </div>
      
      <div className="assets-grid">
        {LOTTIE_FILES.map((file) => (
          <div key={file.name} className="asset-card">
            <div className="card-content">
              <div className="asset-preview">
                <LottiePlayer src={file.url} file={file} />
              </div>
              <div className="asset-info">
                <h3 className="text-l-medium text-primary asset-name">{file.name}</h3>
                <div className="asset-actions">
                  <button 
                    onClick={() => handleDownload(file.url, file.name)}
                    className="download-button"
                  >
                    <svg className="download-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-s-medium">다운로드</span>
                  </button>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="preview-button"
                  >
                    <svg className="preview-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-s-medium">미리보기</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
