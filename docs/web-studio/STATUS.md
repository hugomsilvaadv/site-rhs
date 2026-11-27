# Estado real — RHS Labs / Sentinel

## Fase 8 — o Sentinel como produto (2026-11-27, em andamento)

O proprietário confirmou que os dados do demo do Sentinel são fictícios e que o produto pronto para venda hoje é o Sentinel; o back-office (PAM) ainda não está pronto e deve aparecer como "em desenvolvimento" (RHS-056). A fase 8 (`feat/site-f8-sentinel-20261127`, criada a partir da fase 7) traz:
- a página com o Sentinel no centro (RHS-057): o H1 aprovado de produção, quatro áreas do Sentinel, How it works, Access & integration, os módulos por disponibilidade e a seção do back-office PAM com o selo "In development", sem imagens;
- "Available" no lugar de "available now" (RHS-058);
- `tools/capture/import.mjs`, que transforma os prints revisados do demo nas imagens do site, com o selo e a cópia do hero, sem reescrever nada;
- `tools/stage.mjs`, que deixa de publicar os placeholders do back-office;
- as correções da revisão da fase 7 (ordem dos passos de captura, testes, codificação UTF-8 do gerador e os botões de contato em espanhol entre 901 e 993 px).

| Item | Estado |
|---|---|
| Texto do Sentinel | Escrito a partir do relatório da primeira rodada no demo e auditado em duas rodadas (RHS-059: 35 achados confirmados e aplicados; RHS-060: 8, e a lente do Sentinel já sem achados). Falta conferi-lo com o inventário em texto (item s de `DECISIONS.md`). |
| Imagens | Nenhuma ainda: a página fica com texto, diagramas e a lista de telas até a importação. |
| Hero | **Condição para publicar.** As imagens conceituais mostram multicontas, dispositivos, IP e cripto e não vão ao `main` com a fase 8; antes, a troca para `sentinel-transactions`, `sentinel-alerts` e `sentinel-rules` (RHS-057, RHS-059). Até lá, o selo delas diz "ILLUSTRATIVE CONCEPT · SIMULATED DATA · NOT THE CURRENT PRODUCT". Depois da troca, `tools/stage.mjs` deixa de publicar os três arquivos (RHS-060). |
| Multicontas | Fora do site até o proprietário decidir se a detecção de multicontas, dispositivo, IP e vínculos pode ser anunciada. Os testes recusam esses termos. |
| Testes | Os 11 testes do README foram adaptados à página nova. |
| PR | Ainda não aberto. Ao `main` vai um só PR, o da fase 8, que contém as fases 1 a 7. |

## Fase 7 — publicável sem prints (2026-11-27)

O proprietário pediu o site pronto o quanto antes. A fase 7 (`feat/site-f7-publicacao-20261127`, criada a partir da fase 6) tira as capturas do caminho crítico: **a página nunca mostra um placeholder**. Enquanto uma tela não tiver captura real, a área do tour, o Player 360 e Pagamentos aparecem só com texto, diagramas e a lista de telas, sem moldura vazia. O aviso do rodapé só fala de telas do produto quando a página mostra uma. Quando uma captura chega, `python3 tools/render.py` passa a mostrá-la (RHS-055).

| Item | Estado em 2026-11-27 |
|---|---|
| Produção | Intocada; o `main` continua em `b4c11df`. |
| PR | Não foi aberto: a fase 8 veio logo em seguida e contém a fase 7. O PR #9 (fase 6) continua aberto e pronto para revisão, mas não vai mais ao `main`, porque a página dele mostra os placeholders e apresenta o back-office como produto. Fechá-lo sem merge fica com o proprietário. |
| Testes | Os 11 testes do README passaram na fase 7. `sectors` e `product-images` agora exigem que nenhum placeholder apareça e que a captura apareça depois de gerada a página; `mobile-showcase`, que o tour no celular mostre uma área e no máximo uma imagem por vez, a área de pagamentos com imagem exatamente quando há captura. |
| Capturas do demo | 13 telas do demo do Sentinel foram fotografadas no notebook do proprietário e estão só lá. Os dados são fictícios, como o proprietário confirmou depois; elas entram no site na fase 8 (item p de `DECISIONS.md`). |
| Repositório público | O commit `454453d` traz o endereço do demo; ele saiu da ponta do branch, mas continua no histórico, que a missão não deixa reescrever. |

Para publicar faltam a conferência do preview com o login da Vercel, as decisões dos sócios que o proprietário quiser fechar antes e o OK expresso dele para o merge.

## Rodada "produto real" — 2026-11-26: em preview, produção intocada

**As capturas estão pendentes.** Nenhuma tela real do back-office foi fotografada até agora. O ambiente da nuvem não tem o token de leitura do pacote privado do design system, e o proprietário decidiu seguir sem ele (RHS-023). Mesmo assim, na fase 6, cada imagem de produto do site já apontava para o arquivo final da lista da fase 1, `assets/product/<tela>.webp`. Hoje esse arquivo é um placeholder escuro, do mesmo tamanho, com o rótulo "Screenshot pending: <tela>". Na fase 6, bastava substituir o arquivo (RHS-041); desde a fase 7, a página só aponta para o arquivo quando ele é uma captura real, e é preciso gerar a página de novo depois de substituí-lo (RHS-055, passo 3 abaixo). O hero continua com as três imagens conceituais até a troca deliberada (RHS-044). **Não publicar em produção com placeholders** (resolvido na fase 7: a página não mostra mais nenhum).

| Item | Estado em 2026-11-26 |
|---|---|
| Produção | Intocada. O `main` está em `b4c11df`, o último release aprovado; nesta rodada não houve merge nem deploy de produção. |
| Branches e PRs | Seis branches empilhados (cada fase contém as anteriores):<br>- F1 `feat/site-f1-captura-20261126` (#4)<br>- F2 `feat/site-f2-hero-20261126` (#5)<br>- F3 `feat/site-f3-secoes-20261126` (#6)<br>- F4 `feat/site-f4-texto-20261126` (#7)<br>- F5 `feat/site-f5-conversao-20261126` (#8)<br>- F6 `feat/site-f6-qa-20261126` (#9), o PR deste relatório, pronto para revisão desde 2026-11-27, sem merge, que depende de aprovação expressa (RHS-054)<br>Em 2026-11-27, a pedido do proprietário, os PRs #4 a #8 foram fechados sem merge, porque trazem estados intermediários, com o texto anterior à revisão das afirmações e, no plano de captura, quatro nomes de variáveis da API e um fuso com nome de cidade. Os branches continuam no remoto, como registro (RHS-053). Ao `main` ia o PR da fase 6 ou o do branch das capturas, criado a partir dele; desde a fase 7, vai o PR da fase mais recente ou um posterior criado a partir dele (passo 3 abaixo). |
| Preview Vercel | A verificação "Vercel" de cada PR mostra o build concluído (o link está na própria verificação). Os previews têm SSO. O teste externo desta sessão foi bloqueado pelo proxy (403), então a conferência deve ser feita pelo link autenticado. |
| Capturas | Nenhuma de 30: são 30 placeholders, registrados em `tools/capture/placeholders.json`. O comando `node tools/capture/screens.mjs --dry-run` confere as 30 rotas no menu do back-office e diz o que ainda é placeholder. |
| Hero | Três imagens conceituais, com os mesmos bytes do manifesto de integridade, e o selo "ILLUSTRATIVE CONCEPT · SIMULATED DATA". O ponto de troca está pronto (`tools/capture/hero-swap.mjs` e `tools/capture/hero.json`); o `--check` recusa, como esperado, enquanto houver placeholders. |
| Folha de contato | Pendente: ela sai junto com as capturas reais (`tools/capture/contact-sheet.png`). Até agora só rodou o autoteste da ferramenta, contra o site estático. |
| Antes e depois | `docs/web-studio/real-product-evidence/before-after.md`: cada seção do `main` ao lado da fase 6, em inglês, a 1440 e a 390 px, gerado de novo depois da revisão das afirmações. |

### Como trocar os placeholders (notebook Windows)

1. Siga `tools/capture/README.md`: suba o back-office em modo mock (`API_MODE=mock`, `AUTH_PROVIDER=fake`, `FEATURE_FLAG_PROFILE=homologacao`, inglês) e rode `node tools/capture/screens.mjs --dry-run`, depois `node tools/capture/screens.mjs`.
2. Revise `tools/capture/contact-sheet.png` e cada arquivo em `assets/product/`. Recorte ou deixe de fora o que identificar o país do mock (decisão j). Nenhum e-mail, documento, nome que pareça real ou dado de equipe.
3. Tudo o que está em `assets/` vai ao repositório público e ao site. Para cada tela deixada de fora (e para `users`, que o site não usa), volte o placeholder com `git checkout -- assets/product/<tela>.webp`. Se uma das três telas do hero (`player-360-summary`, `withdrawals-queue` ou `reports`) ficar de fora, falhar ou for recortada à mão, apague também a cópia `assets/hero/<tela>.webp` (`Remove-Item assets/hero/<tela>.webp`), que não tem placeholder, ou recorte-a do mesmo jeito. Depois, refaça a folha com `node tools/capture/contact-sheet.mjs` e, só então, gere a página de novo com `py tools/render.py`: uma página gerada antes de voltar um placeholder continua apontando para ele. Faça commit de `index.html`, `es/index.html`, `assets/product/`, `assets/hero/`, `tools/capture/manifest.json` e da folha de contato num branch novo, criado a partir do branch da fase mais recente, com PR para o `main`, e confira o preview. Sem Python no notebook, faça o commit e o push sem as duas páginas e peça à sessão na nuvem que gere a página nesse branch e faça o commit delas; até lá, o preview não mostra as capturas. Esse PR contém todas as fases anteriores e passa a ser o que vai ao `main`.
4. Para o hero: rode `node tools/capture/hero-swap.mjs --check` e depois `node tools/capture/hero-swap.mjs`. Em seguida, rode `py tools/render.py` e `node tools/og/og.mjs` (sem Python no notebook, faça esse passo numa sessão na nuvem), depois os testes do README, e registre a troca em `DECISIONS.md`.

### Revisão das afirmações (2026-11-26)

Cada frase factual da página, nos dois idiomas, foi conferida contra o inventário verificado e contra o código do back-office, só com leitura:
- **Primeira rodada:** 96 afirmações, 40 achados. Cada achado passou por um verificador de código e um de texto. 39 foram confirmados por pelo menos um dos dois (quatro só pelo de texto) e corrigidos em `ef0a4f0`; o único refutado pelos dois foi o diagrama de segurança.
- **Segunda rodada:** as 78 substituições da primeira, de novo por código e por texto, mais uma leitura completa das duas páginas e da documentação. Nas substituições não houve erro de fato. A leitura completa achou exageros que tinham ficado em frases antigas (como a contagem de segmento apresentada como obrigatória, a legenda de CRM que falava em mensagens aprovadas e a frase da API de integração) e o problema da imagem da área Administration. Os 21 achados, dois deles sobre a mesma frase, foram aplicados em `9e931c8`.
- **Conferência final:** as mudanças da segunda rodada e estes registros, por código, texto e documentação. Os 15 achados, dois deles sobre a mesma frase do `README.md`, foram aplicados (RHS-052), entre eles o passo 03 do piloto e os valores escondidos na captura de `approval-limits`. Também foram aplicadas três notas para o proprietário: o limite das ações em massa sem número, os nomes de variáveis da API fora do plano de captura e a volta ao placeholder das telas que não vão ao site.
- **Última conferência:** as mudanças da conferência final, por código, texto e documentação. Os 9 pontos foram aplicados: o texto alternativo da imagem de Administration, que ainda falava em valores sintéticos, a elipse do passo 03 em espanhol, as cópias do hero em `assets/hero/` no passo de commit e a precisão destes registros. Uma checagem dessas mudanças não achou nada no texto do site e achou dois pontos de documentação, aplicados: o fuso do navegador da captura, que tinha o nome de uma cidade do país do mock, e o branch das capturas, que sai do da fase 6.
- **Onde está cada mudança:** RHS-049 a RHS-052 em `DECISIONS.md`. Saíram da página a tela Integrations da lista de Administration e, do card API-first, a frase de que a plataforma do operador se integra pela mesma API; a conexão da plataforma pela API ficou só no passo 03 do piloto, como trabalho definido e construído com o cliente (item m dos sócios). A imagem da área Administration passou a ser `approval-limits`, com os valores escondidos.

### Testes da fase 6 (2026-11-26, Chromium local)

Os 11 testes do README passaram sem afrouxar nada, também depois de cada rodada da revisão das afirmações:
- `generator`: as páginas equivalem à saída do gerador, há paridade EN/ES, o 3º idioma fica sem publicar e o ponto de troca do hero funciona.
- `integrity`: as imagens da órbita batem com o manifesto, e o selo é verdadeiro.
- `sectors`: os 10 setores, as 7 áreas com módulo e as afirmações proibidas ausentes.
- `alignment-audit`: 18 combinações EN/ES × largura.
- `mobile-showcase`: 320, 375, 390 e 430 px.
- `functional`: idioma, menu, abas do tour com clique, teclado e link direto, contato, pausa, console e movimento reduzido.
- `staging`.
- `visual`: 320, 390, 768, 1024, 1280, 1440 e 1920 px, EN/ES.
- `orbit`: duas voltas.
- `geometry`: as transformações da órbita idênticas às do `main` em 768 a 1920 px.
- `product-images`: os 30 placeholders; a troca por arquivo sem mudar a página; o `hero-swap` recusa placeholders e regrava o manifesto.

Também rodaram:
- O autoteste da captura.
- O `--dry-run`: nenhuma capturada, 30 placeholders, nenhuma faltando.
- O `hero-swap --check`, que recusou, como esperado.

As larguras pedidas (375, 768, 1280 e 1920) estão cobertas, nos dois idiomas. Também foram verificados:
- teclado: o primeiro Tab mostra "Skip to content" e o Enter leva às áreas do tour; há 40 paradas de foco por ciclo, todas com foco visível; menu e abas do tour respondem a setas e Home/End;
- `prefers-reduced-motion`;
- console sem erros;
- armazenamento: o navegador guarda só a preferência de idioma (`rhs-language`), e a página não faz chamada de rede além dos próprios arquivos nem carrega nada de terceiros;
- cabeçalhos: o `vercel.json` é igual ao do `main` (`nosniff`, `Referrer-Policy` e `X-Frame-Options`). Nenhum dos dois envia CSP; as páginas não têm script, estilo ou handler inline, então uma CSP estrita funcionaria.

Lighthouse local, com compressão brotli e simulação, sem dados de usuários reais (medido de novo nas páginas finais da revisão das afirmações, com os mesmos números):

| Perfil | Performance | Accessibility | Best practices | SEO | LCP | Peso inicial |
|---|---|---|---|---|---|---|
| Celular, EN e ES | 91 | 100 | 100 | 100 | 3,5 s | cerca de 600 KB |
| Desktop, EN e ES | 100 | 100 | 100 | 100 | 0,7 s | cerca de 690 KB |
| `main` no celular, para comparar | 85 | 100 | 96 | 100 | 4,3 s | cerca de 580 KB |

Cada imagem do tour só carrega quando a aba abre (lazy). Com as capturas reais, cada imagem terá até 250 KB.

### Pendências

- As capturas e a folha de contato (passo a passo acima). Enquanto isso, o Player 360 aparece sem imagem, só com a legenda numerada (RHS-043, RHS-055).
- A troca do hero, as imagens OG com a captura frontal e uma nova rodada de testes.
- Conferir o preview pelo link autenticado da Vercel, inclusive em Safari e Firefox, e a entrega na caixa `sales@rhs-labs.com` (RHS-039).
- As decisões dos sócios de a até p em `DECISIONS.md`, entre elas a disponibilidade para piloto (b, RHS-037), o recorte da jurisdição do mock (j), a legenda da órbita (l), a integração por API (m), a demonstração em espanhol com a interface em inglês (n), as chaves da API que vêm desligadas (o) e as capturas do demo (p).
- Antes de uma demonstração no mock: ele não reproduz todas as regras. A segunda aprovação usa valores fixos, e não os limites da tela, e os limites por papel não se aplicam. A trilha de auditoria é uma lista fixa: fora as ocorrências registradas no próprio relatório de auditoria, o que se faz na demonstração não aparece nele.
- O login com um provedor de identidade real e o teste de isolamento entre duas operadoras estão preparados no back-office, mas ainda não rodaram. Por isso a página trata a separação entre operadoras como propriedade de projeto.
- Uma CSP estrita pode entrar no `vercel.json` num release futuro; o `main` não tem CSP, e esta rodada não mexeu nos cabeçalhos.
- As evidências em PNG desta última rodada não foram versionadas (RHS-048).

### O que o repositório público expõe

O repositório continua público (decisão d, ação do proprietário).

Já expostos antes desta rodada:
- `docs/` com 50 MB de evidências e os documentos de processo do estúdio (`AGENTS.md`, `.agents/skills`, `PROCESS.md`, `PRODUCT_BRIEF.md`, `BACKLOG.md`).
- O nome da equipe na Vercel e ids de deployment `dpl_` em `STATUS.md`, `EXECUTION_LOG.md`, `RELEASE_PLAN.md`, `ALIGNMENT_STATUS.md` e nos JSON de evidência.
- As decisões, inclusive as dos sócios.

Novos nesta rodada:
- O nome do repositório privado do back-office (`tools/capture/README.md` e a pasta padrão em `tools/capture/lib.mjs`).
- Os nomes dos cookies do template (`tools/capture/screens.config.mjs`).
- Os nomes das variáveis de ambiente do back-office que a captura usa, com valores de desenvolvimento e nenhum segredo (`tools/capture/README.md`, o passo 1 acima, RHS-045 e um comentário em `tools/capture/screens.config.mjs`).
- O plano de captura: as rotas de 30 telas, os seletores e as listas de textos escondidos. Essas listas citavam pelo nome quatro chaves da API (selos de limites do caixa, de políticas e de jurisdição); na conferência final os nomes saíram da ponta do branch da fase 6, mas continuam nas pontas dos branches das fases 1 a 5 (PRs #4 a #8) e no histórico a partir de `23aa41d`. O mesmo vale para o fuso que o plano dá ao navegador, que tinha o nome de uma cidade do país do mock e agora é `Etc/GMT+3`, o mesmo UTC−3.
- Os filtros de termos proibidos em `tests/sectors.cjs` e `tests/alignment-audit.cjs`, que citam a sigla da plataforma de referência e os termos do mercado do mock.
- Da revisão das afirmações, sem nomes de variáveis da API: o texto da nota interna da fila KYC que a captura esconde, as limitações do mock, o que vem desligado por padrão na API (itens m e o de `DECISIONS.md`), que o limite das ações em massa e os valores padrão dos limites de aprovação são provisórios, e que o login com um provedor de identidade real e o teste de isolamento entre duas operadoras ainda não rodaram.

Commits já publicados no início da rodada (`f5cd300`, `23aa41d`, `656dc05`, `5eaff22`, `e4cfd9b`) trazem ainda:
- o nome do pacote privado do design system;
- o nome da variável do token, sem valor;
- os termos do mercado do mock (meio de pagamento, documento nacional, lei de privacidade e país).

Esses termos foram retirados nas pontas dos branches, mas continuam no histórico, e a missão proíbe reescrevê-lo; se isso importar, a saída é tornar o repositório privado. A varredura do histórico desta rodada não encontrou token, chave nem segredo.

---

Atualizado em 2026-10-23. **SITE 2.0 PUBLICADO EM PRODUÇÃO E CONFERIDO NOS ENDEREÇOS PÚBLICOS EN/ES.**

| Superfície | Evidência atual |
|---|---|
| Produção atual | https://site-rhs.vercel.app/ — publicação Vercel `READY`, deployment `dpl_2byDy9Uvx5UEyEi9UEkehgfvfHDz` |
| Rota espanhola | https://site-rhs.vercel.app/es/ — conteúdo novo em espanhol verificado por consulta externa |
| Código publicado | `main`, PR #1 merged (squash), release commit `d1fc5a936a7433b5410974e726821345700f5274` |
| Baseline e opção de rollback | Commit original `e14e2c3f5befade075dfc3009ea63b6fc1ee170c`; deployment original `dpl_t9CXop83FznzcUCQbek8R6aEnKps` |
| Hero V6 | Três dashboards em órbita 3D contínua; preservação comprovada em auditoria local, visual e geométrica |
| Preview | Deployment `dpl_6dUSU3RUybmHZR9qCzqQ8N8PC4HS` `READY`; acesso externo realizado por link temporário autenticado Vercel (sem desligar SSO) |
| Preview smoke | Browser remoto desktop: PASS (três imagens, órbita contínua, navegação, módulos, contato, EN/ES). |
| Mobile QA | Codex registrou teste Chromium local em 320/390/768/1024/1280/1440/1920 e >2 órbitas em mobile; não houve smoke mobile remoto independente após o merge |
| Produção EN/ES | GET externo confirmou conteúdo novo, metadados corretos e caminhos dos três dashboards em ambas as rotas |
| Domínio próprio | Não verificado; não presumir rhs-labs.com como publicado |

## Histórico do bloqueio de preview — RESOLVIDO
O Codex relatou `403 Forbidden` no CONNECT do proxy cloud do seu ambiente. A Vercel também utiliza proteção SSO para previews. O bloqueio foi superado por um **link temporário autenticado de preview**, gerado pelo acesso autorizado ao projeto Vercel, seguido por smoke test no navegador. Nenhuma configuração de SSO foi desativada. Não persistir token ou URL de compartilhamento em código/documentação.

## QA pré-release
- Chromium local: EN/ES, 7 larguras, menu/teclado, Workspace 7 vistas, reduced-motion, links e imagens.
- Órbita 3D: >2 voltas desktop/mobile e 161 amostras de geometria em 7 larguras; comparação com V6 original registrada em `docs/web-studio/evidence/`.
- Auditoria independente Produto/Copy/Compliance e Auditor: achados bloqueadores corrigidos.
- Browser remoto preview desktop: homepage, hero, dashboard assets, rotação, seções, navegação e alternância EN/ES aprovados.
- GET externo de produção nas rotas `/` e `/es/`: ambas carregaram o conteúdo novo; produção Vercel `READY`.
- Lighthouse local simulando mobile: Performance **68**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 4.7s, CLS 0. Não interpretar como métricas de usuários reais.

## Limitações remanescentes
- Não validados Firefox, Safari e Edge; sem dados reais de Core Web Vitals.
- Entrega da caixa `contact@rhs-labs.com` não confirmada; `mailto:` abre aplicativo do visitante, mas não comprova recebimento.
- Dados societários e políticas completas de processamento de dados dependem de validação antes de uso operacional/pilotos; aviso público não substitui política completa.
- Não existem ações financeiras reais no site, nem formulário ou analytics.
- Funcionalidades planejadas e mockups ilustrativos permanecem rotulados honestamente como produto em desenvolvimento.

## Alterações posteriores de documentação
Registros de status e planejamento foram atualizados após a publicação, sem alterações de interface. Qualquer commit subsequente no `main` pode disparar novo deploy automático da Vercel; verificar o commit/deployment efetivo antes de registrar uma versão posterior como produção.

## Nova rodada — alinhamento setor por setor

A missão anterior foi publicada e permanece como baseline de produção. A nova missão utiliza `feature/rhs-site-sector-by-sector-alignment` e termina em preview para aprovação final, sem merge automático. Consulte `ALIGNMENT_STATUS.md`, `SECTOR_ALIGNMENT_PLAN.md` e `alignment-evidence/` para o estado desta rodada. O canônico configurado no novo preview será `https://rhs-labs.com`, conforme instrução explícita; o contato principal será `sales@rhs-labs.com`.

Preview da rodada: https://site-rhs-git-feature-rhs-site-sector-b-3e513d-drhugomsilva-4234.vercel.app (Vercel SUCCESS no commit b3dfd56); PR #3. Auditoria local independente PASS. Smoke externo bloqueado por CONNECT 403; regra salva no rascunho. Produção permanece em 2e4312c e aprovação final deste refinamento está pendente.
