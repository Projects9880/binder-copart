// ============================================================================
// Copart Brasil — Constants
// Color palette from existing HTML templates + business enums
// ============================================================================

export const COLORS = {
  navy: '#0b1f3a',
  blue: '#153a73',
  teal: '#00b8cf',
  green: '#00a85a',
  mint: '#14c79a',
  red: '#cf3044',
  amber: '#c77a00',
  violet: '#8c5be8',
  ink: '#172018',
  muted: '#6c7685',
  bg: '#f4f7fb',
  card: '#ffffff',
  line: '#dfe6ee',
} as const;

export const CHART_COLORS = {
  meta: '#1877f2',
  google: '#4285f4',
  organic: COLORS.green,
  direct: COLORS.violet,
  whatsapp: '#25d366',
  tiktok: '#000000',
  total: COLORS.navy,
} as const;

export const CHANNEL_LABELS: Record<string, string> = {
  META: 'Meta Ads',
  GOOGLE: 'Google Ads',
  TIKTOK: 'TikTok Ads',
  ORGANIC: 'Orgânico',
  WHATSAPP: 'WhatsApp',
  DIRECT: 'Direto',
  TOTAL: 'Total',
};

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  leilao: 'Leilão',
  venda_direta: 'Venda/Compra Direta',
};

export const STATUS_CONFIG = {
  on_target: { label: 'No target', icon: '✅', color: COLORS.green, bg: '#e8f8ef' },
  below_target: { label: 'Below target', icon: '⚠️', color: COLORS.amber, bg: '#fff4df' },
  critical: { label: 'Crítico', icon: '🔴', color: COLORS.red, bg: '#fdecee' },
} as const;

export const SEVERITY_CONFIG = {
  critical: { label: 'CRÍTICO', icon: '🔴', color: COLORS.red, bg: '#fdecee', borderColor: COLORS.red },
  warning: { label: 'AVISO', icon: '⚠️', color: COLORS.amber, bg: '#fff4df', borderColor: COLORS.amber },
  info: { label: 'INFO', icon: 'ℹ️', color: COLORS.blue, bg: '#eef4ff', borderColor: COLORS.teal },
} as const;

export const SOCIAL_COLORS: Record<string, string> = {
  Instagram: '#e1306c',
  Facebook: '#1877f2',
  YouTube: '#ff0000',
  TikTok: '#000000',
  LinkedIn: '#0a66c2',
};

// Business goals from Pacote de Implementação
export const GOALS = {
  leilao: {
    entrantes_mensal: 20000,
    habilitados_mensal: 11000,
  },
  venda_direta: {
    conversas_semanal: 700,
  },
} as const;

// Navigation structure
export const NAV_ITEMS = {
  executivo: [
    { label: 'Visão Geral', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Funil de Leilão', href: '/dashboard/funnel', icon: 'Filter' },
    { label: 'Venda Direta', href: '/dashboard/direct-sales', icon: 'MessageCircle' },
    { label: 'Atribuição', href: '/dashboard/attribution', icon: 'GitBranch' },
  ],
  operacional: [
    { label: 'Performance Diária', href: '/dashboard/campaigns', icon: 'BarChart3' },
    { label: 'Campanhas Leilão', href: '/dashboard/auction-campaigns', icon: 'Gavel' },
    { label: 'Campanhas VD', href: '/dashboard/direct-campaigns', icon: 'ShoppingCart' },
    { label: 'Alertas', href: '/dashboard/alerts', icon: 'AlertTriangle' },
    { label: 'Recomendações', href: '/dashboard/recommendations', icon: 'Lightbulb' },
  ],
} as const;
