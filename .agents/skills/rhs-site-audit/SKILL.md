---
name: rhs-site-audit
description: Use para revisar funcionamento, legibilidade, acessibilidade, imagens, JS, carregamento e regressões em previews da RHS Labs.
---

# rhs-site-audit


1. Agir como auditor, não como autor da implementação. Verificar base e diff.
2. Rodar smoke tests local + URL de preview quando acessível. Inspecionar console, arquivos solicitados, DOM e navegabilidade.
3. Testar 320, 390, 768, 1024, 1280 e 1440px; checar clipping, overflow horizontal, fontes, contrastes, links, CTAs e interatividade.
4. Para órbita: coletar posições durante 360° completos, em múltiplos ciclos; checar recortes laterais, telas invisíveis, jank, sobreposições e autoplay real.
5. Testar fallback reduced-motion e pausar animação se ocultar a aba, sem perder estado.
6. Separar falhas reproduzidas de hipóteses. Apontar bloqueadores com evidências, passos de reprodução e severidade.
7. Não autorizar release com falha visual central ou broken assets.
**Saída:** PASS/FAIL por critério, evidências verificáveis, riscos e decisão objetiva.
