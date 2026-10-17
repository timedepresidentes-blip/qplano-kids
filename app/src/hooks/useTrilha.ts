import { useEffect, useState } from 'react'
import type { Trilha } from '../types/trilha'

export function useTrilha() {
  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    import('../content/trilha-espaco.json')
      .then((mod) => setTrilha(mod.default as Trilha))
      .catch(() => setErro('Não foi possível carregar o conteúdo.'))
  }, [])

  return { trilha, erro }
}
