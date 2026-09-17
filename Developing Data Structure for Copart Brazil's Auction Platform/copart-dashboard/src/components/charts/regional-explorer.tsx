"use client";

import { useMemo, useState } from "react";
import { BrazilHeatMap } from "@/components/charts/brazil-heatmap";
import { InfoTip } from "@/components/layout/info-tip";
import { formatNumberFull, formatPercentage } from "@/lib/utils/formatters";
import type { RegionalRow } from "@/lib/data/types";

type MapKpi = "entrantes" | "habilitados" | "taxa";
type Mode = "volume" | "per_capita";

export function RegionalExplorer({ rows }: { rows: RegionalRow[] }) {
  const [kpi, setKpi] = useState<MapKpi>("entrantes");
  const [mode, setMode] = useState<Mode>("volume");

  const mapped = useMemo(() => {
    return rows.map((row) => {
      const volume =
        kpi === "entrantes" ? row.entrantes : kpi === "habilitados" ? row.habilitados : row.taxa_habilitacao;
      const perCapita =
        kpi === "entrantes" ? row.perCapitaEntrantes : kpi === "habilitados" ? row.perCapitaHabilitados : row.taxa_habilitacao;
      const value = mode === "per_capita" && kpi !== "taxa" ? perCapita : volume;
      return { ...row, entrantes: value };
    });
  }, [rows, kpi, mode]);

  const ranking = rows.filter(
    (row) => (row.geo !== "OUTROS" && row.geo !== "VAZIAS") || row.entrantes > 0 || row.habilitados > 0
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685]">
          KPI do mapa
          <select
            value={kpi}
            onChange={(e) => setKpi(e.target.value as MapKpi)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            <option value="entrantes">Entrantes</option>
            <option value="habilitados">Habilitados</option>
            <option value="taxa">Taxa de habilitação</option>
            <option value="leads" disabled>Leads (sem UF nesta carga)</option>
            <option value="arrematantes" disabled>Arrematantes (sem UF nesta carga)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest font-bold text-[#6c7685]">
          Escala
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="h-9 rounded-lg border border-[#dfe6ee] bg-[#f4f7fb] px-2 text-sm font-semibold text-[#0b1f3a]"
          >
            <option value="volume">Volume absoluto</option>
            <option value="per_capita">Per capita (por 100 mil hab.)</option>
          </select>
        </label>
        <span className="text-[11px] text-[#8c5700] font-semibold">
          Lead e arrematante sem UF
          <InfoTip text="O Excel Copart traz só entrantes e habilitados por estado. Lead Select e arrematantes não têm granularidade UF nesta carga." />
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrazilHeatMap rows={mapped} />
        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {ranking.map((row) => (
            <div key={row.geo} className="bg-white border border-[#dfe6ee] rounded-2xl p-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-[#0b1f3a] text-sm">{row.label}</p>
                <p className="text-[11px] text-[#6c7685]">
                  {row.source === "empty" ? "Zero no recorte" : formatPercentage(row.taxa_habilitacao) + " habilitação"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#0b1f3a] text-sm">
                  {kpi === "taxa"
                    ? formatPercentage(row.taxa_habilitacao)
                    : formatNumberFull(
                        mode === "per_capita"
                          ? kpi === "habilitados"
                            ? row.perCapitaHabilitados
                            : row.perCapitaEntrantes
                          : kpi === "habilitados"
                            ? row.habilitados
                            : row.entrantes
                      )}
                </p>
                {mode === "volume" && kpi !== "taxa" && (
                  <p className="text-[11px] text-[#6c7685]">{formatNumberFull(row.habilitados)} hab.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
