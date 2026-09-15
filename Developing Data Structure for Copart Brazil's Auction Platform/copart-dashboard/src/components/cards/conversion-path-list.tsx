"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, ChevronDown, ArrowRight, Clock, Hash, Calendar } from "lucide-react";
import type { ConversionPath, ConversionType } from "@/lib/data/types";

interface ConversionPathListProps {
  paths: ConversionPath[];
}

const CONVERSION_TYPE_LABELS: Record<string, string> = {
  ALL: "Todos",
  entrante: "Entrante",
  habilitado: "Habilitado",
  licitante: "Licitante",
  arrematante: "Arrematante",
  conversa_whatsapp: "Conversa Blip",
  veiculo_captado: "Veículo captado",
  veiculo_vendido: "Veículo vendido",
};

const CHANNEL_FILTER_OPTIONS = [
  { value: "ALL", label: "Todos os Canais" },
  { value: "SEO", label: "SEO" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "Meta Ads", label: "Meta Ads" },
  { value: "Google Ads", label: "Google Ads" },
  { value: "TikTok", label: "TikTok" },
  { value: "RD Station", label: "RD Station" },
  { value: "Blip (WhatsApp)", label: "Blip (WhatsApp)" },
];

const TOUCHPOINT_COLORS: Record<string, string> = {
  "Instagram Ads": "#e1306c",
  "Instagram Orgânico": "#e1306c",
  "Facebook Orgânico": "#1877f2",
  "Meta Ads": "#0668E1",
  "Google Ads": "#4285f4",
  SEO: "#00a85a",
  TikTok: "#010101",
  "RD Station": "#8c5be8",
  "Blip (WhatsApp)": "#25d366",
  Site: "#6c7685",
  Entrante: "#153a73",
  Habilitado: "#00b8cf",
  Licitante: "#c77a00",
  Arrematante: "#cf3044",
};

function getChipColor(channel: string): string {
  // Exact match first
  if (TOUCHPOINT_COLORS[channel]) return TOUCHPOINT_COLORS[channel];
  // Partial match
  const match = Object.keys(TOUCHPOINT_COLORS).find((key) =>
    channel.toLowerCase().includes(key.toLowerCase())
  );
  return match ? TOUCHPOINT_COLORS[match] : "#6c7685";
}

function getConversionBadgeStyle(type: ConversionType) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    entrante: { bg: "#eef4ff", text: "#153a73", label: "Entrante" },
    habilitado: { bg: "#e5f8f8", text: "#007a7a", label: "Habilitado" },
    licitante: { bg: "#fff4df", text: "#8a5d00", label: "Licitante" },
    arrematante: { bg: "#fdecee", text: "#9b1228", label: "Arrematante" },
    conversa_whatsapp: { bg: "#e8f8ef", text: "#007342", label: "Blip" },
    veiculo_captado: { bg: "#e8f8ef", text: "#007342", label: "Captado" },
    veiculo_vendido: { bg: "#e5f8f8", text: "#007a7a", label: "Vendido" },
  };
  return styles[type] || styles.entrante;
}

export function ConversionPathList({ paths }: ConversionPathListProps) {
  const [conversionFilter, setConversionFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [minTouchpoints, setMinTouchpoints] = useState(1);
  const [maxTouchpoints, setMaxTouchpoints] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const filteredPaths = useMemo(() => {
    let result = [...paths];

    // Filter by conversion type
    if (conversionFilter !== "ALL") {
      result = result.filter((p) => p.conversionType === conversionFilter);
    }

    // Filter by channel in path
    if (channelFilter !== "ALL") {
      result = result.filter((p) =>
        p.touchpoints.some((t) =>
          t.channel.toLowerCase().includes(channelFilter.toLowerCase())
        )
      );
    }

    // Filter by touchpoint count
    result = result.filter(
      (p) =>
        p.totalTouchpoints >= minTouchpoints &&
        p.totalTouchpoints <= maxTouchpoints
    );

    // Filter by search (userId or channel)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.userId.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.touchpoints.some((t) => t.channel.toLowerCase().includes(q))
      );
    }

    return result;
  }, [paths, conversionFilter, channelFilter, minTouchpoints, maxTouchpoints, searchQuery]);

  // Stats
  const avgTouchpoints =
    filteredPaths.length > 0
      ? filteredPaths.reduce((a, p) => a + p.totalTouchpoints, 0) /
        filteredPaths.length
      : 0;
  const avgDays =
    filteredPaths.length > 0
      ? filteredPaths.reduce((a, p) => a + p.daysToConversion, 0) /
        filteredPaths.length
      : 0;

  return (
    <div>
      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 stagger-children">
        <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685] mb-1">
            Jornadas Encontradas
          </p>
          <p className="text-3xl font-black text-[#0b1f3a]">{filteredPaths.length}</p>
          <p className="text-xs text-[#6c7685] mt-0.5">de {paths.length} total</p>
        </div>
        <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <Hash className="w-3 h-3 text-[#6c7685]" />
            <p className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685]">
              Média de Touchpoints
            </p>
          </div>
          <p className="text-3xl font-black text-[#00b8cf]">
            {avgTouchpoints.toFixed(1)}
          </p>
        </div>
        <div className="bg-white border border-[#dfe6ee] rounded-2xl p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-[#6c7685]" />
            <p className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685]">
              Média de Dias p/ Conversão
            </p>
          </div>
          <p className="text-3xl font-black text-[#153a73]">
            {avgDays.toFixed(0)}
            <span className="text-sm font-bold text-[#6c7685] ml-1">dias</span>
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#dfe6ee] rounded-2xl p-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-bold text-[#0b1f3a] mb-0 w-full"
        >
          <Filter className="w-4 h-4 text-[#00b8cf]" />
          Filtros
          <ChevronDown
            className={cn(
              "w-4 h-4 text-[#6c7685] transition-transform duration-200 ml-auto",
              showFilters && "rotate-180"
            )}
          />
        </button>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685] block mb-1.5">
                Buscar
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7685]" />
                <input
                  type="text"
                  placeholder="ID, canal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-[#dfe6ee] rounded-xl bg-[#f8fbff] focus:outline-none focus:ring-2 focus:ring-[#00b8cf]/30 focus:border-[#00b8cf] transition-all"
                />
              </div>
            </div>

            {/* Conversion type */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685] block mb-1.5">
                Tipo de Conversão
              </label>
              <select
                value={conversionFilter}
                onChange={(e) => setConversionFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#dfe6ee] rounded-xl bg-[#f8fbff] focus:outline-none focus:ring-2 focus:ring-[#00b8cf]/30 focus:border-[#00b8cf] transition-all appearance-none cursor-pointer"
              >
                {Object.entries(CONVERSION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel in path */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685] block mb-1.5">
                Canal na Jornada
              </label>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#dfe6ee] rounded-xl bg-[#f8fbff] focus:outline-none focus:ring-2 focus:ring-[#00b8cf]/30 focus:border-[#00b8cf] transition-all appearance-none cursor-pointer"
              >
                {CHANNEL_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Touchpoint range */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.07em] font-bold text-[#6c7685] block mb-1.5">
                Touchpoints (min–max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={maxTouchpoints}
                  value={minTouchpoints}
                  onChange={(e) => setMinTouchpoints(Number(e.target.value))}
                  className="w-16 px-2 py-2 text-sm text-center border border-[#dfe6ee] rounded-xl bg-[#f8fbff] focus:outline-none focus:ring-2 focus:ring-[#00b8cf]/30"
                />
                <span className="text-[#6c7685] text-xs">–</span>
                <input
                  type="number"
                  min={minTouchpoints}
                  max={20}
                  value={maxTouchpoints}
                  onChange={(e) => setMaxTouchpoints(Number(e.target.value))}
                  className="w-16 px-2 py-2 text-sm text-center border border-[#dfe6ee] rounded-xl bg-[#f8fbff] focus:outline-none focus:ring-2 focus:ring-[#00b8cf]/30"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Path list */}
      <div className="space-y-3">
        {filteredPaths.length === 0 ? (
          <div className="bg-white border border-[#dfe6ee] rounded-2xl p-12 text-center">
            <p className="text-[#6c7685] font-semibold">Nenhuma jornada encontrada com os filtros selecionados.</p>
            <p className="text-[#6c7685] text-sm mt-1">Tente ajustar os filtros acima.</p>
          </div>
        ) : (
          filteredPaths.map((path, index) => {
            const badge = getConversionBadgeStyle(path.conversionType);
            return (
              <div
                key={path.id}
                className="bg-white border border-[#dfe6ee] rounded-2xl p-5 hover:shadow-md hover:shadow-[#0b1f3a]/5 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Path header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#0b1f3a] bg-[#f2f6fb] px-2 py-0.5 rounded-lg">
                      {path.id}
                    </span>
                    <span className="text-xs font-semibold text-[#6c7685]">
                      {path.userId}
                    </span>
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6c7685]">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {path.totalTouchpoints} touchpoints
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.daysToConversion} dias
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {path.conversionDate.split("-").reverse().join("/")}
                    </span>
                  </div>
                </div>

                {/* Touchpoint flow */}
                <div className="flex items-center gap-1 flex-wrap">
                  {path.touchpoints.map((tp, i) => {
                    const chipColor = getChipColor(tp.channel);
                    const isConversion = tp.type === "conversion";
                    const isLast = i === path.touchpoints.length - 1;
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <div
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                            isConversion
                              ? "ring-2 ring-offset-1"
                              : "hover:scale-105"
                          )}
                          style={{
                            background: `${chipColor}12`,
                            color: chipColor,
                            ...(isConversion
                              ? { ringColor: chipColor }
                              : {}),
                          }}
                          title={`${tp.channel} — ${tp.source} — ${tp.timestamp}`}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: chipColor }}
                          />
                          <span className="whitespace-nowrap">{tp.channel}</span>
                          <span className="text-[9px] font-medium opacity-60">
                            {tp.timestamp.slice(5).replace("-", "/")}
                          </span>
                        </div>
                        {!isLast && (
                          <ArrowRight className="w-3 h-3 text-[#c0c9d4] flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
