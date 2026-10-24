# Alinhamento visual — rodada para aprovação final

Escopo: missão de refinamento setor por setor com imagem aprovada fornecida pelo proprietário. Esta rodada não autoriza publicação automática de seu resultado.

Branch: `feature/rhs-site-sector-by-sector-alignment`.
Base: núcleo `studio/rhs-web-studio-v1` (39ef91a), reconciliado com main publicada `2e4312c`; PR #1 da missão anterior já estava integrado. Nenhuma alteração em main nesta rodada.

## Implementado
- 02: headline à esquerda e notebook premium à direita, com menos brilho e Workspace HTML interativo.
- 03: quatro cards conectados, ícones, copy comercial curta e menção discreta a Complete.
- 04: conta selecionada central e cinco contas relacionadas; vínculos rotulados por device, payment, identidade, rede e atividade; legenda sem veredito de fraude. Mobile inclui lista legível das relações.
- 05: depósitos/saques em séries distintas e unidades simuladas explícitas, com fila de revisão contextual.
- 06: Observe → Connect → Review → Record em quatro etapas.
- 07: três pilares com ícones, centrados em visibilidade, investigação e rastreabilidade.
- 08: descrição institucional, três princípios e marca vetorial plana; nenhum objeto 3D decorativo.
- 09: painel comercial simples com `sales@rhs-labs.com`; mailto abre o aplicativo do visitante, sem formulário/endpoint inventado.
- EN/ES completos; canônico, hreflang, OG e sitemap apontam para `https://rhs-labs.com`, por decisão explícita do usuário. GET 200 desse domínio foi observado, sem mudança de DNS/deployment nesta rodada.

## HERO
Fragmento, CSS e três imagens permanecem byte a byte iguais ao main publicado. Screenshot desktop e mobile coincide com baseline, exceto última linha de rasterização que toca o fundo da nova seção seguinte. Matemática e velocidade padrão preservadas. Única alteração técnica: dimensões cacheadas até resize/ResizeObserver.
O conflito CSS/RAF suspeito não se reproduziu: as três telas já computavam transition none/0s em 320,375,390,430. Duas amostras de 3 s registraram 360 e 180 recalculações de estilo antes/depois; não constituem benchmark em dispositivo físico nem prova de fluidez universal.

## QA
- Contrato de oito setores falhou no site anterior e passou na implementação nova.
- Suite funcional: idiomas/persistência, menu e teclado, sete vistas, pausa, contato e reduced-motion PASS.
- Auditoria independente: EN/ES × nove larguras, sem overflow, JS errors, requests falhos, imagens quebradas ou âncoras ausentes; redimensionamento 320→430→375→390→1440→390 no mesmo documento sem clipping.
- Geometria vs V6: 161 amostras de dois ciclos em cada uma das sete larguras da suite anterior PASS; screenshots e manifestos em alignment-evidence/.
- Órbita observada por mais de 2 voltas em 320/375/390/430: todos os painéis permaneceram dentro dos limites e com opacity ≥ .75; transições 0s em todas as amostras. Observação concorrente sob carga não equivale a benchmark de aparelho físico.
- Auditoria visual compara a composição aprovada, respeitando as exceções explícitas e copy honesta; não importa promessas não comprovadas da imagem.
- Artefato público exclui documentação, testes, ferramentas e fragments; geração sitemap/metadata e guardas de origem testadas.

## Limitações
Mailbox de vendas não verificada; nenhum email enviado. Safari/iPhone e Chrome Android físicos não disponíveis; Chromium/Pixel 7 emulado, sem alegar teste físico. WebKit e Firefox não instalados. Não há backend de demonstração ou ações financeiras reais.

Preview/PR e resultado de smoke externo serão registrados após geração pela Vercel. Estado nesta revisão: IMPLEMENTADO / VALIDADO LOCALMENTE / AGUARDANDO PREVIEW E APROVAÇÃO FINAL.
