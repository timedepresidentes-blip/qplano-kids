/**
 * Motor de voz do Quasar — Web Speech API com voz robótica masculina.
 * Pitch baixo + rate reduzida = efeito de robô.
 * audio.json (pré-gravado) usado como fallback se SpeechSynthesis não disponível.
 */
import { duck } from './musicEngine'

const OK_PHRASES = [
  'Isso aí, Miguel!',
  'Mandou bem!',
  'Acertou em cheio!',
  'Show de bola!',
  'Que explorador!',
  'Genial, Miguel!',
  'Uau, acertou!',
  'Que cérebro!',
]

const BAD_PHRASES = [
  'Quase, tente de novo!',
  'Boa tentativa!',
  'Vamos aprender juntos!',
  'Quase lá!',
  'Errar faz parte de aprender!',
]

// ── Web Speech API ─────────────────────────────────────────────────────

let prefVoice: SpeechSynthesisVoice | null = null
let voicesReady = false

function loadVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  if (!voices.length) return
  voicesReady = true
  // Tenta voz masculina pt-BR; aceita qualquer pt como fallback
  prefVoice =
    voices.find(v => v.lang === 'pt-BR' && /felipe|male|masculin/i.test(v.name)) ??
    voices.find(v => v.lang.startsWith('pt-BR')) ??
    voices.find(v => v.lang.startsWith('pt')) ??
    null
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
  loadVoice()
}

function speakWS(text: string): boolean {
  const synth = window.speechSynthesis
  if (!synth) return false

  synth.cancel()
  if (!voicesReady) loadVoice()

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang   = 'pt-BR'
  utt.pitch  = 0.45   // grave: efeito robótico
  utt.rate   = 0.82   // levemente mais lento
  utt.volume = 1
  if (prefVoice) utt.voice = prefVoice

  utt.onstart = () => duck(true)
  utt.onend   = () => duck(false)
  utt.onerror = () => duck(false)

  synth.speak(utt)
  return true
}

// ── Fallback: audio.json pré-gravado ──────────────────────────────────

let audioMap: Record<string, string> | null = null
let loadPromise: Promise<void> | null = null
let audioAC: AudioContext | null = null
let activeSrc: AudioBufferSourceNode | null = null

function getAudioAC(): AudioContext {
  if (!audioAC) audioAC = new (window.AudioContext || (window as any).webkitAudioContext)()
  return audioAC
}

function ensureLoaded(): Promise<void> {
  if (audioMap) return Promise.resolve()
  if (!loadPromise) {
    loadPromise = fetch('/audio/audio.json')
      .then(r => r.json() as Promise<Record<string, string>>)
      .then(d => { audioMap = d })
      .catch(() => { audioMap = {} })
  }
  return loadPromise
}

async function playFallback(text: string): Promise<void> {
  await ensureLoaded()
  const b64 = audioMap?.[text]
  if (!b64) return

  const ac = getAudioAC()
  if (ac.state === 'suspended') await ac.resume()

  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  let buffer: AudioBuffer
  try { buffer = await ac.decodeAudioData(bytes.buffer) }
  catch { return }

  try { activeSrc?.stop() } catch {}

  // Aplica filtro para soar mais robótico
  const highpass = ac.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 300

  const peaking = ac.createBiquadFilter()
  peaking.type = 'peaking'
  peaking.frequency.value = 1200
  peaking.gain.value = 6

  duck(true)
  const src = ac.createBufferSource()
  src.buffer = buffer
  src.playbackRate.value = 0.92 // levemente mais lento = mais grave/robótico
  src.connect(highpass)
  highpass.connect(peaking)
  peaking.connect(ac.destination)
  activeSrc = src

  await new Promise<void>(resolve => {
    src.onended = () => { duck(false); activeSrc = null; resolve() }
    src.start()
  })
}

// ── API pública ────────────────────────────────────────────────────────

/** Fala o texto com voz robótica. Web Speech API primeiro, audio.json como fallback. */
export function speak(text: string): void {
  if (!speakWS(text)) {
    playFallback(text).catch(() => {})
  }
}

/** Para qualquer fala em andamento. */
export function stopVoice(): void {
  window.speechSynthesis?.cancel()
  try { activeSrc?.stop() } catch {}
  activeSrc = null
  duck(false)
}

/** Frase aleatória de acerto. */
export function speakOk(): void {
  speak(OK_PHRASES[Math.floor(Math.random() * OK_PHRASES.length)])
}

/** Frase aleatória de erro. */
export function speakBad(): void {
  speak(BAD_PHRASES[Math.floor(Math.random() * BAD_PHRASES.length)])
}

/** Pré-carrega audio.json em background (usado se Web Speech falhar). */
export function preloadVoice(): void {
  ensureLoaded().catch(() => {})
}
