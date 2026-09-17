import { PageHeader, PageContent } from "@/components/layout/page-header";
import { RegionalExplorer } from "@/components/charts/regional-explorer";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { InfoTip } from "@/components/layout/info-tip";

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
        subtitle="Copart Excel set/2026 — 27 UFs, SC e GO inclusos. GA4 desta carga não tem estado."
        badge="Executivo"
        badgeColor="#153a73"
        actions={<InfoTip text="Entrantes/habilitados por UF vêm do Excel Copart (semanas 30/08–05/09 e 06/09–12/09). UFs ausentes no arquivo ficam zero. Outros e Sem UF (Vazias) não entram no mapa, só no ranking. Per capita usa população IBGE 2024." />}
      />
      <PageContent>
        <RegionalExplorer rows={rows} />
      </PageContent>
    </>
  );
}
