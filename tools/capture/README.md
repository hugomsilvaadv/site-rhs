# Capturas para o site

Desde a fase 8, as imagens do site vêm do Sentinel, o produto disponível: veja a seção **Sentinel (demo com dados fictícios)** no fim. O back-office (PAM) está em desenvolvimento e aparece no site sem imagens; o roteiro abaixo fica para quando ele estiver pronto, e os placeholders dele nunca vão ao ar (`tools/stage.mjs` não os publica).

O script do back-office fotografa o back-office real em modo mock (dados sintéticos, inglês, tema escuro) e grava cada tela em `assets/product/<nome>.webp`, por cima do placeholder de mesmo nome e tamanho. A página nunca mostra um placeholder: enquanto o arquivo for o placeholder registrado, a seção fica só com texto, diagramas e a lista de telas. A imagem só aparece quando a página é gerada de novo, no passo 4, **depois** de voltar os placeholders das telas deixadas de fora: uma página gerada antes disso continua apontando para o placeholder que voltou.

## No notebook (Windows, PowerShell)

Pré-requisitos: `rhs-pam-backoffice` e `site-rhs` na mesma pasta, o back-office com as dependências instaladas (como já está), Node 24. O Playwright vem do próprio back-office; o navegador pode ser o Edge ou o Chrome instalados.

**1. Back-office em modo mock** (janela 1):

```powershell
cd C:\caminho\rhs-pam-backoffice
$env:APP_KIND = "backoffice"; $env:APP_URL = "http://127.0.0.1:3000"
$env:API_MODE = "mock"; $env:AUTH_PROVIDER = "fake"; $env:FEATURE_FLAG_PROFILE = "homologacao"; $env:I18N_DEFAULT_LOCALE = "en"
$env:SESSION_SECRETS = node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
npx next dev -H 127.0.0.1 -p 3000
```

O script entra pelo login falso como `admin` e escolhe o inglês e o tema escuro por cookie. Se o Turbopack falhar nas junções, use `npx next dev --webpack -H 127.0.0.1 -p 3000`.

**2. Captura** (janela 2):

```powershell
cd C:\caminho\site-rhs
$env:CAPTURE_CHANNEL = "msedge"
node tools/capture/screens.mjs --dry-run
node tools/capture/screens.mjs
```

O `--dry-run` confere se cada rota é uma tela do menu do back-office e diz quais arquivos ainda são placeholder. A primeira visita de cada tela compila e pode levar minutos. Para refazer só algumas: `node tools/capture/screens.mjs --only reports,alerts`. Se o back-office estiver em outra pasta, defina `$env:BACKOFFICE_DIR`.

**3. Revise** `tools/capture/contact-sheet.png` e cada imagem em `assets/product/`. Uma tela que falhar mantém o placeholder.

**4. Commit e push** só do que passou na revisão. Tudo o que está em `assets/` vai para o repositório público e para o site, mesmo uma tela que a página não usa. Para cada tela deixada de fora (e para `users`, que o site não usa), volte o placeholder com `git checkout -- assets/product/<tela>.webp`. Se uma das três telas do hero (`player-360-summary`, `withdrawals-queue` ou `reports`) ficar de fora, falhar ou for recortada à mão, apague também a cópia `assets/hero/<tela>.webp` (`Remove-Item assets/hero/<tela>.webp`), que não tem placeholder, ou recorte-a do mesmo jeito. Refaça então a folha com `node tools/capture/contact-sheet.mjs` e, só depois de tudo isso, gere a página de novo com `py tools/render.py`. Depois, commit de `index.html`, `es/index.html`, `assets/product/`, `assets/hero/`, `tools/capture/manifest.json` e da folha de contato, num branch novo criado a partir do branch da fase mais recente, com PR para o `main`. Sem Python no notebook, faça o commit e o push sem as duas páginas e peça à sessão na nuvem que gere a página nesse branch e faça o commit delas. A Vercel publica as páginas do commit sem gerá-las: o preview só mostra as telas novas depois do commit das páginas geradas de novo.

## Hero (troca deliberada)

As três imagens atuais da órbita ficam até a troca. Depois que `player-360-summary`, `withdrawals-queue` e `reports` forem capturas reais (o script já grava as cópias 1586×992 em `assets/hero/`):

```powershell
node tools/capture/hero-swap.mjs --check
node tools/capture/hero-swap.mjs
py tools/render.py
node tools/og/og.mjs
```

O `hero-swap` regrava o manifesto de integridade de propósito, e o selo sob a órbita passa a "PRODUCT UI · SYNTHETIC DATA". Rode os testes do README e registre a troca em `docs/web-studio/DECISIONS.md`. Sem Python no notebook, faça esse passo numa sessão na nuvem.

## O que o script garante

- Só `localhost`/`127.0.0.1` e só o back-office em mock. Nunca fotografa a página do login falso. Não confirma, salva, aprova nem revela nada.
- Corta a primeira linha do cabeçalho (marca, busca, selos de fuso e de mock). Esconde, sem reescrever, linhas fora do escopo do site (multicontas, dispositivo, IP, vínculos, pontuação do motor) e textos que o site não descreve: os selos com nomes de variáveis internas e a nota de escopo da fila KYC. Recusa a imagem se aparecer e-mail, documento, token ou endereço interno.
- Grava na imagem o selo "PRODUCT UI · SYNTHETIC DATA" e, no Player 360, os marcadores 1–5 descritos na página.
- `node tools/capture/placeholders.mjs` recria placeholders que faltarem, sem tocar numa captura real.

## Ao revisar

O mock reproduz a jurisdição de um único país (moeda, meio de pagamento, documentos, fuso e lei de privacidade locais) e tem textos sintéticos em português. Recorte ou deixe de fora o que identificar o país; as notas por tela estão na folha de contato. A aba Usuários (nomes realistas) nunca é fotografada: a tela `users` usa a aba Papéis e não aparece nas páginas, porque no mock essa aba mostra os papéis do template e o editor de papéis, não os cinco papéis da equipe. Não faça commit dessa captura: mantenha o placeholder `users.webp`. A área Administration usa `approval-limits`; os valores dessa tela são padrões provisórios da plataforma, na moeda local, e a captura os esconde: confira que nenhum aparece.

## Sentinel (demo com dados fictícios)

As telas do Sentinel vêm do demo da RHS, fotografadas no notebook do proprietário, que faz o login. Antes de cada print, os dados pessoais e os blocos que o site não mostra são escondidos na própria página. Depois, `import.mjs` transforma os PNGs no formato do site, sem reescrever nada:

```powershell
cd C:\caminho\site-rhs
$env:CAPTURE_CHANNEL = "msedge"
node tools/capture/import.mjs C:\caminho\capturas-demo --dry-run
node tools/capture/import.mjs C:\caminho\capturas-demo
```

- A lista de telas, com o nome do PNG de origem, está em `tools/capture/sentinel.config.mjs`. O computador usa 3200×2000 e o celular, 780×1688; um PNG de outro tamanho é recusado, e um que falte fica de fora.
- Cada tela vira `assets/product/sentinel-<tela>.webp`, com o selo "PRODUCT UI · SYNTHETIC DATA". As telas do hero ganham também a cópia limpa de 1586×992 em `assets/hero/`.
- Revise `tools/capture/sentinel-contact-sheet.png` antes do commit. Tudo o que vai para `assets/` fica público.
- Apague a imagem de uma tela que ficar de fora, em `assets/product/` e, se for uma tela do hero, em `assets/hero/`.
- Commit de `assets/product/sentinel-*.webp`, `assets/hero/sentinel-*.webp`, `tools/capture/sentinel-manifest.json` e da folha de contato.
- `node tools/capture/import.mjs --self-test` confere a ferramenta sem imagens reais.

Depois do push, gere a página de novo (`py tools/render.py`; sem Python no notebook, peça à sessão na nuvem) e faça commit de `index.html` e `es/index.html`: só então as imagens aparecem, no tour, em "How it works" e em "Access & integration". O hero troca à parte, de propósito, com as três telas `sentinel-transactions`, `sentinel-alerts` e `sentinel-rules`:

```powershell
node tools/capture/hero-swap.mjs --check
node tools/capture/hero-swap.mjs
py tools/render.py
node tools/og/og.mjs
```

Depois, rode os testes do README e registre a troca em `docs/web-studio/DECISIONS.md`.
