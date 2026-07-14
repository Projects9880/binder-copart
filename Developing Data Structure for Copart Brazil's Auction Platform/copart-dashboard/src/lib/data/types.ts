// ============================================================================
// Copart Brasil — TypeScript Data Types
// Mirrors BigQuery tables from Dicionário de Dados
// ============================================================================

// --- Enumerations ---

export type ConversionType =
  | 'entrante'
  | 'habilitado'
  | 'licitante'
  | 'arrematante'
  | 'conversa_whatsapp';

export type Channel =
  | 'META'
  | 'GOOGLE'
  | 'TIKTOK'
  | 'ORGANIC'
  | 'WHATSAPP'
  | 'DIRECT';

export type CampaignType = 'leilao' | 'venda_direta';

export type DeviceCategory = 'desktop' | 'mobile' | 'tablet';

export type AttributionModel =
  | 'first_touch'
  | 'last_touch'
  | 'linear'
  | 'time_decay';

export type AlertSeverity = 'critical' | 'warning' | 'info';

// --- Core Tables (BigQuery mirrors) ---

/** Mirrors: staging_conversion_events */
export interface ConversionEvent {
  conversion_id: string;
  user_id: string;
  conversion_date: string;
  conversion_type: ConversionType;
  conversion_value: number;
  source_system: string;
  campaign_id: string;
  campaign_name: string;
  channel: Channel;
  is_attributed: boolean;
  attribution_model: AttributionModel;
  created_at: string;
}

/** Mirrors: staging_campaign_performance */
export interface CampaignPerformance {
  performance_id: string;
  date: string;
  campaign_id: string;
  campaign_name: string;
  campaign_type: CampaignType;
  channel: Channel;
  impressions: number;
  clicks: number;
  spend: number;
  entrantes: number;
  habilitados: number;
  licitantes_por_veiculo: number;
  conversas_whatsapp: number;
  // Calculated fields
  taxa_habilitacao: number;
  ctr: number;
  cpc: number;
  custo_por_entrante: number;
  custo_por_habilitado: number;
  roas: number;
  created_at: string;
}

/** Mirrors: staging_user_journey */
export interface UserJourney {
  user_id: string;
  first_touch_date: string;
  first_touch_source: string;
  first_touch_campaign: string;
  first_touch_channel: Channel;
  last_touch_date: string;
  last_touch_source: string;
  last_touch_campaign: string;
  last_touch_channel: Channel;
  touchpoint_count: number;
  days_to_conversion: number;
  conversion_date: string;
  conversion_type: ConversionType;
  device_category: DeviceCategory;
  country: string;
  region: string;
  is_converter: boolean;
  created_at: string;
}

/** Mirrors: mart_daily_metrics */
export interface DailyMetrics {
  date: string;
  channel: Channel | 'TOTAL';
  campaign_name: string;
  campaign_type: CampaignType;
  entrantes: number;
  habilitados: number;
  taxa_habilitacao: number;
  licitantes_por_veiculo: number;
  conversas_whatsapp: number;
  custo_total: number;
  custo_por_entrante: number;
  custo_por_habilitado: number;
  roas: number;
}

// --- Dashboard View Models ---

export interface OverviewKPIs {
  pageViews: MetricValue;
  visitantesUnicos: MetricValue;
  novosUsuarios: MetricValue;
  usuariosRetornantes: MetricValue;
  firstVisit: MetricValue;
  logins: MetricValue;
  favoritados: MetricValue;
  sessoes: MetricValue;
  sessoesEngajadas: MetricValue;
  taxaRejeicao: MetricValue;
  registrationStart: MetricValue;
  signIn: MetricValue;
}

export interface MetricValue {
  value: number;
  formatted: string;
  delta: number;
  deltaFormatted: string;
  deltaType: 'good' | 'bad' | 'neutral';
  label: string;
  period: string;
}

export interface GoalProgress {
  title: string;
  current: number;
  target: number;
  percentage: number;
  delta: number;
  deltaLabel: string;
  deltaType: 'good' | 'bad' | 'neutral';
}

export interface FunnelStage {
  label: string;
  value: number;
  conversionRate?: number;
  description?: string;
}

export interface FunnelData {
  stages: FunnelStage[];
  type: 'leilao' | 'venda_direta';
}

export interface WeeklyRegistration {
  week: string;
  entrantes: number;
  habilitados: number;
  taxa_habilitacao: number;
}

export interface ChannelPerformance {
  channel: string;
  entrantes: number;
  habilitados: number;
  taxa_habilitacao: number;
  custo_por_entrante: number;
  custo_por_habilitado: number;
  gasto: number;
}

export interface CampaignScorecard {
  campaign_name: string;
  channel: Channel;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  entrantes: number;
  habilitados: number | null;
  taxa_habilitacao: number | null;
  spend: number;
  cpc: number | null;
  custo_por_entrante: number;
  conversas: number | null;
  status: 'on_target' | 'below_target' | 'critical';
}

export interface AttributionComparison {
  campaign_name: string;
  first_touch: number;
  last_touch: number;
  linear: number;
  time_decay: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  metric: string;
  expected: string;
  action: string;
  responsavel: string;
  timestamp: string;
}

export interface DataDiscrepancy {
  source_a: string;
  source_b: string;
  discrepancy: number;
  sla: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface ActionRecommendation {
  id: string;
  priority: number;
  title: string;
  campaign?: string;
  reason: string;
  impact: string;
  budget_change?: string;
  responsavel: string;
  deadline: string;
}

export interface SocialMetrics {
  platforms: SocialPlatform[];
}

export interface SocialPlatform {
  name: string;
  color: string;
  base: number;
  baseDelta: string;
  mainMetric: number;
  mainDelta: number;
  mainDeltaType: 'good' | 'bad' | 'neutral';
  details: { label: string; value: string; delta: string; deltaType: 'good' | 'bad' }[];
}

export interface TrafficSource {
  source: string;
  maio: number;
  junho: number;
}

// --- Dashboard Filters ---

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  channel: Channel | 'ALL';
  campaignType: CampaignType | 'ALL';
  geo: string;
  period: 'daily' | 'weekly' | 'monthly';
}

// --- Data Service Interface ---

export interface DataService {
  getOverviewKPIs(filters: DashboardFilters): Promise<OverviewKPIs>;
  getGoalProgress(filters: DashboardFilters): Promise<GoalProgress[]>;
  getWeeklyRegistrations(filters: DashboardFilters): Promise<WeeklyRegistration[]>;
  getFunnelData(type: 'leilao' | 'venda_direta', filters: DashboardFilters): Promise<FunnelData>;
  getChannelPerformance(type: 'leilao' | 'venda_direta', filters: DashboardFilters): Promise<ChannelPerformance[]>;
  getCampaignScorecards(filters: DashboardFilters): Promise<CampaignScorecard[]>;
  getAttributionComparison(filters: DashboardFilters): Promise<AttributionComparison[]>;
  getAlerts(): Promise<Alert[]>;
  getDataDiscrepancies(): Promise<DataDiscrepancy[]>;
  getRecommendations(): Promise<ActionRecommendation[]>;
  getSocialMetrics(): Promise<SocialMetrics>;
  getTrafficSources(): Promise<TrafficSource[]>;
  getTrendData(metric: string, days: number, filters: DashboardFilters): Promise<{ date: string; value: number }[]>;
}
