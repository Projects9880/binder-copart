import { cn } from "@/lib/utils";
import { Calendar, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = "#00b8cf",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#dfe6ee] px-8 py-4", className)}>
      <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {badge && (
            <span
              className="text-[10px] uppercase tracking-[0.12em] font-black px-2.5 py-1 rounded-full text-white flex-shrink-0"
              style={{ background: badgeColor }}
            >
              {badge}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-black text-[#0b1f3a] tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-[#6c7685] mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-xs text-[#6c7685]">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-semibold">28/06 – 04/07/2026</span>
          <RefreshCw className="w-3.5 h-3.5 ml-2" />
          <span>Atualizado 11h</span>
        </div>
      </div>
      {children && (
        <div className="max-w-[1400px] mx-auto mt-3">{children}</div>
      )}
    </div>
  );
}

export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-8 max-w-[1400px] mx-auto w-full", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-base font-black text-[#0b1f3a] mb-4", className)}>{children}</h2>
  );
}

export function CardWrapper({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <div className={cn("bg-white border border-[#dfe6ee] rounded-2xl p-5", className)}>
      {title && <h3 className="text-sm font-black text-[#0b1f3a] mb-4">{title}</h3>}
      {children}
    </div>
  );
}
