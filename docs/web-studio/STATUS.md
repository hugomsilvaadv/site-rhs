# Estado real — RHS Labs / Sentinel

Atualizado em 2026-10-23. Estado desta revisão: **IMPLEMENTADO E VALIDADO LOCALMENTE; RELEASE EM PREPARAÇÃO**.

| Superfície | Evidência atual |
|---|---|
| Base do estúdio | `39ef91a739f8ac98f27a53ccf79b4aaadc484b14`, branch `studio/rhs-web-studio-v1` |
| Produção anterior / rollback | `e14e2c3f5befade075dfc3009ea63b6fc1ee170c` — preservar histórico; reverter o futuro merge para rollback |
| Branch de implementação | `feature/rhs-site-complete-v2` |
| URL de produção existente | https://site-rhs.vercel.app — homepage configurada no GitHub; GET 200 e conteúdo idêntico ao main original |
| Integração Git/Vercel existente | Status Vercel success no commit original; projeto `drhugomsilva-4234/site-rhs` |
| Nova versão | HTML estático EN/ES, hero V6 integrado, narrativa e Workspace revisados; ainda não afirmada em produção |
| Domínio próprio | Não verificado; não presumir rhs-labs.com como URL publicada |
| API Vercel | 403: missing authentication token; testar caminho Git existente sem inventar credencial |

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
