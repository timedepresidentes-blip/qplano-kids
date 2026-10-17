/**
 * Personagem temático por missão.
 * Cicla entre Quasar (robô), Astro (astronauta) e Luna (lunar).
 * Cada personagem tem um som característico de aparecimento.
 */
import { useEffect } from 'react'
import { Quasar } from './Quasar'
import { sfx } from '../audio/musicEngine'

type Mood = 'neutral' | 'happy' | 'sad'
interface Props {
  missaoNum: number
  mood?: Mood
  size?: number
  playSound?: boolean
}

// ── Astronauta ────────────────────────────────────────────────────────
function Astro({ size = 120, mood = 'neutral' }: { size: number; mood: Mood }) {
  const eyeColor = mood === 'happy' ? '#FFD700' : mood === 'sad' ? '#FF4B4B' : '#8FFF8F'
  const uid = `a${size}${mood}`
  return (
    <svg width={size} height={Math.round(size * 150 / 120)} viewBox="0 0 120 150" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 16px rgba(100,255,120,.4))', overflow: 'visible' }}>
      {/* Halo verde */}
      <ellipse cx="60" cy="75" rx="52" ry="60" fill={`url(#ahalo${uid})`} opacity=".18"/>

      {/* Capacete externo */}
      <ellipse cx="60" cy="50" rx="36" ry="40" fill="#1A3050" stroke="#C0E8FF" strokeWidth="2.5"/>
      {/* Visor dourado */}
      <ellipse cx="60" cy="48" rx="26" ry="29" fill={`url(#avisor${uid})`} stroke={eyeColor} strokeWidth="2"/>
      {/* Brilho do visor */}
      <ellipse cx="52" cy="38" rx="8" ry="5" fill="#FFF" opacity=".12"/>
      {/* scanlines */}
      {[36,42,48,54,60,66].map(y => (
        <line key={y} x1="35" y1={y} x2="85" y2={y} stroke={eyeColor} strokeWidth=".8" opacity=".15"/>
      ))}

      {/* Rosto dentro do visor */}
      {/* olhos */}
      <ellipse cx="50" cy="46" rx="6" ry="7" fill="#000A1A"/>
      <ellipse cx="50" cy="46" rx="4.5" ry="5.5" fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="5.5;1;5.5" dur="3.8s" begin=".3s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="48.5" cy="44" rx="1.5" ry="1.5" fill="#FFF" opacity=".9"/>

      <ellipse cx="70" cy="46" rx="6" ry="7" fill="#000A1A"/>
      <ellipse cx="70" cy="46" rx="4.5" ry="5.5" fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="5.5;1;5.5" dur="3.8s" begin=".7s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="68.5" cy="44" rx="1.5" ry="1.5" fill="#FFF" opacity=".9"/>

      {/* boca */}
      {mood === 'happy' && <path d="M 46 60 Q 60 69 74 60" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round"/>}
      {mood === 'sad'   && <path d="M 46 66 Q 60 57 74 66" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round"/>}
      {mood === 'neutral' && <line x1="46" y1="62" x2="74" y2="62" stroke={eyeColor} strokeWidth="2" strokeLinecap="round"/>}

      {/* Bandeja do capacete (pescoço) */}
      <rect x="42" y="88" width="36" height="10" rx="4" fill="#1A3050" stroke="#C0E8FF" strokeWidth="1.5"/>

      {/* Traje espacial (corpo) */}
      <rect x="20" y="96" width="80" height="50" rx="22" fill={`url(#abody${uid})`} stroke="#C0E8FF" strokeWidth="2"/>
      {/* emblema NASA-like */}
      <circle cx="60" cy="116" r="12" fill="#001030" stroke={eyeColor} strokeWidth="1.5"/>
      <ellipse cx="60" cy="116" rx="8" ry="4" fill="none" stroke="#FF6B00" strokeWidth="1.5"/>
      <line x1="52" y1="116" x2="68" y2="116" stroke="#FFF" strokeWidth="1"/>

      {/* Braços */}
      <rect x="2"  y="98" width="18" height="36" rx="9" fill="#1A3050" stroke="#C0E8FF" strokeWidth="1.8"/>
      <rect x="100" y="98" width="18" height="36" rx="9" fill="#1A3050" stroke="#C0E8FF" strokeWidth="1.8"/>
      <circle cx="11"  cy="138" r="9" fill="#122040" stroke="#C0E8FF" strokeWidth="1.5"/>
      <circle cx="109" cy="138" r="9" fill="#122040" stroke="#C0E8FF" strokeWidth="1.5"/>

      {/* Pernas */}
      <rect x="34" y="144" width="18" height="12" rx="7" fill="#1A3050" stroke="#C0E8FF" strokeWidth="1.5"/>
      <rect x="68" y="144" width="18" height="12" rx="7" fill="#1A3050" stroke="#C0E8FF" strokeWidth="1.5"/>

      {/* Antena lateral no capacete */}
      <line x1="94" y1="30" x2="100" y2="18" stroke="#C0E8FF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="101" cy="16" r="3.5" fill={eyeColor}>
        <animate attributeName="opacity" values="1;.3;1" dur="0.7s" repeatCount="indefinite"/>
      </circle>

      <defs>
        <radialGradient id={`ahalo${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#8FFF8F" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#8FFF8F" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`avisor${uid}`} cx="45%" cy="35%" r="70%">
          <stop offset="0%"   stopColor="#C0E8FF" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#001A3A" stopOpacity=".85"/>
        </radialGradient>
        <linearGradient id={`abody${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#1A3060"/>
          <stop offset="100%" stopColor="#060E20"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Luna ─────────────────────────────────────────────────────────────
function Luna({ size = 120, mood = 'neutral' }: { size: number; mood: Mood }) {
  const eyeColor  = mood === 'happy' ? '#FFD700' : mood === 'sad' ? '#FF8FD0' : '#FFB0FF'
  const starColor = '#FFD700'
  const uid = `l${size}${mood}`
  return (
    <svg width={size} height={Math.round(size * 150 / 120)} viewBox="0 0 120 150" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 16px rgba(255,180,255,.5))', overflow: 'visible' }}>
      {/* Halo roxo */}
      <ellipse cx="60" cy="75" rx="52" ry="60" fill={`url(#lhalo${uid})`} opacity=".22"/>

      {/* Cabelo tipo lua crescente no topo */}
      <path d="M 28 42 Q 20 10 60 8 Q 100 10 92 42" fill={`url(#lhair${uid})`} stroke="#9333EA" strokeWidth="2"/>
      {/* estrelinhas no cabelo */}
      <text x="45" y="20" fontSize="10" fill={starColor}>✦</text>
      <text x="65" y="16" fontSize="8"  fill={starColor} opacity=".8">✦</text>
      <text x="78" y="25" fontSize="7"  fill={starColor} opacity=".6">✦</text>

      {/* Cabeça */}
      <ellipse cx="60" cy="54" rx="32" ry="34" fill={`url(#lhead${uid})`} stroke="#C77EFF" strokeWidth="2"/>
      {/* brilho */}
      <ellipse cx="48" cy="40" rx="10" ry="6" fill="#FFF" opacity=".1"/>

      {/* Olhos grandes */}
      <ellipse cx="48" cy="52" rx="9" ry="11" fill="#1A0030"/>
      <ellipse cx="48" cy="52" rx="7" ry="9" fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="9;2;9" dur="4s" begin=".2s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="48" cy="52" rx="4" ry="5" fill="#100020"/>
      <ellipse cx="46" cy="49" rx="2" ry="2" fill="#FFF" opacity=".9"/>

      <ellipse cx="72" cy="52" rx="9" ry="11" fill="#1A0030"/>
      <ellipse cx="72" cy="52" rx="7" ry="9" fill={eyeColor} opacity=".9">
        <animate attributeName="ry" values="9;2;9" dur="4s" begin=".6s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="72" cy="52" rx="4" ry="5" fill="#100020"/>
      <ellipse cx="70" cy="49" rx="2" ry="2" fill="#FFF" opacity=".9"/>

      {/* bochechas coradas */}
      <ellipse cx="40" cy="64" rx="7" ry="4" fill="#FF6EB4" opacity=".35"/>
      <ellipse cx="80" cy="64" rx="7" ry="4" fill="#FF6EB4" opacity=".35"/>

      {/* boca */}
      {mood === 'happy'   && <path d="M 46 66 Q 60 76 74 66" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {mood === 'sad'     && <path d="M 46 72 Q 60 63 74 72" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {mood === 'neutral' && <ellipse cx="60" cy="68" rx="7" ry="3" fill="none" stroke={eyeColor} strokeWidth="2"/>}

      {/* Pescoço */}
      <rect x="50" y="86" width="20" height="10" rx="5" fill="#1A0040" stroke="#C77EFF" strokeWidth="1.5"/>

      {/* Vestido/corpo estrelado */}
      <path d="M 20 96 Q 18 146 60 148 Q 102 146 100 96 Q 80 104 60 102 Q 40 104 20 96 Z"
        fill={`url(#lbody${uid})`} stroke="#C77EFF" strokeWidth="2"/>
      {/* estrelas decorativas no corpo */}
      <text x="52" y="118" fontSize="14" fill={starColor} opacity=".7">★</text>
      <text x="38" y="132" fontSize="9"  fill="#FF80FF"  opacity=".6">✦</text>
      <text x="70" y="130" fontSize="9"  fill="#FF80FF"  opacity=".6">✦</text>

      {/* Braços */}
      <path d="M 22 100 Q 10 112 14 128" stroke="#C77EFF" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M 98 100 Q 110 112 106 128" stroke="#C77EFF" strokeWidth="14" strokeLinecap="round" fill="none"/>
      {/* mãos */}
      <circle cx="14"  cy="130" r="9" fill="#1A0040" stroke="#C77EFF" strokeWidth="1.5"/>
      <circle cx="106" cy="130" r="9" fill="#1A0040" stroke="#C77EFF" strokeWidth="1.5"/>

      <defs>
        <radialGradient id={`lhalo${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#C77EFF" stopOpacity=".5"/>
          <stop offset="100%" stopColor="#C77EFF" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`lhair${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#7B2FBE"/>
          <stop offset="100%" stopColor="#5B1F8A"/>
        </linearGradient>
        <radialGradient id={`lhead${uid}`} cx="45%" cy="35%">
          <stop offset="0%"   stopColor="#3B0070"/>
          <stop offset="100%" stopColor="#16003A"/>
        </radialGradient>
        <linearGradient id={`lbody${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#4A0090"/>
          <stop offset="100%" stopColor="#16003A"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Seleção por missão ─────────────────────────────────────────────────
function selectChar(n: number): 'quasar' | 'astro' | 'luna' {
  const chars: ('quasar' | 'astro' | 'luna')[] = ['quasar', 'astro', 'luna']
  return chars[(n - 1) % 3]
}

const CHAR_SFX: Record<string, 'quasar' | 'astro' | 'luna'> = {
  quasar: 'quasar',
  astro:  'astro',
  luna:   'luna',
}

export function Personagem({ missaoNum, mood = 'neutral', size = 120, playSound = true }: Props) {
  const char = selectChar(missaoNum)

  useEffect(() => {
    if (playSound) {
      const t = setTimeout(() => sfx(CHAR_SFX[char]), 300)
      return () => clearTimeout(t)
    }
  }, [char, playSound])

  if (char === 'astro') return <Astro size={size} mood={mood}/>
  if (char === 'luna')  return <Luna  size={size} mood={mood}/>
  return <Quasar size={size} mood={mood}/>
}
