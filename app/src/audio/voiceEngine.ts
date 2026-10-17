/**
 * Motor de voz do Quasar — carrega audio.json sob demanda, toca clips via Web Audio.
 * Cada chave no JSON é o texto exato da fala; o valor é base64-MP3.
 * Duca a música enquanto fala e cancela qualquer clip em andamento.
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
  'Quase!',
  'Boa tentativa!',
  'Vamos aprender juntos!',
  'Quase lá!',
  'Errar faz parte de aprender!',
]

let audioMap: Record<string, string> | null = null
let loadPromise: Promise<void> | null = null
let AC: AudioContext | null = null
let activeSrc: AudioBufferSourceNode | null = null

function getAC(): AudioContext {
  if (!AC) AC = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return AC
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

async function playKey(text: string): Promise<void> {
  await ensureLoaded()
  const b64 = audioMap?.[text]
  if (!b64) return

  const ac = getAC()
  if (ac.state === 'suspended') await ac.resume()

  // Decodifica base64 para ArrayBuffer
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  let buffer: AudioBuffer
  try {
    buffer = await ac.decodeAudioData(bytes.buffer)
  } catch {
    return
  }

  // Cancela clip anterior
  try { activeSrc?.stop() } catch { /* já parou */ }

  duck(true)
  const src = ac.createBufferSource()
  src.buffer = buffer
  src.connect(ac.destination)
  activeSrc = src

  await new Promise<void>(resolve => {
    src.onended = () => { duck(false); activeSrc = null; resolve() }
    src.start()
  })
}

/** Fala o texto se houver clip correspondente. Fire-and-forget. */
export function speak(text: string): void {
  playKey(text).catch(() => {})
}

/** Para qualquer fala em andamento. */
export function stopVoice(): void {
  try { activeSrc?.stop() } catch { /* já parou */ }
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

/** Pré-carrega o mapa de áudio sem bloquear. */
export function preloadVoice(): void {
  ensureLoaded().catch(() => {})
}
