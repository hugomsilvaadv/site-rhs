# RHS Web Studio — Núcleo de Produção e Discussão

Estrutura inspirada no modelo HM Perícia/PJe-Calc: coordenador `AGENTS.md`, skills especializadas, agentes de funções distintas, checkpoints e auditoria.

## Como operar
1. Leia `AGENTS.md` e `docs/web-studio/PRODUCT_BRIEF.md`.
2. Para debater uma seção: peça ao agente Produto ou Design **3 propostas, com trade-offs**, sem modificar o código.
3. Registre a opção aprovada em `DECISIONS.md` e abra uma tarefa no `BACKLOG.md`.
4. O agente Frontend implementa em branch com evidência de desktop/mobile e protótipo.
5. Auditor e Regulatório avaliam as alterações antes de release.
6. Release gera URL de preview, registra teste de aceite e pede aprovação explícita para o `main`.

## Onde encontrar
- `AGENTS.md`: regras globais/roteamento.
- `.agents/skills/`: 8 skills padrão Open Agent Skills, reconhecidas por Codex e clientes compatíveis.
- `.github/agents/`: perfis de agentes para VS Code / GitHub Copilot.
- `docs/web-studio/`: briefing, decisões, estado real, checklist e backlog.

## Comandos de trabalho sugeridos
- "`$rhs-site-design` apresente 3 versões da seção 2 sem alterar produção."
- "`$rhs-site-build` implemente o layout aprovado em branch de preview."
- "`$rhs-site-audit` verifique o carrossel continuamente por uma volta, inclusive a 320 px."
- "`$rhs-site-release` prepare preview e checklist, não publicar ainda."

Disponibilidade automática das skills depende do ambiente (Codex/Copilot) e acesso ao repositório. Arquivos `SKILL.md` não criam agentes que trabalham sozinhos em segundo plano.

**Estado inicial:** as instruções estão em branch de preparação. `main` e a versão pública permanecem sem alteração pelo núcleo.
