import { PageHeader, PageContent, SectionTitle } from "@/components/layout/page-header";
import { CampaignTable } from "@/components/tables/campaign-table";
import { KpiCard } from "@/components/cards/kpi-card";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { formatBRL, formatNumberFull, formatPercentage } from "@/lib/utils/formatters";

export const metadata = { title: "Performance Diária — Copart BI" };

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const scorecards = await dataService.getCampaignScorecards(filters);
  const entrantes = scorecards.reduce((s, r) => s + r.entrantes, 0);
  const habilitados = scorecards.reduce((s, r) => s + (r.habilitados ?? 0), 0);
  const spend = scorecards.reduce((s, r) => s + r.spend, 0);

  return (
    <>
      <PageHeader
        title="Performance Diária"
        subtitle="Scorecard de campanhas no recorte filtrado"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        <SectionTitle>Resumo do recorte</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard title="Entrantes" value={formatNumberFull(entrantes)} />
          <KpiCard title="Habilitados" value={formatNumberFull(habilitados)} />
          <KpiCard title="Taxa de habilitação" value={formatPercentage(entrantes ? (habilitados / entrantes) * 100 : 0)} />
          <KpiCard title="Gasto total" value={formatBRL(spend)} />
        </div>
        <SectionTitle>Scorecard de campanhas</SectionTitle>
        <div className="overflow-x-auto">
          <CampaignTable data={scorecards} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-[#6c7685]">
          <span className="font-bold">Legenda:</span>
          <span>No alvo — dentro do esperado</span>
          <span>Abaixo da meta — &lt;90% da meta</span>
          <span>Crítico — abaixo de 70% da meta</span>
        </div>
      </PageContent>
    </>
  );
}
