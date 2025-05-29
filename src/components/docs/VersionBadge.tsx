import '../../styles/components/version-badge.css';

interface VersionBadgeProps {
  version: string;                    // "2.0.0", "1.5.2"
  showPrefix?: boolean;              // "v" 표시 여부 (기본: true)
  priority?: 'primary' | 'secondary' | 'tertiary'; // 우선순위
  size?: 'small' | 'medium';        // 크기
  isLatest?: boolean;                // 최신 버전 강조
  className?: string;                // 추가 클래스명
}

const priorityClassMap: Record<VersionBadgeProps['priority'] & string, string> = {
  primary: 'version-badge--primary',
  secondary: 'version-badge--secondary', 
  tertiary: 'version-badge--tertiary',
};

const sizeClassMap: Record<VersionBadgeProps['size'] & string, string> = {
  small: 'version-badge--small',
  medium: 'version-badge--medium',
};

export const VersionBadge = ({ 
  version,
  showPrefix = true,
  priority = 'secondary',
  size = 'small',
  isLatest = false,
  className = ''
}: VersionBadgeProps) => {
  const displayVersion = showPrefix ? `v${version}` : version;
  
  const classNames = [
    'version-badge',
    priorityClassMap[priority],
    sizeClassMap[size],
    isLatest && 'version-badge--latest',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} title={`Version ${version}`}>
      {displayVersion}
    </span>
  );
};