---
name: rhs-site-build
description: Use para implementar HTML, CSS, JavaScript, componentes, animações, acessibilidade e responsividade do site RHS Labs.
---

# rhs-site-build


1. Ler AGENTS.md, escopo aprovado e estado publicado; trabalhar em branch, preservar a arquitetura existente e evitar refatoração ampla não aprovada.
2. Editar só seções autorizadas; registrar diff, assets e tamanhos. Não usar conteúdo de previews como fonte definitiva sem checar dependências.
3. Para 3D contínuo usar ciclo matemático periódico e coordenadas relativas à viewport; assegurar que **todos os quadros** do ciclo fiquem dentro da área visível.
4. Não assumir caminho `assets/...` disponível em HTML isolado. Empacotar recursos junto ao site ou embutir no HTML standalone.
5. JS defensivo: sem fechamento duplicado, verificar console e garantir estado inicial já visível.
6. Suportar mouse, touch, teclado, `prefers-reduced-motion`; evitar animação que degrade desempenho.
7. Usar visual de dados simulados; nenhuma chamada real de pagamento/saque em demos.
8. Pedir auditoria independente antes de indicar prontidão.
**Saída:** alterações, arquivo/branch, teste local realizado, observações e pendências.
