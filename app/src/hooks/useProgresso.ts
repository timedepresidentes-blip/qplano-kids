import { useState, useEffect } from 'react'

export interface Progresso {
  missoesCompletas: string[]   // ids das missões concluídas
  coragem: number
  streakDias: number
  ultimaSessao: string         // ISO date string
  errosPorMissao: Record<string, string[]>  // missaoId -> questionId[]
}

const STORAGE_KEY = 'qplano-progresso'

const inicial: Progresso = {
  missoesCompletas: [],
  coragem: 0,
  streakDias: 0,
  ultimaSessao: '',
  errosPorMissao: {},
}

function carregar(): Progresso {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...inicial, ...JSON.parse(raw) } : inicial
  } catch {
    return inicial
  }
}

export function useProgresso() {
  const [progresso, setProgresso] = useState<Progresso>(carregar)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso))
    } catch { /* disco cheio: ignora */ }
  }, [progresso])

  function completarMissao(missaoId: string) {
    setProgresso(p => {
      if (p.missoesCompletas.includes(missaoId)) return p
      const hoje = new Date().toISOString().split('T')[0]
      const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const streak = p.ultimaSessao === ontem ? p.streakDias + 1
                   : p.ultimaSessao === hoje  ? p.streakDias
                   : 1
      return {
        ...p,
        missoesCompletas: [...p.missoesCompletas, missaoId],
        coragem: p.coragem + 10,
        streakDias: streak,
        ultimaSessao: hoje,
      }
    })
  }

  function registrarErro(missaoId: string, perguntaId: string) {
    setProgresso(p => ({
      ...p,
      coragem: p.coragem + 2,
      errosPorMissao: {
        ...p.errosPorMissao,
        [missaoId]: [...(p.errosPorMissao[missaoId] ?? []), perguntaId],
      },
    }))
  }

  function zerar() {
    setProgresso(inicial)
  }

  return { progresso, completarMissao, registrarErro, zerar }
}
