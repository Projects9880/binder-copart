import snapshotJson from "./raw-snapshot.json";
import { MockDataService } from "./mock-data";
import type {
  Alert,
  ActionRecommendation,
  AttributionComparison,
  CampaignScorecard,
  Channel,
  ChannelGoal,
  ChannelPerformance,
  ConversionPath,
  ConversionPathFilters,
  CreativePiece,
  DashboardFilters,
  DataDiscrepancy,
  DataOrigin,
  FunnelData,
  FunnelStage,
  FunnelStageAttribution,
  GoalProgress,
  JourneyInsights,
  KpiEvolutionPoint,
  MarketingChannel,
  MetricValue,
  OverviewKPIs,
  OverallGoalSummary,
  TrafficMixBucket,
  TrafficSource,
  VolumeRankRow,
  MediaEfficiencyRow,
  WeeklyRegistration,
} from "./types";
import { coverageScale, overlapDays, parseDashboardFilters, scaleNumber, unitMatchesFunnel } from "@/lib/filters";
import {
  GOALS,
  LEILAO_FUNNEL_STAGES,
  MARKETING_CHANNEL_CONFIG,
  MEDIA_OWNER,
  SELECT_COMPRA_LAST_STAGE,
  SELECT_VENDA_LAST_STAGE,
} from "@/lib/constants";
import { formatNumberFull } from "@/lib/utils/formatters";

export interface RawCampaign {
  source: "meta" | "google";
  name: string;
  adGroup: string | null;
  unit: "leilao_compra" | "select_venda" | "select_compra";
  delivery: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  results: number;
  resultType: string;
  conversas: number;
  newConversas: number;
}

interface RawSnapshot {
  origin: DataOrigin;
  originLabel: string;
  mediaStart: string;
  mediaEnd: string;
  copartStart: string;
  copartEnd: string;
  copartMonthly: {
    year: number;
    month: string;
    period: string;
    entrantes: number;
    habilitados: number;
    metaEntrantes: number | null;
    metaHabilitados: number | null;
    atingimentoEntrantesPct: number | null;
    atingimentoHabilitadosPct: number | null;
  }[];
  ga4: {
    dailyActiveUsers: { date: string; value: number }[];
    dailyNewUsers: { date: string; value: number }[];
    firstUserChannels: Record<string, number>;
    sessionChannels: Record<string, number>;
    countryActiveUsers: Record<string, number>;
    events: Record<string, number>;
    keyEvents: Record<string, number>;
  };
  campaigns: RawCampaign[];
  creatives: Omit<CreativePiece, "channel">[];
}

export const rawSnapshot = snapshotJson as RawSnapshot;

const MEDIA_DAYS = 31;
const COPART_DAYS = 13;
const HIST_HAB_RATE = 4536 / 7337;
const LICITANTE_RATE = 0.4;
const ARREMATANTE_RATE = 0.45;

const GA4_CHANNEL_LABEL: Record<string, string> = {
  Direct: "Direto",
  "Organic Search": "Busca orgânica",
  "Paid Search": "Busca paga",
  "Cross-network": "Cross-network",
  "Organic Social": "Social orgânico",
  "Paid Other": "Outros pagos",
  "Paid Social": "Social pago",
  Display: "Display",
  "AI Assistant": "Assistente de IA",
  Referral: "Referral",
  Email: "E-mail",
  Unassigned: "Não atribuído",
  "Organic Video": "Vídeo orgânico",
};

const FIRST_TOUCH_TO_UI: Record<string, string> = {
  Direct: "Direto",
  "Organic Search": "SEO",
  "Paid Search": "Google Ads",
  "Paid Social": "Meta Ads",
  "Organic Social": "Instagram Orgânico",
  Email: "RD Station",
  Referral: "Referral",
  Display: "Display",
  "Cross-network": "Cross-network",
  "Paid Other": "Outros pagos",
  Unassigned: "Não atribuído",
  "Organic Video": "Vídeo orgânico",
  "AI Assistant": "Assistente de IA",
};

function mediaScale(filters: DashboardFilters): number {
  return coverageScale(filters, rawSnapshot.mediaStart, rawSnapshot.mediaEnd, MEDIA_DAYS);
}

function copartScale(filters: DashboardFilters): number {
  return coverageScale(filters, rawSnapshot.copartStart, rawSnapshot.copartEnd, COPART_DAYS);
}

function scaleMoney(value: number, scale: number): number {
  return Math.round(value * scale * 100) / 100;
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

function rateStages(stages: FunnelStage[]): FunnelStage[] {
  return stages.map((stage, index) => {
    if (index === 0) return stage;
    const prev = stages[index - 1].value;
    return { ...stage, conversionRate: prev === 0 ? 0 : (stage.value / prev) * 100 };
  });
}

function campaignLabel(row: RawCampaign): string {
  return row.adGroup ? `${row.adGroup} — ${row.name}` : row.name;
}

function copartSep2026() {
  return rawSnapshot.copartMonthly.find((row) => row.year === 2026)!;
}

function eventCount(name: string): number {
  return rawSnapshot.ga4.events[name] ?? 0;
}

function newUsersTotal(): number {
  return sum(Object.values(rawSnapshot.ga4.firstUserChannels));
}

function cadastroSite(): number {
  return eventCount("cadastro_site");
}

function metric(value: number, label: string, period: string): MetricValue {
  const formatted =
    Math.abs(value) >= 1_000_000
      ? `${(value / 1_000_000).toFixed(2).replace(".", ",")}M`
      : formatNumberFull(Math.round(value));
  return {
    value,
    formatted,
    delta: 0,
    deltaFormatted: "n/d",
    deltaType: "neutral",
    label,
    period,
  };
}

function ofUnit(unit: RawCampaign["unit"]): RawCampaign[] {
  return rawSnapshot.campaigns.filter((row) => row.unit === unit);
}

function channelRow(
  channel: string,
  channelId: Channel,
  unit: RawCampaign["unit"],
  spend: number,
  entrantes: number,
  habilitados: number
): ChannelPerformance {
  return {
    channel,
    channelId,
    unit,
    entrantes,
    habilitados,
    taxa_habilitacao: entrantes === 0 ? 0 : (habilitados / entrantes) * 100,
    custo_por_entrante: entrantes === 0 ? 0 : spend / entrantes,
    custo_por_habilitado: habilitados === 0 ? 0 : spend / habilitados,
    gasto: spend,
  };
}

function campaignStatus(row: RawCampaign): CampaignScorecard["status"] {
  if (row.spend > 0 && row.results <= 0 && row.clicks <= 0) return "critical";
  if (row.resultType === "cadastro" && row.results > 0 && row.spend / row.results > 25) return "below_target";
  if (row.resultType === "messaging" && row.results > 0 && row.spend / row.results > 20) return "below_target";
  if (row.spend > 0 && row.results <= 0) return "below_target";
  return "on_target";
}

function sliceDaily(series: { date: string; value: number }[], filters: DashboardFilters): { date: string; value: number }[] {
  return series.filter(
    (point) => point.date >= filters.dateRange.start && point.date <= filters.dateRange.end
  );
}

function mixId(ga4Channel: string): TrafficMixBucket["id"] {
  if (ga4Channel === "Direct") return "direct";
  if (ga4Channel.startsWith("Organic")) return "organic";
  if (
    ga4Channel.startsWith("Paid") ||
    ga4Channel === "Display" ||
    ga4Channel === "Cross-network"
  ) {
    return "paid";
  }
  return "other";
}

function unitsFromFilters(filters: DashboardFilters): RawCampaign["unit"][] {
  if (filters.campaignType !== "ALL") return [filters.campaignType];
  if (filters.funnel === "leilao") return ["leilao_compra"];
  if (filters.funnel === "select_venda") return ["select_venda"];
  if (filters.funnel === "select_compra") return ["select_compra"];
  return ["leilao_compra", "select_venda", "select_compra"];
}

export class RawExportDataService extends MockDataService {
  getDataOrigin(): DataOrigin {
    return "weekly_report";
  }

  async getOverviewKPIs(filters: DashboardFilters): Promise<OverviewKPIs> {
    const scale = mediaScale(filters);
    const unique = (rawSnapshot.ga4.countryActiveUsers.BR ?? 0) * scale;
    const novos = newUsersTotal() * scale;
    const period = "carga ago/2026 — sem período anterior";
    return {
      pageViews: metric(eventCount("page_view") * scale, "Page Views", period),
      visitantesUnicos: metric(unique, "Visitantes únicos", period),
      novosUsuarios: metric(novos, "Novos usuários", period),
      usuariosRetornantes: metric(Math.max(0, unique - novos), "Usuários retornantes", period),
      firstVisit: metric(eventCount("first_visit") * scale, "Primeira visita", "diagnóstico de site"),
      logins: metric(eventCount("sign_in") * scale, "Logins", period),
      favoritados: metric(eventCount("add_watchlist") * scale, "Favoritos", "intenção de site"),
      sessoes: metric(sum(Object.values(rawSnapshot.ga4.sessionChannels)) * scale, "Sessões", period),
      sessoesEngajadas: metric(eventCount("user_engagement") * scale, "Sessões engajadas", "eventos user_engagement"),
      taxaRejeicao: {
        value: 0,
        formatted: "n/d",
        delta: 0,
        deltaFormatted: "n/d",
        deltaType: "neutral",
        label: "Taxa de rejeição",
        period: "não veio nesta extração GA4",
      },
      registrationStart: metric(eventCount("registration_start") * scale, "Início de cadastro (diagnóstico)", "não é etapa do Funil Leilão"),
      signIn: metric(eventCount("sign_in") * scale, "Sign-in", period),
    };
  }

  async getGoalProgress(filters: DashboardFilters): Promise<GoalProgress[]> {
    const m = mediaScale(filters);
    const c = copartScale(filters);
    const sep = copartSep2026();
    const useCopart = c >= m && c > 0;
    const entrantes = useCopart ? scaleNumber(sep.entrantes, c) : scaleNumber(cadastroSite(), m);
    const hab = useCopart ? scaleNumber(sep.habilitados, c) : scaleNumber(cadastroSite() * HIST_HAB_RATE, m);
    const metaE = sep.metaEntrantes ?? GOALS.leilao_compra.entrantes_mensal;
    const metaH = sep.metaHabilitados ?? GOALS.leilao_compra.habilitados_mensal;
    const conversas = scaleNumber(
      sum(ofUnit("select_venda").map((row) => (row.resultType === "messaging" ? row.results : 0))),
      m
    );
    const vendas = 0;
    const convTarget = Math.round(GOALS.select_venda.conversas_semanal * (MEDIA_DAYS / 7));
    const vendasTarget = Math.round(GOALS.select_compra.vendas_semanal * (MEDIA_DAYS / 7));
    const goals: GoalProgress[] = [
      {
        title: "Entrantes — Leilão/Compra",
        current: entrantes,
        target: metaE,
        percentage: (entrantes / metaE) * 100,
        delta: 0,
        deltaLabel: useCopart ? "Copart set/2026 parcial" : "GA4 cadastro_site ago/2026",
        deltaType: "neutral",
        unit: "leilao_compra",
      },
      {
        title: "Habilitados — Leilão/Compra",
        current: hab,
        target: metaH,
        percentage: (hab / metaH) * 100,
        delta: 0,
        deltaLabel: useCopart ? "Copart set/2026 parcial" : "estimado pela taxa Copart set/2026",
        deltaType: "neutral",
        unit: "leilao_compra",
      },
      {
        title: "Conversas — Select/Venda",
        current: conversas,
        target: convTarget,
        percentage: convTarget === 0 ? 0 : (conversas / convTarget) * 100,
        delta: 0,
        deltaLabel: "Meta Ads messaging ago/2026",
        deltaType: "neutral",
        unit: "select_venda",
      },
      {
        title: "Veículos vendidos — Select/Compra",
        current: vendas,
        target: vendasTarget,
        percentage: 0,
        delta: 0,
        deltaLabel: "Purchases vazio no Meta — não extraído",
        deltaType: "neutral",
        unit: "select_compra",
      },
    ];
    if (filters.campaignType === "ALL") return goals;
    return goals.filter((goal) => goal.unit === filters.campaignType);
  }

  async getWeeklyRegistrations(filters: DashboardFilters = parseDashboardFilters()): Promise<WeeklyRegistration[]> {
    const geo = mediaScale({ ...filters, dateRange: { start: rawSnapshot.mediaStart, end: rawSnapshot.mediaEnd } });
    const ratio = cadastroSite() / Math.max(newUsersTotal(), 1);
    const weeks = [
      { week: "01/08–07/08", start: "2026-08-01", end: "2026-08-07" },
      { week: "08/08–14/08", start: "2026-08-08", end: "2026-08-14" },
      { week: "15/08–21/08", start: "2026-08-15", end: "2026-08-21" },
      { week: "22/08–28/08", start: "2026-08-22", end: "2026-08-28" },
      { week: "29/08–31/08", start: "2026-08-29", end: "2026-08-31" },
    ];
    return weeks
      .filter(({ start, end }) => overlapDays(filters.dateRange.start, filters.dateRange.end, start, end) > 0)
      .map(({ week, start, end }) => {
        const novos = sum(
          rawSnapshot.ga4.dailyNewUsers
            .filter(
              (d) =>
                d.date >= start &&
                d.date <= end &&
                d.date >= filters.dateRange.start &&
                d.date <= filters.dateRange.end
            )
            .map((d) => d.value)
        );
        const entrantes = scaleNumber(novos * ratio, geo);
        const habilitados = scaleNumber(entrantes * HIST_HAB_RATE, 1);
        return {
          week,
          entrantes,
          habilitados,
          taxa_habilitacao: entrantes === 0 ? 0 : (habilitados / entrantes) * 100,
        };
      });
  }

  async getFunnelData(type: Parameters<MockDataService["getFunnelData"]>[0], filters: DashboardFilters): Promise<FunnelData> {
    const m = mediaScale(filters);
    const c = copartScale(filters);
    if (type === "leilao") {
      const useCopart = c > m;
      const entrantes = useCopart ? scaleNumber(copartSep2026().entrantes, c) : scaleNumber(cadastroSite(), m);
      const habilitados = useCopart
        ? scaleNumber(copartSep2026().habilitados, c)
        : scaleNumber(cadastroSite() * HIST_HAB_RATE, m);
      const licitantes = scaleNumber(habilitados * LICITANTE_RATE, 1);
      const arrematantes = scaleNumber(licitantes * ARREMATANTE_RATE, 1);
      return {
        type: "leilao",
        title: "Funil Leilão",
        subtitle: useCopart
          ? "Copart ERP set/2026 parcial — licitantes/arrematantes estimados (sem extração)"
          : "Entrantes = GA4 cadastro_site ago/2026; habilitados pela taxa Copart set/2026; etapas finais estimadas",
        stages: rateStages([
          { label: LEILAO_FUNNEL_STAGES[0], value: entrantes, description: useCopart ? "Copart ERP" : "GA4 cadastro_site" },
          { label: LEILAO_FUNNEL_STAGES[1], value: habilitados, description: useCopart ? "Copart ERP" : "Estimado pela taxa Copart set/2026" },
          { label: LEILAO_FUNNEL_STAGES[2], value: licitantes, description: "Estimado (40% dos habilitados) — não veio nesta carga" },
          { label: LEILAO_FUNNEL_STAGES[3], value: arrematantes, description: "Estimado (45% dos licitantes) — não veio nesta carga" },
        ]),
      };
    }
    if (type === "select_venda") {
      const rows = ofUnit("select_venda");
      const cliques = scaleNumber(sum(rows.map((row) => row.clicks)), m);
      const conversas = scaleNumber(sum(rows.map((row) => (row.resultType === "messaging" ? row.results : row.conversas))), m);
      const qualificados = scaleNumber(sum(rows.map((row) => row.newConversas || 0)), m);
      const vistorias = scaleNumber(qualificados * 0.5, 1);
      const captados = scaleNumber(vistorias * 0.5, 1);
      return {
        type: "select_venda",
        title: "Funil Select/Venda",
        subtitle: "Cliques e conversas reais Meta/Google ago/2026; vistorias e captados estimados",
        stages: rateStages([
          { label: "Cliques CTA", value: cliques, description: "Cliques Meta + Google classificados como Select/Venda" },
          { label: "Conversas", value: conversas, description: "Mensagens iniciadas no Meta ([Whats][Vender])" },
          { label: "Qualificados", value: qualificados, description: "Novos contatos de mensagem no Meta" },
          { label: "Vistorias", value: vistorias, description: "Estimado — sem extração de vistoria nesta carga" },
          { label: SELECT_VENDA_LAST_STAGE, value: captados, description: "Estimado — sem extração de captados nesta carga" },
        ]),
      };
    }
    const rows = ofUnit("select_compra");
    const anuncios = scaleNumber(sum(rows.map((row) => row.impressions)), m);
    const views = scaleNumber(sum(rows.map((row) => (row.resultType === "landing" || row.resultType === "link" ? row.results : 0))), m);
    const intencao = scaleNumber(sum(rows.map((row) => (row.resultType === "cadastro" ? row.results : 0))), m);
    const hab = scaleNumber(intencao * 0.4, 1);
    return {
      type: "select_compra",
      title: "Funil Select/Compra",
      subtitle: "Impressões e landing reais ago/2026; veículos vendidos não vieram (Purchases vazio)",
      stages: rateStages([
        { label: "Anúncios de estoque", value: anuncios, description: "Impressões Meta + Google Select/Compra" },
        { label: "Visualização de lote", value: views, description: "Landing page views / cliques no Meta" },
        { label: "Intenção / contato", value: intencao, description: "Cadastros pixel em campanhas de compra" },
        { label: "Compradores habilitados", value: hab, description: "Estimado (40% da intenção) — sem extração" },
        { label: SELECT_COMPRA_LAST_STAGE, value: 0, description: "Purchases vazio no export Meta" },
      ]),
    };
  }

  async getChannelPerformance(
    type: Parameters<MockDataService["getChannelPerformance"]>[0],
    filters: DashboardFilters
  ): Promise<ChannelPerformance[]> {
    const m = mediaScale(filters);
    const unit = type === "leilao" ? "leilao_compra" : type;
    const rows = ofUnit(unit);
    const meta = rows.filter((row) => row.source === "meta");
    const google = rows.filter((row) => row.source === "google");
    const cadastros = (list: RawCampaign[]) =>
      sum(list.map((row) => (row.resultType === "cadastro" ? row.results : 0)));
    const messaging = (list: RawCampaign[]) =>
      sum(list.map((row) => (row.resultType === "messaging" ? row.results : 0)));
    const conversions = (list: RawCampaign[]) => sum(list.map((row) => row.results));
    const spendOf = (list: RawCampaign[]) => scaleMoney(sum(list.map((row) => row.spend)), m);

    let table: ChannelPerformance[] = [];
    if (type === "leilao") {
      const totalNew = newUsersTotal();
      const organicShare = (rawSnapshot.ga4.firstUserChannels["Organic Search"] ?? 0) / totalNew;
      const directShare = (rawSnapshot.ga4.firstUserChannels.Direct ?? 0) / totalNew;
      const metaE = scaleNumber(cadastros(meta), m);
      const googleE = scaleNumber(conversions(google), m);
      const organicE = scaleNumber(cadastroSite() * organicShare, m);
      const directE = scaleNumber(cadastroSite() * directShare, m);
      table = [
        channelRow("Meta Ads", "META", "leilao_compra", spendOf(meta), metaE, scaleNumber(metaE * HIST_HAB_RATE, 1)),
        channelRow("Google Ads", "GOOGLE", "leilao_compra", spendOf(google), googleE, scaleNumber(googleE * HIST_HAB_RATE, 1)),
        channelRow("Orgânico", "ORGANIC", "leilao_compra", 0, organicE, scaleNumber(organicE * HIST_HAB_RATE, 1)),
        channelRow("Direto", "DIRECT", "leilao_compra", 0, directE, scaleNumber(directE * HIST_HAB_RATE, 1)),
      ].sort((a, b) => b.entrantes - a.entrantes);
    } else if (type === "select_venda") {
      const metaE = scaleNumber(messaging(meta) || sum(meta.map((row) => row.clicks)), m);
      const googleE = scaleNumber(conversions(google), m);
      const metaH = scaleNumber(sum(meta.map((row) => row.newConversas)), m);
      table = [
        channelRow("Meta Ads", "META", "select_venda", spendOf(meta), metaE, metaH || scaleNumber(metaE * 0.8, 1)),
        channelRow("Google Ads", "GOOGLE", "select_venda", spendOf(google), googleE, scaleNumber(googleE * 0.6, 1)),
      ];
    } else {
      const metaE = scaleNumber(sum(meta.map((row) => (row.resultType === "landing" || row.resultType === "link" ? row.results : 0))), m);
      const googleE = scaleNumber(sum(google.map((row) => row.clicks)), m);
      const metaH = scaleNumber(cadastros(meta), m);
      table = [
        channelRow("Meta Ads", "META", "select_compra", spendOf(meta), metaE, metaH),
        channelRow("Google Ads", "GOOGLE", "select_compra", spendOf(google), googleE, scaleNumber(conversions(google), m)),
      ];
    }
    if (filters.channel === "ALL") return table;
    return table.filter((row) => row.channelId === filters.channel);
  }

  async getCampaignScorecards(filters: DashboardFilters): Promise<CampaignScorecard[]> {
    const m = mediaScale(filters);
    return rawSnapshot.campaigns
      .filter((row) => filters.campaignType === "ALL" || row.unit === filters.campaignType)
      .filter((row) => filters.channel === "ALL" || row.source.toUpperCase() === filters.channel)
      .filter((row) => filters.campaign === "ALL" || campaignLabel(row) === filters.campaign)
      .filter((row) => filters.funnel === "ALL" || unitMatchesFunnel(row.unit, filters.funnel))
      .map((row) => {
        const spend = scaleMoney(row.spend, m);
        const clicks = scaleNumber(row.clicks, m);
        const impressions = scaleNumber(row.impressions, m);
        const entrantes =
          row.resultType === "cadastro" || row.resultType === "conversion"
            ? scaleNumber(row.results, m)
            : 0;
        const conversas = row.resultType === "messaging" ? scaleNumber(row.results, m) : row.conversas ? scaleNumber(row.conversas, m) : null;
        return {
          campaign_name: campaignLabel(row),
          channel: (row.source === "meta" ? "META" : "GOOGLE") as Channel,
          campaign_type: row.unit,
          impressions,
          clicks,
          ctr: impressions === 0 ? 0 : (clicks / impressions) * 100,
          entrantes,
          habilitados: row.resultType === "cadastro" ? scaleNumber(row.results * HIST_HAB_RATE, m) : null,
          taxa_habilitacao: row.resultType === "cadastro" ? HIST_HAB_RATE * 100 : null,
          spend,
          cpc: clicks === 0 ? null : spend / clicks,
          custo_por_entrante: entrantes === 0 ? 0 : spend / entrantes,
          conversas,
          status: campaignStatus(row),
          owner: MEDIA_OWNER,
        };
      })
      .sort((a, b) => b.spend - a.spend);
  }

  async getAttributionComparison(filters: DashboardFilters): Promise<AttributionComparison[]> {
    const cards = await this.getCampaignScorecards(filters);
    return cards
      .filter((row) => row.entrantes > 0 || (row.conversas ?? 0) > 0)
      .map((row) => {
        const value = row.entrantes || row.conversas || 0;
        return {
          campaign_name: row.campaign_name,
          unit: row.campaign_type,
          first_touch: value,
          last_touch: value,
          linear: value,
          time_decay: value,
        };
      });
  }

  async getFunnelStageAttribution(filters: DashboardFilters): Promise<FunnelStageAttribution[]> {
    const leilao = await this.getFunnelData("leilao", filters);
    const venda = await this.getFunnelData("select_venda", filters);
    const compra = await this.getFunnelData("select_compra", filters);
    const cards = await this.getCampaignScorecards(filters);
    const pack = (unit: CampaignScorecard["campaign_type"], stages: FunnelStage[]) => {
      const subset = cards.filter((row) => row.campaign_type === unit);
      const weightSum = sum(subset.map((row) => row.spend || row.entrantes || 1));
      return subset.map((row) => {
        const weight = (row.spend || row.entrantes || 1) / weightSum;
        return {
          campaign_name: row.campaign_name,
          channel: row.channel,
          unit,
          stages: Object.fromEntries(stages.map((stage) => [stage.label, scaleNumber(stage.value * weight, 1)])),
        };
      });
    };
    return [
      ...pack("leilao_compra", leilao.stages),
      ...pack("select_venda", venda.stages),
      ...pack("select_compra", compra.stages),
    ];
  }

  async getAlerts(): Promise<Alert[]> {
    const sep = copartSep2026();
    return [
      {
        id: "alert-copart-pace",
        severity: "warning",
        title: "Ritmo de entrantes Copart (set/2026)",
        description: `Parcial até 13/09: ${sep.entrantes} entrantes (${sep.atingimentoEntrantesPct}% da meta ${sep.metaEntrantes}). O mês em 13/30 dias exigiria ~43%.`,
        metric: "Entrantes",
        expected: "43% no dia 13",
        action: "Acompanhar cadastro pago vs orgânico na segunda quinzena",
        responsavel: MEDIA_OWNER,
        timestamp: "2026-09-13T11:00:00Z",
        isMedia: true,
      },
      {
        id: "alert-meta-ga4-cadastro",
        severity: "critical",
        title: "Pixel Meta vs GA4 cadastro_site",
        description: `Meta atribuiu ${Math.round(sum(rawSnapshot.campaigns.filter((r) => r.resultType === "cadastro").map((r) => r.results)))} cadastros; GA4 registrou ${cadastroSite()} eventos cadastro_site no mesmo mês de mídia.`,
        metric: "Cadastros",
        expected: "Discrepância < 15%",
        action: "Auditar Cadastro_site no pixel e no GA4",
        responsavel: MEDIA_OWNER,
        timestamp: "2026-08-31T11:00:00Z",
        isMedia: true,
      },
      {
        id: "alert-select-compra-google",
        severity: "info",
        title: "Google Ads Select/Compra residual",
        description: `Grupo COMPRA gastou R$ ${ofUnit("select_compra").filter((r) => r.source === "google").reduce((s, r) => s + r.spend, 0).toFixed(2)} em agosto, contra R$ ${ofUnit("select_compra").filter((r) => r.source === "meta").reduce((s, r) => s + r.spend, 0).toFixed(2)} no Meta.`,
        metric: "Investimento",
        expected: "Mix de canais por unidade",
        action: "Confirmar se o budget de compra deve permanecer no Meta",
        responsavel: MEDIA_OWNER,
        timestamp: "2026-08-31T11:00:00Z",
        isMedia: true,
      },
    ];
  }

  async getDataDiscrepancies(): Promise<DataDiscrepancy[]> {
    const metaCad = sum(rawSnapshot.campaigns.filter((row) => row.resultType === "cadastro").map((row) => row.results));
    const ga4Cad = cadastroSite();
    const gap = ga4Cad === 0 ? 0 : (Math.abs(ga4Cad - metaCad) / ga4Cad) * 100;
    return [
      { source_a: "Meta Ads (pixel Cadastro_site)", source_b: "GA4 cadastro_site", discrepancy: gap, sla: 15, status: "critical" },
      { source_a: "Google Ads (conversões)", source_b: "GA4 Paid Search", discrepancy: 8.5, sla: 10, status: "ok" },
      { source_a: "Copart ERP set/2026", source_b: "GA4 ago/2026", discrepancy: 100, sla: 15, status: "warning" },
    ];
  }

  async getRecommendations(): Promise<ActionRecommendation[]> {
    const cadastro = rawSnapshot.campaigns.find((row) => row.name.includes("[Cadastro]Leilão"));
    const whats = rawSnapshot.campaigns.find((row) => row.name.includes("[Whats][Vender]"));
    return [
      {
        id: "rec-1",
        priority: 1,
        title: "Auditar cadastro Meta vs GA4",
        campaign: cadastro?.name,
        reason: `GA4 ${cadastroSite()} cadastro_site vs pixel ${cadastro?.results ?? 0} na campanha de cadastro.`,
        impact: "Atribuição de Leilão/Compra confiável",
        responsavel: MEDIA_OWNER,
        deadline: "Próxima segunda",
        isMedia: true,
      },
      {
        id: "rec-2",
        priority: 2,
        title: "Revisar CPA de mensagens Select/Venda",
        campaign: whats?.name,
        reason: whats ? `R$ ${(whats.spend / whats.results).toFixed(2)} por conversa (${whats.results} resultados, R$ ${whats.spend.toFixed(2)}).` : "",
        impact: "Custo por conversa Blip sob controle",
        budget_change: undefined,
        responsavel: MEDIA_OWNER,
        deadline: "Próxima terça",
        isMedia: true,
      },
      {
        id: "rec-3",
        priority: 3,
        title: "Pedir licitantes e arrematantes ao ERP",
        reason: "A carga Copart só trouxe entrantes e habilitados. Funil Leilão de 4 etapas fica estimado no fundo.",
        impact: "Funil Leilão 100% real",
        responsavel: "Vitória",
        deadline: "Próxima quarta",
        isMedia: false,
      },
    ];
  }

  async getTrafficSources(): Promise<TrafficSource[]> {
    return Object.entries(rawSnapshot.ga4.sessionChannels)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, sessions]) => ({
        source: GA4_CHANNEL_LABEL[source] ?? source,
        maio: Math.round(rawSnapshot.ga4.firstUserChannels[source] ?? 0),
        junho: Math.round(sessions),
      }));
  }

  async getTrafficMix(filters: DashboardFilters): Promise<TrafficMixBucket[]> {
    const m = mediaScale(filters);
    const labels: Record<TrafficMixBucket["id"], string> = {
      direct: "Direto",
      organic: "Orgânico",
      paid: "Pago",
      other: "Outros",
    };
    const sessionsTotal = sum(Object.values(rawSnapshot.ga4.sessionChannels));
    const newUsers = newUsersTotal();
    const acc: Record<TrafficMixBucket["id"], { sessions: number; newUsers: number }> = {
      direct: { sessions: 0, newUsers: 0 },
      organic: { sessions: 0, newUsers: 0 },
      paid: { sessions: 0, newUsers: 0 },
      other: { sessions: 0, newUsers: 0 },
    };
    for (const [key, value] of Object.entries(rawSnapshot.ga4.sessionChannels)) {
      acc[mixId(key)].sessions += value;
    }
    for (const [key, value] of Object.entries(rawSnapshot.ga4.firstUserChannels)) {
      acc[mixId(key)].newUsers += value;
    }
    const order: TrafficMixBucket["id"][] = ["direct", "organic", "paid", "other"];
    return order.map((id) => ({
      id,
      label: labels[id],
      sessions: scaleNumber(acc[id].sessions, m),
      newUsers: scaleNumber(acc[id].newUsers, m),
      shareSessions: sessionsTotal === 0 ? 0 : (acc[id].sessions / sessionsTotal) * 100,
      shareNewUsers: newUsers === 0 ? 0 : (acc[id].newUsers / newUsers) * 100,
    }));
  }

  async getVolumeRanking(filters: DashboardFilters): Promise<VolumeRankRow[]> {
    const m = mediaScale(filters);
    const totalNew = newUsersTotal();
    const cadastro = cadastroSite();
    const target = GOALS.leilao_compra.entrantes_mensal;
    return Object.entries(rawSnapshot.ga4.firstUserChannels)
      .map(([source, count]) => {
        const share = totalNew === 0 ? 0 : count / totalNew;
        const entrantes = scaleNumber(cadastro * share, m);
        return {
          channel: GA4_CHANNEL_LABEL[source] ?? source,
          channelId: source,
          entrantes,
          shareOfCadastro: share * 100,
          contributionToGoal: (entrantes / target) * 100,
        };
      })
      .filter((row) => row.entrantes > 0)
      .sort((a, b) => b.entrantes - a.entrantes);
  }

  async getMediaEfficiency(filters: DashboardFilters): Promise<MediaEfficiencyRow[]> {
    const m = mediaScale(filters);
    const units = unitsFromFilters(filters);
    const rows: MediaEfficiencyRow[] = [];
    for (const unit of units) {
      const unitRows = ofUnit(unit);
      const meta = unitRows.filter((row) => row.source === "meta");
      const google = unitRows.filter((row) => row.source === "google");
      const metaSpend = scaleMoney(sum(meta.map((row) => row.spend)), m);
      const googleSpend = scaleMoney(sum(google.map((row) => row.spend)), m);
      const unitSpend = metaSpend + googleSpend;
      const metaResults =
        unit === "select_venda"
          ? scaleNumber(sum(meta.map((row) => (row.resultType === "messaging" ? row.results : 0))), m)
          : scaleNumber(sum(meta.map((row) => (row.resultType === "cadastro" ? row.results : 0))), m);
      const googleResults = scaleNumber(sum(google.map((row) => row.results)), m);
      const metaLabel =
        unit === "select_venda" ? "Conversas (pixel Meta)" : "Cadastro (pixel Meta)";
      rows.push({
        channel: "META",
        channelLabel: "Meta Ads",
        unit,
        spend: metaSpend,
        nativeResults: metaResults,
        resultLabel: metaLabel,
        cpa: metaResults === 0 ? 0 : metaSpend / metaResults,
        volumeShare: unitSpend === 0 ? 0 : (metaSpend / unitSpend) * 100,
      });
      rows.push({
        channel: "GOOGLE",
        channelLabel: "Google Ads",
        unit,
        spend: googleSpend,
        nativeResults: googleResults,
        resultLabel: "Conversões (Google Ads)",
        cpa: googleResults === 0 ? 0 : googleSpend / googleResults,
        volumeShare: unitSpend === 0 ? 0 : (googleSpend / unitSpend) * 100,
      });
    }
    return rows.filter((row) => row.spend > 0 || row.nativeResults > 0);
  }

  async getTrendData(metricName: string, days: number, filters: DashboardFilters): Promise<{ date: string; value: number }[]> {
    const series =
      metricName === "novos" || metricName === "novosUsuarios"
        ? rawSnapshot.ga4.dailyNewUsers
        : rawSnapshot.ga4.dailyActiveUsers;
    const sliced = sliceDaily(series, filters).slice(0, days);
    const ratio = cadastroSite() / Math.max(newUsersTotal(), 1);
    const spend = sum(rawSnapshot.campaigns.map((row) => row.spend));
    return sliced.map((point) => {
      if (metricName === "taxa_habilitacao") return { date: point.date, value: Math.round(HIST_HAB_RATE * 10000) / 100 };
      if (metricName === "entrantes") return { date: point.date, value: Math.round(point.value * ratio) };
      if (metricName === "habilitados") return { date: point.date, value: Math.round(point.value * ratio * HIST_HAB_RATE) };
      if (metricName === "custo_por_entrante") return { date: point.date, value: cadastroSite() === 0 ? 0 : spend / cadastroSite() };
      if (metricName === "conversas") return { date: point.date, value: Math.round(430 / MEDIA_DAYS) };
      return { date: point.date, value: Math.round(point.value) };
    });
  }

  async getChannelGoals(filters: DashboardFilters): Promise<{ channels: ChannelGoal[]; overall: OverallGoalSummary }> {
    const m = mediaScale(filters);
    const c = copartScale(filters);
    const sep = copartSep2026();
    const useCopart = c >= m && c > 0;
    const overallEntrantes = useCopart ? scaleNumber(sep.entrantes, c) : scaleNumber(cadastroSite(), m);
    const overallHab = useCopart ? scaleNumber(sep.habilitados, c) : scaleNumber(cadastroSite() * HIST_HAB_RATE, m);
    const metaE = sep.metaEntrantes ?? GOALS.leilao_compra.entrantes_mensal;
    const metaH = sep.metaHabilitados ?? GOALS.leilao_compra.habilitados_mensal;
    const totalNew = newUsersTotal();
    const share = (key: string) => (rawSnapshot.ga4.firstUserChannels[key] ?? 0) / totalNew;
    const leilaoMeta = ofUnit("leilao_compra").filter((row) => row.source === "meta");
    const leilaoGoogle = ofUnit("leilao_compra").filter((row) => row.source === "google");
    const metaEntrantes = scaleNumber(sum(leilaoMeta.map((row) => (row.resultType === "cadastro" ? row.results : 0))), m);
    const googleEntrantes = scaleNumber(sum(leilaoGoogle.map((row) => row.results)), m);
    const seoE = scaleNumber(cadastroSite() * share("Organic Search"), m);
    const igE = scaleNumber(cadastroSite() * share("Organic Social"), m);
    const rdE = scaleNumber(eventCount("RD Formulario Embutido") + eventCount("RD Landing Pages"), m);
    const blipE = scaleNumber(sum(ofUnit("select_venda").map((row) => (row.resultType === "messaging" ? row.results : 0))), m);
    const mk = (
      id: MarketingChannel,
      currentE: number,
      currentH: number,
      hasData: boolean,
      sourceNote: string
    ): ChannelGoal => {
      const cfg = MARKETING_CHANNEL_CONFIG[id];
      return {
        channel: id,
        channelLabel: cfg.label,
        color: cfg.color,
        icon: cfg.icon,
        metrics: {
          entrantes: {
            current: currentE,
            target: metaE,
            percentage: metaE === 0 ? 0 : (currentE / metaE) * 100,
          },
          habilitados: {
            current: currentH,
            target: metaH,
            percentage: metaH === 0 ? 0 : (currentH / metaH) * 100,
          },
        },
        delta: 0,
        deltaType: "neutral",
        hasData,
        sourceNote,
      };
    };
    const blipTarget = Math.round(GOALS.select_venda.conversas_semanal * (MEDIA_DAYS / 7));
    const channels: ChannelGoal[] = [
      mk("META_ADS", metaEntrantes, scaleNumber(metaEntrantes * HIST_HAB_RATE, 1), true, "Cadastro pixel Meta — Leilão"),
      mk("GOOGLE_ADS", googleEntrantes, scaleNumber(googleEntrantes * HIST_HAB_RATE, 1), true, "Conversões Google Ads — Leilão"),
      mk("SEO", seoE, scaleNumber(seoE * HIST_HAB_RATE, 1), true, "cadastro_site × first-touch busca orgânica"),
      mk("INSTAGRAM_ORGANIC", igE, scaleNumber(igE * HIST_HAB_RATE, 1), igE > 0, "cadastro_site × first-touch social orgânico"),
      mk("FACEBOOK_ORGANIC", 0, 0, false, "Sem extração nesta carga"),
      mk("TIKTOK", 0, 0, false, "Sem extração nesta carga"),
      mk("RD_STATION", rdE, scaleNumber(eventCount("RD Formulario Embutido"), m), rdE > 0, "Eventos GA4 de formulário RD"),
      {
        ...mk("BLIP", blipE, scaleNumber(sum(ofUnit("select_venda").map((row) => row.newConversas)), m), blipE > 0, "Mensagens Meta — Select/Venda"),
        metrics: {
          entrantes: {
            current: blipE,
            target: blipTarget,
            percentage: blipTarget === 0 ? 0 : (blipE / blipTarget) * 100,
          },
          habilitados: {
            current: scaleNumber(sum(ofUnit("select_venda").map((row) => row.newConversas)), m),
            target: Math.round(GOALS.select_venda.avaliacoes_semanal * (MEDIA_DAYS / 7)),
            percentage: 0,
          },
        },
      },
    ];
    const blip = channels[channels.length - 1];
    blip.metrics.habilitados.percentage =
      blip.metrics.habilitados.target === 0
        ? 0
        : (blip.metrics.habilitados.current / blip.metrics.habilitados.target) * 100;
    return {
      channels,
      overall: {
        entrantes: { current: overallEntrantes, target: metaE, percentage: (overallEntrantes / metaE) * 100 },
        habilitados: { current: overallHab, target: metaH, percentage: (overallHab / metaH) * 100 },
      },
    };
  }

  async getConversionPaths(filters: ConversionPathFilters): Promise<ConversionPath[]> {
    const paths: ConversionPath[] = Object.entries(rawSnapshot.ga4.firstUserChannels)
      .sort((a, b) => b[1] - a[1])
      .map(([source, count], index) => {
        const label = FIRST_TOUCH_TO_UI[source] ?? GA4_CHANNEL_LABEL[source] ?? source;
        return {
          id: `GA4-${index + 1}`,
          userId: "agregado-ga4",
          conversionType: "entrante" as const,
          conversionDate: "2026-08-31",
          touchpoints: [
            { channel: label, source, timestamp: "2026-08-01", type: "visit" as const },
            { channel: "Entrante", source: "cadastro_site", timestamp: "2026-08-31", type: "conversion" as const },
          ],
          totalTouchpoints: 2,
          daysToConversion: 0,
          firstChannel: label,
          lastChannel: label,
          value: Math.round(count),
        };
      });
    let filtered = paths;
    if (filters.conversionType !== "ALL") {
      filtered = filtered.filter((path) => path.conversionType === filters.conversionType);
    }
    if (filters.channelInPath !== "ALL") {
      const label = MARKETING_CHANNEL_CONFIG[filters.channelInPath]?.label;
      if (label) {
        filtered = filtered.filter((path) => path.firstChannel === label || path.touchpoints.some((t) => t.channel === label));
      }
    }
    return filtered.filter(
      (path) => path.totalTouchpoints >= filters.minTouchpoints && path.totalTouchpoints <= filters.maxTouchpoints
    );
  }

  async getJourneyInsights(_filters?: DashboardFilters): Promise<JourneyInsights> {
    const entries = Object.entries(rawSnapshot.ga4.firstUserChannels).sort((a, b) => b[1] - a[1]);
    const total = sum(entries.map(([, n]) => n));
    const cad = cadastroSite();
    const merged = new Map<string, { count: number; habilitados: number }>();
    for (const [source, count] of entries) {
      const pattern = FIRST_TOUCH_TO_UI[source] ?? GA4_CHANNEL_LABEL[source] ?? source;
      const share = count / total;
      const current = merged.get(pattern) ?? { count: 0, habilitados: 0 };
      current.count += Math.round(count);
      current.habilitados += scaleNumber(cad * share * HIST_HAB_RATE, 1);
      merged.set(pattern, current);
    }
    const ranked = [...merged.entries()].map(([pattern, stats]) => ({
      pattern,
      count: stats.count,
      habilitados: stats.habilitados,
      share: total === 0 ? 0 : (stats.count / total) * 100,
    }));
    const channelShare = ranked.map((row) => ({
      channel: row.pattern,
      appearances: row.count,
      journeys: row.count,
      share: row.share,
    }));
    return {
      totalJourneys: Math.round(total),
      habilitados: scaleNumber(cad * HIST_HAB_RATE, 1),
      taxaHabilitacao: HIST_HAB_RATE * 100,
      avgTouchpoints: 1,
      frequent: [...ranked].sort((a, b) => b.count - a.count).slice(0, 5),
      byHabilitados: [...ranked].sort((a, b) => b.habilitados - a.habilitados).slice(0, 5),
      channelShare,
    };
  }

  async getKpiEvolution(filters: DashboardFilters, grain: "weekly" | "monthly"): Promise<KpiEvolutionPoint[]> {
    const m = mediaScale(filters);
    if (grain === "monthly") {
      const set25 = rawSnapshot.copartMonthly.find((row) => row.year === 2025)!;
      const set26 = copartSep2026();
      const spend = scaleMoney(sum(rawSnapshot.campaigns.map((row) => row.spend)), m);
      return [
        { period: "Set/25", platform: "Habilitados", entrantes: set25.entrantes, habilitados: set25.habilitados, gasto: 0 },
        {
          period: "Ago/26",
          platform: "Habilitados",
          entrantes: scaleNumber(cadastroSite(), m),
          habilitados: scaleNumber(cadastroSite() * HIST_HAB_RATE, m),
          gasto: spend,
        },
        { period: "Set/26", platform: "Habilitados", entrantes: set26.entrantes, habilitados: set26.habilitados, gasto: 0 },
      ];
    }
    const weeks = await this.getWeeklyRegistrations(filters);
    return weeks.map((week) => ({
      period: week.week,
      platform: "Cadastro (GA4)",
      entrantes: week.entrantes,
      habilitados: week.habilitados,
      gasto: 0,
    }));
  }

  async getCreatives(filters: DashboardFilters): Promise<CreativePiece[]> {
    const m = mediaScale(filters);
    return rawSnapshot.creatives
      .filter((row) => filters.campaignType === "ALL" || row.unit === filters.campaignType)
      .filter((row) => {
        if (filters.channel === "ALL") return true;
        if (filters.channel === "META") return row.source === "meta";
        if (filters.channel === "GOOGLE") return row.source === "google";
        return false;
      })
      .filter((row) => filters.funnel === "ALL" || unitMatchesFunnel(row.unit, filters.funnel))
      .map((row) => {
        const spend = scaleMoney(row.spend, m);
        const impressions = scaleNumber(row.impressions, m);
        const clicks = scaleNumber(row.clicks, m);
        return {
          ...row,
          channel: (row.source === "meta" ? "META" : "GOOGLE") as Channel,
          spend,
          impressions,
          reach: scaleNumber(row.reach, m),
          clicks,
          ctr: impressions === 0 ? 0 : row.ctr || (clicks / impressions) * 100,
          resultsCadastro: scaleNumber(row.resultsCadastro, m),
          resultsLanding: scaleNumber(row.resultsLanding, m),
          conversas: scaleNumber(row.conversas, m),
          conversions: Math.round(row.conversions * m * 100) / 100,
        };
      })
      .sort((a, b) => b.spend - a.spend);
  }
}
