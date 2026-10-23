---
name: rhs-site-release
description: Use para preparar preview, GitHub branch/PR, deploy Vercel, rollback e publicação do site RHS Labs sem afetar produção antes de aprovação.
---

# rhs-site-release


1. Ler STATUS.md, DECISIONS.md e CHECKLIST.md.
2. Garantir que branch de trabalho não seja o main. Conferir arquivos afetados e commits.
3. Criar preview isolado quando solicitado; nunca apontar DNS/domínio de produção para preview.
4. Exigir aprovação visual e relatório de auditoria PASS. Bloquear publicação se faltar revisão de claims e páginas legais relevantes.
5. Pedir autorização explícita para merge em main/produção; aprovação conceitual de uma tela **não é** autorização para publicar o site inteiro.
6. Quando autorizado, merge controlado, deploy, smoke test do endereço oficial, checagem de formulário/rotas e registro no STATUS.md.
7. Preparar rollback pela revisão anterior conhecida; não apagar artefatos nem sobrescrever dados.
**Saída:** branch, preview, status dos testes, checklist, SHA, ação pedida e release/rollback.
