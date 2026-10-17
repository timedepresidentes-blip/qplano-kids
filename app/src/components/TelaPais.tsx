import { useState } from 'react'
import type { DadosPais } from '../hooks/usePais'
import s from './telas.module.css'
import p from './telaPais.module.css'

interface Props {
  dados: DadosPais
  progresso: { missoesCompletas: string[]; coragem: number; streakDias: number }
  onDefinirPin: (pin: string) => void
  onZerarTudo: (cb: () => void) => void
  onFechar: () => void
}

type Etapa = 'pin' | 'painel'

function formatarTempo(seg: number): string {
  if (seg < 60) return `${seg}s`
  if (seg < 3600) return `${Math.floor(seg / 60)}min`
  return `${Math.floor(seg / 3600)}h ${Math.floor((seg % 3600) / 60)}min`
}

function PinInput({ titulo, onConfirmar, onCancelar }: {
  titulo: string
  onConfirmar: (pin: string) => void
  onCancelar?: () => void
}) {
  const [digits, setDigits] = useState('')
  const errado = digits.length === 4

  function tecla(d: string) {
    if (digits.length >= 4) return
    const next = digits + d
    setDigits(next)
    if (next.length === 4) onConfirmar(next)
  }

  function apagar() { setDigits(d => d.slice(0, -1)) }

  return (
    <div className={p.pinWrap}>
      <h2 className={p.pinTitulo}>{titulo}</h2>
      <div className={p.pinDots}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} className={`${p.dot} ${digits.length > i ? p.dotFilled : ''}`} />
        ))}
      </div>
      {errado && <p className={p.pinDica}>Verificando…</p>}
      <div className={p.teclado}>
        {['1','2','3','4','5','6','7','8','9','←','0','✓'].map(k => (
          <button key={k} className={p.tecla}
            onClick={() => k === '←' ? apagar() : k === '✓' ? onConfirmar(digits) : tecla(k)}>
            {k}
          </button>
        ))}
      </div>
      {onCancelar && (
        <button className={`${s.btnAlt} ${s.btn}`} style={{ marginTop: 16 }} onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </div>
  )
}

export function TelaPais({ dados, progresso, onDefinirPin, onZerarTudo, onFechar }: Props) {
  const [etapa, setEtapa] = useState<Etapa>(dados.pin ? 'pin' : 'painel')
  const [pinErrado, setPinErrado] = useState(false)
  const [confirmarReset, setConfirmarReset] = useState(false)
  const [alterandoPin, setAlterandoPin] = useState(false)
  const [resetFeito, setResetFeito] = useState(false)

  // Se ainda não tem PIN, vai direto ao painel (criando PIN depois)
  const semPin = dados.pin === ''

  function verificarPin(tentativa: string) {
    if (semPin || tentativa === dados.pin) {
      setEtapa('painel')
      setPinErrado(false)
    } else {
      setPinErrado(true)
      setTimeout(() => setPinErrado(false), 1200)
    }
  }

  function salvarNovoPin(novoPin: string) {
    onDefinirPin(novoPin)
    setAlterandoPin(false)
  }

  // Agrupa sessões por missão
  const porMissao: Record<string, { acertos: number; erros: number; sessoes: number; ultima: string }> = {}
  for (const s of dados.sessoes) {
    const k = s.missaoId
    if (!porMissao[k]) porMissao[k] = { acertos: 0, erros: 0, sessoes: 0, ultima: s.data }
    porMissao[k].acertos += s.acertos
    porMissao[k].erros   += s.erros
    porMissao[k].sessoes += 1
  }

  // PIN entry
  if (etapa === 'pin' && !semPin) {
    return (
      <div className={s.tela}>
        <button className={s.backBtn} onClick={onFechar}>←</button>
        <PinInput
          titulo={pinErrado ? '❌ PIN incorreto' : '🔑 PIN dos pais'}
          onConfirmar={verificarPin}
          onCancelar={onFechar}
        />
      </div>
    )
  }

  // Alterar PIN
  if (alterandoPin) {
    return (
      <div className={s.tela}>
        <button className={s.backBtn} onClick={() => setAlterandoPin(false)}>←</button>
        <PinInput
          titulo='Novo PIN (4 dígitos)'
          onConfirmar={salvarNovoPin}
          onCancelar={() => setAlterandoPin(false)}
        />
      </div>
    )
  }

  const totalSessoes = dados.sessoes.length
  const totalAcertos = dados.sessoes.reduce((acc, s) => acc + s.acertos, 0)
  const totalErros   = dados.sessoes.reduce((acc, s) => acc + s.erros, 0)

  return (
    <div className={s.tela}>
      <div className={s.bar}>
        <button className={s.backBtn} onClick={onFechar} aria-label="Fechar">←</button>
        <span className={s.brand} style={{ fontSize: 20 }}>Área dos pais</span>
        <button className={`${s.chip}`} onClick={() => setAlterandoPin(true)} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
          🔑 {semPin ? 'Criar PIN' : 'Mudar PIN'}
        </button>
      </div>

      {/* Resumo geral */}
      <div className={p.statsBox}>
        <div className={p.statItem}><b>{progresso.missoesCompletas.length}</b><span>Missões</span></div>
        <div className={p.statItem}><b>{progresso.coragem}</b><span>Coragem ⚡</span></div>
        <div className={p.statItem}><b>{progresso.streakDias}</b><span>Dias seguidos 🔥</span></div>
        <div className={p.statItem}><b>{formatarTempo(dados.tempoTotalSeg)}</b><span>Tempo total</span></div>
        <div className={p.statItem}><b>{totalAcertos}</b><span>Acertos</span></div>
        <div className={p.statItem}><b>{totalErros}</b><span>Erros</span></div>
      </div>

      {/* Histórico de sessões por missão */}
      {totalSessoes > 0 ? (
        <div>
          <p className={p.secTitulo}>Histórico por missão</p>
          <div className={p.lista}>
            {Object.entries(porMissao).map(([id, v]) => (
              <div key={id} className={p.linhaItem}>
                <div>
                  <strong>{dados.sessoes.find(s => s.missaoId === id)?.titulo ?? id}</strong>
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: 12 }}>
                    {v.sessoes} sessão{v.sessoes > 1 ? 'ões' : ''} · última: {v.ultima}
                  </small>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ color: 'var(--good)', fontWeight: 800 }}>✓ {v.acertos}</span>
                  {'  '}
                  <span style={{ color: 'var(--bad)', fontWeight: 800 }}>✗ {v.erros}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 15 }}>
          Ainda sem sessões registradas.
        </p>
      )}

      {/* Reset */}
      {resetFeito ? (
        <div className={s.feedbackOk} style={{ textAlign: 'center' }}>
          <p>✅ Progresso apagado com sucesso.</p>
        </div>
      ) : confirmarReset ? (
        <div className={s.feedbackBad}>
          <p style={{ fontWeight: 800, margin: 0 }}>Isso apaga todo o progresso do Miguel. Tem certeza?</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className={`${s.btn} ${s.btnAlt}`} style={{ flex: 1 }} onClick={() => setConfirmarReset(false)}>
              Cancelar
            </button>
            <button className={s.btn} style={{ flex: 1, background: 'linear-gradient(180deg,#ff8f9a,#e0344a)', color: '#fff' }}
              onClick={() => onZerarTudo(() => { setConfirmarReset(false); setResetFeito(true) })}>
              Apagar tudo
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`${s.btn} ${s.btnAlt}`}
          style={{ marginTop: 8, border: '1px solid var(--bad)', color: 'var(--bad)' }}
          onClick={() => setConfirmarReset(true)}
        >
          🗑️ Resetar progresso
        </button>
      )}
    </div>
  )
}
