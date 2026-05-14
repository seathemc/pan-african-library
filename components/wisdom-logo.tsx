// Conch shell mark — Wisdom's logo.
//
// In many African and Afro-Caribbean traditions, the conch shell is a calling instrument:
// you blow it to summon the community, to announce knowledge, to begin something important.
// The spiral also maps onto Wisdom's architecture — a tightening coil from past to future.
//
// This SVG is a clean geometric version that reads at icon size (32px and up).
// For large-format use (hero, print) commission a detailed engraving-style illustration.

interface WisdomLogoProps {
  className?: string
  size?: number
}

export function WisdomLogo({ className, size = 32 }: WisdomLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wisdom — conch shell mark"
    >
      {/* Outer body — the main shell form, widening downward */}
      <path
        d="M36 5 C44 5 52 13 52 22 C52 34 44 52 32 56 C20 52 12 38 12 28 C12 17 19 8 27 6 C29 5 32 4 36 5 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Spire — the tight spiral apex at top */}
      <path
        d="M36 5 C40 6 43 10 42 14 C41 18 37 19.5 34 18.5 C31.5 17.5 30.5 15 31.5 13 C32.5 11 35 11.5 36 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Flared lip — the thin wing that extends from the shell opening */}
      <path
        d="M12 28 C8 25 6 20 8 15 C10 11 14 10 18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Aperture — the curved opening of the shell */}
      <path
        d="M12 28 C16 33 22 36 28 36 C34 36 40 33 44 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner spiral — the internal chamber, gives depth */}
      <path
        d="M40 17 C42 20 42 25 40 29 C38 33 34 35 31 33 C28 31 27 28 29 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
    </svg>
  )
}

// Square icon variant — for sidebar header use
export function WisdomIcon({ className, size = 32 }: WisdomLogoProps) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <WisdomLogo size={Math.round(size * 0.65)} />
    </span>
  )
}
