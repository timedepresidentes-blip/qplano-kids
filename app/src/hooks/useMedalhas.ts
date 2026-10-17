import type { Progresso } from './useProgresso'

export interface Medalha {
  id: string
  nome: string
  desc: string
  icone: string
  conquistada: boolean
}

export function useMedalhas(progresso: Progresso, totalMissoes: number): Medalha[] {
  const m = progresso.missoesCompletas.length

  return [
    {
      id: 'primeira',
      nome: 'Primeira decolagem',
      desc: 'Complete a 1ª missão',
      icone: '🚀',
      conquistada: m >= 1,
    },
    {
      id: 'explorador',
      nome: 'Explorador',
      desc: 'Complete 3 missões',
      icone: '🔭',
      conquistada: m >= 3,
    },
    {
      id: 'piloto',
      nome: 'Piloto estelar',
      desc: 'Complete 5 missões',
      icone: '👨‍🚀',
      conquistada: m >= 5,
    },
    {
      id: 'astronomo',
      nome: 'Astrônomo',
      desc: 'Complete 8 missões',
      icone: '🌌',
      conquistada: m >= 8,
    },
    {
      id: 'mestre',
      nome: 'Mestre do espaço',
      desc: `Complete todas as ${totalMissoes} missões`,
      icone: '🏆',
      conquistada: m >= totalMissoes,
    },
    {
      id: 'streak',
      nome: '3 dias seguidos',
      desc: 'Jogue 3 dias em sequência',
      icone: '🔥',
      conquistada: progresso.streakDias >= 3,
    },
    {
      id: 'coragem',
      nome: 'Corajoso',
      desc: 'Acumule 100 de coragem',
      icone: '⚡',
      conquistada: progresso.coragem >= 100,
    },
  ]
}
