export default function Pokeball({ size = 40, className = '', spinning = false }) {
  return (
    <svg
      className={`pokeball ${spinning ? 'pokeball--spinning' : ''} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Pokéball"
    >
      <defs>
        <linearGradient id="pokeball-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="55%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#0b1020" strokeWidth="7" />
      <path d="M5 50a45 45 0 0 1 90 0Z" fill="url(#pokeball-red)" />
      <rect x="5" y="46" width="90" height="8" fill="#0b1020" />
      <circle cx="50" cy="50" r="15" fill="#f8fafc" stroke="#0b1020" strokeWidth="7" />
      <circle cx="50" cy="50" r="5.5" fill="#cbd5e1" />
    </svg>
  )
}
