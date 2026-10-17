import type { Pergunta } from '../types/trilha'

/** Move a pergunta no índice `idx` para o fim da fila (chamada ao errar). */
export function moverParaFim(fila: Pergunta[], idx: number): Pergunta[] {
  const nova = [...fila]
  const [p] = nova.splice(idx, 1)
  nova.push(p)
  return nova
}

/** Retorna true se a sessão terminou (todas as perguntas respondidas corretamente). */
export function sessaoTerminou(idx: number, fila: Pergunta[]): boolean {
  return idx + 1 >= fila.length
}
