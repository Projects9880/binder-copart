import { PageHeader, PageContent, SectionTitle, CardWrapper } from "@/components/layout/page-header";
import { dataService } from "@/lib/data/data-service";
import { Calendar, User, TrendingUp, DollarSign } from "lucide-react";

export const metadata = { title: "Recomendações — Copart BI" };

const PRIORITY_CONFIG = {
  1: { label: "P1", bg: "#fdecee", text: "#b2162e", border: "#cf3044" },
  2: { label: "P2", bg: "#fff4df", text: "#8c5700", border: "#c77a00" },
  3: { label: "P3", bg: "#e8f8ef", text: "#007342", border: "#00a85a" },
};

export default async function RecommendationsPage() {
  const recommendations = await dataService.getRecommendations();

  const ritualItems = [
    { day: "Segunda-feira", action: "Atualizar dashboard, checar pacing e isolar desvios de aquisição", owner: "WiseMetrics" },
    { day: "Terça-feira", action: "Binder ajusta mídia, CRM e social com base nos desvios e hipóteses", owner: "Binder" },
    { day: "Sexta-feira", action: "Enviar relatório executivo com tese da semana, alertas e plano de ação", owner: "WiseMetrics + Binder" },
  ];

  return (
    <>
      <PageHeader
        title="Recomendações Semanais"
        subtitle="Plano de ação para a próxima semana"
        badge="Operacional"
        badgeColor="#00a85a"
      />
      <PageContent>
        <SectionTitle>Ações Recomendadas</SectionTitle>
        <div className="space-y-4 mb-10">
          {recommendations.map((rec) => {
            const priority = PRIORITY_CONFIG[rec.priority as 1 | 2 | 3];
            return (
              <div
                key={rec.id}
                className="bg-white border border-[#dfe6ee] rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0b1f3a]/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Priority badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2"
                    style={{ background: priority.bg, borderColor: priority.border, color: priority.text }}
                  >
                    <span className="font-black text-xs">{priority.label}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-[#0b1f3a] text-base">{rec.title}</h3>
                      {rec.campaign && (
                        <code className="text-[10px] font-mono bg-[#f4f7fb] border border-[#dfe6ee] px-2 py-0.5 rounded-md text-[#344255]">
                          {rec.campaign}
                        </code>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-[#6c7685] mb-1">Razão</p>
                        <p className="text-sm text-[#344255]">{rec.reason}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-[#6c7685] mb-1">Impacto Estimado</p>
                        <p className="text-sm font-semibold text-[#0b1f3a] flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#00a85a]" />
                          {rec.impact}
                        </p>
                      </div>
                    </div>

                    {rec.budget_change && (
                      <div className="bg-[#f4f7fb] rounded-xl p-3 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#00a85a]" />
                        <span className="text-sm font-bold text-[#344255]">Orçamento proposto: {rec.budget_change}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-3 border-t border-[#dfe6ee]">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-[#6c7685]" />
                        <span className="font-bold text-[#153a73]">{rec.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-[#6c7685]" />
                        <span className="text-[#344255]">{rec.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ritual */}
        <SectionTitle>Ritual Semanal Recomendado</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {ritualItems.map((item) => (
            <CardWrapper key={item.day} className="border-l-4 border-l-[#00b8cf]">
              <p className="font-black text-[#0b1f3a] text-sm mb-2">{item.day}</p>
              <p className="text-sm text-[#344255] mb-3 leading-relaxed">{item.action}</p>
              <p className="text-xs font-bold text-[#153a73]">Dono: {item.owner}</p>
            </CardWrapper>
          ))}
        </div>

        {/* Callout */}
        <div className="bg-[#0b1f3a] rounded-2xl p-6 text-white">
          <h3 className="text-lg font-black mb-2">Mensagem para vender a evolução</h3>
          <p className="text-[#d9eaf5] leading-relaxed">
            &ldquo;A partir desta versão, o relatório deixa de ser uma prestação de contas e passa a ser uma rotina de decisão:
            o que aconteceu, por que aconteceu, o que faremos agora e quem responde por cada ação.&rdquo;
          </p>
        </div>
      </PageContent>
    </>
  );
}
