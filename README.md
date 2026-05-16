# Tech Week — Frontend

Repositório **apenas do frontend** do sistema Tech Week da UniCesumar Londrina. O backend (API REST) vive noutro projeto (ex.: Rust/Axum).

## Visão geral

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**
- Animações: **motion**, scroll suave (**Lenis**), efeitos em canvas 2D; **Three.js** via **React Three Fiber** onde usado
- Dados estáticos do evento (agenda, patrocinadores, textos da home): `src/lib/event-data.ts`
- Integração HTTP no **servidor** (Server Actions + `src/lib/api-server.ts`) → ver **`CONTRACT.md`** para payloads, códigos HTTP e erros (`error`)

## Funcionalidades

- Homepage com hero, secções do evento e efeitos visuais
- **`/registrations`** — inscrição de participantes (`POST /registrations` via Server Action)
- **`/projects`** — submissão de projetos (`POST /projects` via Server Action)
- **`/checkin`** — check-in por RA (`POST /checkin` via Server Action)
- **`/admin/login`** + **`/admin/dashboard`** — JWT em cookie **httpOnly**; listagens carregadas no servidor com `Authorization: Bearer`
- **`/faq`** — perguntas frequentes

## Estrutura útil

| Caminho | Descrição |
|--------|-----------|
| `src/app/` | Rotas e páginas (App Router) |
| `src/app/actions/` | Server Actions (formulários públicos e admin) |
| `src/components/` | Componentes partilhados (fora de `ui/`) |
| `src/components/ui/` | shadcn/ui — **não editar à mão** |
| `src/lib/api-server.ts` | Cliente `fetch` para o backend (só no servidor) |
| `src/lib/validation.ts` | Validação server-side dos formulários |
| `src/lib/types.ts` | Tipos alinhados ao `CONTRACT.md` |
| `src/lib/event-data.ts` | Conteúdo editorial do site (agenda, patrocinadores, datas) |
| `CONTRACT.md` | Contrato oficial da API com o frontend |

## Pré-requisitos

- **Node.js 20+**
- **npm**
- API acessível na URL configurada em **`API_URL`** (recomendado) ou **`NEXT_PUBLIC_API_URL`**

## Uso local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` (porta padrão do Next).

### Variáveis de ambiente

Crie `.env.local` (não commitar segredos):

```bash

API_URL=http://127.0.0.1:8080


NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
```

Use uma porta diferente da do Next se ambos correrem na mesma máquina. O fallback em código é `http://localhost:3000`.

## Rotas

| Rota | Função |
|------|--------|
| `/` | Homepage |
| `/registrations` | Inscrição |
| `/projects` | Submissão de projetos |
| `/checkin` | Check-in |
| `/admin/login` | Login admin |
| `/admin/dashboard` | Painel (requer sessão) |
| `/faq` | FAQ |

## API (resumo)

Detalhe completo em **`CONTRACT.md`**. Resumo:

- `POST /registrations`, `POST /projects`, `POST /checkin`, `POST /admin/login`
- `GET /registrations`, `GET /projects` — **JWT obrigatório**
- `DELETE /registrations/{ra}`, `DELETE /checkin/{ra}` — **JWT obrigatório** (admin)

## Equipa / deploy

- Backend: repositório separado (https://github.com/guilhermegouve4/tech-week-api).
- **Vercel (ou similar):** definir `API_URL` (e opcionalmente `NEXT_PUBLIC_API_URL`) nas variáveis de ambiente; build `npm run build`, start `npm run start`.

## Observações para contribuintes

- Não editar `src/components/ui/` nem `src/lib/utils.ts` (shadcn).
- Cores de marca: variável `--brand` e tokens em `src/app/globals.css`.
- Commits em **inglês**, [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `perf:`, etc.).
