#!/usr/bin/env python3
"""Parse raw/ Meta, Google Ads, GA4 and Copart CSVs into src/lib/data/raw-snapshot.json."""

from __future__ import annotations

import csv
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "raw"
OUT = ROOT / "src" / "lib" / "data" / "raw-snapshot.json"


def find_raw(*needles: str) -> Path:
    folded = [strip_accents(n).lower() for n in needles]
    for path in RAW.iterdir():
        name = strip_accents(path.name).lower()
        if all(needle in name for needle in folded):
            return path
    raise FileNotFoundError(needles)


def blank(value: str | None) -> bool:
    return str(value or "").strip() in {"", "--", "—", "-"}


def collect_indexed(row: dict, prefix: str, count: int) -> list[str]:
    values: list[str] = []
    for index in range(1, count + 1):
        text = str(row.get(f"{prefix} {index}") or "").strip()
        if not blank(text):
            values.append(text)
    return values


def google_format(ad_type: str) -> str:
    t = strip_accents(ad_type).lower()
    if "video" in t:
        return "Vídeo"
    if "pesquisa" in t:
        return "Texto (RSA)"
    if "grafico" in t or "display" in t:
        return "Estático"
    return ad_type or "n/d"


def strip_accents(text: str) -> str:
    n = unicodedata.normalize("NFD", text)
    return "".join(c for c in n if unicodedata.category(c) != "Mn")


def classify_unit(name: str, ad_group: str | None = None) -> str:
    g = strip_accents(ad_group or "").upper().strip()
    if g == "COMPRA":
        return "select_compra"
    if g == "VENDA":
        return "select_venda"
    if "LEILAO" in g or g == "INSTITUCIONAL":
        return "leilao_compra"

    n = strip_accents(name).upper()
    compact = n.replace(" ", "").replace("_", "").replace("-", "")
    if "VENDADIRETA" in compact and "LEILAO" not in n:
        if "VENDER" in n or "WHATS" in n:
            return "select_venda"
        return "select_compra"
    if "[WHATS]" in n or ("WHATSAPP" in n and "VENDER" in n) or ("WHATS" in n and "VENDER" in n):
        return "select_venda"
    if "VENDER" in n and "COMPRAR" not in n and "COMPRA" not in n and "LEILAO" not in n:
        return "select_venda"
    compra_tokens = (
        "COMPRAR",
        "CATALOGO",
        "COMPRE AGORA",
        "VENHA COMPRAR",
        "VENDAS TESTE",
        "VENDAS |",
        "[COMPRA]",
        "TRAFEGO][COMPRA",
        "TRÁFEGO][COMPRA",
    )
    if any(tok in n for tok in compra_tokens) and "LEILAO" not in n:
        return "select_compra"
    if "COMPRA" in n and "LEILAO" not in n and "VENDA DIRETA" in n and "COMPRA E VENDA" not in n:
        return "select_compra"
    if "COMPRA" in n and "LEILAO" not in n and not ("VENDA DIRETA" in n and "COMPRA E VENDA" in n):
        return "select_compra"
    return "leilao_compra"


def br_number(value: str | None) -> float:
    if value is None:
        return 0.0
    s = str(value).strip().replace("%", "")
    if s in {"", "--", "—", "-"}:
        return 0.0
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    elif s.count(".") == 1:
        left, right = s.split(".")
        if len(right) == 3 and left.isdigit():
            s = left + right
    try:
        return float(s)
    except ValueError:
        return 0.0


def result_type(indicator: str) -> str:
    i = (indicator or "").lower()
    if "cadastro" in i or "fb_pixel_custom.cadastro" in i:
        return "cadastro"
    if "messaging" in i or "conversation" in i:
        return "messaging"
    if "landing_page" in i:
        return "landing"
    if "link_click" in i:
        return "link"
    if i == "reach":
        return "reach"
    if "conversion" in i:
        return "conversion"
    return "other"


def parse_meta() -> list[dict]:
    path = next(RAW.glob("Copart-Boleto-Campaigns*.csv"))
    campaigns = []
    with path.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            spend = br_number(row.get("Amount spent (BRL)"))
            impressions = int(br_number(row.get("Impressions")))
            ctr = br_number(row.get("Unique CTR (link click-through rate)"))
            clicks = int(round(impressions * ctr / 100)) if impressions and ctr else 0
            results = br_number(row.get("Results"))
            rtype = result_type(row.get("Result indicator") or "")
            name = row.get("Campaign name") or ""
            if spend <= 0 and results <= 0 and impressions <= 0:
                continue
            campaigns.append(
                {
                    "source": "meta",
                    "name": name,
                    "adGroup": None,
                    "unit": classify_unit(name),
                    "delivery": row.get("Campaign delivery") or "",
                    "spend": round(spend, 2),
                    "impressions": impressions,
                    "reach": int(br_number(row.get("Reach"))),
                    "clicks": clicks,
                    "ctr": round(ctr, 4),
                    "results": results,
                    "resultType": rtype,
                    "conversas": int(br_number(row.get("Total messaging contacts"))),
                    "newConversas": int(br_number(row.get("New messaging contacts"))),
                }
            )
    return campaigns


def parse_google() -> list[dict]:
    path = find_raw("performance")
    lines = path.read_text(encoding="utf-8").splitlines()
    reader = csv.DictReader(lines[2:])
    campaigns = []
    for row in reader:
        spend = br_number(row.get("Custo"))
        clicks = int(br_number(row.get("Cliques")))
        impressions = int(br_number(row.get("Impr.")))
        if spend <= 0 and clicks <= 0:
            continue
        name = row.get("Campanha") or ""
        ad_group = row.get("Grupo de anúncios") or ""
        conversions = br_number(row.get("Conversões"))
        ctr = br_number(row.get("CTR"))
        campaigns.append(
            {
                "source": "google",
                "name": name,
                "adGroup": ad_group,
                "unit": classify_unit(name, ad_group),
                "delivery": row.get("Status do grupo de anúncios") or "",
                "spend": round(spend, 2),
                "impressions": impressions,
                "reach": 0,
                "clicks": clicks,
                "ctr": round(ctr, 4),
                "results": conversions,
                "resultType": "conversion",
                "conversas": 0,
                "newConversas": 0,
            }
        )
    return campaigns


def parse_copart() -> list[dict]:
    path = RAW / "copart_resultados_mensais.csv"
    rows = []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                {
                    "year": int(row["ano"]),
                    "month": row["mes"],
                    "period": row["periodo"],
                    "entrantes": int(br_number(row["entrantes"])),
                    "habilitados": int(br_number(row["habilitados"])),
                    "metaEntrantes": int(br_number(row.get("meta_entrantes"))) or None,
                    "metaHabilitados": int(br_number(row.get("meta_habilitados"))) or None,
                    "atingimentoEntrantesPct": br_number(row.get("atingimento_entrantes_pct")) or None,
                    "atingimentoHabilitadosPct": br_number(row.get("atingimento_habilitados_pct")) or None,
                }
            )
    return rows


def parse_meta_ads() -> list[dict]:
    path = next(RAW.glob("Copart-Boleto-Ads*.csv"))
    merged: dict[tuple[str, str], dict] = {}
    with path.open(encoding="utf-8", newline="") as handle:
        for index, row in enumerate(csv.DictReader(handle)):
            name = (row.get("Ad name") or "").strip()
            ad_set = (row.get("Ad set name") or "").strip()
            if not name:
                continue
            spend = br_number(row.get("Amount spent (BRL)"))
            impressions = int(br_number(row.get("Impressions")))
            results = br_number(row.get("Results"))
            rtype = result_type(row.get("Result indicator") or "")
            key = (name, ad_set)
            rec = merged.get(key)
            if rec is None:
                rec = {
                    "id": f"meta-{len(merged) + 1}",
                    "source": "meta",
                    "name": name,
                    "campaign": name.rsplit(" AD", 1)[0] if " AD" in name else name,
                    "adGroup": ad_set,
                    "unit": classify_unit(name, ad_set),
                    "delivery": row.get("Ad delivery") or "",
                    "adType": "Anúncio Meta",
                    "format": "n/d",
                    "quality": None,
                    "qualityHint": None,
                    "finalUrl": None,
                    "headlines": [],
                    "descriptions": [],
                    "hasImageIds": False,
                    "spend": 0.0,
                    "impressions": 0,
                    "reach": 0,
                    "clicks": 0,
                    "ctr": 0.0,
                    "resultsCadastro": 0.0,
                    "resultsLanding": 0.0,
                    "conversas": 0,
                    "conversions": 0.0,
                }
                merged[key] = rec
            rec["spend"] = max(rec["spend"], round(spend, 2))
            rec["impressions"] = max(rec["impressions"], impressions)
            rec["reach"] = max(rec["reach"], int(br_number(row.get("Reach"))))
            rec["conversas"] = max(rec["conversas"], int(br_number(row.get("Total messaging contacts"))))
            if (row.get("Ad delivery") or "") == "active":
                rec["delivery"] = "active"
            if rtype == "cadastro":
                rec["resultsCadastro"] += results
            elif rtype == "landing":
                rec["resultsLanding"] += results
            rec["conversions"] = rec["resultsCadastro"]
    out = []
    for rec in merged.values():
        if rec["spend"] <= 0 and rec["impressions"] <= 0 and rec["resultsCadastro"] <= 0 and rec["resultsLanding"] <= 0:
            continue
        rec["resultsCadastro"] = round(rec["resultsCadastro"], 2)
        rec["resultsLanding"] = round(rec["resultsLanding"], 2)
        rec["conversions"] = round(rec["conversions"], 2)
        out.append(rec)
    out.sort(key=lambda row: row["spend"], reverse=True)
    return out


def parse_google_ads() -> list[dict]:
    path = find_raw("relatorio", "anuncios")
    lines = path.read_text(encoding="utf-8").splitlines()
    reader = csv.DictReader(lines[2:])
    ads = []
    for index, row in enumerate(reader):
        campaign = (row.get("Campanha") or "").strip()
        ad_type = (row.get("Tipo de anúncio") or "").strip()
        if blank(campaign) or blank(ad_type):
            continue
        ad_group = (row.get("Grupo de anúncios") or "").strip()
        name = (row.get("Nome do anúncio") or "").strip()
        headlines = collect_indexed(row, "Título", 15)
        descriptions = collect_indexed(row, "Descrição", 5)
        if blank(name):
            name = headlines[0] if headlines else f"{ad_type} — {campaign[:40]}"
        spend = br_number(row.get("Custo"))
        impressions = int(br_number(row.get("Impr.")))
        clicks = int(br_number(row.get("Interações")))
        conversions = br_number(row.get("Conversões"))
        ads.append(
            {
                "id": f"google-{index + 1}",
                "source": "google",
                "name": name,
                "campaign": campaign,
                "adGroup": ad_group,
                "unit": classify_unit(campaign, ad_group),
                "delivery": (row.get("Status") or "").strip(),
                "adType": ad_type,
                "format": google_format(ad_type),
                "quality": None if blank(row.get("Qualidade do anúncio")) else row.get("Qualidade do anúncio"),
                "qualityHint": None if blank(row.get("Melhorias na qualidade do anúncio")) else row.get("Melhorias na qualidade do anúncio"),
                "finalUrl": None if blank(row.get("URL final")) else row.get("URL final"),
                "headlines": headlines,
                "descriptions": descriptions,
                "hasImageIds": not blank(row.get("ID da imagem")),
                "spend": round(spend, 2),
                "impressions": impressions,
                "reach": 0,
                "clicks": clicks,
                "ctr": round(br_number(row.get("Taxa de interação")), 4),
                "resultsCadastro": 0.0,
                "resultsLanding": 0.0,
                "conversas": 0,
                "conversions": round(conversions, 2),
            }
        )
    ads.sort(key=lambda row: row["spend"], reverse=True)
    return ads


def parse_ga4() -> dict:
    path = next(RAW.glob("Resumo*.csv"))
    lines = path.read_text(encoding="utf-8").splitlines()
    sections: list[dict] = []
    current = None
    for line in lines:
        if line.startswith("# Data de início"):
            current = {"header": None, "rows": []}
            sections.append(current)
        elif current is None:
            continue
        elif line.startswith("#"):
            continue
        elif current["header"] is None and line.strip():
            current["header"] = line
        elif current["header"] and line.strip():
            current["rows"].append(line)
        elif not line.strip():
            current = None

    def by_header(prefix: str) -> dict | None:
        for section in sections:
            if section["header"] and section["header"].startswith(prefix):
                return section
        return None

    def daily(prefix: str, metric_index: int = 1) -> list[dict]:
        section = by_header(prefix)
        out = []
        if not section:
            return out
        for row in section["rows"]:
            parts = row.split(",")
            day = int(parts[0])
            out.append({"date": f"2026-08-{day + 1:02d}", "value": float(parts[metric_index])})
        return out

    def kv(prefix: str) -> dict[str, float]:
        section = by_header(prefix)
        out: dict[str, float] = {}
        if not section:
            return out
        for row in section["rows"]:
            key, _, rest = row.partition(",")
            out[key] = br_number(rest)
        return out

    return {
        "dailyActiveUsers": daily("Nº dia,Usuários ativos"),
        "dailyNewUsers": daily("Nº dia,Novos usuários"),
        "dailyEngagementSec": daily("Nº dia,Tempo médio de engajamento"),
        "firstUserChannels": kv("Grupo principal de canais do primeiro usuário"),
        "sessionChannels": kv("Grupo principal de canais da sessão"),
        "countryActiveUsers": kv("País,Usuários ativos"),
        "events": {k: int(v) for k, v in kv("Nome do evento,Contagem de eventos").items()},
        "keyEvents": {k: int(v) for k, v in kv("Nome do evento,Eventos principais").items()},
    }


def main() -> None:
    campaigns = parse_meta() + parse_google()
    creatives = parse_meta_ads() + parse_google_ads()
    snapshot = {
        "origin": "weekly_report",
        "originLabel": "Meta + GA4 ago/2026 · Copart set/2026",
        "mediaStart": "2026-08-01",
        "mediaEnd": "2026-08-31",
        "copartStart": "2026-09-01",
        "copartEnd": "2026-09-13",
        "files": [
            "Copart-Boleto-Campaigns-Aug-1-2026-Aug-31-2026.csv",
            "Copart-Boleto-Ads-Aug-1-2026-Aug-31-2026.csv",
            "Performance do grupo de anúncios.csv",
            "Relatório de anúncios.csv",
            "Resumo_dos_relatórios.csv",
            "copart_resultados_mensais.csv",
        ],
        "copartMonthly": parse_copart(),
        "ga4": parse_ga4(),
        "campaigns": campaigns,
        "creatives": creatives,
    }
    OUT.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    spend = sum(c["spend"] for c in campaigns)
    creative_spend = sum(c["spend"] for c in creatives)
    print(
        f"wrote {OUT} campaigns={len(campaigns)} spend={spend:.2f} "
        f"creatives={len(creatives)} creative_spend={creative_spend:.2f}"
    )


if __name__ == "__main__":
    main()
