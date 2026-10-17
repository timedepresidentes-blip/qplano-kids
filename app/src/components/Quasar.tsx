/* Mascote Quasar — robô IA espacial, versão 2.0
 * Mood: neutral (cyan) | happy (dourado) | sad (vermelho)
 * Inclui: visor com scanlines, olhos animados, núcleo pulsante */
export function Quasar({ size = 120, mood = 'neutral' }: { size?: number; mood?: 'neutral' | 'happy' | 'sad' }) {
  const eyeColor  = mood === 'happy' ? '#FFD700' : mood === 'sad' ? '#FF4B4B' : '#00C8FF'
  const ledColor  = mood === 'happy' ? '#58CC02' : mood === 'sad' ? '#FF4B4B' : '#FFD700'
  const uid = `q${size}${mood}`   // evita colisão de IDs de gradiente

  return (
    <svg
      width={size}
      height={Math.round(size * 150 / 120)}
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 ${Math.round(size * .15)}px rgba(0,200,255,.55))`, overflow: 'visible' }}
    >
      {/* ── Halo de energia ────────────────────────── */}
      <ellipse cx="60" cy="75" rx="54" ry="62" fill={`url(#halo${uid})`} opacity=".2"/>

      {/* ── Antena ──────────────────────────────────── */}
      <line x1="60" y1="6" x2="60" y2="18" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="4" r="5" fill="#FFD700" stroke="#FFE27A" strokeWidth="1.5">
        <animate attributeName="opacity" values="1;.45;1" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="r"       values="5;6.5;5" dur="1.4s" repeatCount="indefinite"/>
      </circle>

      {/* ── Cabeça ──────────────────────────────────── */}
      <rect x="25" y="16" width="70" height="60" rx="22" fill={`url(#head${uid})`} stroke="#00C8FF" strokeWidth="2.5"/>
      {/* brilho superior */}
      <rect x="30" y="19" width="60" height="16" rx="12" fill="#FFF" opacity=".06"/>

      {/* ── Visor ───────────────────────────────────── */}
      <rect x="31" y="24" width="58" height="42" rx="14" fill={`url(#visor${uid})`} stroke={eyeColor} strokeWidth="1.8"/>
      {/* scanlines */}
      {[28,33,38,43,48,53,58].map(y => (
        <rect key={y} x="31" y={y} width="58" height="1.2" rx=".4" fill={eyeColor} opacity=".1"/>
      ))}

      {/* ── Olho esquerdo ────────────────────────────── */}
      <ellipse cx="48" cy="45" rx="9" ry="10" fill="#001A3A"/>
      <ellipse cx="48" cy="45" rx="7" ry="8"  fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="8;1;8" dur="3.6s" begin="0.4s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="48" cy="45" rx="3.5" ry="4" fill="#00070F"/>
      <ellipse cx="46" cy="43"  rx="1.8" ry="1.8" fill="#FFF" opacity=".85"/>

      {/* ── Olho direito ─────────────────────────────── */}
      <ellipse cx="72" cy="45" rx="9" ry="10" fill="#001A3A"/>
      <ellipse cx="72" cy="45" rx="7" ry="8"  fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="8;1;8" dur="3.6s" begin="0.8s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="72" cy="45" rx="3.5" ry="4" fill="#00070F"/>
      <ellipse cx="70" cy="43"  rx="1.8" ry="1.8" fill="#FFF" opacity=".85"/>

      {/* ── Boca expressiva ──────────────────────────── */}
      {mood === 'happy' && (
        <path d="M 44 61 Q 60 70 76 61" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      )}
      {mood === 'sad' && (
        <path d="M 44 68 Q 60 59 76 68" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      )}
      {mood === 'neutral' && (
        <line x1="44" y1="64" x2="76" y2="64" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round"/>
      )}

      {/* ── Pescoço ──────────────────────────────────── */}
      <rect x="50" y="75" width="20" height="12" rx="5" fill="#0A1628" stroke="#00C8FF" strokeWidth="1.5"/>

      {/* ── Corpo ────────────────────────────────────── */}
      <rect x="22" y="85" width="76" height="55" rx="20" fill={`url(#body${uid})`} stroke="#00C8FF" strokeWidth="2.2"/>
      {/* brilho superior do corpo */}
      <rect x="27" y="88" width="66" height="12" rx="10" fill="#FFF" opacity=".05"/>

      {/* ── Painel de peito ──────────────────────────── */}
      <rect x="34" y="93" width="52" height="38" rx="12" fill="#050D1A" stroke="#00C8FF" strokeWidth="1.5"/>

      {/* ── Núcleo de energia ────────────────────────── */}
      <circle cx="60" cy="112" r="11" fill="#00070F" stroke={eyeColor} strokeWidth="1.5"/>
      <circle cx="60" cy="112" r="7"  fill={eyeColor} opacity=".7">
        <animate attributeName="r"       values="7;9.5;7"   dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".7;.25;.7"  dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="112" r="3.5" fill="#FFFFFF"/>

      {/* ── LEDs do painel ───────────────────────────── */}
      <circle cx="40" cy="97" r="3" fill={ledColor}>
        <animate attributeName="opacity" values="1;.2;1" dur="0.9s" repeatCount="indefinite"/>
      </circle>
      <circle cx="47" cy="97" r="3" fill="#00C8FF" opacity=".8"/>
      <circle cx="54" cy="97" r="3" fill="#9333EA" opacity=".6"/>

      {/* ── Braços ───────────────────────────────────── */}
      <rect x="2"  y="87" width="20" height="38" rx="10" fill={`url(#arm${uid})`} stroke="#00C8FF" strokeWidth="1.8"/>
      <rect x="98" y="87" width="20" height="38" rx="10" fill={`url(#arm${uid})`} stroke="#00C8FF" strokeWidth="1.8"/>
      {/* articulações */}
      <circle cx="12"  cy="90" r="5.5" fill="#050D1A" stroke="#00C8FF" strokeWidth="1.5"/>
      <circle cx="108" cy="90" r="5.5" fill="#050D1A" stroke="#00C8FF" strokeWidth="1.5"/>
      {/* mãos */}
      <circle cx="12"  cy="129" r="10" fill="#0A1628" stroke="#00C8FF" strokeWidth="1.8"/>
      <circle cx="108" cy="129" r="10" fill="#0A1628" stroke="#00C8FF" strokeWidth="1.8"/>
      {/* dedo indicador */}
      <rect x="7" y="122" width="4" height="8" rx="2" fill="#00C8FF" opacity=".6"/>

      {/* ── Pernas / base ────────────────────────────── */}
      <rect x="36" y="138" width="19" height="13" rx="7" fill="#0A1628" stroke="#00C8FF" strokeWidth="1.5"/>
      <rect x="65" y="138" width="19" height="13" rx="7" fill="#0A1628" stroke="#00C8FF" strokeWidth="1.5"/>
      {/* solado brilhante */}
      <rect x="36" y="147" width="19" height="4" rx="2" fill={eyeColor} opacity=".4"/>
      <rect x="65" y="147" width="19" height="4" rx="2" fill={eyeColor} opacity=".4"/>

      <defs>
        <radialGradient id={`halo${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#00C8FF" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#00C8FF" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`head${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#1A3D8A"/>
          <stop offset="100%" stopColor="#050D1A"/>
        </linearGradient>
        <radialGradient id={`visor${uid}`} cx="45%" cy="35%" r="70%">
          <stop offset="0%"   stopColor="#4FDFFF" stopOpacity=".45"/>
          <stop offset="100%" stopColor="#001A3A" stopOpacity=".85"/>
        </radialGradient>
        <linearGradient id={`body${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#132050"/>
          <stop offset="100%" stopColor="#050D1A"/>
        </linearGradient>
        <linearGradient id={`arm${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0E1F45"/>
          <stop offset="100%" stopColor="#071228"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
