import { PageHeader, PageContent, SectionTitle } from "@/components/layout/page-header";
import { BrazilHeatMap } from "@/components/charts/brazil-heatmap";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { formatBRL, formatNumberFull, formatPercentage } from "@/lib/utils/formatters";

export const metadata = { title: "Análise Regional — Copart BI" };

export default async function RegionalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const rows = await dataService.getRegionalPerformance(filters);

  return (
    <>
      <PageHeader
        title="Análise Regional"
        subtitle="Rateio nacional por UF — esta carga GA4 não veio com estado, só país"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BrazilHeatMap rows={rows} />
          <div className="space-y-3">
            <SectionTitle>Ranking por UF</SectionTitle>
            {rows.map((row) => (
              <div key={row.geo} className="bg-white border border-[#dfe6ee] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-black text-[#0b1f3a]">{row.label}</p>
                  <p className="text-xs text-[#6c7685]">{formatPercentage(row.taxa_habilitacao)} de habilitação</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#0b1f3a]">{formatNumberFull(row.entrantes)} ent.</p>
                  <p className="text-xs text-[#6c7685]">{formatBRL(row.gasto)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </>
  );
}
