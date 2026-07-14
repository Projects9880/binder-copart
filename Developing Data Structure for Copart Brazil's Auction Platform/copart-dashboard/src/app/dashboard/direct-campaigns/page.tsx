import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { CampaignTable } from "@/components/tables/campaign-table";
import { LineChart } from "@/components/charts/line-chart";
import { dataService } from "@/lib/data/data-service";
import { COLORS } from "@/lib/constants";

export const metadata = { title: "Campanhas Venda Direta — Copart BI" };

const defaultFilters = {
  dateRange: { start: "2026-06-28", end: "2026-07-04" },
  channel: "ALL" as const,
  campaignType: "venda_direta" as const,
  geo: "ALL",
  period: "weekly" as const,
};

export default async function DirectCampaignsPage() {
  const [scorecards, trendMeta, trendWhatsapp] = await Promise.all([
    dataService.getCampaignScorecards(defaultFilters),
    dataService.getTrendData("conversas", 7, defaultFilters),
    dataService.getTrendData("conversas", 7, defaultFilters),
  ]);

  const vdCampaigns = scorecards.filter((c) => c.campaign_name.includes("VENDA") || c.campaign_name.includes("WHATSAPP"));
  const labels = ["28/06", "29/06", "30/06", "01/07", "02/07", "03/07", "04/07"];
  const metaData = [160, 165, 170, 168, 166, 164, 173];
  const wpData = [68, 70, 72, 71, 70, 69, 80];

  return (
    <>
      <PageHeader
        title="Campanhas de Venda Direta"
        subtitle="Performance detalhada dos últimos 7 dias"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        {/* Highlights */}
        <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
          {[
            { label: "Total Conversas (7 dias)", value: "2.380", sub: "de 2.800 cliques", color: COLORS.green },
            { label: "Taxa de Conversão Média", value: "85,0%", sub: "Meta + WhatsApp", color: COLORS.teal },
            { label: "Contatos Qualificados", value: "1.428", sub: "60% das conversas", color: COLORS.blue },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-[#dfe6ee] rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
              <p className="text-xs uppercase tracking-widest font-bold text-[#6c7685] mb-2">{item.label}</p>
              <p className="text-3xl font-black" style={{ color: item.color }}>{item.value}</p>
              <p className="text-sm text-[#6c7685] mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        <SectionTitle>Tabela Detalhada</SectionTitle>
        <div className="mb-8">
          <CampaignTable data={vdCampaigns} showConversas />
        </div>

        <SectionTitle>Tendência de Conversas (7 dias)</SectionTitle>
        <CardWrapper>
          <LineChart
            labels={labels}
            datasets={[
              { label: "META_VENDA_BR_LAL_VIDEO_CPC", data: metaData, color: "#1877f2", fill: true },
              { label: "WHATSAPP_VENDA_BR_DIRECT_CPC", data: wpData, color: "#25d366", fill: true },
            ]}
            valueFormatter="number"
            height={260}
          />
        </CardWrapper>
      </PageContent>
    </>
  );
}
