type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M8 40 L8 14 L28 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 40 H28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="22" y="26" width="5" height="14" rx="1" fill="currentColor" />
      <rect x="30" y="20" width="5" height="20" rx="1" fill="currentColor" />
      <rect x="38" y="12" width="5" height="28" rx="1" fill="currentColor" />
    </svg>
  );
}
