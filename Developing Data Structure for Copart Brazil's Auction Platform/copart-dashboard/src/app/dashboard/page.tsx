import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { KpiCard } from "@/components/cards/kpi-card";
import { GoalCard } from "@/components/cards/goal-card";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { dataService } from "@/lib/data/data-service";

export const metadata = {
  title: "Visão Geral — Copart BI Dashboard",
};

export default async function OverviewPage() {
  const [kpis, goals, weeklyData, trafficSources] = await Promise.all([
    dataService.getOverviewKPIs({ dateRange: { start: "2026-06-28", end: "2026-07-04" }, channel: "ALL", campaignType: "ALL", geo: "ALL", period: "weekly" }),
    dataService.getGoalProgress({ dateRange: { start: "2026-06-01", end: "2026-06-30" }, channel: "ALL", campaignType: "ALL", geo: "ALL", period: "monthly" }),
    dataService.getWeeklyRegistrations({ dateRange: { start: "2026-06-01", end: "2026-07-04" }, channel: "ALL", campaignType: "ALL", geo: "ALL", period: "weekly" }),
    dataService.getTrafficSources(),
  ]);

  const kpiList = [
    { key: "pageViews", data: kpis.pageViews, insights: ["Total de visualizações de página no período", "Queda de 8% puxada pelo menor tráfego direto"] },
    { key: "visitantesUnicos", data: kpis.visitantesUnicos, insights: ["Usuários únicos que acessaram o site", "70% do tráfego vindo de dispositivos móveis", "Retenção estável"] },
    { key: "novosUsuarios", data: kpis.novosUsuarios, insights: ["Usuários que acessaram o site pela primeira vez", "Queda reflete menor investimento em Meta Ads na semana"] },
    { key: "usuariosRetornantes", data: kpis.usuariosRetornantes, insights: ["Retenção: usuários que retornaram", "Crescimento de 7% indica boa performance de e-mail marketing"] },
    { key: "firstVisit", data: kpis.firstVisit, insights: ["Topo do funil: volume de primeiras visitas", "Forte correlação com Campanhas de Venda Direta"] },
    { key: "logins", data: kpis.logins, insights: ["Usuários que efetuaram login", "Queda de 5% alerta para possíveis problemas no fluxo de login"] },
    { key: "favoritados", data: kpis.favoritados, insights: ["Ações de favoritar lotes/veículos", "Métrica de alta intenção manteve-se resiliente"] },
    { key: "registrationStart", data: kpis.registrationStart, insights: ["Usuários que iniciaram o cadastro (registration_start)", "Leve aumento indica que o formulário está mais atrativo"] },
  ];

  const doughnutLabels = trafficSources.map((t) => t.source);
  const doughnutData = trafficSources.map((t) => t.junho);
  const doughnutColors = [
    "#0b1f3a", "#00b8cf", "#00a85a", "#153a73",
    "#8c5be8", "#c77a00", "#cf3044", "#14c79a",
  ];

  const barLabels = weeklyData.map((w) => w.week.split("–")[0]);
  const insightsCards = [
    {
      icon: "🔴",
      type: "alert",
      title: "Aquisição é o gargalo imediato",
      body: "Visitantes únicos e novos usuários recuaram mais do que logins e favoritados. A queda é mais severa na entrada de novos públicos.",
      border: "#cf3044",
    },
    {
      icon: "🟢",
      type: "opp",
      title: "Habilitação ainda tem eficiência",
      body: "Junho entregou 9.709 habilitados (88,3% da meta), mesmo com entrantes em 77,5% da meta. O funil habilita bem o que chega.",
      border: "#00a85a",
    },
    {
      icon: "🟡",
      type: "watch",
      title: "Dados estão atrapalhando decisão",
      body: "Landing pages e pop-ups com zero leads, UTMs fragmentadas e conversões inconsistentes indicam problemas de mensuração.",
      border: "#c77a00",
    },
  ];

  return (
    <>
      <PageHeader
        title="Visão Geral"
        subtitle="Performance executiva da semana 28/06 – 04/07/2026"
        badge="Executivo"
        badgeColor="#153a73"
      />
      <PageContent>
        {/* KPI Grid */}
        <SectionTitle>Métricas da Semana</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 stagger-children">
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

        {/* Goals */}
        <SectionTitle>Progresso vs Metas Mensais (Junho)</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mb-8">
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
              color={g.title === "Entrantes" ? "#153a73" : "#00b8cf"}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {/* Doughnut */}
          <CardWrapper title="Origem de Tráfego — Junho" className="col-span-2">
            <DoughnutChart
              labels={doughnutLabels}
              data={doughnutData}
              colors={doughnutColors}
              height={240}
            />
          </CardWrapper>

          {/* Stacked bar — weekly */}
          <CardWrapper title="Entrantes vs Habilitados por Semana" className="col-span-3">
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
        </div>

        {/* Insights */}
        <SectionTitle>Insights da Semana</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {insightsCards.map((insight) => (
            <div
              key={insight.title}
              className="rounded-2xl p-5 bg-[#f8fbff] border border-[#dfe6ee] border-l-4"
              style={{ borderLeftColor: insight.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{insight.icon}</span>
                <strong className="text-sm font-black text-[#0b1f3a]">{insight.title}</strong>
              </div>
              <p className="text-sm text-[#344255] leading-relaxed">{insight.body}</p>
            </div>
          ))}
        </div>
      </PageContent>
    </>
  );
}
