# FISCON Portal — Portal do Cidadão

Portal de Defesa Administrativa da Prefeitura Municipal de Vitória da Conquista — BA.

## Stack

- React 18 + Vite
- Supabase (mesmo banco do FISCON)
- Deploy: Vercel

---

## Deploy

### 1. Banco de dados (Supabase)

Execute o arquivo `PORTAL_BANCO.sql` no SQL Editor do Supabase antes do primeiro deploy.

### 2. GitHub

Crie um repositório separado chamado `FISCON-Portal` e suba todos os arquivos deste projeto.

### 3. Vercel

1. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
2. Importe o repositório `FISCON-Portal`
3. Framework: **Vite**
4. Adicione as variáveis de ambiente:

```
VITE_SUPABASE_URL=https://zwfiqyctixfgixraariw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Clique em **Deploy**

### 4. Domínio personalizado (opcional)

No painel Vercel, configure o domínio:
`fiscon-portal.pmvc.ba.gov.br`

---

## Estrutura de arquivos

```
src/
  App.jsx                     — Roteador principal
  main.jsx
  styles/global.css
  config/
    supabase.js               — Funções de acesso ao banco
  components/
    Header.jsx                — Cabeçalho governamental
    Footer.jsx                — Rodapé com links úteis
    ContadorPrazo.jsx         — Countdown do prazo
    LinhaTempo.jsx            — Linha do tempo do processo
    DocumentoViewer.jsx       — Visualização e download do PDF oficial
    StatusDefesa.jsx          — Status e parecer da defesa
    GuiaOQueFazer.jsx         — Orientações por tipo (NP ou AI)
    ChecklistRegularizacao.jsx— Checklist interativo
    FAQ.jsx                   — Perguntas frequentes
  pages/
    BuscaPage.jsx             — Tela inicial de busca por código
    CienciaPage.jsx           — Confirmação de recebimento
    ProcessoPage.jsx          — Página principal do processo
    DefesaPage.jsx            — Formulário de defesa
    DefesaConfirmadaPage.jsx  — Confirmação e comprovante
    ProrrogacaoPage.jsx       — Solicitação de prorrogação
    NaoEncontradoPage.jsx     — Código não encontrado
```

---

## Fluxo do usuário

```
QR Code / Link com ?codigo=xxxx
        ↓
   BuscaPage (digita ou auto-preenche o código)
        ↓
   CienciaPage (confirma que recebeu e leu)
        ↓
   ProcessoPage (vê tudo: prazo, documento, linha do tempo, guia)
        ↓
   DefesaPage (preenche nome, CPF, texto, anexos)
        ↓
   DefesaConfirmadaPage (protocolo + comprovante para imprimir)
```

---

## Link do QR Code nas impressões

O QR Code gerado nas impressões térmicas aponta para:

```
https://fiscon-portal.pmvc.ba.gov.br/?codigo=XXXXXXXX
```

O portal detecta o código na URL e faz a busca automaticamente.
