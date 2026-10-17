import type { Missao } from '../types/trilha'
import type { Progresso } from '../hooks/useProgresso'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missoes: Missao[]
  progresso: Progresso
  onIniciar: (missao: Missao) => void
}

const ICONES = ['🌟','🪐','🔭','🌙','🚀','👨‍🚀','💡','🪐','🌌','🏆']

export function TelaMapa({ missoes, progresso, onIniciar }: Props) {
  const coragem = progresso.coragem
  const streak = progresso.streakDias

  return (
    <div className={s.tela}>
      {/* Cabeçalho */}
      <div className={s.bar}>
        <span className={s.brand}>QPlano <b>Kids</b></span>
        <div className={s.chips}>
          {streak > 0 && (
            <span className={s.chip}>🔥 {streak} {streak === 1 ? 'dia' : 'dias'}</span>
          )}
          <span className={s.chip}>⚡ {coragem}</span>
        </div>
      </div>

      {/* Quasar + fala */}
      <div className={s.say}>
        <div className={s.qSlot}><Quasar size={110}/></div>
        <div className={`${s.bubble} ${s.bubbleQ}`}>
          {progresso.missoesCompletas.length === 0
            ? 'Olá, Miguel! Pronto para explorar o espaço? 🚀'
            : `Bem-vindo de volta! Você já completou ${progresso.missoesCompletas.length} missão${progresso.missoesCompletas.length > 1 ? 'ões' : ''}!`}
        </div>
      </div>

      {/* Lista de missões */}
      <div className={s.missoes}>
        {missoes.map((m, i) => {
          const completa = progresso.missoesCompletas.includes(m.id)
          const disponivel = i === 0 || progresso.missoesCompletas.includes(missoes[i - 1].id)
          return (
            <button
              key={m.id}
              className={`${s.missaoBtn} ${completa ? s.completa : disponivel ? s.disponivel : s.bloqueada}`}
              disabled={!disponivel}
              onClick={() => onIniciar(m)}
            >
              <span className={s.missaoIcone}>{completa ? '✅' : disponivel ? ICONES[i] : '🔒'}</span>
              <div className={s.missaoInfo}>
                <strong>Missão {m.nivel}: {m.titulo}</strong>
                <small>{m.cartoes.length} cartões · {m.perguntas.length} perguntas</small>
              </div>
              {completa && <span className={s.medalha}>⭐</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
