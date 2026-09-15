import type { DashboardFilters, Channel, CampaignType, FunnelKey } from "@/lib/data/types";
import { DEFAULT_DATE_RANGE, GEO_WEIGHTS } from "@/lib/constants";

export type SearchParamRecord = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const UNITS: CampaignType[] = ["leilao_compra", "select_venda", "select_compra"];
const FUNNELS: FunnelKey[] = ["leilao", "select_venda", "select_compra"];
const CHANNELS: Channel[] = [
  "META",
  "GOOGLE",
  "TIKTOK",
  "ORGANIC",
  "DIRECT",
  "RD_STATION",
  "BLIP",
];

export function parseDashboardFilters(params: SearchParamRecord = {}): DashboardFilters {
  const unit = first(params.unit);
  const funnel = first(params.funnel);
  const channel = first(params.channel);
  const period = first(params.period);

  return {
    dateRange: {
      start: first(params.start) || DEFAULT_DATE_RANGE.start,
      end: first(params.end) || DEFAULT_DATE_RANGE.end,
    },
    channel: CHANNELS.includes(channel as Channel) ? (channel as Channel) : "ALL",
    campaignType: UNITS.includes(unit as CampaignType) ? (unit as CampaignType) : "ALL",
    campaign: first(params.campaign) || "ALL",
    funnel: FUNNELS.includes(funnel as FunnelKey) ? (funnel as FunnelKey) : "ALL",
    geo: first(params.geo) || "ALL",
    period: period === "daily" || period === "monthly" ? period : "weekly",
  };
}

export function daysInRange(start: string, end: string): number {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1);
}

export function overlapDays(start: string, end: string, srcStart: string, srcEnd: string): number {
  const a = Math.max(new Date(`${start}T00:00:00`).getTime(), new Date(`${srcStart}T00:00:00`).getTime());
  const b = Math.min(new Date(`${end}T00:00:00`).getTime(), new Date(`${srcEnd}T00:00:00`).getTime());
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86_400_000) + 1;
}

export function coverageScale(
  filters: DashboardFilters,
  srcStart: string,
  srcEnd: string,
  srcDays: number
): number {
  const days = overlapDays(filters.dateRange.start, filters.dateRange.end, srcStart, srcEnd);
  const geoScale = GEO_WEIGHTS[filters.geo] ?? 1;
  return (days / Math.max(srcDays, 1)) * geoScale;
}

export function filterScale(filters: DashboardFilters): number {
  const dayScale = daysInRange(filters.dateRange.start, filters.dateRange.end) / 7;
  const geoScale = GEO_WEIGHTS[filters.geo] ?? 1;
  return dayScale * geoScale;
}

export function scaleNumber(value: number, scale: number): number {
  return Math.round(value * scale);
}

export function formatDateRangeLabel(start: string, end: string): string {
  const [ys, ms, ds] = start.split("-");
  const [ye, me, de] = end.split("-");
  return `${ds}/${ms}${ys !== ye ? `/${ys}` : ""} – ${de}/${me}/${ye}`;
}

export function unitMatchesFunnel(
  unit: CampaignType | "ALL",
  type: FunnelKey
): boolean {
  if (unit === "ALL") return true;
  if (type === "leilao") return unit === "leilao_compra";
  return unit === type;
}
