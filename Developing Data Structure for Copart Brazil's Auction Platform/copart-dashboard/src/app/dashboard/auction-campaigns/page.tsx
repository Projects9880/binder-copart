import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { CampaignTable } from "@/components/tables/campaign-table";
import { LineChart } from "@/components/charts/line-chart";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";

export const metadata = { title: "Campanhas de Leilão — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-06-28", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "leilao" as const,
  geo: "ALL",
  period: "weekly" as const,
};

export default async function AuctionCampaignsPage() {
  const [scorecards, trendMeta, trendGoogle, trendOrganic] = await Promise.all([
    dataService.getCampaignScorecards(defaultFilters),
    dataService.getTrendData("taxa_habilitacao", 7, defaultFilters),
    dataService.getTrendData("taxa_habilitacao", 7, defaultFilters),
    dataService.getTrendData("taxa_habilitacao", 7, defaultFilters),
  ]);

  const leilaoCampaigns = scorecards.filter(
    (c) => c.campaign_name.includes("LEILAO") || c.campaign_name.includes("ORGANIC")
  );
  const labels = trendMeta.map((_, i) => `D${i + 1}`);
  const spendData = leilaoCampaigns.filter((c) => c.spend > 0);
  const totalSpend = spendData.reduce((a, c) => a + c.spend, 0);

  return (
    <>
      <PageHeader
        title="Campanhas de Leilão"
        subtitle="Performance detalhada dos últimos 7 dias"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        {/* Table */}
        <SectionTitle>Tabela Detalhada — Últimos 7 Dias</SectionTitle>
        <div className="mb-8">
          <CampaignTable data={leilaoCampaigns} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <CardWrapper title="Tendência — Taxa de Habilitação" className="col-span-2">
            <LineChart
              labels={labels}
              datasets={[
                { label: "META_LEILAO", data: trendMeta.map((d) => d.value + 2), color: "#1877f2" },
                { label: "GOOGLE_LEILAO", data: trendGoogle.map((d) => d.value - 2), color: "#4285f4" },
                { label: "ORGANIC", data: trendOrganic.map((d) => d.value - 1), color: COLORS.green },
              ]}
              valueFormatter="percent"
              height={240}
            />
          </CardWrapper>

          <CardWrapper title="Distribuição de Gasto">
            <DoughnutChart
              labels={spendData.map((c) => c.campaign_name.split("_").slice(0, 2).join("_"))}
              data={spendData.map((c) => c.spend)}
              colors={[COLORS.teal, COLORS.blue, COLORS.violet]}
              centerValue={`R$ ${(totalSpend / 1000).toFixed(0)}k`}
              centerLabel="Gasto Total"
              height={240}
            />
          </CardWrapper>
        </div>
      </PageContent>
    </>
  );
}
