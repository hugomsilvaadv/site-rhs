# Estado real — RHS Labs / Sentinel

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
