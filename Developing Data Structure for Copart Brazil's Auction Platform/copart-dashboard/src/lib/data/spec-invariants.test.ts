import { describe, expect, it } from "vitest";
import { RawExportDataService } from "@/lib/data/raw-data";
import { classifyCampaignUnit } from "@/lib/data/campaign-unit";
import {
  FORBIDDEN_COPY,
  LEILAO_FUNNEL_STAGES,
  SELECT_COMPRA_LAST_STAGE,
  SELECT_VENDA_LAST_STAGE,
  USER_FACING_LABELS,
} from "@/lib/constants";
import { assertNoForbiddenCopy, isMonotonicFunnel, totalChannelPerformance } from "@/lib/aggregations";
import { parseDashboardFilters } from "@/lib/filters";

const service = new RawExportDataService();

const week = parseDashboardFilters({
  start: "2026-08-01",
  end: "2026-08-07",
});

const month = parseDashboardFilters({
  start: "2026-08-01",
  end: "2026-08-31",
  unit: "leilao_compra",
});

describe("nomenclatura", () => {
  it("não usa copy proibida em labels user-facing", () => {
    expect(assertNoForbiddenCopy(USER_FACING_LABELS, FORBIDDEN_COPY)).toEqual([]);
  });
});

describe("origem", () => {
  it("declara extrações reais, não mock", () => {
    expect(service.getDataOrigin()).toBe("weekly_report");
  });
});

describe("classificação de campanha", () => {
  it("separa Leilão, Select/Venda e Select/Compra", () => {
    expect(classifyCampaignUnit("[Binder][Cadastro]Leilão")).toBe("leilao_compra");
    expect(classifyCampaignUnit("[Binder][Whats][Vender]")).toBe("select_venda");
    expect(classifyCampaignUnit("[Binder][Tráfego][Compra]")).toBe("select_compra");
    expect(classifyCampaignUnit("VENDA DIRETA | …", "VENDA")).toBe("select_venda");
    expect(classifyCampaignUnit("VENDA DIRETA | …", "COMPRA")).toBe("select_compra");
    expect(classifyCampaignUnit("VENDA DIRETA | … | COMPRA", "[FRASE]")).toBe("select_compra");
  });
});

describe("funis", () => {
  it("Funil Leilão tem 4 etapas canônicas e é monotônico", async () => {
    const funnel = await service.getFunnelData("leilao", week);
    expect(funnel.stages.map((s) => s.label)).toEqual([...LEILAO_FUNNEL_STAGES]);
    expect(isMonotonicFunnel(funnel.stages)).toBe(true);
  });

  it("Select termina em captados e vendidos", async () => {
    const venda = await service.getFunnelData("select_venda", week);
    const compra = await service.getFunnelData("select_compra", week);
    expect(venda.stages.at(-1)?.label).toBe(SELECT_VENDA_LAST_STAGE);
    expect(compra.stages.at(-1)?.label).toBe(SELECT_COMPRA_LAST_STAGE);
    expect(isMonotonicFunnel(venda.stages)).toBe(true);
    expect(isMonotonicFunnel(compra.stages)).toBe(true);
  });
});

describe("isolamento de investimento", () => {
  it("performance de Leilão/Compra não mistura Select", async () => {
    const rows = await service.getChannelPerformance("leilao", week);
    expect(rows.every((r) => r.unit === "leilao_compra")).toBe(true);
    expect(rows.some((r) => r.channel.includes("Blip"))).toBe(false);
  });

  it("spend Leilão e Select são conjuntos distintos", async () => {
    const leilao = await service.getChannelPerformance("leilao", week);
    const selectVenda = await service.getChannelPerformance("select_venda", week);
    const selectCompra = await service.getChannelPerformance("select_compra", week);
    const spendLeilao = leilao.reduce((s, r) => s + r.gasto, 0);
    const spendSelect = selectVenda.reduce((s, r) => s + r.gasto, 0) + selectCompra.reduce((s, r) => s + r.gasto, 0);
    expect(spendLeilao).toBeGreaterThan(0);
    expect(spendSelect).toBeGreaterThan(0);
    expect(spendLeilao).not.toBe(spendSelect);
  });
});

describe("filtros", () => {
  it("alterar dateRange muda o payload", async () => {
    const weekFunnel = await service.getFunnelData("leilao", week);
    const monthFunnel = await service.getFunnelData("leilao", month);
    expect(weekFunnel.stages[0].value).not.toBe(monthFunnel.stages[0].value);
  });

  it("alterar unidade muda scorecards", async () => {
    const all = await service.getCampaignScorecards(week);
    const leilao = await service.getCampaignScorecards({ ...week, campaignType: "leilao_compra" });
    expect(leilao.length).toBeLessThan(all.length);
    expect(leilao.every((c) => c.campaign_type === "leilao_compra")).toBe(true);
  });
});

describe("totais", () => {
  it("TOTAL da tabela é a soma das linhas", async () => {
    const rows = await service.getChannelPerformance("leilao", week);
    const total = totalChannelPerformance(rows);
    expect(total.entrantes).toBe(rows.reduce((s, r) => s + r.entrantes, 0));
    expect(total.gasto).toBe(rows.reduce((s, r) => s + r.gasto, 0));
    expect(total.custo_por_entrante).toBeCloseTo(total.gasto / total.entrantes);
  });
});

describe("CRM split", () => {
  it("metas expõem RD Station e Blip, sem CRM genérico", async () => {
    const { channels } = await service.getChannelGoals(week);
    const labels = channels.map((c) => c.channelLabel);
    expect(labels).toContain("RD Station");
    expect(labels).toContain("Blip (WhatsApp)");
    expect(labels.some((l) => l === "CRM")).toBe(false);
  });
});

describe("mix e eficiência de mídia", () => {
  const fullMonth = parseDashboardFilters({
    start: "2026-08-01",
    end: "2026-08-31",
  });

  it("Direct + orgânico superam pago nas sessões e os buckets somam 100%", async () => {
    const mix = await service.getTrafficMix(fullMonth);
    const owned = mix.filter((b) => b.id === "direct" || b.id === "organic").reduce((s, b) => s + b.shareSessions, 0);
    const paid = mix.find((b) => b.id === "paid")?.shareSessions ?? 0;
    const total = mix.reduce((s, b) => s + b.shareSessions, 0);
    expect(owned).toBeGreaterThan(paid);
    expect(total).toBeCloseTo(100, 0);
  });

  it("eficiência de Leilão não inclui spend Select", async () => {
    const leilao = await service.getMediaEfficiency({ ...fullMonth, campaignType: "leilao_compra" });
    const selectVenda = await service.getMediaEfficiency({ ...fullMonth, campaignType: "select_venda" });
    expect(leilao.every((row) => row.unit === "leilao_compra")).toBe(true);
    expect(selectVenda.every((row) => row.unit === "select_venda")).toBe(true);
    const spendLeilao = leilao.reduce((s, r) => s + r.spend, 0);
    const spendSelect = selectVenda.reduce((s, r) => s + r.spend, 0);
    expect(spendLeilao).toBeGreaterThan(0);
    expect(spendSelect).toBeGreaterThan(0);
    expect(spendLeilao).not.toBe(spendSelect);
    const funnel = await service.getChannelPerformance("leilao", { ...fullMonth, campaignType: "leilao_compra" });
    expect(spendLeilao).toBeCloseTo(funnel.reduce((s, r) => s + r.gasto, 0), 0);
  });

  it("ranking de volume coloca Direto acima de Meta Ads", async () => {
    const ranking = await service.getVolumeRanking(fullMonth);
    expect(ranking[0]?.channel).toBe("Direto");
    const direto = ranking.find((row) => row.channel === "Direto")?.entrantes ?? 0;
    const socialPago = ranking.find((row) => row.channel === "Social pago")?.entrantes ?? 0;
    expect(direto).toBeGreaterThan(socialPago);
    const funnel = await service.getChannelPerformance("leilao", fullMonth);
    expect(funnel[0]?.channel).toBe("Direto");
    const meta = funnel.find((row) => row.channel === "Meta Ads");
    expect(funnel[0]?.entrantes ?? 0).toBeGreaterThan(meta?.entrantes ?? 0);
  });
});

describe("criativos", () => {
  it("não duplica gasto Meta por indicador de resultado", async () => {
    const ads = await service.getCreatives(month);
    const ad1 = ads.find((row) => row.id === "meta-1");
    expect(ad1?.spend).toBeCloseTo(3188.76);
    expect(ad1?.resultsCadastro).toBeGreaterThan(0);
    expect(ad1?.resultsLanding).toBeGreaterThan(ad1?.resultsCadastro ?? 0);
  });

  it("ignora totais Google sem campanha e não mistura unidades", async () => {
    const ads = await service.getCreatives(month);
    const google = ads.filter((row) => row.source === "google");
    expect(google.length).toBeGreaterThan(0);
    expect(google.every((row) => row.campaign.length > 0 && row.adType.length > 0)).toBe(true);
    const spend = google.reduce((sum, row) => sum + row.spend, 0);
    expect(spend).toBeGreaterThan(10000);
    expect(spend).toBeLessThan(30000);
  });

  it("filtra por canal e unidade", async () => {
    const meta = await service.getCreatives({ ...month, channel: "META" });
    const google = await service.getCreatives({ ...month, channel: "GOOGLE" });
    const leilao = await service.getCreatives({ ...month, campaignType: "leilao_compra" });
    expect(meta.every((row) => row.source === "meta")).toBe(true);
    expect(google.every((row) => row.source === "google")).toBe(true);
    expect(leilao.every((row) => row.unit === "leilao_compra")).toBe(true);
    expect(meta.length).toBeGreaterThan(0);
    expect(google.length).toBeGreaterThan(0);
  });

  it("[FRASE] em campanha de compra não vira Select/Venda", async () => {
    const ads = await service.getCreatives({ ...month, campaignType: "ALL" });
    const google124 = ads.find((row) => row.id === "google-124");
    expect(google124?.adGroup).toBe("[FRASE]");
    expect(google124?.campaign).toMatch(/COMPRA/);
    expect(google124?.unit).toBe("select_compra");
  });
});

describe("jornadas e evolução", () => {
  it("padrões de jornada não repetem canal", async () => {
    const insights = await service.getJourneyInsights(week);
    const patterns = insights.frequent.map((row) => row.pattern);
    const channels = insights.channelShare.map((row) => row.channel);
    expect(new Set(patterns).size).toBe(patterns.length);
    expect(new Set(channels).size).toBe(channels.length);
  });

  it("evolução mensal usa totais reais, sem fatiar por plataforma inventada", async () => {
    const monthly = await service.getKpiEvolution(week, "monthly");
    const set25 = monthly.find((p) => p.period === "Set/25");
    expect(set25?.habilitados).toBe(11000);
    expect(monthly.filter((p) => p.period === "Set/25")).toHaveLength(1);
  });

  it("evolução semanal tem uma série só", async () => {
    const weekly = await service.getKpiEvolution(month, "weekly");
    const platforms = [...new Set(weekly.map((p) => p.platform))];
    expect(platforms).toEqual(["Cadastro (GA4)"]);
    expect(weekly.length).toBeGreaterThan(1);
  });
});
