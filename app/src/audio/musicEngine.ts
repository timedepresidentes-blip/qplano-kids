/**
 * Motor de áudio procedural — portado do protótipo qplano-kids.html
 * Trilha: pad suave + arpejo + sino, loop de 4 compassos (Lá menor, Fá, Dó, Sol)
 * SFX: ok, bad, up, medal via Web Audio API
 * Inicia no primeiro toque do usuário (política do navegador)
 */

let AC: AudioContext | null = null
let sfxG: GainNode | null = null
let musicG: GainNode | null = null
let delayN: DelayNode | null = null
let duckLevel = 1

const M = {
  timer: 0 as ReturnType<typeof setInterval> | 0,
  next: 0,
  step: 0,
  dur: 60 / 76 / 2,  // ~0.394s por passo (76 BPM, colcheias)
}

export const audioSettings = { music: true, sfx: true }

function getAC(): AudioContext | null {
  if (!AC) {
    const C = (window.AudioContext ?? (window as any).webkitAudioContext) as typeof AudioContext | undefined
    if (!C) return null
    try {
      AC = new C()
      sfxG = AC.createGain(); sfxG.gain.value = 1; sfxG.connect(AC.destination)
      musicG = AC.createGain(); musicG.gain.value = 0; musicG.connect(AC.destination)
      delayN = AC.createDelay(1); delayN.delayTime.value = 0.39
      const fb = AC.createGain(); fb.gain.value = 0.38
      const wet = AC.createGain(); wet.gain.value = 0.4
      delayN.connect(fb); fb.connect(delayN); delayN.connect(wet); wet.connect(musicG)
    } catch { AC = null; return null }
  }
  if (AC.state === 'suspended') { try { void AC.resume() } catch {} }
  return AC
}

function tone(f: number, t0: number, d: number, type: OscillatorType = 'sine', g = 0.18) {
  if (!audioSettings.sfx) return
  const a = getAC(); if (!a || !sfxG) return
  try {
    const o = a.createOscillator(), v = a.createGain()
    o.type = type; o.frequency.value = f
    v.gain.setValueAtTime(0.0001, a.currentTime + t0)
    v.gain.exponentialRampToValueAtTime(g, a.currentTime + t0 + 0.02)
    v.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + d)
    o.connect(v); v.connect(sfxG)
    o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + d + 0.05)
  } catch {}
}

export function sfx(kind: 'ok' | 'bad' | 'up' | 'medal') {
  if (kind === 'ok')    { tone(660, 0, .14); tone(880, .12, .22) }
  if (kind === 'bad')   { tone(260, 0, .22, 'triangle', .16); tone(200, .16, .26, 'triangle', .14) }
  if (kind === 'up')    { ;[523,659,784,1047].forEach((f,i) => tone(f, i*.1, .2)) }
  if (kind === 'medal') { ;[784,988,1175,1568].forEach((f,i) => tone(f, i*.12, .26, 'triangle')) }
}

// Progressão: Lá menor → Fá → Dó → Sol
const CH = [[45,52,57,60],[41,48,53,57],[48,55,60,64],[43,50,55,59]]
const ARP = [0,1,2,3,2,1,3,2]
const PENT = [76,79,81,84,86]

function mtof(m: number) { return 440 * Math.pow(2, (m - 69) / 12) }

function mnote(m: number, t: number, d: number, type: OscillatorType, g: number, att: number, send: number) {
  if (!AC || !musicG || !delayN) return
  const o = AC.createOscillator(), v = AC.createGain()
  o.type = type; o.frequency.value = mtof(m)
  v.gain.setValueAtTime(0.0001, t)
  v.gain.linearRampToValueAtTime(g, t + att)
  v.gain.exponentialRampToValueAtTime(0.0001, t + d)
  o.connect(v); v.connect(musicG)
  if (send) { const s = AC.createGain(); s.gain.value = send; v.connect(s); s.connect(delayN) }
  o.start(t); o.stop(t + d + 0.1)
}

function mstep() {
  if (!AC) return
  while (M.next < AC.currentTime + 0.6) {
    const s = M.step % 32, bar = Math.floor(s / 8), st = s % 8
    const ch = CH[bar], t = M.next
    if (st === 0) {
      for (let i = 1; i < 4; i++) mnote(ch[i], t, M.dur * 8.5, 'triangle', 0.035, 0.7, 0.1)
      mnote(ch[0], t, M.dur * 3.6, 'sine', 0.13, 0.03, 0)
    }
    if (st === 4) mnote(ch[0], t, M.dur * 3, 'sine', 0.1, 0.03, 0)
    mnote(ch[ARP[st]] + 12, t, M.dur * 1.8, 'sine', 0.05, 0.02, 0.55)
    if ((st === 0 || st === 3 || st === 6) && Math.random() < 0.55)
      mnote(PENT[Math.floor(Math.random() * PENT.length)], t, M.dur * 3.5, 'triangle', 0.055, 0.01, 0.7)
    M.next += M.dur; M.step++
  }
}

function applyMusicGain() {
  if (!AC || !musicG) return
  const target = audioSettings.music ? 0.85 * duckLevel : 0
  try { musicG.gain.setTargetAtTime(target, AC.currentTime, 0.25) } catch {}
}

export function startMusic() {
  const a = getAC(); if (!a) return
  if (M.timer) { applyMusicGain(); return }
  M.next = a.currentTime + 0.15; M.step = 0
  M.timer = setInterval(mstep, 120); mstep(); applyMusicGain()
}

export function stopMusic() {
  applyMusicGain()
  if (M.timer) {
    setTimeout(() => {
      if (!audioSettings.music && M.timer) {
        clearInterval(M.timer as ReturnType<typeof setInterval>)
        M.timer = 0
      }
    }, 1200)
  }
}

export function duck(on: boolean) { duckLevel = on ? 0.3 : 1; applyMusicGain() }

export function toggleMusic() {
  audioSettings.music = !audioSettings.music
  if (audioSettings.music) startMusic(); else stopMusic()
}

export function toggleSfx() { audioSettings.sfx = !audioSettings.sfx }

/** Deve ser chamado uma vez no mount do App. */
export function initAudio() {
  document.addEventListener('pointerdown', () => {
    if (audioSettings.music) startMusic()
  }, { once: true })
  document.addEventListener('visibilitychange', () => {
    try {
      if (document.hidden) void AC?.suspend()
      else if (audioSettings.music || audioSettings.sfx) void AC?.resume()
    } catch {}
  })
}
