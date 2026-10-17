/**
 * Etapa 4 — Testes do fluxo "erro que ensina"
 *
 * Verifica que ao errar:
 * - a pergunta é movida para o fim da fila (não perdida)
 * - as outras perguntas mantêm a ordem
 * - a sessão só termina quando todas foram respondidas corretamente
 */

import { describe, it, expect } from 'vitest'
import { moverParaFim, sessaoTerminou } from '../utils/filaPerguntas'
import type { Pergunta } from '../types/trilha'

function p(id: string): Pergunta {
  return { id, cartao: 'c1', pergunta: '?', opcoes: ['a','b','c','d'], resposta: 0, explicacao: 'ok' }
}

describe('moverParaFim — pergunta errada vai para o final', () => {
  it('move a primeira pergunta para o fim', () => {
    const fila = [p('q1'), p('q2'), p('q3')]
    const nova = moverParaFim(fila, 0)
    expect(nova.map(x => x.id)).toEqual(['q2', 'q3', 'q1'])
  })

  it('move a última pergunta para o fim (permanece no lugar)', () => {
    const fila = [p('q1'), p('q2'), p('q3')]
    const nova = moverParaFim(fila, 2)
    expect(nova.map(x => x.id)).toEqual(['q1', 'q2', 'q3'])
  })

  it('move do meio para o fim', () => {
    const fila = [p('q1'), p('q2'), p('q3')]
    const nova = moverParaFim(fila, 1)
    expect(nova.map(x => x.id)).toEqual(['q1', 'q3', 'q2'])
  })

  it('fila com uma única pergunta fica igual', () => {
    const fila = [p('q1')]
    const nova = moverParaFim(fila, 0)
    expect(nova.map(x => x.id)).toEqual(['q1'])
  })

  it('não muta a fila original', () => {
    const fila = [p('q1'), p('q2')]
    moverParaFim(fila, 0)
    expect(fila.map(x => x.id)).toEqual(['q1', 'q2'])
  })

  it('erro repetido: pergunta volta sem perder conteúdo', () => {
    let fila = [p('q1'), p('q2'), p('q3')]
    // Erra q1 duas vezes
    fila = moverParaFim(fila, 0) // [q2, q3, q1]
    fila = moverParaFim(fila, 2) // [q2, q3, q1] (q1 ainda no fim)
    expect(fila[2].id).toBe('q1')
    expect(fila.length).toBe(3)
  })
})

describe('sessaoTerminou — encerra só quando todas estão corretas', () => {
  it('não termina se ainda há perguntas à frente', () => {
    const fila = [p('q1'), p('q2'), p('q3')]
    expect(sessaoTerminou(0, fila)).toBe(false)
    expect(sessaoTerminou(1, fila)).toBe(false)
  })

  it('termina na última pergunta', () => {
    const fila = [p('q1'), p('q2'), p('q3')]
    expect(sessaoTerminou(2, fila)).toBe(true)
  })

  it('termina com fila de uma só pergunta', () => {
    const fila = [p('q1')]
    expect(sessaoTerminou(0, fila)).toBe(true)
  })

  it('não termina se a última pergunta foi movida (fila cresceu)', () => {
    // Simula: 3 perguntas, idx=2 seria o fim, mas uma errada foi reinserida
    const fila = [p('q2'), p('q3'), p('q1')] // q1 voltou ao fim
    expect(sessaoTerminou(1, fila)).toBe(false) // ainda falta q1
    expect(sessaoTerminou(2, fila)).toBe(true)  // agora sim
  })
})
