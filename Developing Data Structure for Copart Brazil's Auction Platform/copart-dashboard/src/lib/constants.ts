import type { BusinessUnit, Channel, FunnelKey, MarketingChannel } from "@/lib/data/types";

export const COLORS = {
  navy: "#0b1f3a",
  blue: "#153a73",
  teal: "#00b8cf",
  green: "#00a85a",
  mint: "#14c79a",
  red: "#cf3044",
  amber: "#c77a00",
  violet: "#8c5be8",
  ink: "#172018",
  muted: "#6c7685",
  bg: "#f4f7fb",
  card: "#ffffff",
  line: "#dfe6ee",
} as const;

export const CHART_COLORS = {
  meta: "#1877f2",
  google: "#4285f4",
  organic: COLORS.green,
  direct: COLORS.violet,
  blip: "#25d366",
  rd_station: "#8c5be8",
  tiktok: "#000000",
  total: COLORS.navy,
} as const;

export const BUSINESS_UNIT_LABELS: Record<BusinessUnit, string> = {
  leilao_compra: "Leilão/Compra",
  select_venda: "Select/Venda",
  select_compra: "Select/Compra",
};

export const FUNNEL_LABELS: Record<FunnelKey, string> = {
  leilao: "Funil Leilão",
  select_venda: "Funil Select/Venda",
  select_compra: "Funil Select/Compra",
};

export const LEILAO_FUNNEL_STAGES = [
  "Entrantes",
  "Habilitados",
  "Licitantes",
  "Arrematantes",
] as const;

export const SELECT_VENDA_LAST_STAGE = "Veículos Captados";
export const SELECT_COMPRA_LAST_STAGE = "Veículos Vendidos";

export const CHANNEL_LABELS: Record<string, string> = {
  META: "Meta Ads",
  GOOGLE: "Google Ads",
  TIKTOK: "TikTok Ads",
  ORGANIC: "Orgânico",
  DIRECT: "Direto",
  RD_STATION: "RD Station",
  BLIP: "Blip (WhatsApp)",
  TOTAL: "Total",
};

export const CAMPAIGN_TYPE_LABELS: Record<BusinessUnit, string> = {
  leilao_compra: "Leilão/Compra",
  select_venda: "Select/Venda",
  select_compra: "Select/Compra",
};

export const STATUS_CONFIG = {
  on_target: { label: "No alvo", icon: "ok", color: COLORS.green, bg: "#e8f8ef" },
  below_target: { label: "Abaixo da meta", icon: "warn", color: COLORS.amber, bg: "#fff4df" },
  critical: { label: "Crítico", icon: "crit", color: COLORS.red, bg: "#fdecee" },
} as const;

export const SEVERITY_CONFIG = {
  critical: { label: "CRÍTICO", color: COLORS.red, bg: "#fdecee", borderColor: COLORS.red },
  warning: { label: "AVISO", color: COLORS.amber, bg: "#fff4df", borderColor: COLORS.amber },
  info: { label: "INFO", color: COLORS.blue, bg: "#eef4ff", borderColor: COLORS.teal },
} as const;

export const SOCIAL_COLORS: Record<string, string> = {
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  YouTube: "#ff0000",
  TikTok: "#000000",
  LinkedIn: "#0a66c2",
};

export const MARKETING_CHANNEL_CONFIG: Record<
  MarketingChannel,
  { label: string; color: string; icon: string }
> = {
  SEO: { label: "SEO", color: "#00a85a", icon: "Search" },
  INSTAGRAM_ORGANIC: { label: "Instagram Orgânico", color: "#e1306c", icon: "Instagram" },
  FACEBOOK_ORGANIC: { label: "Facebook Orgânico", color: "#1877f2", icon: "Facebook" },
  META_ADS: { label: "Meta Ads", color: "#0668E1", icon: "Megaphone" },
  GOOGLE_ADS: { label: "Google Ads", color: "#4285f4", icon: "Target" },
  TIKTOK: { label: "TikTok", color: "#010101", icon: "Music" },
  RD_STATION: { label: "RD Station", color: "#8c5be8", icon: "Users" },
  BLIP: { label: "Blip (WhatsApp)", color: "#25d366", icon: "MessageCircle" },
};

export const GOALS = {
  leilao_compra: {
    entrantes_mensal: 20000,
    habilitados_mensal: 11000,
  },
  select_venda: {
    conversas_semanal: 700,
    avaliacoes_semanal: 250,
    veiculos_captados_semanal: 80,
  },
  select_compra: {
    propostas_semanal: 500,
    vendas_semanal: 120,
  },
} as const;

export const MEDIA_OWNER = "Felipe";

export const DEFAULT_DATE_RANGE = {
  start: "2026-08-01",
  end: "2026-08-31",
} as const;

export const DATA_ORIGIN_LABEL = "Meta + GA4 ago/2026 · GA4/Google 15/06–15/09 · Copart set/2026";

import { BRAZIL_UFS } from "@/lib/data/ibge-population";

export const GEO_OPTIONS = [{ id: "ALL", label: "Brasil" }, ...BRAZIL_UFS] as const;

export const GEO_WEIGHTS: Record<string, number> = {
  ALL: 1,
  SP: 0.42,
  RJ: 0.18,
  MG: 0.14,
  PR: 0.09,
  RS: 0.08,
  BA: 0.05,
  OTHER: 0.04,
};

export const ATTRIBUTION_GLOSSARY = [
  {
    term: "Contribuição por etapa",
    definition:
      "Quantas conversões de cada etapa do funil a campanha ajudou a gerar no recorte selecionado. Métrica principal desta tela.",
  },
  {
    term: "Primeiro toque",
    definition: "Canal ou campanha do primeiro touchpoint conhecido da jornada.",
  },
  {
    term: "Último toque",
    definition: "Canal ou campanha imediatamente anterior à conversão.",
  },
  {
    term: "Linear",
    definition: "Crédito dividido igualmente entre os touchpoints da jornada.",
  },
  {
    term: "Decaimento temporal",
    definition: "Crédito maior para os toques mais próximos da conversão.",
  },
  {
    term: "Atribuição confiável",
    definition: "Conversão com campanha e UTM válidos.",
  },
  {
    term: "Atribuição questionável",
    definition: "UTM inválido, campanha nula ou dados incompletos.",
  },
] as const;

export const LEAD_QUALIFICATION_DEFINITION =
  "Contato Qualificado = veículo dentro do perfil Select. Fonte: RD Station ou Blip. Critério provisório até alinhamento Copart (D18).";

export const USER_FACING_LABELS: string[] = [
  ...Object.values(BUSINESS_UNIT_LABELS),
  ...Object.values(FUNNEL_LABELS),
  ...Object.values(CHANNEL_LABELS),
  ...Object.values(CAMPAIGN_TYPE_LABELS),
  ...Object.values(STATUS_CONFIG).map((s) => s.label),
  ...Object.values(MARKETING_CHANNEL_CONFIG).map((c) => c.label),
  ...LEILAO_FUNNEL_STAGES,
  SELECT_VENDA_LAST_STAGE,
  SELECT_COMPRA_LAST_STAGE,
  MEDIA_OWNER,
];

export const FORBIDDEN_COPY = [
  "Venda Direta",
  "venda_direta",
  "WhatsApp Direct",
  "Below target",
  "Trazer para Vender",
  "Venha Comprar",
] as const;

export const NAV_ITEMS = {
  executivo: [
    { label: "Visão Geral", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Funil de Leilão", href: "/dashboard/funnel", icon: "Filter" },
    { label: "Copart Select", href: "/dashboard/direct-sales", icon: "MessageCircle" },
    { label: "Atribuição", href: "/dashboard/attribution", icon: "GitBranch" },
    { label: "Metas por Canal", href: "/dashboard/channel-goals", icon: "Target" },
    { label: "Jornada de Conversão", href: "/dashboard/conversion-paths", icon: "Route" },
    { label: "Análise Regional", href: "/dashboard/regional", icon: "Map" },
    { label: "Evolução", href: "/dashboard/evolution", icon: "TrendingUp" },
  ],
  operacional: [
    { label: "Performance Diária", href: "/dashboard/campaigns", icon: "BarChart3" },
    { label: "Campanhas Leilão", href: "/dashboard/auction-campaigns", icon: "Gavel" },
    { label: "Campanhas Select", href: "/dashboard/direct-campaigns", icon: "ShoppingCart" },
    { label: "Alertas", href: "/dashboard/alerts", icon: "AlertTriangle" },
    { label: "Recomendações", href: "/dashboard/recommendations", icon: "Lightbulb" },
    { label: "Relatório", href: "/dashboard/report", icon: "FileText" },
    { label: "Criativos", href: "/dashboard/creatives", icon: "Images" },
  ],
  emBreve: [
    { label: "Assistente de IA", href: "/dashboard/assistant", icon: "Bot" },
    { label: "Segurança", href: "/dashboard/security", icon: "Shield" },
  ],
} as const;

export const CHANNELS: Channel[] = [
  "META",
  "GOOGLE",
  "TIKTOK",
  "ORGANIC",
  "DIRECT",
  "RD_STATION",
  "BLIP",
];
