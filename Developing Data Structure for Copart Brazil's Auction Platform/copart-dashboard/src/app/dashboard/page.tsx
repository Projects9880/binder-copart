import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { KpiCard } from "@/components/cards/kpi-card";
import { GoalCard } from "@/components/cards/goal-card";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { dataService } from "@/lib/data/data-service";
import { filtersFromSearchParams } from "@/lib/page-filters";
import { formatDateRangeLabel } from "@/lib/filters";
import type { SearchParamRecord } from "@/lib/filters";
import { BUSINESS_UNIT_LABELS } from "@/lib/constants";
import { formatBRL, formatPercentage } from "@/lib/utils/formatters";
import { Database, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Visão Geral — Copart BI Dashboard",
};

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const filters = await filtersFromSearchParams(searchParams);
  const [kpis, goals, weeklyData, trafficSources, mix, efficiency] = await Promise.all([
    dataService.getOverviewKPIs(filters),
    dataService.getGoalProgress(filters),
    dataService.getWeeklyRegistrations(filters),
    dataService.getTrafficSources(filters),
    dataService.getTrafficMix(filters),
    dataService.getMediaEfficiency(filters),
  ]);

  const owned = mix.filter((bucket) => bucket.id === "direct" || bucket.id === "organic");
  const paid = mix.find((bucket) => bucket.id === "paid");
  const ownedShare = owned.reduce((sum, bucket) => sum + bucket.shareSessions, 0);
  const paidShare = paid?.shareSessions ?? 0;
  const spendByUnit = efficiency.reduce<Record<string, number>>((acc, row) => {
    acc[row.unit] = (acc[row.unit] ?? 0) + row.spend;
    return acc;
  }, {});
  const unitKeys = Object.keys(spendByUnit) as Array<keyof typeof BUSINESS_UNIT_LABELS>;
  const spendLabel =
    unitKeys.length === 1
      ? formatBRL(spendByUnit[unitKeys[0]])
      : unitKeys.map((unit) => `${BUSINESS_UNIT_LABELS[unit]} ${formatBRL(spendByUnit[unit])}`).join(" · ");

  const kpiList = [
    { key: "pageViews", data: kpis.pageViews, insights: ["Visualizações de página no recorte filtrado"] },
    { key: "visitantesUnicos", data: kpis.visitantesUnicos, insights: ["Usuários únicos no recorte"] },
    { key: "novosUsuarios", data: kpis.novosUsuarios, insights: ["Primeiro acesso no recorte"] },
    { key: "usuariosRetornantes", data: kpis.usuariosRetornantes, insights: ["Retenção no recorte"] },
    { key: "firstVisit", data: kpis.firstVisit, insights: ["Diagnóstico de site — não é etapa do Funil Leilão"] },
    { key: "logins", data: kpis.logins, insights: ["Usuários que efetuaram login"] },
    { key: "favoritados", data: kpis.favoritados, insights: ["Favoritar lotes — intenção de site"] },
    { key: "registrationStart", data: kpis.registrationStart, insights: ["Início de cadastro (GA4). Distinto de Entrante e fora do Funil Leilão."] },
  ];

  const doughnutLabels = trafficSources.map((t) => t.source);
  const doughnutData = trafficSources.map((t) => t.junho);
  const doughnutColors = ["#0b1f3a", "#00b8cf", "#00a85a", "#153a73", "#8c5be8", "#c77a00", "#cf3044", "#14c79a"];
  const mixColors = ["#8c5be8", "#00a85a", "#cf3044", "#6c7685"];
  const barLabels = weeklyData.map((w) => w.week.split("–")[0]);
  const period = formatDateRangeLabel(filters.dateRange.start, filters.dateRange.end);

  return (
    <>
      <PageHeader
        title="Visão Geral"
        subtitle={`Performance executiva — ${period}`}
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        <CardWrapper className="mb-8 bg-[#0b1f3a] text-white border-0">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#00b8cf] mb-2">Quem traz o volume</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-[#8aa4be] font-semibold">Direct + orgânico (sessões)</p>
              <p className="text-3xl font-black">{formatPercentage(ownedShare)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8aa4be] font-semibold">Mídia paga (sessões)</p>
              <p className="text-3xl font-black">{formatPercentage(paidShare)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8aa4be] font-semibold">Gasto de mídia (unidade filtrada)</p>
              <p className="text-lg font-black leading-snug">{spendLabel || "—"}</p>
            </div>
          </div>
          <p className="text-sm text-[#d9eaf5] leading-relaxed">
            Direct e orgânico carregam a maior parte do tráfego. O investimento está 100% na fatia paga, que é minoria de sessões e de novos usuários. A meta de Leilão pressiona a mídia, mas o volume de cadastro alocado pelo first-touch está em Direto. Spend de Leilão e Select não se somam neste card.
          </p>
        </CardWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
          <CardWrapper title="Mix agregado — sessões GA4" subtitle="Direct, orgânico, pago e outros" className="lg:col-span-2">
            <DoughnutChart
              labels={mix.map((bucket) => bucket.label)}
              data={mix.map((bucket) => bucket.sessions)}
              colors={mixColors}
              centerValue={formatPercentage(ownedShare, 0)}
              centerLabel="owned"
              height={240}
            />
          </CardWrapper>
          <CardWrapper title="Detalhe por canal GA4" subtitle="Sessões — não é atribuição de campanha" className="lg:col-span-3">
            <DoughnutChart labels={doughnutLabels} data={doughnutData} colors={doughnutColors} height={240} />
          </CardWrapper>
        </div>

        <SectionTitle>Métricas do recorte</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          {kpiList.map(({ key, data, insights }) => (
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

        <SectionTitle>Progresso vs metas por unidade</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {goals.map((g) => (
            <GoalCard
              key={g.title}
              title={g.title}
              current={g.current}
              target={g.target}
              percentage={g.percentage}
              delta={g.delta}
              deltaLabel={g.deltaLabel}
              deltaType={g.deltaType}
              color={g.title.includes("Select/Compra") ? "#00b8cf" : g.title.includes("Select") ? "#00a85a" : "#153a73"}
            />
          ))}
        </div>

        <CardWrapper title="Entrantes vs Habilitados — Leilão/Compra" className="mb-8">
          <BarChart
            labels={barLabels}
            datasets={[
              { label: "Entrantes", data: weeklyData.map((w) => w.entrantes), color: "#00a85a" },
              { label: "Habilitados", data: weeklyData.map((w) => w.habilitados), color: "#00b8cf" },
            ]}
            valueFormatter="number"
            height={240}
          />
        </CardWrapper>

        <div className="mt-8 p-5 rounded-2xl bg-[#0b1f3a] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b8cf]/20 flex items-center justify-center text-[#00b8cf]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm">Governança e origem</span>
              <p className="text-xs text-[#d9eaf5] mt-0.5">
                Google Ads, Meta Ads, GA4 e Copart ERP a partir dos CSVs em raw/. Recorte: Meta + GA4 ago/2026 · Copart set/2026. Não é BigQuery ao vivo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8aa4be]">
            <ShieldCheck className="w-4 h-4 text-[#00b8cf]" />
            <span>SLA 99,8% • Carga 11h BRT</span>
          </div>
        </div>
      </PageContent>
    </>
  );
}
