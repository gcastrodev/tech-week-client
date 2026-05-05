# Tech Week — Frontend

Este repositório contém apenas o frontend do sistema Tech Week da UniCesumar Londrina.
O backend está sendo desenvolvido separadamente pela equipe do Guilherme.

## Visão geral

- Framework: **Next.js 16 (App Router)**
- Linguagem: **TypeScript**
- Estilização: **Tailwind CSS**, **shadcn/ui**
- Interações: **React**, **motion**, **three.js**
- Frontend apenas: as chamadas de API são feitas para um backend externo

## Funcionalidades implementadas

- Página principal com hero animado e informações do evento
- Página de inscrição de participantes (`/inscricao`)
- Página de submissão de projetos (`/projetos`)
- Página de check-in de presença (`/checkin`)
- Dashboard administrativo com login (`/admin/login` e `/admin/dashboard`)
- Suporte a mock data para testes sem backend
- Uso de componentes UI reutilizáveis em `src/components/ui`

## Estrutura principal do projeto

- `src/app/`
  - `page.tsx` — homepage do evento
  - `admin/login/page.tsx` — login da área administrativa
  - `admin/dashboard/page.tsx` — painel admin de inscrições e projetos
  - `inscricao/page.tsx` — formulário de inscrição de participantes
  - `projetos/page.tsx` — formulário de submissão de projetos
  - `checkin/page.tsx` — registro de presença por RA
  - `faq/page.tsx` — página de perguntas frequentes
- `src/components/` — componentes compartilhados do layout
- `src/components/ui/` — componentes gerados shadcn/ui
- `src/lib/api.ts` — cliente de API e mocks
- `src/lib/types.ts` — tipos TypeScript para payloads e modelos
- `src/lib/event-data.ts` — dados do evento, agenda e patrocinadores
- `public/` — imagens e assets públicos

## Pré-requisitos

- Node.js 20+ instalado
- `npm` disponível no terminal
- Backend do Guilherme rodando ou `NEXT_PUBLIC_API_URL` apontando para o servidor de API

## Uso local

1. Instale dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o app em:

```bash
http://localhost:3000
```

## Configuração do backend

O frontend consome as APIs do backend via `src/lib/api.ts`.
Por padrão, o `BASE_URL` é definido como:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
```

### Variáveis de ambiente úteis

- `NEXT_PUBLIC_API_URL` — URL base do backend

> Observação: enquanto o backend ainda está em desenvolvimento, o `AdminDashboard` está configurado para usar `USE_MOCK = true` em `src/lib/event-data.ts`.
> Assim, os dados exibidos no painel administrativo são mockados até o backend estar pronto.

## Rotas principais

- `/` — homepage
- `/inscricao` — inscrição de participantes
- `/projetos` — submissão de projetos
- `/checkin` — check-in de participantes
- `/admin/login` — login administrativo
- `/admin/dashboard` — dashboard administrativo
- `/faq` — perguntas frequentes

## APIs de frontend

O frontend espera as seguintes rotas no backend:

- `POST /registrations` — cadastrar inscrição
- `POST /projects` — cadastrar projeto
- `POST /checkin` — registrar presença
- `POST /admin/login` — autenticar admin
- `GET /registrations` — listar inscrições (admin)
- `GET /projects` — listar projetos (admin)

## Desenvolvedor

- Guilherme: backend
- Este repositório: frontend

## Deploy

O projeto pode ser implantado em qualquer plataforma compatível com Next.js, como Vercel.

### Deploy no Vercel

1. Conecte o repositório ao Vercel.
2. Defina a variável de ambiente `NEXT_PUBLIC_API_URL` para a URL do backend em _Environment Variables_.
3. Configure o comando de build padrão:

```bash
npm run build
```

4. Configure o comando de start padrão:

```bash
npm run start
```

### Deploy local com backend

Se o backend estiver rodando localmente, use:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run dev
```

## Observações

- Não editar manualmente `src/components/ui/`, pois são componentes gerados pela configuração do `shadcn/ui`.
- O estilo global e as cores da marca estão definidos em `src/app/globals.css`.
- Mantenha a separação frontend/backend clara: este repositório só serve a interface do evento.
