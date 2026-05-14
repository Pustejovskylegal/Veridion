export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#8CB4FF" />
        </linearGradient>
      </defs>
      <path
        d="M4 6.5L16 27 28 6.5"
        stroke="url(#vg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 6.5L16 17l5.5-10.5"
        stroke="url(#vg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
