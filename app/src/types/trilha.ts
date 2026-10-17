export interface Cartao {
  id: string
  texto: string
  versiculo?: string
}

export interface Pergunta {
  id: string
  cartao: string // id do cartão que contém a resposta
  pergunta: string
  opcoes: string[]
  resposta: number
  explicacao: string
}

export interface Missao {
  id: string
  nivel: number
  titulo: string
  historia: string
  cartoes: Cartao[]
  perguntas: Pergunta[]
  revisado?: boolean
}

export interface Trilha {
  trilha: string
  titulo: string
  regra: string
  traducao_biblica: string
  missoes: Missao[]
}
