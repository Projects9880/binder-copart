# Estrutura de Pastas e Taxonomia de Campanhas — Copart Brasil

**Versão**: 1.0  
**Data**: Julho 2026  
**Objetivo**: Definir organização de arquivos em Google Drive/SharePoint e padrão de nomeação de campanhas

---

## 1. Estrutura de Pastas (Google Drive + SharePoint)

### 1.1 Estrutura Recomendada

```
Copart Brasil — WiseMetrics
│
├── 📁 00_GOVERNANÇA
│   ├── 📄 Dicionário de Dados (v1.0)
│   ├── 📄 Padrões de Nomeação
│   ├── 📄 SLA de Qualidade
│   └── 📄 Roadmap de Implementação
│
├── 📁 01_DADOS_BRUTOS
│   ├── 📁 GA4
│   │   ├── 📊 GA4_Entrantes_Mensais.xlsx
│   │   ├── 📊 GA4_Comportamento_Usuários.xlsx
│   │   └── 📊 GA4_Eventos_Customizados.xlsx
│   │
│   ├── 📁 Google_Ads
│   │   ├── 📊 GoogleAds_Performance_Diária.xlsx
│   │   ├── 📊 GoogleAds_Campanhas_Ativas.xlsx
│   │   └── 📊 GoogleAds_Conversões.xlsx
│   │
│   ├── 📁 Meta_Ads
│   │   ├── 📊 MetaAds_Performance_Diária.xlsx
│   │   ├── 📊 MetaAds_Campanhas_Ativas.xlsx
│   │   └── 📊 MetaAds_Conversões.xlsx
│   │
│   ├── 📁 RD_Station
│   │   ├── 📊 RDStation_Contatos_Novos.xlsx
│   │   ├── 📊 RDStation_Funil_Vendas.xlsx
│   │   └── 📊 RDStation_Segmentação.xlsx
│   │
│   ├── 📁 Copart_Interno
│   │   ├── 📊 Entrantes_Habilitados_Diários.xlsx
│   │   ├── 📊 Licitantes_por_Veículo.xlsx
│   │   ├── 📊 Arremates_Diários.xlsx
│   │   ├── 📊 Conversas_WhatsApp.xlsx
│   │   └── 📊 Origem_Campanha_Interna.xlsx
│   │
│   └── 📁 mLabs
│       ├── 📊 mLabs_Tráfego_Diário.xlsx
│       └── 📊 mLabs_Comportamento.xlsx
│
├── 📁 02_DADOS_PROCESSADOS
│   ├── 📁 Staging
│   │   ├── 📊 Staging_User_Journey.xlsx
│   │   ├── 📊 Staging_Conversion_Events.xlsx
│   │   └── 📊 Staging_Campaign_Performance.xlsx
│   │
│   └── 📁 Mart
│       ├── 📊 Mart_Daily_Metrics.xlsx
│       ├── 📊 Mart_User_Cohort.xlsx
│       └── 📊 Mart_Attribution_Model.xlsx
│
├── 📁 03_CAMPANHAS
│   ├── 📁 LEILÃO
│   │   ├── 📁 2026_Q3
│   │   │   ├── 📁 META_LEILAO_BR_LAL_VIDEO_CPC
│   │   │   │   ├── 📄 Brief.md
│   │   │   │   ├── 📊 Performance.xlsx
│   │   │   │   ├── 📊 Audiência.xlsx
│   │   │   │   └── 📁 Criativos
│   │   │   │
│   │   │   ├── 📁 GOOGLE_LEILAO_SP_INT_STATIC_CPM
│   │   │   │   ├── 📄 Brief.md
│   │   │   │   ├── 📊 Performance.xlsx
│   │   │   │   └── 📁 Criativos
│   │   │   │
│   │   │   └── 📁 ORGANIC_LEILAO_BR_SEO
│   │   │       ├── 📄 Estratégia SEO.md
│   │   │       ├── 📊 Ranking.xlsx
│   │   │       └── 📊 Tráfego Orgânico.xlsx
│   │   │
│   │   └── 📁 2026_Q4
│   │       └── (estrutura similar)
│   │
│   └── 📁 VENDA_DIRETA
│       ├── 📁 2026_Q3
│       │   ├── 📁 META_VENDA_BR_LAL_VIDEO_CPC
│       │   │   ├── 📄 Brief.md
│       │   │   ├── 📊 Performance.xlsx
│       │   │   └── 📁 Criativos
│       │   │
│       │   ├── 📁 GOOGLE_VENDA_BR_INT_STATIC_CPM
│       │   │   ├── 📄 Brief.md
│       │   │   └── 📊 Performance.xlsx
│       │   │
│       │   └── 📁 WHATSAPP_VENDA_BR_DIRECT
│       │       ├── 📄 Brief.md
│       │       └── 📊 Conversas.xlsx
│       │
│       └── 📁 2026_Q4
│           └── (estrutura similar)
│
├── 📁 04_DASHBOARDS
│   ├── 📄 Dashboard_Executivo.md (especificação)
│   ├── 📄 Dashboard_Operacional.md (especificação)
│   ├── 📊 Dashboard_Executivo_Link.txt (URL Data Studio)
│   └── 📊 Dashboard_Operacional_Link.txt (URL Data Studio)
│
├── 📁 05_RELATÓRIOS
│   ├── 📁 Semanais
│   │   ├── 📄 Semana_01_2026.md
│   │   ├── 📄 Semana_02_2026.md
│   │   └── 📄 Semana_03_2026.md
│   │
│   ├── 📁 Mensais
│   │   ├── 📄 Diagnóstico_Julho_2026.md
│   │   └── 📄 Diagnóstico_Agosto_2026.md
│   │
│   └── 📁 Especiais
│       ├── 📄 Análise_Atribuição.md
│       └── 📄 Análise_Coortes.md
│
├── 📁 06_INTELIGÊNCIA
│   ├── 📁 Recomendações_Semanais
│   │   ├── 📄 Recomendações_Semana_01.md
│   │   ├── 📄 Recomendações_Semana_02.md
│   │   └── 📄 Recomendações_Semana_03.md
│   │
│   ├── 📁 Análise_Gargalos
│   │   ├── 📄 Gargalo_Habilitação.md
│   │   ├── 📄 Gargalo_Atribuição.md
│   │   └── 📄 Gargalo_Qualidade_Tráfego.md
│   │
│   └── 📁 Quick_Wins
│       ├── 📄 Quick_Win_01_Limpeza_Campanhas.md
│       └── 📄 Quick_Win_02_Segmentação_Audiência.md
│
├── 📁 07_TEMPLATES
│   ├── 📊 Template_Campanha_Brief.md
│   ├── 📊 Template_Performance_Semanal.xlsx
│   ├── 📊 Template_Relatório_Mensal.md
│   ├── 📊 Template_Recomendações.md
│   └── 📊 Template_Análise_Gargalo.md
│
└── 📁 08_HISTÓRICO
    ├── 📁 Arquivos_Antigos
    ├── 📁 Versões_Anteriores
    └── 📁 Backup_Dados

```

### 1.2 Convenção de Nomes para Arquivos

**Padrão geral**:
```
[TIPO]_[DESCRIÇÃO]_[PERÍODO]_[VERSÃO].extensão
```

**Exemplos**:
- `CAMPANHA_META_LEILAO_BR_LAL_VIDEO_CPC_Q3_2026_v1.0.xlsx`
- `RELATÓRIO_DIAGNÓSTICO_JULHO_2026_v2.1.md`
- `DASHBOARD_EXECUTIVO_LINK_v1.0.txt`
- `TEMPLATE_PERFORMANCE_SEMANAL_v1.0.xlsx`

---

## 2. Taxonomia de Campanhas

### 2.1 Estrutura Hierárquica

```
COPART BRASIL
│
├── LEILÃO (Unidade de Negócio)
│   ├── AWARENESS (Estágio do Funil)
│   │   ├── BRAND (Tipo de Campanha)
│   │   │   └── META_LEILAO_BR_BRAND_VIDEO_CPC (Campanha Tática)
│   │   │
│   │   └── GENERIC (Tipo de Campanha)
│   │       └── GOOGLE_LEILAO_BR_GENERIC_STATIC_CPM
│   │
│   ├── CONSIDERATION (Estágio do Funil)
│   │   ├── INTEREST (Tipo de Campanha)
│   │   │   └── META_LEILAO_SP_INT_VIDEO_CPC
│   │   │
│   │   └── LOOKALIKE (Tipo de Campanha)
│   │       └── META_LEILAO_BR_LAL_VIDEO_CPC
│   │
│   ├── CONVERSION (Estágio do Funil)
│   │   ├── REMARKETING (Tipo de Campanha)
│   │   │   └── META_LEILAO_BR_RMKT_STATIC_CPA
│   │   │
│   │   └── CUSTOM (Tipo de Campanha)
│   │       └── GOOGLE_LEILAO_BR_CUSTOM_STATIC_CPA
│   │
│   └── ORGANIC (Canal)
│       ├── SEO (Tipo de Campanha)
│       │   └── ORGANIC_LEILAO_BR_SEO_CORE
│       │
│       └── SOCIAL (Tipo de Campanha)
│           └── ORGANIC_LEILAO_BR_SOCIAL_CONTENT
│
└── VENDA_DIRETA (Unidade de Negócio)
    ├── AWARENESS (Estágio do Funil)
    │   ├── BRAND (Tipo de Campanha)
    │   │   └── META_VENDA_BR_BRAND_VIDEO_CPC
    │   │
    │   └── GENERIC (Tipo de Campanha)
    │       └── GOOGLE_VENDA_BR_GENERIC_STATIC_CPM
    │
    ├── CONSIDERATION (Estágio do Funil)
    │   └── LOOKALIKE (Tipo de Campanha)
    │       └── META_VENDA_BR_LAL_VIDEO_CPC
    │
    ├── CONVERSION (Estágio do Funil)
    │   └── REMARKETING (Tipo de Campanha)
    │       └── META_VENDA_BR_RMKT_STATIC_CPA
    │
    └── DIRECT (Canal)
        └── WHATSAPP (Tipo de Campanha)
            └── WHATSAPP_VENDA_BR_DIRECT_CPC
```

### 2.2 Fórmula de Nomeação Tática

**Estrutura**: `[CHANNEL]_[UNIT]_[GEO]_[AUDIENCE]_[FORMAT]_[BUY_MODEL]`

| **Componente** | **Variáveis** | **Exemplo** | **Notas** |
|---|---|---|---|
| **CHANNEL** | META, GOOGLE, TIKTOK, ORGANIC, WHATSAPP, DIRECT | META | Plataforma de mídia ou canal |
| **UNIT** | LEILAO, VENDA | LEILAO | Unidade de negócio |
| **GEO** | BR, SP, RJ, MG, RS, etc. | BR | Geografia (Brasil ou estado) |
| **AUDIENCE** | BRAND, INT, LAL, RMKT, CUSTOM, GENERIC | LAL | Tipo de audiência |
| **FORMAT** | VIDEO, STATIC, CAROUSEL, COLLECTION, TEXT | VIDEO | Formato do criativo |
| **BUY_MODEL** | CPC, CPM, CPA, ROAS | CPC | Modelo de compra |

**Exemplos completos**:
- `META_LEILAO_BR_LAL_VIDEO_CPC` → Meta, Leilão, Brasil, Look-alike, Vídeo, CPC
- `GOOGLE_LEILAO_SP_INT_STATIC_CPM` → Google, Leilão, São Paulo, Interesse, Estático, CPM
- `META_VENDA_BR_RMKT_CAROUSEL_CPA` → Meta, Venda/Compra Direta, Brasil, Remarketing, Carrossel, CPA
- `WHATSAPP_VENDA_BR_DIRECT_CPC` → WhatsApp, Venda/Compra Direta, Brasil, Direto, CPC

### 2.3 Variáveis Detalhadas

#### CHANNEL (Canal de Mídia)
| **Código** | **Descrição** | **Plataforma** |
|---|---|---|
| META | Meta Ads (Facebook + Instagram) | Facebook Ads Manager |
| GOOGLE | Google Ads (Search + Display) | Google Ads |
| TIKTOK | TikTok Ads | TikTok Ads Manager |
| ORGANIC | Tráfego Orgânico (SEO + Social) | GA4 |
| WHATSAPP | WhatsApp Business | WhatsApp API |
| DIRECT | Tráfego Direto | GA4 |

#### UNIT (Unidade de Negócio)
| **Código** | **Descrição** | **Meta Mensal** |
|---|---|---|
| LEILAO | Leilão de Veículos | 22k entrantes / 11k habilitados |
| VENDA | Venda/Compra Direta | 700-800 conversas/semana |

#### GEO (Geografia)
| **Código** | **Região** | **Prioridade** |
|---|---|---|
| BR | Brasil (Nacional) | 1 |
| SP | São Paulo | 2 |
| RJ | Rio de Janeiro | 3 |
| MG | Minas Gerais | 4 |
| RS | Rio Grande do Sul | 5 |
| BA | Bahia | 6 |
| SC | Santa Catarina | 7 |
| PR | Paraná | 8 |

#### AUDIENCE (Tipo de Audiência)
| **Código** | **Descrição** | **Aplicação** |
|---|---|---|
| BRAND | Audiência de Marca | Campanhas de reforço de marca |
| INT | Interesse | Campanhas baseadas em interesses (ex: "carros", "leilões") |
| LAL | Look-alike | Audiências similares a conversores |
| RMKT | Remarketing | Usuários que já visitaram o site |
| CUSTOM | Audiência Customizada | Listas de email, phone, etc. |
| GENERIC | Genérica | Audiência ampla, sem segmentação |

#### FORMAT (Formato do Criativo)
| **Código** | **Descrição** | **Plataformas** |
|---|---|---|
| VIDEO | Vídeo (15-60s) | Meta, Google, TikTok |
| STATIC | Imagem Estática | Meta, Google, TikTok |
| CAROUSEL | Carrossel (múltiplas imagens) | Meta, Google |
| COLLECTION | Collection (catálogo) | Meta, Google |
| TEXT | Texto Puro | Google Search |

#### BUY_MODEL (Modelo de Compra)
| **Código** | **Descrição** | **Métrica** |
|---|---|---|
| CPC | Custo por Clique | Cliques no anúncio |
| CPM | Custo por Mil Impressões | Impressões |
| CPA | Custo por Ação | Conversões (entrantes, habilitados) |
| ROAS | Retorno sobre Gasto em Anúncios | Valor de conversão / Gasto |

### 2.4 Mapeamento de Campanhas Táticas para Plataformas

#### Google Ads
```
Campaign Name (Google Ads) → Campanha Tática (Copart)
└── Ad Group (Google Ads) → Audiência + Formato

Exemplo:
Campaign: "GOOGLE_LEILAO_SP_INT_STATIC_CPM"
└── Ad Group 1: "Interesse_Carros_Leilão"
└── Ad Group 2: "Interesse_Seguros_Leilão"
```

#### Meta Ads
```
Campaign (Meta Ads) → Campanha Tática (Copart)
└── Ad Set (Meta Ads) → Audiência + Geo + Formato
    └── Ad (Meta Ads) → Criativo específico

Exemplo:
Campaign: "META_LEILAO_BR_LAL_VIDEO_CPC"
└── Ad Set 1: "LAL_SP_Video_15s"
└── Ad Set 2: "LAL_RJ_Video_30s"
    └── Ad 1: "Video_Leilão_Promo_01"
    └── Ad 2: "Video_Leilão_Promo_02"
```

### 2.5 UTM Parameters (Obrigatório)

**Estrutura padrão**:
```
utm_source = [CHANNEL em minúscula]
utm_medium = [BUY_MODEL em minúscula]
utm_campaign = [Campanha Tática completa]
utm_content = [AdSet ID ou AdSet Name]
utm_term = [Audiência ou Keyword, se aplicável]
```

**Exemplos**:
```
Campanha: META_LEILAO_BR_LAL_VIDEO_CPC

utm_source = meta
utm_medium = cpc
utm_campaign = META_LEILAO_BR_LAL_VIDEO_CPC
utm_content = LAL_SP_Video_15s
utm_term = look_alike_converters

URL completa:
https://www.copart.com.br/leilao?utm_source=meta&utm_medium=cpc&utm_campaign=META_LEILAO_BR_LAL_VIDEO_CPC&utm_content=LAL_SP_Video_15s&utm_term=look_alike_converters
```

---

## 3. Calendário de Campanhas

### 3.1 Exemplo de Planejamento Trimestral

| **Período** | **Unidade** | **Campanha Tática** | **CHANNEL** | **AUDIENCE** | **Budget (R$)** | **Meta** |
|---|---|---|---|---|---|---|
| **Q3 2026** | LEILAO | META_LEILAO_BR_LAL_VIDEO_CPC | META | LAL | 50.000 | 5k entrantes |
| **Q3 2026** | LEILAO | GOOGLE_LEILAO_SP_INT_STATIC_CPM | GOOGLE | INT | 30.000 | 3k entrantes |
| **Q3 2026** | LEILAO | ORGANIC_LEILAO_BR_SEO_CORE | ORGANIC | SEO | 0 | 2k entrantes |
| **Q3 2026** | VENDA | META_VENDA_BR_LAL_VIDEO_CPC | META | LAL | 20.000 | 150 conversas |
| **Q3 2026** | VENDA | WHATSAPP_VENDA_BR_DIRECT_CPC | WHATSAPP | DIRECT | 10.000 | 100 conversas |

---

## 4. Governança de Campanhas

### 4.1 Responsabilidades

| **Função** | **Responsável** | **Atividades** |
|---|---|---|
| **Estratégia de Campanha** | Miriam (Diretora de Mídia) | Definir objetivos, audiências, budget |
| **Execução Tática** | Bruno, Felipe, Maria (Mídia) | Criar campanhas, monitorar performance |
| **Nomeação e Documentação** | WiseMetrics + Binder | Garantir padrão de nomeação, documentar briefs |
| **Rastreamento de Dados** | Vitória (Copart) + WiseMetrics | Coletar dados, validar atribuição |
| **Análise e Recomendações** | WiseMetrics | Gerar insights, recomendações semanais |

### 4.2 Checklist de Lançamento de Campanha

- [ ] Campanha nomeada seguindo padrão `[CHANNEL]_[UNIT]_[GEO]_[AUDIENCE]_[FORMAT]_[BUY_MODEL]`
- [ ] UTM parameters configurados corretamente
- [ ] Brief documentado em `/03_CAMPANHAS/[UNIT]/[PERIODO]/[CAMPANHA]/Brief.md`
- [ ] Audiência definida e documentada
- [ ] Criativos salvos em `/03_CAMPANHAS/[UNIT]/[PERIODO]/[CAMPANHA]/Criativos/`
- [ ] Budget aprovado
- [ ] Data de início e fim definidas
- [ ] Integração com GA4 validada
- [ ] Responsável designado

---

## 5. Integração com BigQuery

### 5.1 Mapeamento de Campanhas para Data Lake

```
raw_google_ads_conversions
├── campaign_name (ex: "GOOGLE_LEILAO_SP_INT_STATIC_CPM")
├── campaign_id
├── adgroup_name
└── ...

raw_meta_ads_conversions
├── campaign_name (ex: "META_LEILAO_BR_LAL_VIDEO_CPC")
├── campaign_id
├── adset_name
└── ...

staging_campaign_performance
├── campaign_name (ex: "META_LEILAO_BR_LAL_VIDEO_CPC")
├── campaign_type (LEILAO ou VENDA)
├── channel (META, GOOGLE, ORGANIC, etc.)
├── audience (LAL, INT, RMKT, etc.)
├── geo (BR, SP, RJ, etc.)
└── ...
```

---

## 6. Próximos Passos

1. **Validar** estrutura de pastas com Binder (Google Drive vs. SharePoint)
2. **Criar** pastas base em Google Drive
3. **Documentar** campanhas atuais usando a taxonomia
4. **Treinar** time de mídia na nomeação padrão
5. **Configurar** UTM parameters em todas as campanhas ativas
6. **Integrar** nomes de campanhas com BigQuery

---
