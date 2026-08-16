export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M4 20V6l16 12V4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-700 tracking-tight text-foreground">
          NEXORA
        </span>
      )}
    </span>
  );
}
