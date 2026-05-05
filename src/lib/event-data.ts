export const EVENT = {
  edition: "II",
  name: "TECH WEEK",
  fullTitle: "II TECH WEEK",
  theme:
    "Inteligência Artificial em ação: Dados, Inovação e Transformação Digital",
  hashtag: "#TechWeek",
  dates: {
    labelShort: "01, 02 e 03 de junho de 2026",
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
  time: string
  title: string
  type: ScheduleType
}

export type DaySchedule = {
  id: string
  dateLabel: string
  weekday: string
  blocks: ScheduleBlock[]
}

/** Grade alinhada ao flyer: três noites, 19h–22h, palestras de 60 min — títulos quando confirmados. */
export const scheduleByDay: DaySchedule[] = [
  {
    id: "jun1",
    dateLabel: "01/06",
    weekday: "Segunda-feira",
    blocks: [
      { time: "19:00", title: "Abertura e recepção", type: "geral" },
      {
        time: "19:30",
        title: "Palestras (60 min cada) — programação detalhada em breve",
        type: "palestra",
      },
      { time: "22:00", title: "Encerramento da noite", type: "geral" },
    ],
  },
  {
    id: "jun2",
    dateLabel: "02/06",
    weekday: "Terça-feira",
    blocks: [
      { time: "19:00", title: "Credenciamento", type: "geral" },
      {
        time: "19:30",
        title: "Palestras (60 min cada) — programação detalhada em breve",
        type: "palestra",
      },
      { time: "22:00", title: "Encerramento da noite", type: "geral" },
    ],
  },
  {
    id: "jun3",
    dateLabel: "03/06",
    weekday: "Quarta-feira",
    blocks: [
      { time: "19:00", title: "Credenciamento", type: "geral" },
      {
        time: "19:30",
        title: "Palestras (60 min cada) — programação detalhada em breve",
        type: "palestra",
      },
      { time: "22:00", title: "Encerramento da noite", type: "geral" },
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

/** Patrocinadores confirmados; amplie a lista quando fechar novas parcerias. */
export const sponsors: Sponsor[] = [
  {
    name: "CACO Alimentação",
    tier: "apoio",
    logoSrc: "/sponsors/caco.png",
    logoAlt: "Logo CACO Alimentação",
    href: undefined,
  },
]

/** Prévia opcional na home; site completo de palestrantes ficará em URL separada. */
export const speakerPreview = [
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Os nomes e temas serão divulgados em breve. A versão completa do hub de palestrantes ficará em outro site.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Fique de olho nas redes da organização para novidades.",
  },
  {
    name: "A confirmar",
    role: "Palestrante",
    bio: "Inscrição de palestrantes via formulário até 22/05.",
  },
] as const
