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
