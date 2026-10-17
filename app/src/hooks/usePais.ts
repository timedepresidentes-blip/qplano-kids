/**
 * Dados da área dos pais: PIN, sessões por missão, tempo total de uso.
 * Tudo em localStorage — sem dependência de servidor.
 */
import { useState, useEffect } from 'react'

export interface SessaoMissao {
  missaoId: string
  titulo: string
  acertos: number
  erros: number
  data: string  // ISO date
  duracaoSeg: number
}

export interface DadosPais {
  pin: string            // '' = PIN não definido
  sessoes: SessaoMissao[]
  tempoTotalSeg: number
}

const KEY = 'qplano-pais'

const inicial: DadosPais = { pin: '', sessoes: [], tempoTotalSeg: 0 }

function carregar(): DadosPais {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...inicial, ...JSON.parse(raw) } : inicial
  } catch { return inicial }
}

export function usePais() {
  const [dados, setDados] = useState<DadosPais>(carregar)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(dados)) } catch { /* disco cheio */ }
  }, [dados])

  function definirPin(pin: string) {
    setDados(d => ({ ...d, pin }))
  }

  function registrarSessao(s: Omit<SessaoMissao, 'data'>) {
    setDados(d => ({
      ...d,
      sessoes: [{ ...s, data: new Date().toISOString().split('T')[0] }, ...d.sessoes].slice(0, 200),
      tempoTotalSeg: d.tempoTotalSeg + s.duracaoSeg,
    }))
  }

  function zerarTudo(onZerado: () => void) {
    setDados(inicial)
    onZerado()
  }

  return { dados, definirPin, registrarSessao, zerarTudo }
}
