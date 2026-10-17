import type { Missao } from '../types/trilha'
import type { Progresso } from '../hooks/useProgresso'
import { useMedalhas } from '../hooks/useMedalhas'
import { Quasar } from './Quasar'
import s from './telas.module.css'

interface Props {
  missoes: Missao[]
  progresso: Progresso
  onIniciar: (missao: Missao) => void
  onAbrirPais?: () => void
}

const ICONES = [
  '🌍', '🌙', '☄️', '🪐', '🔭', '🚀', '👨‍🚀', '🌌', '⭐', '🏆',
  '🛸', '🌠', '🌑', '🛰️', '💥', '🔬', '🌟', '🌀', '🎇', '👑',
]
const POSICOES = ['planetaWrapCenter', 'planetaWrapRight', 'planetaWrapCenter', 'planetaWrapLeft'] as const

export function TelaMapa({ missoes, progresso, onIniciar, onAbrirPais }: Props) {
  const medalhas = useMedalhas(progresso, missoes.length)
  const conquistadas = medalhas.filter(m => m.conquistada)

  const hoje = new Date().toISOString().split('T')[0]
  const desafioHoje = progresso.desafioDiario?.data === hoje ? progresso.desafioDiario : null
  const missaoDesafio = desafioHoje ? missoes.find(m => m.id === desafioHoje.missaoId) : null

  const bubbleText = desafioHoje && !desafioHoje.concluido
    ? `🎯 Desafio do dia: "${missaoDesafio?.titulo}"! Faça com 3 ⭐ e ganhe +50 ⚡!`
    : desafioHoje?.concluido
      ? `🏅 Desafio do dia concluído! Incrível, Miguel! ${progresso.missoesCompletas.length} missões! 🌟`
      : progresso.missoesCompletas.length === 0
        ? 'Olá, Miguel! Pronto para explorar o espaço? 🚀'
        : `Bem-vindo de volta! ${progresso.missoesCompletas.length} missão${progresso.missoesCompletas.length > 1 ? 'ões' : ''} concluída${progresso.missoesCompletas.length > 1 ? 's' : ''}! 🌟`

  return (
    <div className={s.tela}>
      {/* Cabeçalho */}
      <div className={s.bar}>
        <span className={s.brand}>QPlano <b>Kids</b></span>
        <div className={s.chips}>
          {progresso.streakDias > 0 && (
            <span className={s.chip}>🔥 {progresso.streakDias}</span>
          )}
          <span className={s.chip}>⚡ {progresso.coragem}</span>
          {onAbrirPais && (
            <button
              onClick={onAbrirPais}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer', padding: '4px 6px', lineHeight: 1 }}
              aria-label="Área dos pais"
              title="Área dos pais"
            >👨‍👩‍👦</button>
          )}
        </div>
      </div>

      {/* Quasar + fala */}
      <div className={s.say}>
        <div className={`${s.qSlot} q-slot`}><Quasar size={100}/></div>
        <div className={`${s.bubble} ${s.bubbleQ}`}>{bubbleText}</div>
      </div>

      {/* Trilha de planetas — ziguezague estilo Duolingo */}
      <div className={s.trilha}>
        {missoes.map((m, i) => {
          const completa    = progresso.missoesCompletas.includes(m.id)
          const disponivel  = i === 0 || progresso.missoesCompletas.includes(missoes[i - 1].id)
          const estrelas    = progresso.missoesEstrelas?.[m.id] ?? 0
          const ehDesafio   = desafioHoje?.missaoId === m.id && !desafioHoje?.concluido
          const posClass    = s[POSICOES[i % POSICOES.length]]
          const statusClass = completa ? s.planetaCompleto : disponivel ? s.planetaDisponivel : s.planetaBloqueado

          return (
            <div key={m.id}>
              {i > 0 && <div className={s.trilhaConector} />}
              <div className={`${s.planetaWrap} ${posClass}`}>
                <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 32 }}>
                  {ehDesafio && (
                    <span style={{ position: 'absolute', top: -10, right: -10, fontSize: 20, zIndex: 2, filter: 'drop-shadow(0 0 4px gold)' }}>🎯</span>
                  )}
                  <button
                    className={`${s.planetaBtn} ${statusClass}`}
                    disabled={!disponivel}
                    onClick={() => onIniciar(m)}
                    aria-label={`Missão ${m.nivel}: ${m.titulo}`}
                  >
                    {disponivel || completa ? ICONES[i % ICONES.length] : '🔒'}
                  </button>
                  <span className={s.planetaLabel}>{m.titulo}</span>
                  {completa && (
                    <span style={{ fontSize: 14, letterSpacing: 1, marginTop: 2 }}>
                      {'⭐'.repeat(estrelas)}{'☆'.repeat(3 - estrelas)}
                    </span>
                  )}
                  {completa && estrelas < 3 && (
                    <span style={{ fontSize: 10, color: 'var(--xp)', fontWeight: 800, marginTop: 2 }}>Jogar de novo!</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Medalhas conquistadas */}
      {conquistadas.length > 0 && (
        <div style={{ marginTop: 24 }}>
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
