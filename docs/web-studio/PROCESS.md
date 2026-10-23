# Processo padrão RHS Web Studio
## 0. Preparação
Ler AGENTS.md, briefing, decisões, status, backlog. Revisar GitHub main, branch de trabalho, origem do HTML/Figma e diferenças. Registrar commit de partida.

## 1. Discussão orientada
Produzir 2–3 alternativas concisas; comparar benefício de negócio, consistência visual, esforço, risco regulatório, uso mobile e performance. Para pedido visual, apresentar imagens/preview antes de codificar se o usuário assim desejar. Registrar *seleção do usuário*.

## 2. Implementação isolada
Criar branch por alteração (`feature/site-...`). Modificar apenas arquivos do escopo. Não trocar todo o site por uma prévia sem revisar a perda de recursos. Não misturar produção com placeholders não autorizados.

## 3. Auditoria independente
Testar desktop 1440, 1280 e 1024; tablet 768; mobile 390 e 320. Validar imagens/fontes, layout, links, menus, navegação teclado, reduced-motion, animações, rede, console, CTA e SEO. Para órbita 3D: 360°, várias voltas, posições extremas, não cortar laterais ou cabeçalhos.

## 4. Comunicação da entrega
Resumo antes/depois, evidências reais, links de preview, arquivos alterados, limitações, pendências e decisão solicitada. Não afirmar que algo foi testado sem teste.

## 5. Release
Somente após autorização expressa de publicação: merge controlado em main, deploy Vercel, teste de fumaça pós-deploy, registro de versão e rollback disponível. Se erro, reversão pontual; não sobrescrever versão aprovada sem backup.

## 6. Paralelismo de trabalho
Produto, Design e Copy podem propor em paralelo; Frontend integra em uma branch; Auditor verifica depois. Evitar duas edições concorrentes no mesmo arquivo, assim como no núcleo PJe-Calc.
