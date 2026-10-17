import { useState, useEffect } from 'react'

export interface Progresso {
  missoesCompletas: string[]
  missoesEstrelas: Record<string, number>   // missaoId -> 1|2|3 estrelas (melhor resultado)
  coragem: number
  streakDias: number
  ultimaSessao: string
  errosPorMissao: Record<string, string[]>
  desafioDiario: { data: string; missaoId: string; concluido: boolean } | null
}

const STORAGE_KEY = 'qplano-progresso'

const inicial: Progresso = {
  missoesCompletas: [],
  missoesEstrelas: {},
  coragem: 0,
  streakDias: 0,
  ultimaSessao: '',
  errosPorMissao: {},
  desafioDiario: null,
}

/** Calcula estrelas a partir do número de erros (0=3⭐, 1=2⭐, 2+=1⭐). */
export function calcularEstrelas(numErros: number): number {
  if (numErros === 0) return 3
  if (numErros === 1) return 2
  return 1
}

function carregar(): Progresso {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return inicial
    const loaded: Progresso = { ...inicial, ...JSON.parse(raw) }
    // Migração: missões concluídas sem registro de estrelas recebem 1 estrela
    if (loaded.missoesCompletas.length > 0 && Object.keys(loaded.missoesEstrelas ?? {}).length === 0) {
      const estrelas: Record<string, number> = {}
      for (const id of loaded.missoesCompletas) estrelas[id] = 1
      loaded.missoesEstrelas = estrelas
    }
    return loaded
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

  function completarMissao(missaoId: string, estrelas: number) {
    setProgresso(p => {
      const hoje = new Date().toISOString().split('T')[0]
      const ontem = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
      const streak = p.ultimaSessao === ontem ? p.streakDias + 1
                   : p.ultimaSessao === hoje  ? p.streakDias
                   : 1
      const jaConcluida = p.missoesCompletas.includes(missaoId)
      const estrelasAnteriores = p.missoesEstrelas?.[missaoId] ?? 0
      const melhoresEstrelas = Math.max(estrelasAnteriores, estrelas)

      // Bonus desafio diário: +50 se for a missão do dia e obteve 3 estrelas
      const ehDesafio = p.desafioDiario?.data === hoje &&
                        p.desafioDiario?.missaoId === missaoId &&
                        !p.desafioDiario?.concluido
      const bonusDesafio = ehDesafio && estrelas === 3 ? 50 : 0
      // +10 primeira vez / +3 melhoria de estrelas
      const bonusCoragem = !jaConcluida ? 10 : estrelas > estrelasAnteriores ? 3 : 0

      return {
        ...p,
        missoesCompletas: jaConcluida ? p.missoesCompletas : [...p.missoesCompletas, missaoId],
        missoesEstrelas: { ...(p.missoesEstrelas ?? {}), [missaoId]: melhoresEstrelas },
        coragem: p.coragem + bonusCoragem + bonusDesafio,
        streakDias: streak,
        ultimaSessao: hoje,
        desafioDiario: ehDesafio && estrelas === 3
          ? { ...p.desafioDiario!, concluido: true }
          : p.desafioDiario,
      }
    })
  }

  /** Gera o desafio do dia se ainda não existe para hoje. */
  function gerarDesafioDiario(): void {
    setProgresso(p => {
      const hoje = new Date().toISOString().split('T')[0]
      if (p.desafioDiario?.data === hoje) return p
      if (p.missoesCompletas.length === 0) return p
      const hash = hoje.split('-').reduce((a, b) => (a as number) + parseInt(b), 0) as number
      const missaoId = p.missoesCompletas[hash % p.missoesCompletas.length]
      return { ...p, desafioDiario: { data: hoje, missaoId, concluido: false } }
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

  return { progresso, completarMissao, gerarDesafioDiario, registrarErro, zerar }
}
