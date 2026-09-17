import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { EvolutionChart } from "@/components/charts/evolution-chart";
import { ChannelPerformanceTable } from "@/components/tables/channel-performance-table";
import { PaidMediaEvents } from "@/components/cards/paid-media-events";
import { GoogleQuarterly } from "@/components/cards/google-quarterly";
import { KpiCard } from "@/components/cards/kpi-card";
import { InfoTip } from "@/components/layout/info-tip";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";
import { filtersFromSearchParams } from "@/lib/page-filters";
import { formatDateRangeLabel } from "@/lib/filters";
import type { SearchParamRecord } from "@/lib/filters";
import { formatNumberFull, formatPercentage } from "@/lib/utils/formatters";

export const metadata = { title: "Funil Leilão — Copart BI" };

export default async function FunnelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const leilaoFilters = { ...filters, campaignType: "leilao_compra" as const };
  const [funnelData, channelPerf, series, paidEvents, googleQuarterly, kpis] = await Promise.all([
    dataService.getFunnelData("leilao", filters),
    dataService.getChannelPerformance("leilao", leilaoFilters),
    dataService.getEvolutionSeries(filters),
    dataService.getPaidMediaEvents(filters),
    dataService.getGoogleQuarterly(leilaoFilters),
    dataService.getOverviewKPIs(filters),
  ]);

  const period = formatDateRangeLabel(filters.dateRange.start, filters.dateRange.end);
  const pageViews = funnelData.pageViews ?? 0;
  const entrantes = funnelData.stages[0]?.value ?? 0;
  const toEntrantes = pageViews === 0 ? 0 : (entrantes / pageViews) * 100;
  const siteKpis = [
    { key: "visitantesUnicos", data: kpis.visitantesUnicos, insights: ["Usuários únicos GA4, site inteiro"] },
    { key: "logins", data: kpis.logins, insights: ["Evento sign_in do Resumo GA4 de agosto"] },
    { key: "favoritados", data: kpis.favoritados, insights: ["Favoritar lote — intenção, fora do funil Copart"] },
    { key: "registrationStart", data: kpis.registrationStart, insights: ["Início de cadastro GA4. Distinto de Entrante Copart."] },
  ];

  return (
    <>
      <PageHeader
        title="Funil Leilão"
        subtitle={`Leilão/Compra — ${period}`}
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <CardWrapper title="Topo do site e funil Copart">
            <div className="rounded-2xl border border-[#dfe6ee] bg-[#f8fbff] p-4 mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#6c7685]">
                  Page Views
                  <InfoTip text="Evento page_view do GA4, site inteiro, recorte de mídia ago/2026. Não é view de um leilão específico do Excel Macro." />
                </p>
                <p className="text-2xl font-black text-[#0b1f3a]">{formatNumberFull(pageViews)}</p>
              </div>
              <p className="text-xs font-bold text-[#6c7685]">{formatPercentage(toEntrantes)} até entrantes</p>
            </div>
            <FunnelChart stages={funnelData.stages} primaryColor={COLORS.teal} />
          </CardWrapper>
          <CardWrapper title="Evolução">
            <EvolutionChart points={series} />
          </CardWrapper>
        </div>

        <SectionTitle>Diagnóstico de site</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {siteKpis.map(({ key, data, insights }) => (
            <KpiCard
              key={key}
              title={data.label}
              value={data.formatted}
              delta={data.delta}
              deltaFormatted={data.deltaFormatted}
              deltaType={data.deltaType}
              period={data.period}
              insights={insights}
            />
          ))}
        </div>

        <PaidMediaEvents
          report={paidEvents}
          featured={["cadastro_site", "register_to_bid", "click_bid_now", "sign_in"]}
          channelEvents={["cadastro_site", "register_to_bid", "click_bid_now", "sign_in"]}
        />
        <GoogleQuarterly report={googleQuarterly} />

        <SectionTitle>
          Performance por canal — Leilão/Compra
          <InfoTip text="Ordenado por volume. Gasto zero em Direto e Orgânico = sem spend de mídia nesta carga. Meta usa cadastro do pixel; Google usa conversões da conta; Direto/Orgânico rateiam cadastro_site pelo first-touch." />
        </SectionTitle>
        <div className="mb-8">
          <ChannelPerformanceTable rows={channelPerf} />
        </div>
      </PageContent>
    </>
  );
}
