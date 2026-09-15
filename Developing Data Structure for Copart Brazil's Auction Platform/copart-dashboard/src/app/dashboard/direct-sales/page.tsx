import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { ChannelPerformanceTable } from "@/components/tables/channel-performance-table";
import { dataService } from "@/lib/data/data-service";
import { COLORS, LEAD_QUALIFICATION_DEFINITION } from "@/lib/constants";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { formatNumberFull } from "@/lib/utils/formatters";
import { Car, ShoppingBag } from "lucide-react";

export const metadata = { title: "Copart Select — BI Dashboard" };

export default async function CopartSelectPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [funnelVender, funnelComprar, perfVender, perfComprar] = await Promise.all([
    dataService.getFunnelData("select_venda", filters),
    dataService.getFunnelData("select_compra", filters),
    dataService.getChannelPerformance("select_venda", { ...filters, campaignType: "select_venda" }),
    dataService.getChannelPerformance("select_compra", { ...filters, campaignType: "select_compra" }),
  ]);

  const captados = funnelVender.stages.at(-1)?.value ?? 0;
  const vendidos = funnelComprar.stages.at(-1)?.value ?? 0;

  return (
    <>
      <PageHeader
        title="Copart Select"
        subtitle="Funil Select/Venda e Funil Select/Compra — jornadas e investimentos independentes"
        badge="Executivo Select"
        badgeColor="#00a85a"
      />
      <PageContent>
        <div className="mb-6 rounded-2xl border border-[#dfe6ee] bg-[#f8fbff] p-4 text-sm text-[#344255]">
          {LEAD_QUALIFICATION_DEFINITION}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#6c7685]">Veículos Captados</span>
              <Car className="w-4 h-4 text-[#00a85a]" />
            </div>
            <p className="text-3xl font-black text-[#0b1f3a]">{formatNumberFull(captados)}</p>
            <p className="text-xs text-[#6c7685] mt-1">Funil Select/Venda</p>
          </div>
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#6c7685]">Veículos Vendidos</span>
              <ShoppingBag className="w-4 h-4 text-[#00b8cf]" />
            </div>
            <p className="text-3xl font-black text-[#0b1f3a]">{formatNumberFull(vendidos)}</p>
            <p className="text-xs text-[#6c7685] mt-1">Funil Select/Compra</p>
          </div>
        </div>

        <SectionTitle>Funil Select</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <CardWrapper title="Select/Venda" subtitle="Até veículo captado">
            <FunnelChart stages={funnelVender.stages} primaryColor={COLORS.green} />
          </CardWrapper>
          <CardWrapper title="Select/Compra" subtitle="Até veículo vendido">
            <FunnelChart stages={funnelComprar.stages} primaryColor={COLORS.teal} />
          </CardWrapper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <SectionTitle>Canais — Select/Venda</SectionTitle>
            <ChannelPerformanceTable rows={perfVender} volumeLabel="Cliques" convertedLabel="Conversas" />
          </div>
          <div>
            <SectionTitle>Canais — Select/Compra</SectionTitle>
            <ChannelPerformanceTable rows={perfComprar} volumeLabel="Cliques" convertedLabel="Propostas" />
          </div>
        </div>
      </PageContent>
    </>
  );
}
