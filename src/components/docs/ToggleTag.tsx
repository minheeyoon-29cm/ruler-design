import '../../styles/components/toggle-tag.css';

interface ToggleTagProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

export const ToggleTag = ({ 
  label, 
  isSelected = false, 
  onClick, 
  size = 'medium',
  disabled = false 
}: ToggleTagProps) => {
  const sizeClass = size === 'small' ? 'toggle-tag--small' : 'toggle-tag--medium';
  const selectedClass = isSelected ? 'toggle-tag--selected' : '';
  const disabledClass = disabled ? 'toggle-tag--disabled' : '';
  
  return (
    <button
      className={`toggle-tag ${sizeClass} ${selectedClass} ${disabledClass}`.trim()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
};