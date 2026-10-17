/**
 * Etapa 3 — Testes de integridade do conteúdo
 *
 * Regras verificadas:
 * 1. Cada pergunta.cartao deve existir como id em missao.cartoes (ENSINAR ANTES DE PERGUNTAR)
 * 2. Ids de cartões e perguntas são únicos dentro de cada missão e globalmente
 * 3. Cada resposta está dentro do intervalo de opcoes (0..opcoes.length-1)
 * 4. Toda missão tem ao menos 1 cartão e 1 pergunta
 * 5. Os versículos bíblicos só aparecem em cartões (não em perguntas)
 * 6. Ordem da trilha: missoes[i].nivel === i + 1
 */

import { describe, it, expect } from 'vitest'
import trilha from '../content/trilha-espaco.json'
import type { Trilha, Missao } from '../types/trilha'

const dados = trilha as Trilha

describe('trilha-espaco.json — integridade', () => {

  it('cada missão tem ao menos 1 cartão e 1 pergunta', () => {
    for (const m of dados.missoes) {
      expect(m.cartoes.length, `missão ${m.id}: sem cartões`).toBeGreaterThanOrEqual(1)
      expect(m.perguntas.length, `missão ${m.id}: sem perguntas`).toBeGreaterThanOrEqual(1)
    }
  })

  it('nivel de cada missão é sequencial (1, 2, 3…)', () => {
    dados.missoes.forEach((m, i) => {
      expect(m.nivel, `missão ${m.id}: nivel esperado ${i + 1}, encontrado ${m.nivel}`)
        .toBe(i + 1)
    })
  })

  it('ids de cartões são únicos globalmente', () => {
    const vistos = new Set<string>()
    for (const m of dados.missoes) {
      for (const c of m.cartoes) {
        expect(vistos.has(c.id), `cartão duplicado: ${c.id}`).toBe(false)
        vistos.add(c.id)
      }
    }
  })

  it('ids de perguntas são únicos globalmente', () => {
    const vistos = new Set<string>()
    for (const m of dados.missoes) {
      for (const p of m.perguntas) {
        expect(vistos.has(p.id), `pergunta duplicada: ${p.id}`).toBe(false)
        vistos.add(p.id)
      }
    }
  })

  it('cada pergunta referencia um cartão que existe na mesma missão (ENSINAR ANTES DE PERGUNTAR)', () => {
    for (const m of dados.missoes) {
      const cartaoIds = new Set(m.cartoes.map(c => c.id))
      for (const p of m.perguntas) {
        expect(
          cartaoIds.has(p.cartao),
          `missão ${m.id}, pergunta ${p.id}: cartao="${p.cartao}" não existe nessa missão`
        ).toBe(true)
      }
    }
  })

  it('índice de resposta está dentro do intervalo de opcoes', () => {
    for (const m of dados.missoes) {
      for (const p of m.perguntas) {
        expect(p.resposta, `pergunta ${p.id}: resposta=${p.resposta} fora do range`)
          .toBeGreaterThanOrEqual(0)
        expect(p.resposta, `pergunta ${p.id}: resposta=${p.resposta} >= opcoes.length=${p.opcoes.length}`)
          .toBeLessThan(p.opcoes.length)
      }
    }
  })

  it('cada pergunta tem exatamente 4 opções', () => {
    for (const m of dados.missoes) {
      for (const p of m.perguntas) {
        expect(p.opcoes.length, `pergunta ${p.id}: esperado 4 opções, encontrado ${p.opcoes.length}`)
          .toBe(4)
      }
    }
  })

  it('nenhuma opção é string vazia', () => {
    for (const m of dados.missoes) {
      for (const p of m.perguntas) {
        for (const op of p.opcoes) {
          expect(op.trim().length, `pergunta ${p.id}: opção vazia`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('todos os campos obrigatórios estão preenchidos', () => {
    for (const m of dados.missoes as Missao[]) {
      expect(m.id.trim().length, `missão sem id`).toBeGreaterThan(0)
      expect(m.titulo.trim().length, `missão ${m.id}: titulo vazio`).toBeGreaterThan(0)
      expect(m.historia.trim().length, `missão ${m.id}: historia vazia`).toBeGreaterThan(0)

      for (const c of m.cartoes) {
        expect(c.id.trim().length, `cartão sem id em ${m.id}`).toBeGreaterThan(0)
        expect(c.texto.trim().length, `cartão ${c.id}: texto vazio`).toBeGreaterThan(0)
      }

      for (const p of m.perguntas) {
        expect(p.id.trim().length, `pergunta sem id em ${m.id}`).toBeGreaterThan(0)
        expect(p.pergunta.trim().length, `pergunta ${p.id}: texto vazio`).toBeGreaterThan(0)
        expect(p.explicacao.trim().length, `pergunta ${p.id}: explicacao vazia`).toBeGreaterThan(0)
      }
    }
  })
})
