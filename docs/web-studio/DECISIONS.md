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
| RHS-027 | 2026-11-26 | Hero: H1 "Player account management for regulated operators." e subtítulo com PAM, Player 360, pagamentos com níveis de aprovação, risco e compliance (EN/ES). As três imagens conceituais ficam byte a byte (manifesto de integridade intacto), agora com nomes e alt que dizem "conceito, não o produto atual", e a faixa sob a órbita vira o selo único "AVAILABLE FOR PILOT PROGRAMS · ILLUSTRATIVE CONCEPT · SIMULATED DATA". Os rótulos "Multi-account Investigation" e "Operations Control Center" saem das legendas. A faixa de valores troca os títulos genéricos por Player 360, pagamentos com níveis de aprovação, risco e fraude, e trilha de auditoria. | Missão (fase 2); troca das imagens pendente do token |
| RHS-028 | 2026-11-26 | Troca do hero só por comando deliberado (`tools/capture/hero-swap.mjs`): exige as três capturas aprovadas em 1586×992, regrava o manifesto de integridade de propósito e o gerador passa o selo para "PRODUCT UI · SYNTHETIC DATA". Sem isso, o gerador recusa a troca. | Regra do README (bytes iguais ao manifesto) mantida, agora testada (`tests/integrity.cjs`) |
| RHS-029 | 2026-11-26 | Gerador com registro de idiomas (`LANGUAGES`): só os publicados geram página, hreflang e seletor; checagem de estrutura EN/ES em toda geração. `site.js` e `hero-v6.js` leem rótulos e rotas da própria página, sem textos EN/ES no código. Português não é publicado (decisão c). | Padrão c da missão; `tests/generator.cjs` prova o terceiro idioma sem gerar a página |
| RHS-030 | 2026-11-26 | Sem a referência V6 nesta sessão (pacote de handoff ausente), `tests/geometry.cjs` foi rodado contra o `main` publicado servido na porta 8001 (o `main` já tinha sido comparado à V6). O teste passou a comparar a transformação de cada painel exatamente e os limites com tolerância de 0,01 px, porque o H1 novo desloca a faixa inteira e a subtração de posições absolutas varia na 5ª casa decimal. | Ajuste do teste registrado; transformações idênticas nas 5 larguras |
| RHS-031 | 2026-11-26 | A parte de baixo passa a ter 10 setores, todos com base no back-office real: tour (7 áreas), módulos, Player 360, pagamentos, compliance e controle, inteligência conectada (conceitual), segurança e integração, piloto, empresa e contato. Cada afirmação foi conferida no código do back-office por leitores com verificador cético (rota do menu, flag ligada no perfil `homologacao`). | Missão (fase 3) |
| RHS-032 | 2026-11-26 | Imagem de produto só com captura aprovada. Sem captura, cada área do tour mostra a lista real das telas do menu, e o Player 360 mostra as cinco partes numeradas. Pagamentos mostra os estados reais do saque (`requested → … → confirmed`, com `held`, `rejected`, `failed`, `reversed`) como diagrama, que não é tela. Nada de tela inventada. | Escolha do proprietário de seguir sem capturas (RHS-023) |
| RHS-033 | 2026-11-26 | "Connected intelligence" vira um diagrama conceitual de sinais em torno de uma conta (pagamentos, alertas, pontos de fraude, KYC, jogo responsável, auditoria), todos módulos reais. O grafo de contas vinculadas, com dispositivo e rede compartilhados, sai: o site não anuncia multicontas, dispositivos nem fingerprint. | Regra da missão |
| RHS-034 | 2026-11-26 | Saem o espaço de trabalho HTML ilustrativo ("Player 360" com abas de vínculos e dispositivos), o gráfico simulado de depósitos e retiros, o notebook do celular e `assets/visual-fidelity.css/js`. O botão "Pausar movimento" passa para o lado dos pontos da órbita (WCAG 2.2.2). | Missão (fase 3): o mock HTML era substituído pelo tour |
| RHS-035 | 2026-11-26 | Testes reescritos para o conteúdo novo sem afrouxar o que verificam: `sectors`, `functional` e `mobile-showcase`. `alignment-audit` e `visual` rolam a página antes de checar as imagens, porque imagens lazy fora da tela não carregavam e o teste falhava já no `main`. Novo `tests/product-images.cjs`, com imagens de fixture numa cópia temporária, prova o caminho das capturas aprovadas. | Ajuste dos testes registrado |
| RHS-036 | 2026-11-26 | Metadados: title "RHS Labs Sentinel — PAM and back-office for regulated betting operators" (ES equivalente), description com Player 360, retiros com níveis de aprovação, risco, fraude, compliance e disponibilidade para piloto; `og:site_name`, `og:locale:alternate`, `og:image` 1200×630 com dimensões e alt, `twitter:image`. A imagem OG (JPEG, uma por idioma) sai do texto do hero gerado (`tools/og/og.mjs`): tipográfica enquanto o hero for conceitual, com a captura frontal depois da troca. | Missão (fase 4) |
| RHS-037 | 2026-11-26 | "Available for pilot programs" (decisão b) contraria a regra 4 do `AGENTS.md` e o "aviso global de desenvolvimento" do `PRODUCT_BRIEF.md`. Aplicado por instrução expressa do proprietário nesta missão; as duas regras não foram editadas e a confirmação fica com os sócios. | Conflito registrado, não resolvido no texto das regras |

## Decisões a confirmar com os sócios

Escolhas feitas sem consulta, pelo padrão da missão (o proprietário pediu para não ser perguntado sobre conteúdo). Cada linha diz o que foi aplicado e o que ainda depende de confirmação.

| Ref. | Decisão aplicada | O que confirmar |
|---|---|---|
| a | Nome: **"RHS Labs Sentinel — PAM e back-office para operadoras de apostas reguladas"**. Sentinel continua a marca; a palavra "PAM" passa a aparecer. | Nome e posicionamento |
| b | "Platform in development" sai; entra **"Available for pilot programs"**. Um único selo nas imagens e um aviso no rodapé; os avisos repetidos saem. O selo "Product UI · Synthetic data" só vale para capturas reais: enquanto o hero tiver as imagens conceituais, o selo delas continua dizendo que são ilustrativas. | Se a disponibilidade para piloto pode ser anunciada já, mesmo antes da troca das imagens |
| c | Português **não** é publicado agora (cautela regulatória do briefing). O gerador fica pronto para um terceiro idioma, sem gerar a página. | Quando e se publicar em português |
| d | A visibilidade do repositório público **não** muda (ação do proprietário). O relatório final lista o que está exposto em `docs/`. | Tornar o repositório privado ou limpar `docs/` |
| e | H1 em inglês "Player account management for regulated operators." e, em espanhol, "Gestión de cuentas de jugadores para operadores regulados.", com "PAM" no subtítulo. | Texto do H1 |
| f | Enquanto não houver capturas, o hero continua com as imagens conceituais, com legendas "(concept)" e alt "not the current product". | Se preferem esconder as imagens conceituais até a troca |
| g | Módulo comercial de cada área do tour: Players → Core, Payments → Payments, Risk & Fraud → Fraud, Bonus & CRM → Core, Compliance → Core, Reports → Intelligence, Administration → Core. | Mapeamento comercial |
| h | O card "Intelligence" descreve o que existe hoje (relatórios e segmentos: saldos dos jogadores, margens, saldos negativos, bloqueios, saúde das rotinas), não sinais de dispositivo, identidade ou redes de contas, como o briefing original. | Escopo comercial do módulo Intelligence |
| i | Menu do topo com seis itens (Platform, Modules, Payments, Compliance, Security, Pilot); "Company" fica no rodapé. As âncoras antigas `#use-cases` e `#how` levam ao piloto. | Navegação |
| j | O mock do back-office reflete a jurisdição de um único país (moeda, meio de pagamento instantâneo, documento nacional, fuso horário e lei de privacidade locais, além de textos sintéticos em português). Nas capturas isso será recortado ou escondido, nunca reescrito. Alternativa: pedir ao back-office um mock com jurisdição neutra antes de capturar. | Aceitar recortes ou pedir mock neutro |
