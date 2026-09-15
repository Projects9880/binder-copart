import { PageHeader, PageContent, SectionTitle } from "@/components/layout/page-header";
import { AttributionGlossary } from "@/components/cards/attribution-glossary";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import type { SearchParamRecord } from "@/lib/filters";
import { BUSINESS_UNIT_LABELS } from "@/lib/constants";
import { formatNumberFull } from "@/lib/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Análise de Atribuição — Copart BI" };

export default async function AttributionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [stageRows, modelRows] = await Promise.all([
    dataService.getFunnelStageAttribution(filters),
    dataService.getAttributionComparison(filters),
  ]);

  const stageKeys = Array.from(new Set(stageRows.flatMap((row) => Object.keys(row.stages))));

  return (
    <>
      <PageHeader
        title="Análise de Atribuição"
        subtitle="Contribuição das campanhas nas etapas do funil da unidade selecionada"
        badge="Executivo"
        badgeColor="#153a73"
        actions={<AttributionGlossary />}
      />
      <PageContent>
        <SectionTitle>Contribuição por etapa do funil</SectionTitle>
        <div className="rounded-2xl border border-[#dfe6ee] overflow-x-auto mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                <TableHead className="text-[#0b1f3a] font-bold text-xs uppercase">Campanha</TableHead>
                <TableHead className="text-[#0b1f3a] font-bold text-xs uppercase">Unidade</TableHead>
                {stageKeys.map((key) => (
                  <TableHead key={key} className="text-[#0b1f3a] font-bold text-xs uppercase text-right whitespace-nowrap">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stageRows.map((row, i) => (
                <TableRow key={`${row.campaign_name}-${row.channel}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                  <TableCell className="font-mono text-xs font-semibold">{row.campaign_name}</TableCell>
                  <TableCell className="text-sm">{BUSINESS_UNIT_LABELS[row.unit]}</TableCell>
                  {stageKeys.map((key) => (
                    <TableCell key={key} className="text-right font-bold">
                      {row.stages[key] != null ? formatNumberFull(row.stages[key]) : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <SectionTitle>Como lemos a jornada (modelos secundários)</SectionTitle>
        <div className="rounded-2xl border border-[#dfe6ee] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f2f6fb] hover:bg-[#f2f6fb]">
                {["Campanha", "Primeiro toque", "Último toque", "Linear", "Decaimento temporal"].map((h) => (
                  <TableHead key={h} className="text-[#0b1f3a] font-bold text-xs uppercase">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelRows.map((row, i) => (
                <TableRow key={`${row.campaign_name}-${row.unit}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-[#fafbfd]"}>
                  <TableCell className="font-mono text-xs font-semibold">{row.campaign_name}</TableCell>
                  <TableCell>{formatNumberFull(row.first_touch)}</TableCell>
                  <TableCell>{formatNumberFull(row.last_touch)}</TableCell>
                  <TableCell>{formatNumberFull(row.linear)}</TableCell>
                  <TableCell>{formatNumberFull(row.time_decay)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageContent>
    </>
  );
}
