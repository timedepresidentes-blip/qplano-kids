import type { Missao } from '../types/trilha'
import { Personagem } from './Personagem'
import { speak } from '../audio/voiceEngine'
import { useEffect } from 'react'
import s from './telas.module.css'

interface Props {
  missao: Missao
  onAvancar: () => void
  onVoltar?: () => void
}

export function TelaHistoria({ missao, onAvancar, onVoltar }: Props) {
  // Lê a história em voz robótica ao entrar na tela
  useEffect(() => {
    const t = setTimeout(() => speak(missao.historia), 800)
    return () => clearTimeout(t)
  }, [missao.historia])

  return (
    <div className={s.tela}>
      <button className={s.backBtn} onClick={onVoltar ?? (() => window.history.back())} aria-label="Voltar">←</button>

      <div className={s.cabecalho}>
        <h2>Missão {missao.nivel}</h2>
        <h3>{missao.titulo}</h3>
      </div>

      <div className={s.say}>
        <div className={`${s.qSlot} ${s.qSlotBig} q-slot`}>
          <Personagem missaoNum={missao.nivel} mood="neutral" size={140} playSound={true}/>
        </div>
        <div className={`${s.bubble} ${s.bubbleQ} ${s.talk}`}>
          {missao.historia}
        </div>
      </div>

      <button className={s.btn} onClick={onAvancar}>
        Vamos lá! 🚀
      </button>
    </div>
  )
}
