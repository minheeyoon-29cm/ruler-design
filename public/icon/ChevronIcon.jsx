// src/components/icons/ChevronIcon.jsx
export const ChevronIcon = ({ isOpen = false, className = "", size = 16 }) => {
  if (isOpen) {
    // 위쪽 화살표 (열린 상태)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-colors duration-200 ${className}`}
      >
        <path
          fill="currentColor"
          d="M3.32759 16.4224c-.43646-.3905-.43646-1.0235 0-1.414l8.38231-7.50002c.4365-.39053 1.1439-.39053 1.5804 0l8.3823 7.50002c.4365.3905.4365 1.0235 0 1.414-.4365.3906-1.144.3906-1.5804 0l-7.5921-6.79293L4.908 16.4224c-.43646.3906-1.14394.3906-1.58041 0Z"
        />
      </svg>
    );
  }

  // 아래쪽 화살표 (닫힌 상태)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      className={`transition-colors duration-200 ${className}`}
    >
      <path
        fill="currentColor"
        d="M20.7071 7.79302c.3905.39052.3905 1.02353 0 1.41406l-7.5 7.50002c-.3905.3905-1.0235.3905-1.4141 0L4.29305 9.20708c-.39053-.39053-.39053-1.02354 0-1.41406.39052-.39053 1.02353-.39053 1.41406 0L12.5001 14.586l6.7929-6.79298c.3906-.39053 1.0236-.39053 1.4141 0Z"
      />
    </svg>
  );
};
