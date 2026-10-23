# Estado real — RHS Labs / Sentinel

Atualizado em 2026-10-23. Estado desta revisão: **BLOQUEADO ANTES DO MERGE DE PRODUÇÃO — PREVIEW PRONTO, SMOKE EXTERNO NEGADO PELO PROXY**.

| Superfície | Evidência atual |
|---|---|
| Base do estúdio | `39ef91a739f8ac98f27a53ccf79b4aaadc484b14`, branch `studio/rhs-web-studio-v1` |
| Produção anterior / rollback | `e14e2c3f5befade075dfc3009ea63b6fc1ee170c` — preservar histórico; reverter o futuro merge para rollback |
| Branch de implementação | `feature/rhs-site-complete-v2` |
| URL de produção existente | https://site-rhs.vercel.app — homepage configurada no GitHub; GET 200 e conteúdo idêntico ao main original |
| Integração Git/Vercel existente | Status Vercel success no commit original; projeto `drhugomsilva-4234/site-rhs` |
| Nova versão | HTML estático EN/ES, hero V6 integrado, narrativa e Workspace revisados; commit `6ccb5b3`, PR #1; não integrada em main nem afirmada em produção |
| Domínio próprio | Não verificado; não presumir rhs-labs.com como URL publicada |
| API Vercel | 403: missing authentication token; testar caminho Git existente sem inventar credencial |

## Preview real e bloqueio atual
- PR: https://github.com/hugomsilvaadv/site-rhs/pull/1
- Preview informado pelo bot Vercel: https://site-rhs-git-feature-rhs-site-complete-v2-drhugomsilva-4234.vercel.app
- Deployment status SUCCESS para `6ccb5b35c4315c4b8f4104ad286e2fa95baf3900`; dashboard: https://vercel.com/drhugomsilva-4234/site-rhs/JAHR6iDa4sLPShqusCQ2BeniKfaD
- Requisição externa ao preview bloqueada no CONNECT do proxy: `403 Forbidden`. Não é evidência de erro do site nem de login Vercel.
- Regra exata do hostname adicionada ao rascunho de rede preservando regras anteriores; o acesso efetivo ainda foi negado no retry.
- Ação externa mínima: aplicar/salvar essa regra nas configurações de rede do ambiente. A autorização de publicação já existe; não é necessário pedir nova autorização estética ou de merge.
- Sem smoke de preview, não fazer merge em main. API Vercel sem token não impede necessariamente a via Git, que já gerou o preview.
- Lighthouse da saída pública com origem absoluta: performance 68, acessibilidade 100, boas práticas 100, SEO 100, CLS 0; LCP 4.7s/TBT 540ms na simulação local. Não representa Core Web Vitals em produção. Medição anterior de performance 76 demonstra variação; não afirmar pontuação oficial.

## QA executado
- Funcional Chromium: idiomas persistentes, menu/teclado, 7 vistas, contato, console e reduced-motion.
- EN/ES × 7 larguras (320, 390, 768, 1024, 1280, 1440, 1920): sem overflow, imagens quebradas, âncoras ausentes ou requests de recursos falhos.
- Órbita real: >2 voltas em 1440/390; três telas visíveis, alternância frontal 0→1→2→0→1→2→0; limites positivos em todas as amostras. Sob carga concorrente, 64.3s/67.4s de observação; velocidade matemática original e limite de delta por frame preservados.
- Geometria determinística: 161 amostras de dois ciclos em cada uma das 7 larguras; estilos e limites dos 3 painéis idênticos à V6 original.
- Comparação visual em fase estática/reduced-motion com as mesmas fontes: 1440 pixel-idêntico; 390 idêntico exceto última linha raster junto à seção seguinte.
- Auditoria independente: Produto/Copy/Compliance e Auditor em contextos separados; achados de empacotamento, idioma e pausa corrigidos pelo coordenador.
- Saída pública exclui docs, testes, ferramentas e fragments. Sitemap/metadata absolutos gerados do domínio verificado; guardas de origem testadas.
- Lighthouse local mobile, servidor Python sem gzip/cache: performance 76, acessibilidade 100, boas práticas 100, SEO 85 antes de finalizar origem absoluta. Ver evidência; não são métricas de produção.

## Limitações honestas
- Não testados Safari, Firefox, Edge nem dados reais de Core Web Vitals/INP em campo.
- Mailto funcional abre o aplicativo do visitante; entrega de `contact@rhs-labs.com` não confirmada.
- Dados societários e tratamento de dados para piloto ainda dependem de confirmação. Aviso público sucinto não se apresenta como política jurídica completa.
- Sem certificações/clientes/resultados/integradores inventados; sem formulário, analytics ou ação financeira real.

Evidências e capturas: `docs/web-studio/evidence/`. Consulte `EXECUTION_LOG.md` para mudanças de diagnóstico e passos reais do release.
