# QPlano Kids — regras permanentes do projeto

App educativo para o Miguel (7 anos). Uso familiar, NÃO é diagnóstico nem teste clínico.
Mascote: **Quasar**, robô astronauta. Idioma: português do Brasil.

## Valores (inegociáveis)
- Proibido palavrão, baixo calão ou conteúdo que desvirtue. Base cristã e conservadora; temas bíblicos, sabedoria e princípios.
- Nada de "cultura inútil" ou modernidade que contrarie esses valores.
- O conteúdo atual de `conteudo/trilha-espaco.json` é rascunho a ser lido pelo pai. Todo conteúdo NOVO entra com `"revisado": false` e só aparece para a criança depois da aprovação do pai (o app mostra conteúdo não revisado apenas no modo pais).

## Regra pedagógica central: ENSINAR ANTES DE PERGUNTAR
- Fluxo de cada missão: História -> Cartões de aprendizado (Quasar narra) -> Desafio -> Revisão.
- Toda pergunta tem `cartao` (id do cartão que contém a resposta). O app só faz a pergunta depois que o cartão foi exibido.
- Perguntas de revisão só usam cartões de missões já concluídas.
- Erro: Quasar reabre o cartão certo, explica com carinho, e a criança tenta de novo mais tarde. Nunca punir.
- Um teste automático deve falhar se existir pergunta sem cartão válido.

## Experiência
- Comemoração forte (confete, fogos, sons, medalhas, sequência de dias), sem luz piscante rápida; respeitar `prefers-reduced-motion`.
- Erro dá "+2 coragem". Sessões curtas (5 perguntas).
- Voz do Quasar: áudio pré-gerado (Piper pt_BR-faber-medium + efeito robô), não depender da voz do aparelho.

## Restrições técnicas
- Tudo gratuito: Vercel (hospedagem) e, se precisar, Supabase (plano grátis). Sem serviços pagos.
- PWA instalável, funcionar offline depois do primeiro acesso.
- Dados da criança: mínimo possível, sem rastreadores, sem anúncios (LGPD). Guardar texto, nunca áudio da criança.
- Área dos pais protegida por PIN.
