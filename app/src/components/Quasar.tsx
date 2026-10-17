/**
 * Quasar — mascote robô-astronauta 3D.
 * CSS animations (não SMIL) para máxima estabilidade no Chrome Android.
 * Gradientes radiais com luz upper-left = ilusão de esfera 3D.
 */

interface Props {
  size?: number
  mood?: 'neutral' | 'happy' | 'sad'
}

export function Quasar({ size = 120, mood = 'neutral' }: Props) {
  const eyeC = mood === 'happy' ? '#58CC02' : mood === 'sad' ? '#FF4B4B' : '#00C8FF'
  const uid  = `q${size}${mood}`
  const h    = Math.round(size * 160 / 120)

  /* usa apenas opacity+transform — suporte universal no Chrome Android */
  const css = `
    @keyframes antBlink${uid} { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.22)} }
    @keyframes eyeL${uid}     { 0%,78%,100%{transform:scaleY(1);opacity:0.9} 85%{transform:scaleY(0.08);opacity:0.2} }
    @keyframes eyeR${uid}     { 0%,58%,100%{transform:scaleY(1);opacity:0.9} 65%{transform:scaleY(0.08);opacity:0.2} }
    @keyframes core${uid}     { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:0.12;transform:scale(1.5)} }
    @keyframes led${uid}      { 0%,100%{opacity:1} 50%{opacity:0.15} }
    .ant-tip-${uid}  { animation:antBlink${uid} 1.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
    .eye-l-${uid}    { animation:eyeL${uid} 4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
    .eye-r-${uid}    { animation:eyeR${uid} 4s ease-in-out infinite 0.6s; transform-box:fill-box; transform-origin:center; }
    .core-${uid}     { animation:core${uid} 2.2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
    .led-g-${uid}    { animation:led${uid} 0.9s ease-in-out infinite; }
  `

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <style>{css}</style>

      {/* Sombra no chão */}
      <ellipse cx="60" cy="156" rx="30" ry="4" fill="rgba(0,0,0,0.22)" />

      {/* ── Antena ── */}
      <line x1="60" y1="8" x2="60" y2="17" stroke="#9BB0C8" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="5" r="4.5" fill="#FFD700" className={`ant-tip-${uid}`}/>
      <circle cx="60" cy="5" r="2" fill="white" opacity="0.8"/>

      {/* ── Capacete esfera 3D ── */}
      <circle cx="60" cy="52" r="36" fill={`url(#hB${uid})`}/>
      <ellipse cx="60" cy="83" rx="31" ry="7" fill="rgba(0,20,60,0.18)"/>
      <ellipse cx="46" cy="37" rx="13" ry="8"  fill="white" opacity="0.45" transform="rotate(-25 46 37)"/>
      <ellipse cx="42" cy="32" rx="5.5" ry="3" fill="white" opacity="0.75" transform="rotate(-25 42 32)"/>

      {/* ── Visor dourado ── */}
      <ellipse cx="60" cy="54" rx="24" ry="20" fill={`url(#vs${uid})`}/>
      <ellipse cx="51" cy="46" rx="8" ry="4.5" fill="rgba(255,255,255,0.28)" transform="rotate(-15 51 46)"/>

      {/* ── Olhos LED ── */}
      <circle cx="51" cy="55" r="7.5" fill="#030E1A"/>
      <ellipse cx="51" cy="55" rx="5.5" ry="5.5" fill={eyeC} opacity="0.9" className={`eye-l-${uid}`}/>
      <ellipse cx="49" cy="53" rx="2" ry="2" fill="white" opacity="0.85"/>

      <circle cx="69" cy="55" r="7.5" fill="#030E1A"/>
      <ellipse cx="69" cy="55" rx="5.5" ry="5.5" fill={eyeC} opacity="0.9" className={`eye-r-${uid}`}/>
      <ellipse cx="67" cy="53" rx="2" ry="2" fill="white" opacity="0.85"/>

      {/* ── Expressão ── */}
      {mood === 'happy'   && <path d="M47 69 Q60 78 73 69" stroke={eyeC} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {mood === 'sad'     && <path d="M47 74 Q60 65 73 74" stroke={eyeC} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {mood === 'neutral' && <line x1="47" y1="71" x2="73" y2="71" stroke={eyeC} strokeWidth="2.5" strokeLinecap="round"/>}

      {/* ── Colar ── */}
      <rect x="40" y="86" width="40" height="9" rx="4.5" fill={`url(#col${uid})`}/>

      {/* ── Braços ── */}
      <rect x="2"  y="93" width="21" height="46" rx="10.5" fill={`url(#arm${uid})`}/>
      <rect x="97" y="93" width="21" height="46" rx="10.5" fill={`url(#arm${uid})`}/>
      <circle cx="12.5"  cy="95" r="5.5" fill={`url(#jnt${uid})`}/>
      <circle cx="107.5" cy="95" r="5.5" fill={`url(#jnt${uid})`}/>
      <circle cx="12.5"  cy="137" r="10" fill={`url(#glv${uid})`}/>
      <circle cx="107.5" cy="137" r="10" fill={`url(#glv${uid})`}/>

      {/* ── Corpo ── */}
      <rect x="22" y="92" width="76" height="57" rx="23" fill={`url(#bod${uid})`}/>

      {/* ── Painel de peito ── */}
      <rect x="33" y="100" width="54" height="42" rx="13" fill={`url(#pnl${uid})`}/>
      <rect x="33" y="100" width="54" height="42" rx="13" fill="none" stroke="rgba(0,160,230,0.5)" strokeWidth="1.5"/>

      <circle cx="40" cy="107" r="3.5" fill="#58CC02" className={`led-g-${uid}`}/>
      <circle cx="49" cy="107" r="3.5" fill="#FFD700"/>
      <circle cx="58" cy="107" r="3.5" fill={eyeC} opacity="0.9"/>

      {/* Núcleo pulsante */}
      <circle cx="60" cy="121" r="11.5" fill="#000C1E" stroke={eyeC} strokeWidth="1.5"/>
      <circle cx="60" cy="121" r="8"    fill={eyeC} opacity="0.55" className={`core-${uid}`}/>
      <circle cx="60" cy="121" r="3.5"  fill="white" opacity="0.9"/>

      {/* ── Botas ── */}
      <rect x="33" y="146" width="22" height="13" rx="6.5" fill={`url(#bt${uid})`}/>
      <rect x="65" y="146" width="22" height="13" rx="6.5" fill={`url(#bt${uid})`}/>
      <rect x="31" y="153" width="26" height="5" rx="2.5" fill="rgba(0,15,45,0.45)"/>
      <rect x="63" y="153" width="26" height="5" rx="2.5" fill="rgba(0,15,45,0.45)"/>

      <defs>
        <radialGradient id={`hB${uid}`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#EDF4FF"/>
          <stop offset="38%"  stopColor="#C4D8EF"/>
          <stop offset="72%"  stopColor="#86A9CD"/>
          <stop offset="100%" stopColor="#4A6C92"/>
        </radialGradient>
        <radialGradient id={`vs${uid}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="#FFF2A0"/>
          <stop offset="38%"  stopColor="#E8A500"/>
          <stop offset="100%" stopColor="#6C4200"/>
        </radialGradient>
        <linearGradient id={`col${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#7898B8"/>
          <stop offset="100%" stopColor="#2E4A68"/>
        </linearGradient>
        <radialGradient id={`bod${uid}`} cx="32%" cy="16%" r="78%">
          <stop offset="0%"   stopColor="#D8EAFF"/>
          <stop offset="44%"  stopColor="#8AAAD0"/>
          <stop offset="100%" stopColor="#2E5080"/>
        </radialGradient>
        <linearGradient id={`pnl${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#061828"/>
          <stop offset="100%" stopColor="#010C1C"/>
        </linearGradient>
        <radialGradient id={`arm${uid}`} cx="28%" cy="20%" r="80%">
          <stop offset="0%"   stopColor="#CADCEF"/>
          <stop offset="100%" stopColor="#3C5A7A"/>
        </radialGradient>
        <radialGradient id={`jnt${uid}`} cx="32%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#D8E8FF"/>
          <stop offset="100%" stopColor="#3A5870"/>
        </radialGradient>
        <radialGradient id={`glv${uid}`} cx="32%" cy="26%" r="74%">
          <stop offset="0%"   stopColor="#BAD2E8"/>
          <stop offset="100%" stopColor="#263C52"/>
        </radialGradient>
        <linearGradient id={`bt${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#6A8AAC"/>
          <stop offset="100%" stopColor="#1C3050"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
