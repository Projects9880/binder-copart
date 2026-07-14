import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Venda/Compra Direta — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-06-28", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "venda_direta" as const,
  geo: "ALL",
  period: "weekly" as const,
};

export default async function DirectSalesPage() {
  const [funnelData, channelPerf] = await Promise.all([
    dataService.getFunnelData("venda_direta", defaultFilters),
    dataService.getChannelPerformance("venda_direta", defaultFilters),
  ]);

  const qualityData = {
    labels: ["Qualificados", "Não Qualificados"],
    values: [1428, 952],
    colors: [COLORS.green, COLORS.red],
  };

  return (
    <>
      <PageHeader
        title="Venda / Compra Direta"
        subtitle="Cliques CTA → Conversas → Contatos Qualificados → Leads"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <CardWrapper title="Funil de Venda Direta">
            <FunnelChart stages={funnelData.stages} primaryColor={COLORS.green} />
          </CardWrapper>

          <CardWrapper title="Qualidade de Contatos — Junho">
            <BarChart
              labels={qualityData.labels}
              datasets={[{
                label: "Contatos",
                data: qualityData.values,
                color: qualityData.colors,
              }]}
              valueFormatter="number"
              height={280}
            />
            <div className="mt-4 pt-4 border-t border-[#dfe6ee] grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-black text-[#00a85a]">1.428</p>
                <p className="text-xs text-[#6c7685] font-semibold">Qualificados (60%)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[#cf3044]">952</p>
                <p className="text-xs text-[#6c7685] font-semibold">Não Qualificados (40%)</p>
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* VD Lead highlight */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#00a85a] to-[#14c79a] rounded-2xl p-5 text-white">
            <p className="text-sm font-bold opacity-80 mb-1">Leads VD — Semana</p>
            <p className="text-4xl font-black">546</p>
            <p className="text-sm font-bold mt-2 opacity-90">+11,4% vs semana anterior</p>
          </div>
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685] mb-1">Taxa de Conversão</p>
            <p className="text-4xl font-black text-[#0b1f3a]">85,0%</p>
            <p className="text-sm text-[#6c7685] mt-2">Cliques → Conversas</p>
          </div>
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685] mb-1">Custo / Conversa</p>
            <p className="text-4xl font-black text-[#0b1f3a]">R$ 7,60</p>
            <p className="text-sm text-[#6c7685] mt-2">Média Meta + WhatsApp</p>
          </div>
        </div>

        {/* Table */}
        <SectionTitle>Performance por Canal — Venda Direta</SectionTitle>
        <div className="rounded-2xl border border-[#dfe6ee] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                {["Canal", "Cliques", "Conversas", "Taxa Conv.", "Custo/Conversa", "Gasto (R$)"].map((h) => (
                  <TableHead key={h} className="text-[#0b1f3a] font-bold text-xs uppercase tracking-wide">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerf.map((row, i) => (
                <TableRow key={row.channel} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                  <TableCell className="font-bold text-[#0b1f3a]">{row.channel}</TableCell>
                  <TableCell>{row.entrantes.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="font-semibold">{row.habilitados.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    <span className="font-black text-sm text-[#007342]">{row.taxa_habilitacao.toFixed(1)}%</span>
                  </TableCell>
                  <TableCell>R$ {row.custo_por_entrante.toFixed(2).replace(".", ",")}</TableCell>
                  <TableCell className="font-semibold">R$ {row.gasto.toLocaleString("pt-BR")}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-[#f2f6fb] font-black">
                <TableCell className="font-black text-[#0b1f3a]">TOTAL</TableCell>
                <TableCell className="font-black">2.800</TableCell>
                <TableCell className="font-black">2.380</TableCell>
                <TableCell className="font-black text-[#00a85a]">85,0%</TableCell>
                <TableCell className="font-black">R$ 7,60</TableCell>
                <TableCell className="font-black">R$ 18.000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </PageContent>
    </>
  );
}
