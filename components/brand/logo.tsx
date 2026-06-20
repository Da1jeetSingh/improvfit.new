type LogoProps = {
  className?: string;
};

/**
 * Right triangle + three growth bars. Bar tops follow the same upward
 * diagonal as the triangle hypotenuse.
 */
export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 58 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M6 40 L28 40 L28 24 Z" fill="currentColor" />
      <path
        d="M31 40 L36 40 L36 24 L31 20 Z M38.5 40 L43.5 40 L43.5 18 L38.5 14 Z M46 40 L51 40 L51 12 L46 8 Z"
        fill="currentColor"
      />
    </svg>
  );
}
