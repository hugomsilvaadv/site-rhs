# RHS Web Studio — coordenador permanente do site RHS Labs

Este repositório contém o site da RHS Labs e os procedimentos do núcleo de desenvolvimento, revisão e publicação. Antes de qualquer alteração, ler `docs/web-studio/PRODUCT_BRIEF.md`, `DECISIONS.md`, `PROCESS.md` e `STATUS.md`.

## Missão
Criar uma experiência B2B internacional e sofisticada que represente a RHS Labs e o Sentinel com precisão, qualidade visual, rastreabilidade e comunicação honesta sobre disponibilidade. O fluxo é **discutir → propor opções → aprovar → implementar em branch → auditar → aprovar release → publicar**.

## Dispatch de skills
- Estratégia, arquitetura, requisitos e conflitos de escopo: `$rhs-site-product`.
- Design, UI/UX, carrossel 3D, gráficos e motion: `$rhs-site-design`.
- Textos, tradução EN/ES e posicionamento: `$rhs-site-copy`.
- HTML, CSS, JavaScript, acessibilidade e responsividade: `$rhs-site-build`.
- Testes, comportamento, mobile e regressões: `$rhs-site-audit`.
- Revisão jurídica/regulatória, claims e LGPD: `$rhs-site-compliance`.
- SEO, Core Web Vitals e instrumentação: `$rhs-site-seo`.
- Preview, GitHub, Vercel, release e rollback: `$rhs-site-release`.

Um coordenador pode combinar skills de forma sequencial, mas **não deve deixar dois agentes alterando os mesmos arquivos ao mesmo tempo**. O auditor valida o trabalho do implementador, com evidências independentes.

## Regras não negociáveis
1. Preservar o `main` e o deployment de produção até aprovação explícita de publicação; mudanças em branch/preview.
2. Não inventar clientes, números, integrações, certificações, funcionalidade entregue, homologação ou demonstração real.
3. Site comercial em **inglês e espanhol** nesta fase; não adicionar português sem decisão expressa.
4. Produto **em desenvolvimento**; diferenciar mockup/simulação de tela funcional e evitar promessas de disponibilidade imediata.
5. RHS Labs é a empresa; Sentinel é o produto. Módulos: Core, Payments, Intelligence e Fraud; Complete é combinação comercial.
6. Identidade: azul-marinho e verde-água; alta qualidade enterprise; Chainalysis foi referência de sofisticação, **não copiar componentes ou composição**.
7. Preservar a abertura aprovada: **3 dashboards em órbita 3D contínua**, um frontal e dois recuados; nenhuma tela deve ser cortada nos extremos.
8. Validar navegação, fonte, imagens, mobile, animações, acessibilidade, performance e CTA **antes** de liberar.
9. Não divulgar ou presumir aconselhamento jurídico definitivo; claims e público-alvo sujeitos a revisão especializada.
10. Nunca registrar segredos, tokens, dados reais de apostadores ou credenciais em previews/commits.

## Saída padrão de cada tarefa
Objetivo; estado anterior; proposta; arquivos tocados; prévia (se houver); evidências de teste; riscos/pendências; decisão necessária; estado final **PROPOSTA / APROVADO / IMPLEMENTADO / TESTADO / PUBLICADO**.

## Fonte de verdade
`docs/web-studio/DECISIONS.md` = decisões, `STATUS.md` = o que está de fato publicado, `BACKLOG.md` = prioridades. Não confundir "aprovado conceitualmente" com "em produção".
