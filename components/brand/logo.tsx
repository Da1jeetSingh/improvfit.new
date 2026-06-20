type LogoProps = {
  className?: string;
};

/**
 * Mountain + growth bars mark. Slanted bar tops share the same diagonal
 * as the truncated right leg of the peak.
 */
export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M6 42 L6 14 L24 4 L31 20"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 42 L41 42 L41 14.8 L36 17.4 Z M44 42 L49 42 L49 12.2 L44 14.8 Z M52 42 L57 42 L57 9.6 L52 12.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}
