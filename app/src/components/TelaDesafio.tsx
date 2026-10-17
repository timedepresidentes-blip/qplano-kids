import { useState, useCallback, useEffect } from 'react'
import type { Pergunta, Cartao } from '../types/trilha'
import { moverParaFim, sessaoTerminou } from '../utils/filaPerguntas'
import { speak, speakOk, speakBad } from '../audio/voiceEngine'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  perguntas: Pergunta[]
  cartoes: Cartao[]
  missaoId: string
  missaoNum: number
  onConcluir: (erros: string[]) => void
  onErro: (perguntaId: string) => void
  onAcerto?: () => void
  onErroSfx?: () => void
}

type Estado = 'perguntando' | 'correto' | 'errado' | 'reaprendendo'
const MAX_CORACOES = 3

export function TelaDesafio({ perguntas, cartoes, missaoNum, onConcluir, onErro, onAcerto, onErroSfx }: Props) {
  const [fila, setFila] = useState<Pergunta[]>(() => [...perguntas])
  const [idx, setIdx] = useState(0)
  const [estado, setEstado] = useState<Estado>('perguntando')
  const [escolha, setEscolha] = useState<number | null>(null)
  const [erros, setErros] = useState<string[]>([])
  const [cartaoReaberto, setCartaoReaberto] = useState<Cartao | null>(null)
  const [combo, setCombo] = useState(0)
  const [coracoes, setCoracoes] = useState(MAX_CORACOES)

  const pergunta = fila[idx]
  const total = perguntas.length

  useEffect(() => { speak(pergunta.pergunta) }, [pergunta.pergunta])

  const responder = useCallback((opcaoIdx: number) => {
    if (estado !== 'perguntando') return
    setEscolha(opcaoIdx)
    const acertou = opcaoIdx === pergunta.resposta

    if (acertou) {
      setCombo(c => c + 1)
      setEstado('correto')
      onAcerto?.()
      speakOk()
    } else {
      setCombo(0)
      onErroSfx?.()
      speakBad()
      onErro(pergunta.id)
      setErros(e => [...e, pergunta.id])
      setCoracoes(c => Math.max(0, c - 1))
      const cartaoCorreto = cartoes.find(c => c.id === pergunta.cartao) ?? null
      setCartaoReaberto(cartaoCorreto)
      setEstado('errado')
    }
  }, [estado, pergunta, cartoes, onErro])

  function proximoPasso() {
    if (estado === 'errado') {
      setEstado('reaprendendo')
      return
    }

    if (estado === 'reaprendendo') {
      setFila(f => moverParaFim(f, idx))
      setCartaoReaberto(null)
      setEstado('perguntando')
      setEscolha(null)
      return
    }

    if (sessaoTerminou(idx, fila)) {
      onConcluir(erros)
    } else {
      setIdx(idx + 1)
      setEstado('perguntando')
      setEscolha(null)
    }
  }

  const letras = ['A', 'B', 'C', 'D']

  // Tela de reaprendizado: Quasar mostra o cartão novamente
  if (estado === 'reaprendendo' && cartaoReaberto) {
    return (
      <div className={s.tela}>
        <div className={s.reaprendendo}>
          <h3>Quasar explica de novo 💙</h3>
        </div>
        <div className={s.say}>
          <div className={`${s.qSlot} ${s.qSlotBig} q-slot`}><Quasar size={140}/></div>
          <div className={`${s.bubble} ${s.bubbleQ} ${s.talk}`}>
            {cartaoReaberto.texto}
          </div>
        </div>
        <div className={s.coragemBadge}>+2 coragem por tentar! ⚡</div>
        <button className={s.btn} onClick={proximoPasso}>
          Agora entendi! 👍
        </button>
      </div>
    )
  }

  return (
    <div className={s.tela}>
      {/* Header: missão + barra de progresso + corações */}
      <div className={s.bar}>
        <span className={s.chip}>🚀 Missão {missaoNum}</span>
        <div className={s.progBar}>
          <div className={s.prog}>
            <i style={{ width: `${(idx / total) * 100}%` }} />
          </div>
        </div>
        <div className={s.hearts}>
          {Array.from({ length: MAX_CORACOES }, (_, i) => (
            <span key={i} className={`${s.heart} ${i >= coracoes ? s.heartLost : ''}`}>❤️</span>
          ))}
        </div>
      </div>

      {combo >= 2 && estado === 'perguntando' && (
        <div className={s.combo}>🔥 {combo} seguidas!</div>
      )}

      {/* Card da pergunta */}
      <div className={s.card}>
        <p className={s.perguntaTexto}>{pergunta.pergunta}</p>
      </div>

      {/* Opções de resposta */}
      <div className={s.opts}>
        {pergunta.opcoes.map((op, i) => {
          let extra = ''
          if (estado !== 'perguntando') {
            if (i === pergunta.resposta) extra = s.optOk
            else if (i === escolha && escolha !== pergunta.resposta) extra = s.optBad
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

      {/* Painel de feedback deslizante (estilo Duolingo) */}
      {estado === 'correto' && (
        <div className={`${s.feedbackPanel} ${s.feedbackPanelOk}`}>
          <p className={s.feedbackTitulo}>✅ Correto!</p>
          <p className={s.feedbackTexto}>{pergunta.explicacao}</p>
          <button className={`${s.btn} ${s.btnOk}`} onClick={proximoPasso}>
            {sessaoTerminou(idx, fila) ? 'Ver resultado! 🎉' : 'Continuar ➜'}
          </button>
        </div>
      )}

      {estado === 'errado' && (
        <div className={`${s.feedbackPanel} ${s.feedbackPanelBad}`}>
          <p className={s.feedbackTitulo}>❌ Quase! +2 coragem ⚡</p>
          <p className={s.feedbackTexto}>{pergunta.explicacao}</p>
          <button className={`${s.btn} ${s.btnBad}`} onClick={proximoPasso}>
            Quasar me explica 💙
          </button>
        </div>
      )}
    </div>
  )
}
