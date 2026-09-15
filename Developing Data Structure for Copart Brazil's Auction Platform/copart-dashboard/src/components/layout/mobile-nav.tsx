"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Geral" },
  { href: "/dashboard/funnel", label: "Funil" },
  { href: "/dashboard/direct-sales", label: "Select" },
  { href: "/dashboard/attribution", label: "Atribuição" },
  { href: "/dashboard/channel-goals", label: "Metas" },
  { href: "/dashboard/conversion-paths", label: "Jornadas" },
  { href: "/dashboard/regional", label: "Regional" },
  { href: "/dashboard/evolution", label: "Evolução" },
  { href: "/dashboard/campaigns", label: "Diária" },
  { href: "/dashboard/alerts", label: "Alertas" },
  { href: "/dashboard/report", label: "Relatório" },
  { href: "/dashboard/creatives", label: "Criativos" },
];

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  return (
    <div className="md:hidden overflow-x-auto border-b border-[#dfe6ee] bg-[#0b1f3a] px-3 py-2 flex gap-2">
      {links.map((link) => {
        const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
        const href = query ? `${link.href}?${query}` : link.href;
        return (
          <Link
            key={link.href}
            href={href}
            className={`whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full ${
              active ? "bg-[#00b8cf] text-[#0b1f3a]" : "text-[#8aa4be]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
