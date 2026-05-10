export const EVENT = {
  edition: "II",
  name: "TECH WEEK",
  fullTitle: "II TECH WEEK",
  theme:
    "Três dias imersos no futuro. Palestras com referências da indústria, submissão de projetos de alunos e muita troca de conhecimento sobre IA.",
  hashtag: "#TechWeek",
  dates: {
    labelShort: "01 — 03 de junho de 2026",
    labelLong: "1º, 2 e 3 de junho de 2026",
    year: 2026,
  },
  time: { start: "19:00", end: "22:00", label: "19:00 – 22:00" },
  lectureMinutes: 60,
  location: {
    venue: "UniCesumar Londrina",
    addressLine: "Av. Santa Mônica, 450",
    city: "Londrina — PR",
    mapQuery: "UniCesumar Londrina Av. Santa Mônica 450 Londrina",
  },
  cfp: {
    deadlineLabel: "22 de maio de 2026",
    formUrl: "https://forms.gle/5NMZmjFHzAA7A9HE9",
  },
  ctaFlyer: "Compartilhe conhecimento. Construa o futuro com a gente!",
} as const

/** Imagens estáticas em /public */
export const ASSETS = {
  heroFlyer: "/hero-tech-week-flyer.png",
} as const

export type ScheduleType = "geral" | "palestra" | "coffee"

export type ScheduleBlock = {
  title: string
  type: ScheduleType
}

export type DaySchedule = {
  id: string
  dateLabel: string
  weekday: string
  /** Início e fim do dia de evento (sem grade horária detalhada). */
  dayRange: string
  blocks: ScheduleBlock[]
}

/** Três dias · apenas intervalo diário; conteúdo por dia conforme programação oficial. */
export const scheduleByDay: DaySchedule[] = [
  {
    id: "jun1",
    dateLabel: "01/06",
    weekday: "Segunda-feira",
    dayRange: "19:00 – 22:00",
    blocks: [
      { title: "Abertura oficial do evento", type: "geral" },
      { title: "Networking", type: "geral" },
      {
        title: "Apresentação dos projetos dos alunos — tema Inteligência Artificial",
        type: "palestra",
      },
      { title: "Coffee break", type: "coffee" },
    ],
  },
  {
    id: "jun2",
    dateLabel: "02/06",
    weekday: "Terça-feira",
    dayRange: "19:00 – 22:00",
    blocks: [
      { title: "Networking", type: "geral" },
      {
        title:
          "Palestras com profissionais e empresários do meio tecnológico — programação detalhada em breve",
        type: "palestra",
      },
      { title: "Coffee break", type: "coffee" },
    ],
  },
  {
    id: "jun3",
    dateLabel: "03/06",
    weekday: "Quarta-feira",
    dayRange: "19:00 – 22:00",
    blocks: [
      { title: "Networking", type: "geral" },
      {
        title:
          "Palestras com profissionais e empresários do meio tecnológico — programação detalhada em breve",
        type: "palestra",
      },
      { title: "Coffee break", type: "coffee" },
    ],
  },
]

export type SponsorTier = "ouro" | "prata" | "bronze" | "apoio"

export type Sponsor = {
  name: string
  tier: SponsorTier
  logoSrc?: string
  logoAlt?: string
  href?: string
}

/** Patrocinadores — inclua o arquivo em /public/sponsors quando disponível. */
export const sponsors: Sponsor[] = [
  {
    name: "Adilson",
    tier: "apoio",
    logoSrc: "/sponsors/adilson.png",
    logoAlt: "Logo Adilson",
  },
  {
    name: "Vitório's Restaurante",
    tier: "apoio",
    logoSrc: undefined,
    logoAlt: "Vitório's Restaurante",
  },
  {
    name: "CACO Alimentação",
    tier: "apoio",
    logoSrc: "/sponsors/caco.png",
    logoAlt: "Logo CACO Alimentação",
  },
]

/** Prévia na home — hub completo em página dedicada. */
export const speakerPreview = [
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Os nomes e temas serão divulgados em breve.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Acompanhe as redes da organização para novidades.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Submeta sua palestra até a data limite do edital.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Experiências da indústria e da academia.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "IA aplicada a produtos e serviços reais.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Em breve: perfis completos e fotos.",
  },
] as const
