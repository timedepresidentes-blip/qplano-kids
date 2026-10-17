import { useState, useMemo } from 'react'
import type { Missao } from '../types/trilha'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missoesAnteriores: Missao[]  // missões já concluídas, exceto a atual
  onConcluir: () => void
}

export function TelaRevisao({ missoesAnteriores, onConcluir }: Props) {
  // Sorteia 1-2 perguntas de missões passadas
  const perguntas = useMemo(() => {
    if (missoesAnteriores.length === 0) return []
    const pool = missoesAnteriores.flatMap(m =>
      m.perguntas.map(p => ({ pergunta: p, cartoes: m.cartoes, missaoTitulo: m.titulo }))
    )
    const embaralhado = [...pool].sort(() => Math.random() - 0.5)
    return embaralhado.slice(0, Math.min(2, embaralhado.length))
  }, [missoesAnteriores])

  const [idx, setIdx] = useState(0)
  const [estado, setEstado] = useState<'perguntando' | 'respondido'>('perguntando')
  const [escolha, setEscolha] = useState<number | null>(null)

  if (perguntas.length === 0) {
    onConcluir()
    return null
  }

  const atual = perguntas[idx]
  const letras = ['A', 'B', 'C', 'D']

  function responder(i: number) {
    if (estado !== 'perguntando') return
    setEscolha(i)
    setEstado('respondido')
  }

  function avancar() {
    if (idx + 1 >= perguntas.length) {
      onConcluir()
    } else {
      setIdx(i => i + 1)
      setEstado('perguntando')
      setEscolha(null)
    }
  }

  return (
    <div className={s.tela}>
      <div className={s.bar}>
        <span className={s.chip}>🔁 Revisão</span>
        <span className={s.chip}>{idx + 1}/{perguntas.length}</span>
      </div>

      <div className={s.say}>
        <div className={s.qSlot}><Quasar size={100}/></div>
        <div className={s.bubble}>
          Vamos revisar o que você já aprendeu!
          <small style={{ display: 'block', marginTop: 4, opacity: 0.7 }}>
            Missão: {atual.missaoTitulo}
          </small>
        </div>
      </div>

      <div className={s.card}>
        <p className={s.perguntaTexto}>{atual.pergunta.pergunta}</p>
      </div>

      <div className={s.opts}>
        {atual.pergunta.opcoes.map((op, i) => {
          let extra = ''
          if (estado === 'respondido') {
            if (i === atual.pergunta.resposta) extra = s.optOk
            else if (i === escolha) extra = s.optBad
          }
          return (
            <button
              key={i}
              className={`${s.opt} ${extra}`}
              disabled={estado !== 'perguntando'}
              onClick={() => responder(i)}
            >
              <span className={s.optLetra}>{letras[i]}</span>
              <span>{op}</span>
            </button>
          )
        })}
      </div>

      {estado === 'respondido' && (
        <div className={escolha === atual.pergunta.resposta ? s.feedbackOk : s.feedbackBad}>
          <h3>{escolha === atual.pergunta.resposta ? '✅ Exatamente!' : 'Quase!'}</h3>
          <p>{atual.pergunta.explicacao}</p>
          <button className={s.btn} onClick={avancar}>
            {idx + 1 >= perguntas.length ? 'Ver celebração! 🎉' : 'Próxima ➜'}
          </button>
        </div>
      )}
    </div>
  )
}
