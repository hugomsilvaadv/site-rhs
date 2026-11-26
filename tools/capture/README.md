# Captura das telas reais do back-office

Ferramenta que fotografa o back-office real (o checkout ao lado do site) para o site: modo mock, dados sintéticos, inglês, tema escuro, perfil de flags `homologacao`. Nada é publicado sem revisão: cada imagem nasce "review pending" e só entra no site depois de aprovada.

Estado em 2026-11-26: a ferramenta está pronta e testada contra o próprio site (`--self-test`), mas **nunca rodou contra o back-office**. O `npm ci` do back-office precisa do pacote privado do design system (GitHub Packages), e esta sessão não tinha o token `read:packages`. Seletores, ids e cortes saíram do código-fonte e precisam ser confirmados na primeira captura.

## Pré-requisitos

- Back-office ao lado do site, em `../rhs-pam-backoffice` (ou `BACKOFFICE_DIR`), com `npm ci` feito. O token vai como segredo de rede para `npm.pkg.github.com` no ambiente da nuvem, ou como `NODE_AUTH_TOKEN` no ambiente; nunca em arquivo ou no chat.
- Playwright e Chromium do ambiente (a nuvem já tem os dois; não rode `playwright install`).

## Passo a passo

1. Suba o back-office em modo de desenvolvimento, só local. `next build` recusa o login falso e o mock:
   ```bash
   cd ../rhs-pam-backoffice
   APP_KIND=backoffice APP_URL=http://127.0.0.1:3000 AUTH_PROVIDER=fake API_MODE=mock FEATURE_FLAG_PROFILE=homologacao \
   SESSION_SECRETS="$(node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")" npm run dev -- -H 127.0.0.1
   ```
   A primeira visita de cada rota compila e pode levar minutos; o script espera até 300 s.
2. Confira o plano: `node tools/capture/screens.mjs --dry-run`. Toda rota tem de ser uma tela do menu (`src/config/navigation.ts`).
3. Capture: `BACKOFFICE_URL=http://127.0.0.1:3000 node tools/capture/screens.mjs`, ou só algumas telas com `--only player-360-summary,reports`. O script entra pelo login falso como `admin` e nunca fotografa `/auth/fake`. Ele não confirma, salva, aprova nem revela nada.
4. Revise **cada** imagem: abra `tools/capture/contact-sheet.png` (ou o `.html`) e os arquivos de `assets/product/`. A folha mostra, por tela, o que conferir, o que foi escondido e os avisos.
5. Aprove o que passou: `node tools/capture/screens.mjs --approve player-360-summary,withdrawals-queue,…`. A aprovação confere o SHA-256 do arquivo revisado.
6. Gere o site: `python3 tools/render.py` e `node tools/stage.mjs`. Só as capturas aprovadas aparecem; o resto continua com a lista de telas.
7. Troca do hero (de propósito, depois de aprovar `player-360-summary`, `withdrawals-queue` e `reports`): `node tools/capture/hero-swap.mjs --check` e, se der certo, sem `--check`. O manifesto de integridade é reescrito e o selo do hero passa a "PRODUCT UI · SYNTHETIC DATA". Registre a troca em `docs/web-studio/DECISIONS.md`.
8. Rode os testes do README (inclusive `tests/integrity.cjs` e `tests/product-images.cjs`).

## Regras que o script aplica

- Só `localhost`/`127.0.0.1`: nunca um back-office compartilhado ou de produção.
- Corta a primeira linha do cabeçalho (marca do back-office, busca, selos de fuso e de mock) e, no celular, também a linha da busca. Assim ficam de fora o placeholder que cita o documento nacional e o selo "BRT". A tela `global-search` mantém o cabeçalho.
- Esconde, sem reescrever, linhas com sinais fora do escopo do site (multicontas, dispositivo, IP, vínculos, a linha "Links", a pontuação do motor) e menções a produtos internos. Cada ocultação fica registrada na folha de contato.
- Recusa a imagem se aparecer e-mail, documento nacional, token, credencial ou endereço interno na área fotografada.
- Esconde a sobreposição de desenvolvimento do Next e os toasts; sem cursor, sem animação.

## Riscos conhecidos por tela (do código, a confirmar)

O mock reproduz a jurisdição de um único país: moeda, meio de pagamento instantâneo, documentos nacionais, fuso horário e lei de privacidade locais aparecem em várias telas, e há textos sintéticos em português. O site é internacional (EN/ES), então isso está em "Decisões a confirmar com os sócios": aceitar, recortar ou pedir um mock neutro ao back-office.

- `reconciliation`, `data-requests`, `jurisdiction`, `kyc`: nomeiam na própria tela o meio de pagamento local, a lei de privacidade, o país ou os documentos nacionais. Provavelmente ficam fora ou precisam de recorte.
- `users`: só a aba Papéis. A aba Usuários lista nomes realistas com e-mail e nunca é fotografada.
- `alerts` e `rules`: as linhas padrão incluem regras de multicontas, dispositivo e IP. A captura usa o filtro real `ruleCode=payee_mismatch` e esconde essas regras.
- `player-360-summary`: o cartão de dados tem a linha "Links" (dispositivo/documento) e o resumo financeiro cita uma referência interna; os dois ficam escondidos.
- `withdrawal-detail`: sem preparar o mock, o segundo aprovador aparece como "Not provided". O plano de captura descreve como semear a primeira aprovação, só em memória.
