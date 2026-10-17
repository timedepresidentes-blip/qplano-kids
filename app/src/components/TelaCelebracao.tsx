import { useEffect, useRef } from 'react'
import type { Missao } from '../types/trilha'
import { sfx } from '../audio/musicEngine'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missao: Missao
  erros: number
  coragem: number
  estrelasAnterior?: number   // 0 = primeira vez; >0 = replay
  ehDesafioDiario?: boolean
  onVoltar: () => void
}

export function TelaCelebracao({ missao, erros, coragem, estrelasAnterior = 0, ehDesafioDiario = false, onVoltar }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { sfx('up') }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particulas: Array<{
      x: number; y: number; vx: number; vy: number
      cor: string; tamanho: number; vida: number; forma: 'circulo' | 'quadrado'
    }> = []

    const cores = ['#FFD700', '#FF6B6B', '#58CC02', '#00C8FF', '#9333EA', '#FF9600', '#FFF']

    for (let i = 0; i < 160; i++) {
      particulas.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 5,
        vy: 2 + Math.random() * 5,
        cor: cores[Math.floor(Math.random() * cores.length)],
        tamanho: 5 + Math.random() * 7,
        vida: 1,
        forma: Math.random() > 0.5 ? 'circulo' : 'quadrado',
      })
    }

    let animId: number
    function animar() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particulas) {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.1
        p.vida -= 0.005
        ctx.globalAlpha = Math.max(0, p.vida)
        ctx.fillStyle = p.cor
        ctx.beginPath()
        if (p.forma === 'circulo') {
          ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2)
        } else {
          ctx.rect(p.x - p.tamanho / 2, p.y - p.tamanho / 2, p.tamanho, p.tamanho)
        }
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
  const estrelas = erros === 0 ? 3 : erros === 1 ? 2 : 1
  const bonusDesafio = ehDesafioDiario && estrelas === 3 ? 50 : 0
  const melhorou = estrelasAnterior > 0 && estrelas > estrelasAnterior

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

      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <Quasar size={140} />
      </div>

      <div className={`${s.bubble} ${s.bubbleQ}`} style={{ margin: '0 auto 20px', maxWidth: 360 }}>
        {melhorou
          ? `Nova marca na Missão "${missao.titulo}"! ${'⭐'.repeat(estrelasAnterior)} → ${'⭐'.repeat(estrelas)} 🌟`
          : estrelas === 3
            ? `Incrível, Miguel! Você acertou tudo na Missão "${missao.titulo}"! 🎉`
            : `Ótimo trabalho na Missão "${missao.titulo}"! Continue assim! 💪`}
      </div>

      {/* Estrelas animadas */}
      <div className={s.estrelas}>
        {[1, 2, 3].map(n => (
          <span
            key={n}
            className={n <= estrelas ? s.estrelaBig : s.estrelaVazia}
            style={n <= estrelas ? { animationDelay: `${(n - 1) * 0.15}s` } : {}}
          >⭐</span>
        ))}
      </div>

      {/* Bonus desafio diário */}
      {ehDesafioDiario && estrelas === 3 && (
        <div style={{ background: 'rgba(255,215,0,.15)', border: '2px solid gold', borderRadius: 16, padding: '8px 20px', margin: '0 auto 12px', maxWidth: 280, textAlign: 'center', fontSize: 15, fontWeight: 800, color: '#FFD700' }}>
          🎯 Desafio diário! +50 ⚡ bônus!
        </div>
      )}

      {/* Stats */}
      <div className={s.statsRow}>
        <div className={s.stat}>
          <b>{acertos}/{missao.perguntas.length}</b>
          <span>Acertos</span>
        </div>
        <div className={s.stat}>
          <b>+{10 + (estrelas - 1) * 5 + bonusDesafio}⚡</b>
          <span>Coragem</span>
        </div>
        <div className={s.stat}>
          <b>{coragem}</b>
          <span>Total ⚡</span>
        </div>
      </div>

      <button className={s.btn} onClick={onVoltar} style={{ marginTop: 24 }}>
        Voltar ao mapa 🗺️
      </button>
    </div>
  )
}
