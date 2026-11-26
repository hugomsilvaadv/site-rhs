# Registro de decisões (ADR leve)
Nenhuma decisão é apagada sem aditivo.

| ID | Data | Decisão | Estado |
|---|---|---|---|
| RHS-001 | 2026-10-23 | Manter apresentação comercial apenas em inglês e espanhol nesta fase. | APROVADO |
| RHS-002 | 2026-10-23 | Posicionar Sentinel como backoffice completo + pagamentos + inteligência + antifraude; não somente aprovação de saque. | APROVADO |
| RHS-003 | 2026-10-23 | Não divulgar roadmap/percentuais por componente; informar de forma global que produto está em desenvolvimento. | APROVADO |
| RHS-004 | 2026-10-23 | Dados de dashboard são fictícios; não fingir funcionalidades operacionais. | APROVADO |
| RHS-005 | 2026-10-23 | Hero com três dashboards em **órbita 3D contínua**, um frontal e dois recuados, sem cortes, controles sem setas. | APROVADO VISUALMENTE |
| RHS-006 | 2026-10-23 | Usar visual sofisticado com gráficos e movimento em identidade RHS; sem cópia de Chainalysis. | APROVADO |
| RHS-007 | 2026-10-23 | Fluxo de trabalho: discutir → aprovar visual → branch → preview → auditoria → publicar com autorização. | APROVADO |
| RHS-008 | 2026-10-23 | Criar núcleo coordenado RHS Web Studio com skills, agentes e checkpoints. | IMPLEMENTADO NA BRANCH DO NÚCLEO |

## Particularidade da abertura
A prévia **V6 — Órbita Sem Cortes** foi aceita como base para integração. Não presumir que já esteja aplicada ao `main`; verificar `STATUS.md`.

## Como registrar próximas decisões
`RHS-NNN | data | demanda | opções avaliadas | decisão | impacto nos arquivos | revisor | estado`. Depois atualizar backlog e checklist correspondente.

## Aditivo da missão de release — 2026-10-23

| ID | Decisão | Origem / estado |
|---|---|---|
| RHS-009 | A missão fornecida autoriza implementação integral e publicação após QA, sem nova rodada estética ou nova pergunta de autorização. | Instrução expressa do proprietário; substitui checkpoints intermediários genéricos nesta missão |
| RHS-010 | Referência exclusiva da abertura: V6 SHA-256 `43563210bff41737b38070b32c5c5931af39af2366662d43a5e369f41cd7eecd`. | Verificada; CSS e imagens preservados; movimento comparado em todas as larguras |
| RHS-011 | Manter stack estática, duas rotas rastreáveis `/` e `/es/`, sem framework/backend. Usar fontes locais com licenças. | Escolha do coordenador sob mandato; reduz dependências e payload base64 |
| RHS-012 | Narrativa: Workspace → quatro pilares → quatro cenários → fluxo → empresa/controles → contato/aviso. | Produto/Copy/Compliance consultados; implementação aprovada pela missão |
| RHS-013 | Remover placeholders jurídicos, afirmações não comprovadas e referências a mercado excluído dos arquivos públicos. Usar aviso transparente sem documento jurídico fictício. | Implementado; confirmação societária e mailbox permanece pendente |
| RHS-014 | Publicar apenas saída `public/`, criada por allowlist em `tools/stage.mjs`; nunca a raiz do checkout. | Achado do auditor corrigido e testado |
| RHS-015 | Origem oficial existente confirmada: `https://site-rhs.vercel.app`, coincidente com homepage GitHub e bytes do main em produção. Não inventar domínio próprio. | Verificado por HTTP e GitHub; sitemap/canonical/OG gerados da configuração |
| RHS-016 | Melhorias invisíveis do hero: ARIA traduzida, teclado/reduced-motion, pausa de acessibilidade e uma leitura de largura por frame; nenhuma mudança na geometria, imagens ou velocidade matemática padrão. | Comparação determinística com a V6 passou em 7 larguras |

| RHS-017 | Não integrar em main com smoke externo do preview bloqueado por rede, mesmo com build Vercel SUCCESS. Preservar produção anterior até aplicar a regra de rede já salva e executar o gate. | Bloqueio verificável, não falta de autorização do proprietário |

## Aditivo — alinhamento setor a setor

| ID | Decisão | Origem / estado |
|---|---|---|
| RHS-018 | Setores 2–9 seguem a imagem enviada, com notebook limpo no 2, grafo semântico no 4, pagamentos coerentes no 5 e marca vetorial plana no 8. Não propor outra direção visual. | Nova missão expressa; implementado para preview |
| RHS-019 | Canônico passa a `https://rhs-labs.com` e contato principal a `sales@rhs-labs.com`. Configuração não comprova caixa postal nem altera DNS. | Decisão explícita do usuário; substitui canônico da rodada anterior |
| RHS-020 | Esta rodada termina em preview auditado para aprovação final; não herdar autorização de merge da missão anterior para publicar o novo refinamento. | Novo escopo expresso |
| RHS-021 | HERO permanece visualmente idêntico. Diagnóstico em 320/375/390/430 encontrou transition none/0s; cache de dimensões até resize remove leitura de layout por frame sem alterar matemática, imagens ou velocidade. | Testes de geometria e regressão visual executados |
| RHS-022 | Gráficos são explicativos e usam dados simulados: contas periféricas uniformes, relações rotuladas, unidade explícita em depósitos/saques e fila sem botões financeiros reais. | Copy/Compliance e Design aplicados |

## Aditivo — produto real no site (2026-11-26)

Missão: trocar as imagens conceituais pelo back-office real (modo mock, dados sintéticos) e reescrever o site em torno do que existe de fato. Branches por fase `feat/site-<fase>-<assunto>-20261126`, PR para `main`, só preview; nada vai ao domínio de produção sem aprovação expressa.

| ID | Data | Decisão | Origem / estado |
|---|---|---|---|
| RHS-023 | 2026-11-26 | A captura das telas reais ficou bloqueada: o back-office depende do pacote privado do design system (GitHub Packages) e não há token `read:packages` no ambiente da nuvem. O formulário seguro de credencial foi recusado e o proprietário escolheu **seguir sem capturas reais**. A ferramenta de captura é entregue pronta (`tools/capture/`), com autoteste contra o site estático; hero, tour e Player 360 ficam com as imagens pendentes, e as três imagens conceituais do hero continuam, rotuladas como ilustrativas. | Escolha do proprietário; pendente: token para `npm ci` no back-office |
| RHS-024 | 2026-11-26 | Capturas no tema escuro do back-office (cookie `ginga_theme=dark`, que liga a classe `dark` do design system), em inglês, perfil de flags `homologacao`, 1600×1000 a 2× (celular 390×844 a 2×), WebP ~0,82 com alvo abaixo de 250 KB. | Pedido da missão; o tema escuro existe no back-office (`src/lib/theme.ts`) |
| RHS-025 | 2026-11-26 | Nenhuma captura vai ao site sem revisão humana: cada uma nasce "review pending" em `tools/capture/manifest.json` e só é usada depois de `--approve`, que confere o SHA-256 do arquivo revisado. A varredura recusa a imagem com e-mail, documento nacional, token, credencial ou endereço interno visível. | Regra de dados sintéticos da missão |
| RHS-026 | 2026-11-26 | Captura só contra back-office local (`localhost`/`127.0.0.1`) e só em modo mock. A aba Vínculos do Player 360 e qualquer tela de multicontas, dispositivo, fingerprint ou grafo de vínculos ficam fora da lista de telas. | Limite inegociável do back-office e da missão |

## Decisões a confirmar com os sócios

Escolhas feitas sem consulta, pelo padrão da missão (o proprietário pediu para não ser perguntado sobre conteúdo). Cada linha diz o que foi aplicado e o que ainda depende de confirmação.

| Ref. | Decisão aplicada | O que confirmar |
|---|---|---|
| a | Nome: **"RHS Labs Sentinel — PAM e back-office para operadoras de apostas reguladas"**. Sentinel continua a marca; a palavra "PAM" passa a aparecer. | Nome e posicionamento |
| b | "Platform in development" sai; entra **"Available for pilot programs"**. Um único selo nas imagens e um aviso no rodapé; os avisos repetidos saem. O selo "Product UI · Synthetic data" só vale para capturas reais: enquanto o hero tiver as imagens conceituais, o selo delas continua dizendo que são ilustrativas. | Se a disponibilidade para piloto pode ser anunciada já, mesmo antes da troca das imagens |
| c | Português **não** é publicado agora (cautela regulatória do briefing). O gerador fica pronto para um terceiro idioma, sem gerar a página. | Quando e se publicar em português |
| d | A visibilidade do repositório público **não** muda (ação do proprietário). O relatório final lista o que está exposto em `docs/`. | Tornar o repositório privado ou limpar `docs/` |
