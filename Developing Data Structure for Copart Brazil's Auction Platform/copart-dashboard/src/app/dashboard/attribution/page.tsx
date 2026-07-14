import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { dataService } from "@/lib/data/data-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Análise de Atribuição — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-06-01", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "ALL" as const,
  geo: "ALL",
  period: "monthly" as const,
};

export default async function AttributionPage() {
  const attributionData = await dataService.getAttributionComparison(defaultFilters);

  const models = ["first_touch", "last_touch", "linear", "time_decay"] as const;
  const modelLabels = {
    first_touch: "First Touch",
    last_touch: "Last Touch",
    linear: "Linear",
    time_decay: "Time Decay",
  };
  const modelColors = {
    first_touch: "#00b8cf",
    last_touch: "#153a73",
    linear: "#00a85a",
    time_decay: "#8c5be8",
  };

  return (
    <>
      <PageHeader
        title="Análise de Atribuição"
        subtitle="Comparação de modelos de atribuição — Últimos 30 dias"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        {/* Attribution model cards */}
        <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
          {models.map((model) => {
            const total = attributionData.reduce((a, r) => a + r[model], 0);
            return (
              <div key={model} className="bg-white border border-[#dfe6ee] rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="w-3 h-3 rounded-full mb-3" style={{ background: modelColors[model] }} />
                <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685] mb-1">{modelLabels[model]}</p>
                <p className="text-3xl font-black text-[#0b1f3a]">{total.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-[#6c7685] mt-1">conversões atribuídas</p>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <SectionTitle>Comparação por Campanha</SectionTitle>
        <div className="rounded-2xl border border-[#dfe6ee] overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                <TableHead className="text-[#0b1f3a] font-bold text-xs uppercase tracking-wide">Campanha</TableHead>
                {models.map((m) => (
                  <TableHead key={m} className="text-center font-bold text-xs uppercase tracking-wide" style={{ color: modelColors[m] }}>
                    {modelLabels[m]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributionData.map((row, i) => (
                <TableRow key={row.campaign_name} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                  <TableCell className="font-mono text-xs font-semibold text-[#0b1f3a] max-w-[240px]">
                    <span className="truncate block" title={row.campaign_name}>{row.campaign_name}</span>
                  </TableCell>
                  {models.map((m) => (
                    <TableCell key={m} className="text-center font-bold text-[#0b1f3a]">
                      {row[m].toLocaleString("pt-BR")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Data quality */}
        <SectionTitle>Confiabilidade de Atribuição</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685]">Atribuição Confiável</p>
                <p className="text-4xl font-black text-[#00a85a] mt-1">92%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#00a85a] flex items-center justify-center">
                <span className="text-sm font-black text-[#00a85a]">✓</span>
              </div>
            </div>
            <div className="h-3 bg-[#e9eef5] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00a85a] to-[#14c79a] rounded-full" style={{ width: "92%" }} />
            </div>
            <p className="text-xs text-[#6c7685] mt-2">Conversões com campanha e UTM válidos</p>
          </div>
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685]">Atribuição Questionável</p>
                <p className="text-4xl font-black text-[#c77a00] mt-1">8%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#c77a00] flex items-center justify-center">
                <span className="text-sm font-black text-[#c77a00]">⚠</span>
              </div>
            </div>
            <div className="h-3 bg-[#e9eef5] rounded-full overflow-hidden">
              <div className="h-full bg-[#c77a00] rounded-full" style={{ width: "8%" }} />
            </div>
            <p className="text-xs text-[#6c7685] mt-2">UTM inválido, campanha nula ou dados incompletos</p>
          </div>
        </div>
      </PageContent>
    </>
  );
}
