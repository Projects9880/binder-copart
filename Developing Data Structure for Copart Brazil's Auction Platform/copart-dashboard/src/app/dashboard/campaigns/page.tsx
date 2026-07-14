import { PageHeader, PageContent, SectionTitle } from "@/components/layout/page-header";
import { CampaignTable } from "@/components/tables/campaign-table";
import { KpiCard } from "@/components/cards/kpi-card";
import { dataService } from "@/lib/data/data-service";

export const metadata = { title: "Performance Diária — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-07-04", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "ALL" as const,
  geo: "ALL",
  period: "daily" as const,
};

export default async function CampaignsPage() {
  const scorecards = await dataService.getCampaignScorecards(defaultFilters);

  const wowKpis = [
    { title: "Entrantes (Hoje)", value: "815", delta: 4.5, deltaFormatted: "+4,5%", deltaType: "good" as const, period: "vs semana passada (780)" },
    { title: "Habilitados (Hoje)", value: "445", delta: 6.0, deltaFormatted: "+6,0%", deltaType: "good" as const, period: "vs semana passada (420)" },
    { title: "Taxa de Habilitação", value: "54,6%", delta: 0.8, deltaFormatted: "+0,8pp", deltaType: "good" as const, period: "vs semana passada (53,8%)" },
    { title: "Gasto Total (R$)", value: "R$ 27.210", delta: -3.2, deltaFormatted: "-3,2%", deltaType: "good" as const, period: "vs semana passada" },
  ];

  return (
    <>
      <PageHeader
        title="Performance Diária"
        subtitle="Scorecard de campanhas — 04 de Julho de 2026"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        {/* WoW KPIs */}
        <SectionTitle>Comparativo WoW (Semana vs Semana)</SectionTitle>
        <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
          {wowKpis.map((kpi) => (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              delta={kpi.delta}
              deltaFormatted={kpi.deltaFormatted}
              deltaType={kpi.deltaType}
              period={kpi.period}
            />
          ))}
        </div>

        {/* Scorecard table */}
        <SectionTitle>Scorecard de Campanhas</SectionTitle>
        <CampaignTable data={scorecards} />

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs text-[#6c7685]">
          <span className="font-bold">Legenda de Status:</span>
          <span>✅ No target — Métrica dentro do esperado</span>
          <span>⚠️ Below target — Abaixo do esperado (&lt;90% da meta)</span>
          <span>🔴 Crítico — Abaixo de 70% da meta</span>
        </div>
      </PageContent>
    </>
  );
}
