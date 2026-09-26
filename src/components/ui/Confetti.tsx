// Confete de CSS: cada papelzinho é um span com trajetória própria em custom
// property. Sem canvas e sem dependência — some sozinho ao fim da animação.
const COLORS = ['bg-clay', 'bg-clay-light', 'bg-note-terracotta', 'bg-note-peach', 'bg-sand-dark'];

const PIECES = Array.from({ length: 24 }, (_, i) => {
  const fromLeft = i % 2 === 0;
  const spread = 80 + (i % 6) * 45;
  return {
    color: COLORS[i % COLORS.length],
    side: fromLeft ? 'left-0' : 'right-0',
    top: `${8 + ((i * 7) % 80)}%`,
    x: `${fromLeft ? spread : -spread}px`,
    y: `${-60 + ((i * 23) % 200)}px`,
    spin: `${fromLeft ? 1 : -1}${180 + ((i * 37) % 360)}deg`,
    delay: `${(i % 8) * 35}ms`,
  };
});

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden" aria-hidden>
      {PIECES.map((piece, i) => (
        <span
          key={i}
          className={`absolute size-2 rounded-xs animate-confetti ${piece.color} ${piece.side}`}
          style={
            {
              top: piece.top,
              animationDelay: piece.delay,
              '--confetti-x': piece.x,
              '--confetti-y': piece.y,
              '--confetti-spin': piece.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
