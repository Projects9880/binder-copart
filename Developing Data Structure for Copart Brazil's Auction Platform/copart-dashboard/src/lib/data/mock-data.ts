// ============================================================================
// Copart Brasil — Mock Data
// Real values extracted from template HTML files and dashboard specs
// ============================================================================

import type {
  DataService,
  DashboardFilters,
  OverviewKPIs,
  GoalProgress,
  WeeklyRegistration,
  FunnelData,
  ChannelPerformance,
  CampaignScorecard,
  AttributionComparison,
  Alert,
  DataDiscrepancy,
  ActionRecommendation,
  SocialMetrics,
  TrafficSource,
} from './types';

// ---------- Overview KPIs (from copart_painel_acompanhamento_referencia.html) ----------

const overviewKPIs: OverviewKPIs = {
  pageViews: {
    value: 6420000, formatted: '6,42M', delta: -8.15,
    deltaFormatted: '-8,15%', deltaType: 'bad', label: 'Page Views', period: 'vs semana anterior',
  },
  visitantesUnicos: {
    value: 297000, formatted: '297k', delta: -4.91,
    deltaFormatted: '-4,91%', deltaType: 'bad', label: 'Visitantes Únicos', period: 'total users',
  },
  novosUsuarios: {
    value: 176000, formatted: '176k', delta: -5.84,
    deltaFormatted: '-5,84%', deltaType: 'bad', label: 'Novos Usuários', period: 'aquisição',
  },
  usuariosRetornantes: {
    value: 145000, formatted: '145k', delta: 7.21,
    deltaFormatted: '+7,21%', deltaType: 'good', label: 'Usuários Retornantes', period: 'retenção',
  },
  firstVisit: {
    value: 1100000, formatted: '1,10M', delta: -6.66,
    deltaFormatted: '-6,66%', deltaType: 'bad', label: 'First Visit', period: 'topo do funil',
  },
  logins: {
    value: 110000, formatted: '110k', delta: -5.73,
    deltaFormatted: '-5,73%', deltaType: 'bad', label: 'Logins', period: 'sign in',
  },
  favoritados: {
    value: 59000, formatted: '59k', delta: -0.89,
    deltaFormatted: '-0,89%', deltaType: 'bad', label: 'Favoritos', period: 'favoritados',
  },
  sessoes: {
    value: 765851, formatted: '765.851', delta: -4.96,
    deltaFormatted: '-4,96%', deltaType: 'bad', label: 'Sessões', period: 'visitas',
  },
  sessoesEngajadas: {
    value: 595804, formatted: '595.804', delta: -7.94,
    deltaFormatted: '-7,94%', deltaType: 'bad', label: 'Sessões Engajadas', period: 'qualidade',
  },
  taxaRejeicao: {
    value: 22.20, formatted: '22,20%', delta: 12.78,
    deltaFormatted: '+12,78%', deltaType: 'bad', label: 'Taxa de Rejeição', period: 'piora',
  },
  registrationStart: {
    value: 68445, formatted: '68.445', delta: 0.6,
    deltaFormatted: '+0,6%', deltaType: 'good', label: 'Registration Start', period: 'resiliência',
  },
  signIn: {
    value: 110269, formatted: '110.269', delta: -5.73,
    deltaFormatted: '-5,73%', deltaType: 'bad', label: 'Sign In', period: 'login',
  },
};

// ---------- Goal Progress (from relatório executivo) ----------

const goalProgress: GoalProgress[] = [
  {
    title: 'Entrantes',
    current: 15500,
    target: 20000,
    percentage: 77.5,
    delta: -2.66,
    deltaLabel: 'vs Maio/26',
    deltaType: 'bad',
  },
  {
    title: 'Habilitados',
    current: 9709,
    target: 11000,
    percentage: 88.3,
    delta: 15.25,
    deltaLabel: 'vs Maio/26',
    deltaType: 'good',
  },
];

// ---------- Weekly Registrations (from relatório executivo) ----------

const weeklyRegistrations: WeeklyRegistration[] = [
  { week: '31/05–06/06', entrantes: 3511, habilitados: 2092, taxa_habilitacao: 59.58 },
  { week: '07/06–13/06', entrantes: 3498, habilitados: 2158, taxa_habilitacao: 61.69 },
  { week: '14/06–20/06', entrantes: 3695, habilitados: 2368, taxa_habilitacao: 64.09 },
  { week: '21/06–27/06', entrantes: 3554, habilitados: 2326, taxa_habilitacao: 65.44 },
  { week: '28/06–04/07', entrantes: 3547, habilitados: 2231, taxa_habilitacao: 62.90 },
];

// ---------- Funnel Data (from Especificação de Dashboards) ----------

const funnelLeilao: FunnelData = {
  type: 'leilao',
  stages: [
    { label: 'Topo', value: 291769, description: 'Usuários ativos na semana' },
    { label: 'Aquisição', value: 176578, conversionRate: 60.5, description: 'Novos usuários' },
    { label: 'Intenção', value: 68445, conversionRate: 38.8, description: 'Registration start' },
    { label: 'Entrantes', value: 3547, conversionRate: 5.2, description: 'Entrantes da semana' },
    { label: 'Habilitados', value: 2231, conversionRate: 62.9, description: 'Taxa de 62,90%' },
    { label: 'Venda Direta', value: 546, conversionRate: 24.5, description: 'Leads VD' },
  ],
};

const funnelVendaDireta: FunnelData = {
  type: 'venda_direta',
  stages: [
    { label: 'Cliques em CTA', value: 2800, description: 'Total de cliques' },
    { label: 'Conversas Iniciadas', value: 2380, conversionRate: 85.0, description: '85% de conversão' },
    { label: 'Contatos Qualificados', value: 1428, conversionRate: 60.0, description: '60% qualificação' },
    { label: 'Leads em Negociação', value: 571, conversionRate: 40.0, description: '40% em negociação' },
  ],
};

// ---------- Channel Performance — Leilão (from Especificação) ----------

const channelPerformanceLeilao: ChannelPerformance[] = [
  { channel: 'Meta', entrantes: 8950, habilitados: 4750, taxa_habilitacao: 53.1, custo_por_entrante: 8.20, custo_por_habilitado: 15.47, gasto: 73400 },
  { channel: 'Google', entrantes: 6200, habilitados: 3100, taxa_habilitacao: 50.0, custo_por_entrante: 9.10, custo_por_habilitado: 18.20, gasto: 56400 },
  { channel: 'Orgânico', entrantes: 5600, habilitados: 2800, taxa_habilitacao: 50.0, custo_por_entrante: 0, custo_por_habilitado: 0, gasto: 0 },
  { channel: 'Direto', entrantes: 1700, habilitados: 580, taxa_habilitacao: 34.1, custo_por_entrante: 0, custo_por_habilitado: 0, gasto: 0 },
];

// ---------- Channel Performance — Venda Direta ----------

const channelPerformanceVD: ChannelPerformance[] = [
  { channel: 'Meta', entrantes: 1960, habilitados: 1666, taxa_habilitacao: 85.0, custo_por_entrante: 7.20, custo_por_habilitado: 7.20, gasto: 12000 },
  { channel: 'WhatsApp Direct', entrantes: 840, habilitados: 714, taxa_habilitacao: 85.0, custo_por_entrante: 8.40, custo_por_habilitado: 8.40, gasto: 6000 },
];

// ---------- Campaign Scorecards (from Especificação Operacional) ----------

const campaignScorecards: CampaignScorecard[] = [
  { campaign_name: 'META_LEILAO_BR_LAL_VIDEO_CPC', channel: 'META', impressions: 245000, clicks: 5880, ctr: 2.4, entrantes: 1995, habilitados: 1077, taxa_habilitacao: 53.9, spend: 16380, cpc: 2.79, custo_por_entrante: 8.21, conversas: null, status: 'on_target' },
  { campaign_name: 'GOOGLE_LEILAO_SP_INT_STATIC_CPM', channel: 'GOOGLE', impressions: 156000, clicks: 3120, ctr: 2.0, entrantes: 1470, habilitados: 735, taxa_habilitacao: 50.0, spend: 13230, cpc: 4.24, custo_por_entrante: 9.00, conversas: null, status: 'below_target' },
  { campaign_name: 'ORGANIC_LEILAO_BR_SEO_CORE', channel: 'ORGANIC', impressions: null, clicks: null, ctr: null, entrantes: 1260, habilitados: 630, taxa_habilitacao: 50.0, spend: 0, cpc: null, custo_por_entrante: 0, conversas: null, status: 'on_target' },
  { campaign_name: 'META_VENDA_BR_LAL_VIDEO_CPC', channel: 'META', impressions: 98000, clicks: 1960, ctr: 2.0, entrantes: 665, habilitados: null, taxa_habilitacao: null, spend: 8400, cpc: 4.29, custo_por_entrante: 7.58, conversas: 1166, status: 'on_target' },
  { campaign_name: 'WHATSAPP_VENDA_BR_DIRECT_CPC', channel: 'WHATSAPP', impressions: null, clicks: 588, ctr: null, entrantes: 315, habilitados: null, taxa_habilitacao: null, spend: 4200, cpc: 7.14, custo_por_entrante: 8.00, conversas: 500, status: 'on_target' },
];

// ---------- Attribution Comparison (from Especificação) ----------

const attributionComparison: AttributionComparison[] = [
  { campaign_name: 'META_LEILAO_BR_LAL_VIDEO_CPC', first_touch: 3200, last_touch: 2800, linear: 3000, time_decay: 2900 },
  { campaign_name: 'GOOGLE_LEILAO_SP_INT_STATIC_CPM', first_touch: 2100, last_touch: 2400, linear: 2250, time_decay: 2350 },
  { campaign_name: 'ORGANIC_LEILAO_BR_SEO_CORE', first_touch: 1800, last_touch: 1500, linear: 1650, time_decay: 1550 },
  { campaign_name: 'META_VENDA_BR_LAL_VIDEO_CPC', first_touch: 1200, last_touch: 1100, linear: 1150, time_decay: 1120 },
];

// ---------- Alerts (from Especificação Operacional) ----------

const alerts: Alert[] = [
  {
    id: 'alert-1', severity: 'critical',
    title: 'GOOGLE_LEILAO_SP_INT_STATIC_CPM',
    description: 'Taxa de Habilitação caiu para 42% (vs. 50% esperado)',
    metric: 'Taxa de Habilitação', expected: '50%',
    action: 'Revisar segmentação de audiência',
    responsavel: 'Felipe',
    timestamp: '2026-07-04T10:30:00Z',
  },
  {
    id: 'alert-2', severity: 'warning',
    title: 'META_LEILAO_BR_LAL_VIDEO_CPC',
    description: 'Custo por Entrante subiu para R$ 9.50 (vs. R$ 8.20 esperado)',
    metric: 'Custo/Entrante', expected: 'R$ 8,20',
    action: 'Revisar lances de CPC',
    responsavel: 'Bruno',
    timestamp: '2026-07-04T11:00:00Z',
  },
  {
    id: 'alert-3', severity: 'info',
    title: 'ORGANIC_LEILAO_BR_SEO_CORE',
    description: 'Tráfego orgânico cresceu 15% vs. semana passada',
    metric: 'Tráfego Orgânico', expected: 'Estável',
    action: 'Investigar quais páginas estão rankando',
    responsavel: 'Caio',
    timestamp: '2026-07-04T09:15:00Z',
  },
];

// ---------- Data Discrepancies ----------

const dataDiscrepancies: DataDiscrepancy[] = [
  { source_a: 'GA4', source_b: 'mLabs', discrepancy: 3.2, sla: 5, status: 'ok' },
  { source_a: 'Google Ads', source_b: 'GA4', discrepancy: 8.5, sla: 10, status: 'ok' },
  { source_a: 'Meta Ads', source_b: 'GA4', discrepancy: 12.1, sla: 15, status: 'warning' },
  { source_a: 'Copart (Planilhas)', source_b: 'RD Station', discrepancy: 2.1, sla: 5, status: 'ok' },
];

// ---------- Recommendations (from Especificação) ----------

const recommendations: ActionRecommendation[] = [
  {
    id: 'rec-1', priority: 1,
    title: 'Aumentar Orçamento',
    campaign: 'META_LEILAO_BR_LAL_VIDEO_CPC',
    reason: 'Taxa de habilitação 54% (acima da meta de 50%)',
    impact: '+200 habilitados/mês',
    budget_change: '+R$ 5.000 (de R$ 16.380 para R$ 21.380)',
    responsavel: 'Bruno',
    deadline: 'Próxima segunda',
  },
  {
    id: 'rec-2', priority: 2,
    title: 'Revisar Segmentação',
    campaign: 'GOOGLE_LEILAO_SP_INT_STATIC_CPM',
    reason: 'Taxa de habilitação caiu para 42% (abaixo da meta)',
    impact: 'Recuperar taxa para 50%+',
    responsavel: 'Felipe',
    deadline: 'Próxima terça',
  },
  {
    id: 'rec-3', priority: 3,
    title: 'Expandir Cobertura Orgânica',
    campaign: 'ORGANIC_LEILAO_BR_SEO_CORE',
    reason: 'Tráfego cresceu 15%, custo por entrante = R$ 0',
    impact: 'Reduzir dependência de mídia paga',
    responsavel: 'Caio',
    deadline: 'Próxima quarta',
  },
];

// ---------- Social Metrics (from painel de acompanhamento) ----------

const socialMetrics: SocialMetrics = {
  platforms: [
    {
      name: 'Instagram', color: '#e1306c', base: 547876, baseDelta: '-167 seguidores',
      mainMetric: 547100, mainDelta: -14, mainDeltaType: 'bad',
      details: [
        { label: 'Visualizações', value: '547,1k', delta: '-14%', deltaType: 'bad' },
        { label: 'Interações', value: '2,4k', delta: '+31%', deltaType: 'good' },
        { label: 'Clicks', value: '2,3k', delta: '-20%', deltaType: 'bad' },
      ],
    },
    {
      name: 'Facebook', color: '#1877f2', base: 171696, baseDelta: '-104 seguidores',
      mainMetric: 74300, mainDelta: -57, mainDeltaType: 'bad',
      details: [
        { label: 'Visualizações', value: '74,3k', delta: '-57%', deltaType: 'bad' },
        { label: 'Interações', value: '110', delta: '-52%', deltaType: 'bad' },
        { label: 'Clicks', value: '320', delta: '-32%', deltaType: 'bad' },
      ],
    },
    {
      name: 'TikTok', color: '#000000', base: 287501, baseDelta: '-52 seguidores',
      mainMetric: 7900, mainDelta: -28, mainDeltaType: 'bad',
      details: [
        { label: 'Visualizações', value: '7,9k', delta: '-28%', deltaType: 'bad' },
        { label: 'Vis. Perfil', value: '140', delta: '-20%', deltaType: 'bad' },
        { label: 'Compartilhamentos', value: '18', delta: '-25%', deltaType: 'bad' },
      ],
    },
    {
      name: 'YouTube', color: '#ff0000', base: 44570, baseDelta: '+45 inscritos',
      mainMetric: 12000, mainDelta: -23, mainDeltaType: 'bad',
      details: [
        { label: 'Visualizações', value: '12k', delta: '-23%', deltaType: 'bad' },
        { label: 'Espectadores', value: '4,8k', delta: '-25%', deltaType: 'bad' },
        { label: 'Impressões', value: '103k', delta: '-5%', deltaType: 'bad' },
      ],
    },
  ],
};

// ---------- Traffic Sources (from relatório executivo) ----------

const trafficSources: TrafficSource[] = [
  { source: 'Direct', maio: 1156279, junho: 632940 },
  { source: 'Paid Search', maio: 121914, junho: 140610 },
  { source: 'Organic Search', maio: 186873, junho: 167107 },
  { source: 'Cross-network', maio: 70555, junho: 79668 },
  { source: 'Organic Social', maio: 31932, junho: 17974 },
  { source: 'Email', maio: 36783, junho: 21209 },
  { source: 'Paid Social', maio: 40772, junho: 10624 },
  { source: 'Referral', maio: 6840, junho: 7514 },
];

// ---------- Trend Data Generator ----------

function generateTrendData(baseValue: number, days: number, volatility: number = 0.05): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  let currentValue = baseValue;
  const startDate = new Date('2026-06-28');

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const change = 1 + (Math.random() - 0.5) * 2 * volatility;
    currentValue = currentValue * change;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue * 100) / 100,
    });
  }
  return data;
}

// ---------- Mock Data Service ----------

export class MockDataService implements DataService {
  async getOverviewKPIs(): Promise<OverviewKPIs> {
    return overviewKPIs;
  }

  async getGoalProgress(): Promise<GoalProgress[]> {
    return goalProgress;
  }

  async getWeeklyRegistrations(): Promise<WeeklyRegistration[]> {
    return weeklyRegistrations;
  }

  async getFunnelData(type: 'leilao' | 'venda_direta'): Promise<FunnelData> {
    return type === 'leilao' ? funnelLeilao : funnelVendaDireta;
  }

  async getChannelPerformance(type: 'leilao' | 'venda_direta'): Promise<ChannelPerformance[]> {
    return type === 'leilao' ? channelPerformanceLeilao : channelPerformanceVD;
  }

  async getCampaignScorecards(): Promise<CampaignScorecard[]> {
    return campaignScorecards;
  }

  async getAttributionComparison(): Promise<AttributionComparison[]> {
    return attributionComparison;
  }

  async getAlerts(): Promise<Alert[]> {
    return alerts;
  }

  async getDataDiscrepancies(): Promise<DataDiscrepancy[]> {
    return dataDiscrepancies;
  }

  async getRecommendations(): Promise<ActionRecommendation[]> {
    return recommendations;
  }

  async getSocialMetrics(): Promise<SocialMetrics> {
    return socialMetrics;
  }

  async getTrafficSources(): Promise<TrafficSource[]> {
    return trafficSources;
  }

  async getTrendData(metric: string, days: number): Promise<{ date: string; value: number }[]> {
    const baseValues: Record<string, number> = {
      taxa_habilitacao: 62.9,
      entrantes: 507,
      habilitados: 319,
      custo_por_entrante: 8.50,
      conversas: 340,
    };
    return generateTrendData(baseValues[metric] || 100, days);
  }
}
