import { cn } from "@/lib/utils";
import type { FunnelStage } from "@/lib/data/types";
import { InfoTip } from "@/components/layout/info-tip";

interface FunnelChartProps {
  stages: FunnelStage[];
  primaryColor?: string;
  className?: string;
}

export function FunnelChart({
  stages,
  primaryColor = "#00b8cf",
  className,
}: FunnelChartProps) {
  if (!stages || stages.length === 0) {
    return null;
  }

  const max = stages[0]?.value > 0 ? stages[0].value : 1;

  return (
    <div className={cn("space-y-1", className)}>
      {stages.map((stage, i) => {
        const widthPct = (stage.value / max) * 100;
        const isLast = i === stages.length - 1;

        return (
          <div key={`${stage.label}-${i}`} className="relative">
            {/* Bar */}
            <div
              className="flex items-center gap-3 mx-auto transition-all duration-700"
              style={{ width: `${Math.max(widthPct, 30)}%` }}
            >
              <div
                className="flex-1 rounded-xl px-4 py-3 flex items-center min-h-[52px]"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}11)`,
                  border: `1.5px solid ${primaryColor}44`,
                }}
              >
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-[#6c7685] inline-flex items-center">
                    {stage.label}
                    {stage.description ? <InfoTip text={stage.description} side="right" /> : null}
                  </span>
                  <span className="text-xl font-black text-[#0b1f3a] block">
                    {stage.value.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow + conversion rate */}
            {!isLast && stage.conversionRate !== undefined && (
              <div className="flex items-center justify-center py-1 gap-2">
                <div className="h-px flex-1 max-w-[200px] bg-[#dfe6ee]" />
                <span className="text-xs font-black text-[#6c7685] flex items-center gap-1">
                  ↓
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-black",
                      stage.conversionRate >= 50
                        ? "bg-[#e8f8ef] text-[#007342]"
                        : "bg-[#fff4df] text-[#8c5700]"
                    )}
                  >
                    {stage.conversionRate.toFixed(1)}% conv.
                  </span>
                </span>
                <div className="h-px flex-1 max-w-[200px] bg-[#dfe6ee]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
