import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { LineChart } from "@/components/charts/line-chart";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Funil de Leilão — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-06-28", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "leilao" as const,
  geo: "ALL",
  period: "weekly" as const,
};

export default async function FunnelPage() {
  const [funnelData, channelPerf, trendData] = await Promise.all([
    dataService.getFunnelData("leilao", defaultFilters),
    dataService.getChannelPerformance("leilao", defaultFilters),
    dataService.getTrendData("taxa_habilitacao", 7, defaultFilters),
  ]);

  const trendLabels = trendData.map((_, i) => `D${i + 1}`);

  return (
    <>
      <PageHeader
        title="Funil de Leilão"
        subtitle="Entrantes → Habilitados → Licitantes → Arrematantes"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Funnel */}
          <CardWrapper title="Funil Visual — Semana 28/06–04/07">
            <FunnelChart stages={funnelData.stages} primaryColor={COLORS.teal} />
          </CardWrapper>

          {/* Trend line */}
          <CardWrapper title="Tendência — Taxa de Habilitação (7 dias)">
            <LineChart
              labels={trendLabels}
              datasets={[{
                label: "Taxa de Habilitação (%)",
                data: trendData.map((d) => d.value),
                color: COLORS.teal,
                fill: true,
              }]}
              valueFormatter="percent"
              height={280}
            />
          </CardWrapper>
        </div>

        {/* Channel Performance Table */}
        <SectionTitle>Performance por Canal</SectionTitle>
        <div className="rounded-2xl border border-[#dfe6ee] overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                {["Canal", "Entrantes", "Habilitados", "Taxa Hab.", "Custo/Entrante", "Custo/Habilitado", "Gasto (R$)"].map((h) => (
                  <TableHead key={h} className="text-[#0b1f3a] font-bold text-xs uppercase tracking-wide">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerf.map((row, i) => (
                <TableRow key={row.channel} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                  <TableCell className="font-bold text-[#0b1f3a]">{row.channel}</TableCell>
                  <TableCell className="font-semibold">{row.entrantes.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="font-semibold">{row.habilitados.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    <span className={`font-black text-sm ${row.taxa_habilitacao >= 50 ? "text-[#007342]" : "text-[#b2162e]"}`}>
                      {row.taxa_habilitacao.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-[#344255]">
                    {row.custo_por_entrante > 0 ? `R$ ${row.custo_por_entrante.toFixed(2).replace(".", ",")}` : "—"}
                  </TableCell>
                  <TableCell className="text-[#344255]">
                    {row.custo_por_habilitado > 0 ? `R$ ${row.custo_por_habilitado.toFixed(2).replace(".", ",")}` : "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-[#0b1f3a]">
                    {row.gasto > 0 ? `R$ ${row.gasto.toLocaleString("pt-BR")}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total row */}
              <TableRow className="bg-[#f2f6fb] font-black">
                <TableCell className="font-black text-[#0b1f3a]">TOTAL</TableCell>
                <TableCell className="font-black text-[#0b1f3a]">{channelPerf.reduce((a, r) => a + r.entrantes, 0).toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-black text-[#0b1f3a]">{channelPerf.reduce((a, r) => a + r.habilitados, 0).toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-black text-[#00b8cf]">
                  {(channelPerf.reduce((a, r) => a + r.habilitados, 0) / channelPerf.reduce((a, r) => a + r.entrantes, 0) * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="font-black text-[#0b1f3a]">R$ 8,50</TableCell>
                <TableCell className="font-black text-[#0b1f3a]">R$ 17,00</TableCell>
                <TableCell className="font-black text-[#0b1f3a]">R$ 129.800</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Rate strip */}
        <SectionTitle>Taxa de Habilitação por Semana</SectionTitle>
        <div className="grid grid-cols-5 gap-3">
          {[
            { week: "31/05–06/06", rate: 59.58 },
            { week: "07/06–13/06", rate: 61.69 },
            { week: "14/06–20/06", rate: 64.09 },
            { week: "21/06–27/06", rate: 65.44 },
            { week: "28/06–04/07", rate: 62.90 },
          ].map(({ week, rate }) => (
            <div key={week} className="bg-white border border-[#dfe6ee] rounded-xl p-4 text-center">
              <p className="text-xs text-[#6c7685] font-semibold mb-2">{week}</p>
              <p className="text-2xl font-black text-[#0b1f3a]">{rate.toFixed(2).replace(".", ",")}%</p>
            </div>
          ))}
        </div>
      </PageContent>
    </>
  );
}
