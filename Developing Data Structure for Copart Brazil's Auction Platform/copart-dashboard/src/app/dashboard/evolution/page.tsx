import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { LineChart } from "@/components/charts/line-chart";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { COLORS } from "@/lib/constants";

export const metadata = { title: "Evolução de KPIs — Copart BI" };

export default async function EvolutionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [weekly, monthly] = await Promise.all([
    dataService.getKpiEvolution(filters, "weekly"),
    dataService.getKpiEvolution(filters, "monthly"),
  ]);

  const weeklyLabels = Array.from(new Set(weekly.map((p) => p.period)));
  const monthlyLabels = Array.from(new Set(monthly.map((p) => p.period)));
  const palette = [COLORS.teal, COLORS.blue, COLORS.green, "#25d366"];

  return (
    <>
      <PageHeader
        title="Evolução"
        subtitle="Série real desta carga — cadastro GA4 por semana e habilitados Copart/GA4 por mês"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <SectionTitle>Semanal — cadastros estimados (GA4)</SectionTitle>
        <CardWrapper className="mb-8">
          <LineChart
            labels={weeklyLabels}
            datasets={Array.from(new Set(weekly.map((p) => p.platform))).map((platform, i) => ({
              label: platform,
              data: weeklyLabels.map((period) => weekly.find((p) => p.period === period && p.platform === platform)?.entrantes ?? 0),
              color: palette[i % palette.length],
            }))}
            height={280}
          />
          <p className="text-xs text-[#6c7685] mt-3">A semana 29/08–31/08 tem só 3 dias; o volume cai porque o recorte é menor, não porque o canal caiu.</p>
        </CardWrapper>
        <SectionTitle>Mensal — habilitados</SectionTitle>
        <CardWrapper>
          <LineChart
            labels={monthlyLabels}
            datasets={Array.from(new Set(monthly.map((p) => p.platform))).map((platform, i) => ({
              label: platform,
              data: monthlyLabels.map((period) => monthly.find((p) => p.period === period && p.platform === platform)?.habilitados ?? 0),
              color: palette[i % palette.length],
            }))}
            height={280}
          />
          <p className="text-xs text-[#6c7685] mt-3">Set/25 e set/26 vêm do Copart ERP. Ago/26 usa cadastro_site do GA4 × taxa Copart — não há habilitados oficiais de agosto nesta carga.</p>
        </CardWrapper>
      </PageContent>
    </>
  );
}
