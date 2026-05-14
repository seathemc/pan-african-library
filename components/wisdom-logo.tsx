// Sankofa-inspired mark.
// Sankofa (Adinkra) means "go back and fetch what you left behind" —
// a bird looking backward while moving forward, carrying an egg.
// The heart form is the simplified Adinkra version of the same symbol.
// Perfect for a knowledge library that mines the past to build the future.

interface WisdomLogoProps {
  className?: string
  size?: number
}

export function WisdomLogo({ className, size = 32 }: WisdomLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wisdom — Sankofa mark"
    >
      {/* Sankofa heart — the body of the bird looking backward */}
      <path
        d="M16 27 C11 23 4 19 4 13 C4 9.5 6.8 7 10 7 C12 7 13.8 8 16 10 C18.2 8 20 7 22 7 C25.2 7 28 9.5 28 13 C28 19 21 23 16 27 Z"
        fill="currentColor"
      />
      {/* The egg — the seed of knowledge being carried forward */}
      <circle cx="16" cy="4.5" r="2.5" fill="currentColor" />
      {/* The neck — connecting past to future */}
      <line x1="16" y1="7" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Square icon variant — for sidebar and favicon-style use
export function WisdomIcon({ className, size = 32 }: WisdomLogoProps) {
  return (
    <span
      className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <WisdomLogo size={Math.round(size * 0.6)} />
    </span>
  )
}
