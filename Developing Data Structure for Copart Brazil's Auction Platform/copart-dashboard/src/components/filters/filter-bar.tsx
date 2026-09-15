"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BUSINESS_UNIT_LABELS,
  CHANNEL_LABELS,
  CHANNELS,
  DEFAULT_DATE_RANGE,
  FUNNEL_LABELS,
  GEO_OPTIONS,
} from "@/lib/constants";
import type { BusinessUnit, FunnelKey } from "@/lib/data/types";

const UNITS: Array<BusinessUnit | "ALL"> = ["ALL", "leilao_compra", "select_venda", "select_compra"];
const FUNNELS: Array<FunnelKey | "ALL"> = ["ALL", "leilao", "select_venda", "select_compra"];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const start = searchParams.get("start") || DEFAULT_DATE_RANGE.start;
  const end = searchParams.get("end") || DEFAULT_DATE_RANGE.end;
  const unit = searchParams.get("unit") || "ALL";
  const funnel = searchParams.get("funnel") || "ALL";
  const channel = searchParams.get("channel") || "ALL";
  const geo = searchParams.get("geo") || "ALL";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || value === "") params.delete(key);
    else params.set(key, value);
    if (key === "unit") {
      params.delete("funnel");
      params.delete("campaign");
    }
    if (key === "funnel") params.delete("campaign");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const funnelOptions = FUNNELS.filter((key) => {
    if (key === "ALL") return true;
    if (unit === "ALL") return true;
    if (unit === "leilao_compra") return key === "leilao";
    return key === unit;
  });

  const channelOptions = CHANNELS.filter((id) => {
    if (unit === "leilao_compra") return ["META", "GOOGLE", "ORGANIC", "DIRECT", "TIKTOK"].includes(id);
    if (unit === "select_venda") return ["META", "BLIP", "RD_STATION"].includes(id);
    if (unit === "select_compra") return ["META", "GOOGLE", "ORGANIC", "BLIP"].includes(id);
    return true;
  });

  return (
    <div className="sticky top-0 z-20 border-b border-[#dfe6ee] bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end gap-3">
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-0">
          Início
          <input
            type="date"
            value={start}
            onChange={(e) => setParam("start", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-0">
          Fim
          <input
            type="date"
            value={end}
            onChange={(e) => setParam("end", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-[140px]">
          Unidade
          <select
            value={unit}
            onChange={(e) => setParam("unit", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            <option value="ALL">Todas</option>
            {UNITS.filter((u) => u !== "ALL").map((u) => (
              <option key={u} value={u}>{BUSINESS_UNIT_LABELS[u]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-[150px]">
          Funil
          <select
            value={funnel}
            onChange={(e) => setParam("funnel", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            {funnelOptions.map((key) => (
              <option key={key} value={key}>
                {key === "ALL" ? "Todos" : FUNNEL_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-[150px]">
          Canal
          <select
            value={channel}
            onChange={(e) => setParam("channel", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            <option value="ALL">Todos</option>
            {channelOptions.map((id) => (
              <option key={id} value={id}>{CHANNEL_LABELS[id]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685] min-w-[140px]">
          Região
          <select
            value={geo}
            onChange={(e) => setParam("geo", e.target.value)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            {GEO_OPTIONS.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
