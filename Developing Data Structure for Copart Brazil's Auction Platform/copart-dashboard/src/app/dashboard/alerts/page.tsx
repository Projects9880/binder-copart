import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { AlertCard } from "@/components/cards/alert-card";
import { dataService } from "@/lib/data/data-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const metadata = { title: "Alertas e Anomalias — Copart BI" };

export default async function AlertsPage() {
  const [alerts, discrepancies] = await Promise.all([
    dataService.getAlerts(),
    dataService.getDataDiscrepancies(),
  ]);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return (
    <>
      <PageHeader
        title="Alertas e Anomalias"
        subtitle="Últimas 24 horas — Monitoramento em tempo real"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        {/* Summary pills */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#fdecee] border border-[#cf3044]/30 rounded-full px-4 py-2">
            <span className="text-sm font-black text-[#b2162e]">{criticalCount} Crítico{criticalCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#fff4df] border border-[#c77a00]/30 rounded-full px-4 py-2">
            <span className="text-sm font-black text-[#8c5700]">{warningCount} Aviso{warningCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#eef4ff] border border-[#153a73]/30 rounded-full px-4 py-2">
            <span className="text-sm font-black text-[#153a73]">{alerts.filter((a) => a.severity === "info").length} Informações</span>
          </div>
        </div>

        {/* Alert cards */}
        <SectionTitle>Alertas Ativos</SectionTitle>
        <div className="space-y-3 mb-8">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

        {/* Data discrepancies */}
        <SectionTitle>Análise de Discrepâncias de Dados</SectionTitle>
        <CardWrapper title="Validação Cruzada de Fontes">
          <div className="rounded-xl border border-[#dfe6ee] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                  {["Fonte A", "Fonte B", "Discrepância", "SLA Máximo", "Status"].map((h) => (
                    <TableHead key={h} className="text-[#0b1f3a] font-bold text-xs uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {discrepancies.map((row, i) => (
                  <TableRow key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                    <TableCell className="font-semibold text-[#0b1f3a]">{row.source_a}</TableCell>
                    <TableCell className="font-semibold text-[#0b1f3a]">{row.source_b}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-black text-sm",
                        row.discrepancy <= row.sla * 0.7 ? "text-[#007342]" : row.discrepancy <= row.sla ? "text-[#8c5700]" : "text-[#b2162e]"
                      )}>
                        {row.discrepancy.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-[#6c7685]">{row.sla}%</TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-xs font-black px-2 py-1 rounded-full",
                        row.status === "ok" ? "bg-[#e8f8ef] text-[#007342]" :
                        row.status === "warning" ? "bg-[#fff4df] text-[#8c5700]" :
                        "bg-[#fdecee] text-[#b2162e]"
                      )}>
                        {row.status === "ok" ? "✅ OK" : row.status === "warning" ? "⚠️ Monitorar" : "🔴 Crítico"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardWrapper>
      </PageContent>
    </>
  );
}
