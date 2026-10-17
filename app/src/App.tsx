import { useState, useCallback, useEffect } from 'react'
import { useTrilha } from './hooks/useTrilha'
import { useProgresso } from './hooks/useProgresso'
import { TelaMapa } from './components/TelaMapa'
import { TelaHistoria } from './components/TelaHistoria'
import { TelaCartoes } from './components/TelaCartoes'
import { TelaDesafio } from './components/TelaDesafio'
import { TelaRevisao } from './components/TelaRevisao'
import { TelaCelebracao } from './components/TelaCelebracao'
import { Cena3D } from './components/Cena3D'
import { initAudio, sfx } from './audio/musicEngine'
import { preloadVoice } from './audio/voiceEngine'
import type { Missao } from './types/trilha'

type Fase = 'mapa' | 'historia' | 'cartoes' | 'desafio' | 'revisao' | 'celebracao'

export default function App() {
  const { trilha, erro } = useTrilha()
  const progresso = useProgresso()

  const [fase, setFase] = useState<Fase>('mapa')
  const [missaoAtual, setMissaoAtual] = useState<Missao | null>(null)
  const [errosCelebracao, setErrosCelebracao] = useState<number>(0)

  useEffect(() => { initAudio(); preloadVoice() }, [])

  const iniciarMissao = useCallback((missao: Missao) => {
    setMissaoAtual(missao)
    setFase('historia')
  }, [])

  const onDesafioConcluido = useCallback((erros: string[]) => {
    setErrosCelebracao(erros.length)
    progresso.completarMissao(missaoAtual!.id)
    setFase('revisao')
  }, [missaoAtual, progresso])

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

      {fase === 'desafio' && missaoAtual && (
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
      )}

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
          onVoltar={() => {
            setFase('mapa')
            setMissaoAtual(null)
            setErrosCelebracao(0)
          }}
        />
      )}
    </>
  )
}
