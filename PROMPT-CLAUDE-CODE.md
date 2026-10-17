# Como usar

1. Abra o terminal nesta pasta (`qplano-kids`) e rode `claude`.
2. Cole TUDO o que está abaixo da linha.

---

Você é meu engenheiro principal neste projeto. Leia primeiro `CLAUDE.md` (regras permanentes) e depois os arquivos desta pasta:
- `prototipo/qplano-kids.html`: protótipo funcional em um único arquivo (3D com three.js, Quasar, voz, música, celebração, medalhas, área dos pais).
- `prototipo/qplano-template-sem-audio.html`: o mesmo protótipo, com o áudio separado.
- `conteudo/trilha-espaco.json`: conteúdo novo no modelo "ensinar antes de perguntar" (10 missões, cada uma com história, 4 cartões e 3 perguntas ligadas a um cartão).
- `audio/` e `ferramentas/scripts/`: voz do Quasar já gerada e os scripts que geram as falas.

## Objetivo
Transformar o protótipo em um app web (PWA) de verdade, publicado de graça na Vercel, para o meu filho Miguel (7 anos) usar no tablet/celular. Ele precisa APRENDER e ao mesmo tempo ser testado de forma leve. Não é diagnóstico.

## Faça nesta ordem, com commits pequenos
1. **Estrutura**: Next.js (App Router) + TypeScript, ou Vite + React se for mais simples. PWA instalável com cache offline. Rodar em `localhost` e conferir.
2. **Modelo de conteúdo**: carregar `conteudo/trilha-espaco.json`. Fluxo por missão: tela de história -> cartões (um por vez, Quasar narra, botão "Entendi") -> desafio de 3 perguntas -> revisão com 1 a 2 perguntas de missões anteriores -> celebração. Só liberar a missão seguinte ao concluir a atual.
3. **Regra de ouro (teste automático)**: escreva um teste que falha se alguma pergunta apontar para um cartão que não existe, ou se uma pergunta de revisão usar cartão de missão ainda não concluída.
4. **Erro que ensina**: ao errar, Quasar reabre o cartão certo, explica com carinho e a pergunta volta no fim da sessão. Erro dá "+2 coragem".
5. **Portar do protótipo**: cena 3D e Quasar, música gerada, efeitos de celebração (confete, fogos, combos, estrelas, medalhas), nível adaptativo, sequência de dias, área dos pais.
6. **Voz do Quasar**: usar os clipes de `audio/` (chave = texto exato da fala). Para o conteúdo novo, gerar as falas faltantes com `ferramentas/scripts` (sherpa-onnx + Piper `pt_BR-faber-medium` + efeito robô). Os cartões e perguntas novos precisam de áudio: gere um manifesto com todas as falas e rode o pipeline. Salvar os mp3 em `public/audio/` carregando sob demanda, não embutidos em base64.
7. **Área dos pais com PIN**: desempenho por missão, perguntas erradas, tempo de uso, botão de zerar. Salvar no `localStorage` primeiro. Supabase (grátis) só como etapa opcional para sincronizar entre aparelhos, com tabela `progresso` e RLS ativado.
8. **Publicar**: `vercel` (conta gratuita), me dar a URL e o passo de "Adicionar à tela inicial" no tablet.
9. **Teste real**: abrir no Chrome com Playwright, passar uma missão inteira, conferir que não há erro no console, que o áudio toca depois do primeiro toque e que o modo offline funciona.

## Regras
- Tudo gratuito. Se algo exigir pagamento, pare e me avise antes.
- Não escreva nem aceite palavrão ou conteúdo fora dos valores do `CLAUDE.md`.
- Não invente fatos: todo conteúdo novo precisa ser conferido em fonte oficial (por exemplo NASA) antes de entrar, e entra com `"revisado": false` até eu aprovar (o conteúdo atual do JSON é rascunho que eu ainda vou ler).
- Antes de cada etapa grande, me diga o plano em 5 linhas. Ao terminar, me diga o que testou e o que não consegui testar.
- Não faça conversa livre com IA nesta fase. Isso é uma etapa futura, com camada de segurança e registro para os pais.

Comece pela etapa 1.
