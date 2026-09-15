import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { LineChart } from "@/components/charts/line-chart";
import { ChannelPerformanceTable } from "@/components/tables/channel-performance-table";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";
import { filtersFromSearchParams } from "@/lib/page-filters";
import { formatDateRangeLabel } from "@/lib/filters";
import type { SearchParamRecord } from "@/lib/filters";

export const metadata = { title: "Funil Leilão — Copart BI" };

export default async function FunnelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [funnelData, channelPerf, trendData, weekly] = await Promise.all([
    dataService.getFunnelData("leilao", filters),
    dataService.getChannelPerformance("leilao", { ...filters, campaignType: "leilao_compra" }),
    dataService.getTrendData("entrantes", 31, filters),
    dataService.getWeeklyRegistrations(filters),
  ]);

  const period = formatDateRangeLabel(filters.dateRange.start, filters.dateRange.end);

  return (
    <>
      <PageHeader
        title="Funil Leilão"
        subtitle="Leilão/Compra — Entrantes → Habilitados → Licitantes → Arrematantes"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <CardWrapper title={`Funil visual — ${period}`}>
            <FunnelChart stages={funnelData.stages} primaryColor={COLORS.teal} />
          </CardWrapper>
          <CardWrapper title="Cadastros estimados por dia (GA4)">
            <LineChart
              labels={trendData.map((d) => `${d.date.slice(8)}/${d.date.slice(5, 7)}`)}
              datasets={[{
                label: "Cadastro (GA4)",
                data: trendData.map((d) => d.value),
                color: COLORS.teal,
                fill: true,
              }]}
              valueFormatter="number"
              height={280}
            />
          </CardWrapper>
        </div>

        <SectionTitle>Performance por canal — Leilão/Compra</SectionTitle>
        <p className="text-xs text-[#6c7685] -mt-2 mb-4">
          Ordenado por volume. Gasto zero em Direto e Orgânico significa sem spend de mídia nesta carga — não que o canal seja de graça no negócio. Meta usa cadastro do pixel; Google usa conversões da conta; Direto/Orgânico rateiam cadastro_site pelo first-touch.
        </p>
        <div className="mb-8">
          <ChannelPerformanceTable rows={channelPerf} />
        </div>

        <SectionTitle>Cadastros estimados por semana (GA4)</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {weekly.map((row) => (
            <div key={row.week} className="bg-white border border-[#dfe6ee] rounded-xl p-4 text-center">
              <p className="text-xs text-[#6c7685] font-semibold mb-2">{row.week}</p>
              <p className="text-2xl font-black text-[#0b1f3a]">{row.entrantes.toLocaleString("pt-BR")}</p>
            </div>
          ))}
        </div>
      </PageContent>
    </>
  );
}
