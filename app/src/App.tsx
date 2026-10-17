import { useState, useCallback, useEffect, useRef } from 'react'
import { useTrilha } from './hooks/useTrilha'
import { useProgresso, calcularEstrelas } from './hooks/useProgresso'
import { usePais } from './hooks/usePais'
import { TelaMapa } from './components/TelaMapa'
import { TelaHistoria } from './components/TelaHistoria'
import { TelaCartoes } from './components/TelaCartoes'
import { TelaDesafio } from './components/TelaDesafio'
import { TelaRevisao } from './components/TelaRevisao'
import { TelaCelebracao } from './components/TelaCelebracao'
import { TelaPais } from './components/TelaPais'
import { Cena3D } from './components/Cena3D'
import { initAudio, sfx } from './audio/musicEngine'
import { preloadVoice } from './audio/voiceEngine'
import type { Missao } from './types/trilha'

type Fase = 'mapa' | 'historia' | 'cartoes' | 'desafio' | 'revisao' | 'celebracao' | 'pais'

export default function App() {
  const { trilha, erro } = useTrilha()
  const progresso = useProgresso()
  const pais = usePais()

  const [fase, setFase] = useState<Fase>('mapa')
  const [missaoAtual, setMissaoAtual] = useState<Missao | null>(null)
  const [errosCelebracao, setErrosCelebracao] = useState<number>(0)
  const [estrelasAnteriorCelebracao, setEstrelasAnteriorCelebracao] = useState<number>(0)
  const [ehDesafioCelebracao, setEhDesafioCelebracao] = useState<boolean>(false)
  const inicioDesafioRef = useRef<number>(0)

  useEffect(() => {
    initAudio()
    preloadVoice()
    progresso.gerarDesafioDiario()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const iniciarMissao = useCallback((missao: Missao) => {
    setMissaoAtual(missao)
    setFase('historia')
  }, [])

  const onDesafioConcluido = useCallback((erros: string[]) => {
    const duracao = Math.round((Date.now() - inicioDesafioRef.current) / 1000)
    const m = missaoAtual!
    pais.registrarSessao({
      missaoId: m.id,
      titulo: m.titulo,
      acertos: m.perguntas.length - erros.length,
      erros: erros.length,
      duracaoSeg: duracao,
    })
    const hoje = new Date().toISOString().split('T')[0]
    const estrelasAnter = progresso.progresso.missoesEstrelas?.[m.id] ?? 0
    const ehDesafio = progresso.progresso.desafioDiario?.data === hoje &&
                      progresso.progresso.desafioDiario?.missaoId === m.id &&
                      !progresso.progresso.desafioDiario?.concluido
    const estrelas = calcularEstrelas(erros.length)
    setErrosCelebracao(erros.length)
    setEstrelasAnteriorCelebracao(estrelasAnter)
    setEhDesafioCelebracao(ehDesafio ?? false)
    progresso.completarMissao(m.id, estrelas)
    setFase('revisao')
  }, [missaoAtual, progresso, pais])

  const onErroPergunta = useCallback((perguntaId: string) => {
    if (missaoAtual) {
      progresso.registrarErro(missaoAtual.id, perguntaId)
    }
  }, [missaoAtual, progresso])

  if (erro) return (
    <div style={{ padding: 24, color: '#ff6b6b', fontFamily: 'Nunito, sans-serif' }}>
      Erro ao carregar trilha: {erro}
    </div>
  )

  if (!trilha) return (
    <div style={{ padding: 24, color: '#8fa3d8', fontFamily: 'Nunito, sans-serif' }}>
      Carregando…
    </div>
  )

  const missoesAnteriores = missaoAtual
    ? trilha.missoes.filter(m =>
        progresso.progresso.missoesCompletas.includes(m.id) && m.id !== missaoAtual.id
      )
    : []

  return (
    <>
      <Cena3D />

      {fase === 'mapa' && (
        <TelaMapa
          missoes={trilha.missoes}
          progresso={progresso.progresso}
          onIniciar={iniciarMissao}
          onAbrirPais={() => setFase('pais')}
        />
      )}

      {fase === 'historia' && missaoAtual && (
        <TelaHistoria
          missao={missaoAtual}
          onAvancar={() => setFase('cartoes')}
          onVoltar={() => setFase('mapa')}
        />
      )}

      {fase === 'cartoes' && missaoAtual && (
        <TelaCartoes
          cartoes={missaoAtual.cartoes}
          missaoNum={missaoAtual.nivel}
          onConcluir={() => setFase('desafio')}
        />
      )}

      {fase === 'desafio' && missaoAtual && (() => {
        if (inicioDesafioRef.current === 0) inicioDesafioRef.current = Date.now()
        return (
          <TelaDesafio
            perguntas={missaoAtual.perguntas}
            cartoes={missaoAtual.cartoes}
            missaoId={missaoAtual.id}
            missaoNum={missaoAtual.nivel}
            onConcluir={onDesafioConcluido}
            onErro={onErroPergunta}
            onAcerto={() => sfx('ok')}
            onErroSfx={() => sfx('bad')}
          />
        )
      })()}

      {fase === 'revisao' && missaoAtual && (
        <TelaRevisao
          missoesAnteriores={missoesAnteriores}
          onConcluir={() => setFase('celebracao')}
        />
      )}

      {fase === 'celebracao' && missaoAtual && (
        <TelaCelebracao
          missao={missaoAtual}
          erros={errosCelebracao}
          coragem={progresso.progresso.coragem}
          estrelasAnterior={estrelasAnteriorCelebracao}
          ehDesafioDiario={ehDesafioCelebracao}
          onVoltar={() => {
            setFase('mapa')
            setMissaoAtual(null)
            setErrosCelebracao(0)
            setEstrelasAnteriorCelebracao(0)
            setEhDesafioCelebracao(false)
            inicioDesafioRef.current = 0
          }}
        />
      )}

      {fase === 'pais' && (
        <TelaPais
          dados={pais.dados}
          progresso={progresso.progresso}
          onDefinirPin={pais.definirPin}
          onZerarTudo={(cb) => pais.zerarTudo(() => { progresso.zerar(); cb() })}
          onFechar={() => setFase('mapa')}
        />
      )}
    </>
  )
}
