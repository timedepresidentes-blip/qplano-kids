import { useState, useEffect } from 'react'
import type { Cartao } from '../types/trilha'
import { speak } from '../audio/voiceEngine'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  cartoes: Cartao[]
  missaoNum: number
  onConcluir: () => void
}

export function TelaCartoes({ cartoes, missaoNum, onConcluir }: Props) {
  const [idx, setIdx] = useState(0)
  const cartao = cartoes[idx]
  const ultimo = idx === cartoes.length - 1

  useEffect(() => { speak(cartao.texto) }, [cartao.texto])

  function avancar() {
    if (ultimo) onConcluir()
    else setIdx(i => i + 1)
  }

  return (
    <div className={s.tela}>
      {/* Progresso */}
      <div className={s.bar}>
        <span className={s.chip}>📖 Cartão {idx + 1} de {cartoes.length}</span>
        <div className={s.prog}>
          <i style={{ width: `${((idx + 1) / cartoes.length) * 100}%` }}/>
        </div>
      </div>

      <div className={s.say}>
        <div className={`${s.qSlot} ${s.qSlotBig} q-slot`}><Quasar size={140}/></div>
        <div className={`${s.bubble} ${s.bubbleQ} ${s.talk}`}>
          {cartao.texto}
          {cartao.versiculo && (
            <div className={s.versiculo}>📖 {cartao.versiculo}</div>
          )}
        </div>
      </div>

      <div className={s.missaoNum}>Missão {missaoNum}</div>

      <button className={s.btn} onClick={avancar}>
        {ultimo ? 'Pronto para o desafio! ⚡' : 'Entendi! 👍'}
      </button>
    </div>
  )
}
