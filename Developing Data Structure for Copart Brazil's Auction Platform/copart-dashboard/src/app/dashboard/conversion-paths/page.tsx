import { PageHeader, PageContent, SectionTitle } from "@/components/layout/page-header";
import { ConversionPathList } from "@/components/cards/conversion-path-list";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { formatNumberFull, formatPercentage } from "@/lib/utils/formatters";

export const metadata = {
  title: "Jornada de Conversão — Copart BI Dashboard",
};

export default async function ConversionPathsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [allPaths, insights] = await Promise.all([
    dataService.getConversionPaths({
      conversionType: "ALL",
      channelInPath: "ALL",
      minTouchpoints: 0,
      maxTouchpoints: 20,
      dateRange: filters.dateRange,
    }),
    dataService.getJourneyInsights(filters),
  ]);

  return (
    <>
      <PageHeader
        title="Jornada de Conversão"
        subtitle="Padrões, habilitados e participação de canal no recorte"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Jornadas", value: formatNumberFull(insights.totalJourneys) },
            { label: "Habilitados na jornada", value: formatNumberFull(insights.habilitados) },
            { label: "Taxa de habilitação", value: formatPercentage(insights.taxaHabilitacao) },
            { label: "Touchpoints médios", value: insights.avgTouchpoints.toFixed(1).replace(".", ",") },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#6c7685] mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-[#0b1f3a]">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <h3 className="text-sm font-black text-[#0b1f3a] mb-3">Padrões mais frequentes</h3>
            <ol className="space-y-2">
              {insights.frequent.map((row, i) => (
                <li key={`freq-${row.pattern}-${i}`} className="text-sm text-[#344255]">
                  <span className="font-black text-[#0b1f3a] mr-2">{i + 1}.</span>
                  {row.pattern} <span className="text-[#6c7685]">({row.count})</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <h3 className="text-sm font-black text-[#0b1f3a] mb-3">Padrões que mais geram habilitados</h3>
            <ol className="space-y-2">
              {insights.byHabilitados.map((row, i) => (
                <li key={`hab-${row.pattern}-${i}`} className="text-sm text-[#344255]">
                  <span className="font-black text-[#0b1f3a] mr-2">{i + 1}.</span>
                  {row.pattern} <span className="text-[#00a85a] font-bold">({row.habilitados} hab.)</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <SectionTitle>Participação de canal nas jornadas</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {insights.channelShare.map((row, i) => (
            <div key={`${row.channel}-${i}`} className="bg-white border border-[#dfe6ee] rounded-2xl p-4">
              <p className="text-sm font-black text-[#0b1f3a]">{row.channel}</p>
              <p className="text-xs text-[#6c7685] mt-1">
                {row.journeys} jornadas ({formatPercentage(row.share)}) · {row.appearances} aparições
              </p>
            </div>
          ))}
        </div>

        <SectionTitle>Jornadas individuais</SectionTitle>
        <ConversionPathList paths={allPaths} />
      </PageContent>
    </>
  );
}
