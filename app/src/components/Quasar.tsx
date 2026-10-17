/* Mascote Quasar — robô astronauta SVG inline */
export function Quasar({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 18px rgba(122,167,255,.5))' }}>
      {/* Capacete */}
      <ellipse cx="60" cy="48" rx="32" ry="34" fill="#1a2860" stroke="#7aa7ff" strokeWidth="2.5"/>
      <ellipse cx="60" cy="48" rx="24" ry="26" fill="#0d1640" stroke="#5580ff" strokeWidth="1.5"/>
      {/* Visor */}
      <ellipse cx="60" cy="47" rx="18" ry="20" fill="#4fc3f7" opacity="0.18"/>
      <ellipse cx="60" cy="47" rx="18" ry="20" fill="url(#visor)" stroke="#8fd3ff" strokeWidth="1.5"/>
      {/* Olhos */}
      <ellipse cx="51" cy="44" rx="5" ry="6" fill="#ffc531"/>
      <ellipse cx="69" cy="44" rx="5" ry="6" fill="#ffc531"/>
      <ellipse cx="51" cy="45" rx="2.5" ry="3" fill="#2a1700"/>
      <ellipse cx="69" cy="45" rx="2.5" ry="3" fill="#2a1700"/>
      <ellipse cx="52" cy="43.5" rx="1" ry="1" fill="#fff" opacity="0.7"/>
      <ellipse cx="70" cy="43.5" rx="1" ry="1" fill="#fff" opacity="0.7"/>
      {/* Antena */}
      <line x1="60" y1="14" x2="60" y2="24" stroke="#7aa7ff" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="11" r="4" fill="#ffc531" stroke="#ffe27a" strokeWidth="1.5"/>
      {/* Corpo */}
      <rect x="32" y="78" width="56" height="44" rx="14" fill="#1a2860" stroke="#5580ff" strokeWidth="2"/>
      {/* Emblema no peito */}
      <circle cx="60" cy="96" r="10" fill="#0d1640" stroke="#7aa7ff" strokeWidth="1.5"/>
      <text x="60" y="100" textAnchor="middle" fontSize="11" fill="#ffc531" fontWeight="bold">Q</text>
      {/* Braços */}
      <rect x="12" y="80" width="18" height="32" rx="9" fill="#1a2860" stroke="#5580ff" strokeWidth="1.8"/>
      <rect x="90" y="80" width="18" height="32" rx="9" fill="#1a2860" stroke="#5580ff" strokeWidth="1.8"/>
      {/* Mãos */}
      <circle cx="21" cy="116" r="7" fill="#162050" stroke="#7aa7ff" strokeWidth="1.5"/>
      <circle cx="99" cy="116" r="7" fill="#162050" stroke="#7aa7ff" strokeWidth="1.5"/>
      {/* Pernas */}
      <rect x="40" y="120" width="15" height="16" rx="7" fill="#1a2860" stroke="#5580ff" strokeWidth="1.5"/>
      <rect x="65" y="120" width="15" height="16" rx="7" fill="#1a2860" stroke="#5580ff" strokeWidth="1.5"/>
      <defs>
        <radialGradient id="visor" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#8fd3ff" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#1a4080" stopOpacity="0.1"/>
        </radialGradient>
      </defs>
    </svg>
  )
}
