import type { Missao } from '../types/trilha'
import type { Progresso } from '../hooks/useProgresso'
import { useMedalhas } from '../hooks/useMedalhas'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missoes: Missao[]
  progresso: Progresso
  onIniciar: (missao: Missao) => void
}

const ICONES = ['🌟','🪐','🔭','🌙','🚀','👨‍🚀','💡','🪐','🌌','🏆']

export function TelaMapa({ missoes, progresso, onIniciar }: Props) {
  const medalhas = useMedalhas(progresso, missoes.length)
  const conquistadas = medalhas.filter(m => m.conquistada)

  return (
    <div className={s.tela}>
      {/* Cabeçalho */}
      <div className={s.bar}>
        <span className={s.brand}>QPlano <b>Kids</b></span>
        <div className={s.chips}>
          {progresso.streakDias > 0 && (
            <span className={s.chip}>🔥 {progresso.streakDias} {progresso.streakDias === 1 ? 'dia' : 'dias'}</span>
          )}
          <span className={s.chip}>⚡ {progresso.coragem}</span>
        </div>
      </div>

      {/* Quasar + fala */}
      <div className={s.say}>
        <div className={`${s.qSlot} q-slot`}><Quasar size={110}/></div>
        <div className={`${s.bubble} ${s.bubbleQ}`}>
          {progresso.missoesCompletas.length === 0
            ? 'Olá, Miguel! Pronto para explorar o espaço? 🚀'
            : `Bem-vindo de volta! Você já completou ${progresso.missoesCompletas.length} missão${progresso.missoesCompletas.length > 1 ? 'ões' : ''}!`}
        </div>
      </div>

      {/* Lista de missões */}
      <div className={s.missoes}>
        {missoes.map((m, i) => {
          const completa   = progresso.missoesCompletas.includes(m.id)
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

      {/* Medalhas conquistadas */}
      {conquistadas.length > 0 && (
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
            Medalhas desbloqueadas
          </p>
          <div className={s.medalhasGrid}>
            {medalhas.map(med => (
              <div key={med.id} className={`${s.medalhaCard} ${med.conquistada ? s.medalhaOn : s.medalhaOff}`}>
                <span style={{ fontSize: 32 }}>{med.icone}</span>
                <strong style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{med.nome}</strong>
                <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>{med.desc}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
