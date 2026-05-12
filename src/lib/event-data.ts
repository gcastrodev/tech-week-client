import type { SpeakerCard } from "@/components/speaker-carousel"

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

/** Patrocinadores — inclua o arquivo em /public/sponsors quando disponível. (CACO em destaque: primeiro na lista.) */
export const sponsors: Sponsor[] = [
  {
    name: "CACO Alimentação",
    tier: "apoio",
    logoSrc: "/sponsors/caco.png",
    logoAlt: "Logo CACO Alimentação",
  },
  {
    name: "Minas Casa Empório",
    tier: "apoio",
    logoSrc: "/sponsors/minas-casa-emporio.png",
    logoAlt: "Logo Minas Casa Empório",
  },
  {
    name: "ESTMA",
    tier: "apoio",
    logoSrc: "/sponsors/estma.png",
    logoAlt: "Logo ESTMA — Engenharia e Saúde do Trabalho e Meio Ambiente",
  },
  {
    name: "Zona Country",
    tier: "apoio",
    logoSrc: "/sponsors/zona-country.png",
    logoAlt: "Logo Zona Country",
  },
  {
    name: "Óculos Express",
    tier: "apoio",
    logoSrc: "/sponsors/oculos-express.png",
    logoAlt: "Logo Óculos Express",
  },
  {
    name: "M2 Centro Automotivo",
    tier: "apoio",
    logoSrc: "/sponsors/m2-centro-automotivo.png",
    logoAlt: "Logo M2 Centro Automotivo",
  },
  {
    name: "Veículo Rastreado",
    tier: "apoio",
    logoSrc: "/sponsors/veiculo-rastreado.png",
    logoAlt: "Logo Veículo Rastreado",
  },
  {
    name: "Quali Mais",
    tier: "apoio",
    logoSrc: "/sponsors/quali-mais.png",
    logoAlt: "Logo Quali Mais",
  },
  {
    name: "Hanke Digital Solutions",
    tier: "apoio",
    logoSrc: "/sponsors/hanke.png",
    logoAlt: "Logo Hanke digital solutions",
  },
  {
    name: "Adilson",
    tier: "apoio",
    logoSrc: "/sponsors/adilson.png",
    logoAlt: "Logo Adilson",
  },
  {
    name: "Vitório's Restaurante",
    tier: "apoio",
    logoSrc: "/sponsors/vitorios-restaurante.png",
    logoAlt: "Logo Vitório's Restaurante",
  },
]

/** Prévia na home — hub completo em página dedicada. */
export const speakerPreview: SpeakerCard[] = [
  {
    name: "Gustavo Melles",
    role: "Palestrante",
    bio: "Palestrante, professor de Inteligência Artificial no MBA da PUC Paraná, colunista da CBN e criador do movimento Pense com IA.",
    talkTopic: "Pense com IA: A Revolução da Inteligência Ampliada",
    photoSrc: "/speakers/gustavo-melles.png",
    photoAlt: "Gustavo Melles — palestrante da Tech Week",
    statusBadge: "confirmado",
    socials: [
      {
        network: "instagram",
        href: "https://www.instagram.com/gusmelles/",
        label: "@gusmelles",
      },
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/gustavomelles/",
        label: "linkedin.com/in/gustavomelles",
      },
      {
        network: "phone",
        href: "tel:+5543996814914",
        label: "43 99681-4914",
        hint: "número pessoal",
      },
    ],
  },
  {
    name: "Huander Tironi",
    role: "Palestrante",
    bio: "Huander Tironi | Head de IA na Bankme, empreendedor e especialista em arquitetura de software. Mestre e doutorando em IA e Segurança da Informação, conecta pesquisa científica e prática de mercado para desenvolver soluções escaláveis de Machine Learning e automação desde 2009.",
    talkTopic: "Inteligência Artificial Aplicada",
    photoSrc: "/speakers/huander-tironi.png",
    photoAlt: "Huander Tironi — palestrante da Tech Week",
    statusBadge: "confirmado",
    socials: [
      {
        network: "instagram",
        href: "https://www.instagram.com/coding_tironi/",
        label: "@coding_tironi",
      },
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/huandertironi/",
        label: "linkedin.com/in/huandertironi",
      },
    ],
  },
  {
    name: "Jessy Borges Ferracioli",
    role: "Palestrante",
    bio: "Advogada há mais de 10 anos, atualmente advogo em uma empresa do ramo de licitações públicas. Sou pós-graduada em Direito Civil e Processo Civil, mestre em Direito, Sociedades e Tecnologia, e pesquisadora de direito e inteligência artificial na Lawgorithm, do núcleo IA e Raça.",
    talkTopic:
      "Os data taggers e o trabalho invisível por trás da Inteligência Artificial",
    photoSrc: "/speakers/jessy-borges-ferracioli.png",
    photoAlt: "Jessy Borges Ferracioli — palestrante da Tech Week",
    statusBadge: "confirmado",
    socials: [
      {
        network: "instagram",
        href: "https://www.instagram.com/jessybofer/",
        label: "@jessybofer",
      },
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/jessy-borges-ferracioli/",
        label: "linkedin.com/in/jessy-borges-ferracioli",
      },
    ],
  },
]
