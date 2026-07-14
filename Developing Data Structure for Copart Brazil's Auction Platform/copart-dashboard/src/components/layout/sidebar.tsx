"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Filter, MessageCircle, GitBranch,
  BarChart3, Gavel, ShoppingCart, AlertTriangle, Lightbulb,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navGroups = [
  {
    label: "Executivo",
    items: [
      { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
      { label: "Funil de Leilão", href: "/dashboard/funnel", icon: Filter },
      { label: "Venda Direta", href: "/dashboard/direct-sales", icon: MessageCircle },
      { label: "Atribuição", href: "/dashboard/attribution", icon: GitBranch },
    ],
  },
  {
    label: "Operacional",
    items: [
      { label: "Performance Diária", href: "/dashboard/campaigns", icon: BarChart3 },
      { label: "Campanhas Leilão", href: "/dashboard/auction-campaigns", icon: Gavel },
      { label: "Campanhas VD", href: "/dashboard/direct-campaigns", icon: ShoppingCart },
      { label: "Alertas", href: "/dashboard/alerts", icon: AlertTriangle },
      { label: "Recomendações", href: "/dashboard/recommendations", icon: Lightbulb },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen bg-[#0b1f3a] border-r border-[#1a3050] sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1a3050]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b8cf] to-[#153a73] flex items-center justify-center">
          <span className="text-white font-black text-sm">C</span>
        </div>
        <div>
          <span className="text-white font-black text-lg tracking-tight">Copart</span>
          <span className="text-[#00b8cf] font-black text-lg">.</span>
          <p className="text-[#6c7685] text-[10px] uppercase tracking-widest font-bold -mt-1">
            BI Dashboard
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.12em] font-bold text-[#4a6080]">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-[#00b8cf]/20 to-[#153a73]/20 text-white border border-[#00b8cf]/30"
                            : "text-[#8aa4be] hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            isActive ? "text-[#00b8cf]" : "text-[#4a6080] group-hover:text-[#8aa4be]"
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-3 h-3 text-[#00b8cf]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1a3050]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00a85a] animate-pulse" />
          <span className="text-[#4a6080] text-xs font-medium">Mock Data</span>
          <span className="ml-auto text-[#4a6080] text-[10px]">v1.0</span>
        </div>
        <p className="text-[#3a5070] text-[10px] mt-1">Atualizado: 04/07/2026 11h</p>
      </div>
    </aside>
  );
}
