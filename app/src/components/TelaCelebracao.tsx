import { useEffect, useRef } from 'react'
import type { Missao } from '../types/trilha'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missao: Missao
  erros: number
  coragem: number
  onVoltar: () => void
}

export function TelaCelebracao({ missao, erros, coragem, onVoltar }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particulas: Array<{
      x: number; y: number; vx: number; vy: number
      cor: string; tamanho: number; vida: number
    }> = []

    const cores = ['#ffc531', '#ff8a3d', '#46e0a4', '#8fd3ff', '#ff8f9a', '#ffe27a']

    for (let i = 0; i < 120; i++) {
      particulas.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        cor: cores[Math.floor(Math.random() * cores.length)],
        tamanho: 4 + Math.random() * 6,
        vida: 1,
      })
    }

    let animId: number
    function animar() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particulas) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.vida -= 0.006
        ctx.globalAlpha = Math.max(0, p.vida)
        ctx.fillStyle = p.cor
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (particulas.some(p => p.vida > 0)) {
        animId = requestAnimationFrame(animar)
      }
    }
    animId = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(animId)
  }, [])

  const acertos = missao.perguntas.length - erros
  const estrelas = acertos === missao.perguntas.length ? 3 : acertos >= 2 ? 2 : 1

  return (
    <div className={s.tela} style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}
        aria-hidden
      />

      <div className={s.celebracaoTitulo}>
        {estrelas === 3 ? '🏆 Perfeito!' : estrelas === 2 ? '🌟 Muito bem!' : '⭐ Missão cumprida!'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
        <Quasar size={150}/>
      </div>

      <div className={`${s.bubble} ${s.bubbleQ}`} style={{ margin: '0 auto 20px', maxWidth: 360 }}>
        {estrelas === 3
          ? `Incrível, Miguel! Você acertou tudo na Missão "${missao.titulo}"! 🎉`
          : `Ótimo trabalho na Missão "${missao.titulo}"! Continue assim! 💪`}
      </div>

      {/* Estrelas */}
      <div className={s.estrelas}>
        {[1, 2, 3].map(n => (
          <span key={n} style={{
            fontSize: 48,
            filter: n <= estrelas ? 'drop-shadow(0 0 12px #ffc531)' : 'none',
            opacity: n <= estrelas ? 1 : 0.2,
          }}>⭐</span>
        ))}
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        <div className={s.stat}>
          <b>{acertos}/{missao.perguntas.length}</b>
          <span>Acertos</span>
        </div>
        <div className={s.stat}>
          <b>+{10 + erros * 2}⚡</b>
          <span>Coragem</span>
        </div>
        <div className={s.stat}>
          <b>{coragem}</b>
          <span>Total</span>
        </div>
      </div>

      <button className={s.btn} onClick={onVoltar} style={{ marginTop: 24 }}>
        Voltar ao mapa 🗺️
      </button>
    </div>
  )
}
