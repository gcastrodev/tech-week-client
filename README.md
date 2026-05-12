# Tech Week — Frontend

Repositório **apenas do frontend** do sistema Tech Week da UniCesumar Londrina. O backend (API REST) vive noutro projeto (ex.: Rust/Axum).

## Visão geral

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**
- Animações: **motion**, scroll suave (**Lenis**), efeitos em canvas 2D; **Three.js** via **React Three Fiber** onde usado
- Dados estáticos do evento (agenda, patrocinadores, textos da home): `src/lib/event-data.ts`
- Integração HTTP: `src/lib/api.ts` → ver **`CONTRACT.md`** para payloads, códigos HTTP e erros (`error`)

## Funcionalidades

- Homepage com hero, secções do evento e efeitos visuais
- **`/inscricao`** — inscrição de participantes (`POST /registrations`)
- **`/projetos`** — submissão de projetos (`POST /projects`)
- **`/checkin`** — check-in por RA (`POST /checkin`)
- **`/admin/login`** + **`/admin/dashboard`** — JWT em `localStorage` (`admin_token`); listagens `GET /registrations` e `GET /projects` com `Authorization: Bearer`
- **`/faq`** — perguntas frequentes

## Estrutura útil

| Caminho | Descrição |
|--------|-----------|
| `src/app/` | Rotas e páginas (App Router) |
| `src/components/` | Componentes partilhados (fora de `ui/`) |
| `src/components/ui/` | shadcn/ui — **não editar à mão** |
| `src/lib/api.ts` | Cliente `fetch` para o backend |
| `src/lib/types.ts` | Tipos alinhados ao `CONTRACT.md` |
| `src/lib/event-data.ts` | Conteúdo editorial do site (agenda, patrocinadores, datas) |
| `CONTRACT.md` | Contrato oficial da API com o frontend |

## Pré-requisitos

- **Node.js 20+**
- **npm**
- API acessível na URL configurada em **`NEXT_PUBLIC_API_URL`**, com **CORS** permitindo a origem do Next (ver comentário no topo de `src/lib/api.ts`)

## Uso local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` (porta padrão do Next).

### Variáveis de ambiente

Crie `.env.local` (não commitar segredos):

```bash
# URL base da API (sem barra final). Use uma porta diferente da do Next se ambos correrem na mesma máquina.
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
```

O fallback em código é `http://localhost:3000`; se o Next também usar a porta **3000**, defina sempre `NEXT_PUBLIC_API_URL` para a porta real do backend.

## Rotas

| Rota | Função |
|------|--------|
| `/` | Homepage |
| `/inscricao` | Inscrição |
| `/projetos` | Submissão de projetos |
| `/checkin` | Check-in |
| `/admin/login` | Login admin |
| `/admin/dashboard` | Painel (requer token) |
| `/faq` | FAQ |

## API (resumo)

Detalhe completo em **`CONTRACT.md`**. Resumo:

- `POST /registrations`, `POST /projects`, `POST /checkin`, `POST /admin/login`
- `GET /registrations`, `GET /projects` — **JWT obrigatório**

## Equipa / deploy

- Backend: repositório separado (https://github.com/guilhermegouve4/tech-week-api).
- **Vercel (ou similar):** definir `NEXT_PUBLIC_API_URL` nas variáveis de ambiente; build `npm run build`, start `npm run start`.

## Observações para contribuintes

- Não editar `src/components/ui/` nem `src/lib/utils.ts` (shadcn).
- Cores de marca: variável `--brand` e tokens em `src/app/globals.css`.
- Commits em **inglês**, [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `perf:`, etc.).
