# Capturas do back-office para o site

O script fotografa o back-office real em modo mock (dados sintéticos, inglês, tema escuro) e grava cada tela em `assets/product/<nome>.webp`, por cima do placeholder de mesmo nome e tamanho. A página já aponta para esses arquivos: **a troca é substituir o arquivo**.

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

**4. Commit e push** só do que passou na revisão. Tudo o que está em `assets/` vai para o repositório público e para o site, mesmo uma tela que a página não usa. Para cada tela deixada de fora (e para `users`, que o site não usa), volte o placeholder com `git checkout -- assets/product/<tela>.webp` e refaça a folha com `node tools/capture/contact-sheet.mjs`. Depois, commit de `assets/product/`, `assets/hero/`, `tools/capture/manifest.json` e da folha de contato. O preview da Vercel mostra as telas novas sem nenhuma outra mudança.

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
