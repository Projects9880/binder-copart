# Especificação de Dashboards — Copart Brasil

**Versão**: 1.0  
**Data**: Julho 2026  
**Objetivo**: Definir estrutura, métricas e layout dos dashboards executivo e operacional

---

## 1. Visão Geral dos Dashboards

A Copart Brasil requer **dois dashboards complementares** que servem a públicos e necessidades distintas:

| **Dashboard** | **Público** | **Frequência** | **Granularidade** | **Objetivo** |
|---|---|---|---|---|
| **Executivo** | Claudio Romano, Fernando, Miriam | Semanal | Agregado (canal + tipo) | Visão estratégica do funil |
| **Operacional** | Bruno, Felipe, Maria, Arthur, Caio | Diária | Detalhado (campanha) | Ações táticas diárias |

---

## 2. Dashboard Executivo

### 2.1 Propósito

O dashboard executivo fornece uma **visão consolidada do desempenho** das unidades de negócio (Leilão Core e Copart Select), permitindo que líderes entendam rapidamente:

- Progresso em relação às metas mensais
- Qualidade do tráfego e taxa de habilitação (Leilão)
- Captação de estoque vs Vendas de veículos (Copart Select)
- Eficiência de gasto em mídia por funil
- Principais gargalos operacionais e conversão

### 2.2 Estrutura de Abas

#### Aba 1: Visão Geral (Overview)

**Período**: Últimos 30 dias (com opção de filtro)

**Seção 1.1: KPIs Principais (Cards)**

```
┌─────────────────────────────────────────────────────────────┐
│  Entrantes (Mês)    Habilitados (Mês)   Taxa Habilitação   │
│      22.450              11.230              50.0%          │
│     ↑ 12% vs mês ant.   ↑ 8% vs mês ant.   ↓ 2% vs mês ant. │
│                                                              │
│  Veículos Captados   Veículos Vendidos    Custo/Venda (R$)   │
│       357 (Select)        248 (Select)        R$ 122,00      │
│     ↑ 14% vs mês ant.   ↑ 18% vs mês ant.   ↓ 4% vs mês ant. │
└─────────────────────────────────────────────────────────────┘
```

**Seção 1.2: Progresso em Relação às Metas (Gauge Charts)**

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  Leilão — Entrantes          Leilão — Habilitados            │
│  Meta: 22k | Realizado: 22.4k  Meta: 11k | Realizado: 11.2k │
│  ████████████░░░ 102%         ████████░░░░░░░░░ 102%        │
│                                                               │
│  Copart Select — Funil 1: Trazer para Vender (Conversas)     │
│  Meta: 3.2k/mês | Realizado: 3.1k                           │
│  ████████░░░░░░░░░░░░░░░░░░░ 97%                            │
│                                                               │
│  Copart Select — Funil 2: Venha Comprar (Vendas de Estoque)  │
│  Meta: 300/mês | Realizado: 248                             │
│  ██████████░░░░░░░░░░░░░░░░░ 82,6%                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Seção 1.3: Distribuição de Entrantes por Canal (Pie Chart)**

```
Leilão:
- Mídia Paga (Meta + Google): 65%
- Orgânico (SEO + Social): 25%
- Direto: 10%

Venda/Compra Direta:
- Mídia Paga (Meta): 70%
- Direto (WhatsApp): 30%
```

---

#### Aba 2: Funil de Leilão

**Período**: Últimos 30 dias

**Seção 2.1: Funil Visual (Sankey Diagram)**

```
Entrantes (22.450)
    ↓ 50% conversão
Habilitados (11.230)
    ↓ 35% conversão
Licitantes (3.930)
    ↓ 45% conversão
Arrematantes (1.770)
```

**Seção 2.2: Tabela de Performance por Canal**

| **Canal** | **Entrantes** | **Habilitados** | **Taxa Hab.** | **Custo/Entrante** | **Custo/Habilitado** | **Gasto (R$)** |
|---|---|---|---|---|---|---|
| **Meta** | 8.950 | 4.750 | 53.1% | R$ 8.20 | R$ 15.47 | R$ 73.400 |
| **Google** | 6.200 | 3.100 | 50.0% | R$ 9.10 | R$ 18.20 | R$ 56.400 |
| **Orgânico** | 5.600 | 2.800 | 50.0% | R$ 0.00 | R$ 0.00 | R$ 0 |
| **Direto** | 1.700 | 580 | 34.1% | R$ 0.00 | R$ 0.00 | R$ 0 |
| **TOTAL** | **22.450** | **11.230** | **50.0%** | **R$ 8.50** | **R$ 17.00** | **R$ 190.500** |

**Seção 2.3: Tendência de Taxa de Habilitação (Line Chart)**

```
Eixo Y: Taxa de Habilitação (%)
Eixo X: Últimos 30 dias

Linha 1: Meta (azul) — Tendência crescente de 48% para 53%
Linha 2: Google (laranja) — Tendência estável em ~50%
Linha 3: Orgânico (verde) — Tendência estável em ~50%
Linha 4: Total (preto) — Tendência crescente de 48% para 50%
```

---

#### Aba 3: Funil de Venda/Compra Direta

**Período**: Últimos 30 dias

**Seção 3.1: Funil Visual (Sankey Diagram)**

```
Cliques em CTA (2.800)
    ↓ 85% conversão
Conversas Iniciadas (2.380)
    ↓ 60% conversão
Contatos Qualificados (1.428)
    ↓ 40% conversão
Leads em Negociação (571)
```

**Seção 3.2: Tabela de Performance por Canal**

| **Canal** | **Cliques** | **Conversas** | **Taxa Conv.** | **Custo/Conversa** | **Gasto (R$)** |
|---|---|---|---|---|---|
| **Meta** | 1.960 | 1.666 | 85.0% | R$ 7.20 | R$ 12.000 |
| **WhatsApp Direct** | 840 | 714 | 85.0% | R$ 8.40 | R$ 6.000 |
| **TOTAL** | **2.800** | **2.380** | **85.0%** | **R$ 7.60** | **R$ 18.000** |

**Seção 3.3: Qualidade de Contatos (Bar Chart)**

```
Contatos Qualificados: 1.428 (60% das conversas)
Contatos Não Qualificados: 952 (40% das conversas)
```

---

#### Aba 4: Análise de Atribuição

**Período**: Últimos 30 dias

**Seção 4.1: Comparação de Modelos de Atribuição (Table)**

| **Campanha** | **First Touch** | **Last Touch** | **Linear** | **Time Decay** |
|---|---|---|---|---|
| META_LEILAO_BR_LAL_VIDEO_CPC | 3.200 | 2.800 | 3.000 | 2.900 |
| GOOGLE_LEILAO_SP_INT_STATIC_CPM | 2.100 | 2.400 | 2.250 | 2.350 |
| ORGANIC_LEILAO_BR_SEO_CORE | 1.800 | 1.500 | 1.650 | 1.550 |
| META_VENDA_BR_LAL_VIDEO_CPC | 1.200 | 1.100 | 1.150 | 1.120 |

**Seção 4.2: Confiabilidade de Dados (Gauge)**

```
Conversões com Atribuição Confiável: 92%
Conversões com Atribuição Questionável: 8%
```

---

### 2.3 Filtros Globais

- **Período**: Data de início e data de fim (padrão: últimos 30 dias)
- **Unidade de Negócio**: Leilão, Venda/Compra Direta, Ambas
- **Canal**: Meta, Google, Orgânico, WhatsApp, Todos
- **Geo**: Brasil, São Paulo, Rio de Janeiro, Minas Gerais, Todos

---

### 2.4 Atualização e Latência

- **Frequência**: Diária (atualização às 11h)
- **Latência**: Máximo 24h (dados do dia anterior)
- **Alertas**: Se alguma métrica cair > 20% vs. dia anterior, gerar alerta visual

---

## 3. Dashboard Operacional

### 3.1 Propósito

O dashboard operacional fornece **visibilidade tática diária** para o time de mídia, CRM e conteúdo, permitindo:

- Monitorar performance de cada campanha em tempo real
- Identificar campanhas com baixo desempenho
- Tomar decisões rápidas de otimização
- Rastrear progresso em relação a metas diárias

### 3.2 Estrutura de Abas

#### Aba 1: Performance Diária (Today)

**Período**: Hoje (com opção de histórico dos últimos 7 dias)

**Seção 1.1: Scorecard de Campanhas (Table)**

| **Campanha** | **Entrantes** | **Habilitados** | **Taxa** | **Gasto (R$)** | **Custo/Entrante** | **Status** |
|---|---|---|---|---|---|---|
| META_LEILAO_BR_LAL_VIDEO_CPC | 285 | 155 | 54.4% | 2.340 | 8.21 | ✅ No target |
| GOOGLE_LEILAO_SP_INT_STATIC_CPM | 210 | 105 | 50.0% | 1.890 | 9.00 | ⚠️ Below target |
| ORGANIC_LEILAO_BR_SEO_CORE | 180 | 90 | 50.0% | 0 | 0.00 | ✅ On track |
| META_VENDA_BR_LAL_VIDEO_CPC | 95 | — | — | 720 | 7.58 | ✅ On track |
| WHATSAPP_VENDA_BR_DIRECT_CPC | 45 | — | — | 360 | 8.00 | ✅ On track |

**Legenda de Status**:
- ✅ No target: Métrica dentro do esperado
- ⚠️ Below target: Métrica abaixo do esperado (< 90% da meta)
- 🔴 Critical: Métrica crítica (< 70% da meta)

**Seção 1.2: Comparação WoW (Week-over-Week)**

```
Entrantes (Hoje vs. Semana Passada):
Today: 815 | Last Week Avg: 780 | Δ +4.5% ✅

Habilitados (Hoje vs. Semana Passada):
Today: 445 | Last Week Avg: 420 | Δ +6.0% ✅

Taxa de Habilitação (Hoje vs. Semana Passada):
Today: 54.6% | Last Week Avg: 53.8% | Δ +0.8pp ✅
```

---

#### Aba 2: Campanhas de Leilão

**Período**: Últimos 7 dias (com opção de histórico)

**Seção 2.1: Tabela Detalhada de Campanhas**

| **Campanha** | **Canal** | **Impressões** | **Cliques** | **CTR** | **Entrantes** | **Habilitados** | **Taxa** | **Gasto** | **CPC** | **Custo/Entrante** |
|---|---|---|---|---|---|---|---|---|---|---|
| META_LEILAO_BR_LAL_VIDEO_CPC | META | 245.000 | 5.880 | 2.4% | 1.995 | 1.077 | 53.9% | 16.380 | 2.79 | 8.21 |
| GOOGLE_LEILAO_SP_INT_STATIC_CPM | GOOGLE | 156.000 | 3.120 | 2.0% | 1.470 | 735 | 50.0% | 13.230 | 4.24 | 9.00 |
| ORGANIC_LEILAO_BR_SEO_CORE | ORGANIC | — | — | — | 1.260 | 630 | 50.0% | 0 | — | 0.00 |

**Seção 2.2: Gráfico de Tendência de Taxa de Habilitação (Line Chart)**

```
Eixo Y: Taxa de Habilitação (%)
Eixo X: Últimos 7 dias

META_LEILAO_BR_LAL_VIDEO_CPC (azul): 52% → 53% → 54% → 54% → 54% → 53% → 54%
GOOGLE_LEILAO_SP_INT_STATIC_CPM (laranja): 50% → 50% → 50% → 50% → 50% → 50% → 50%
ORGANIC_LEILAO_BR_SEO_CORE (verde): 50% → 50% → 50% → 50% → 50% → 50% → 50%
```

**Seção 2.3: Distribuição de Gasto (Pie Chart)**

```
META_LEILAO_BR_LAL_VIDEO_CPC: 55%
GOOGLE_LEILAO_SP_INT_STATIC_CPM: 45%
ORGANIC_LEILAO_BR_SEO_CORE: 0%
```

---

#### Aba 3: Campanhas de Venda/Compra Direta

**Período**: Últimos 7 dias

**Seção 3.1: Tabela Detalhada de Campanhas**

| **Campanha** | **Canal** | **Cliques** | **Conversas** | **Taxa Conv.** | **Contatos Qualificados** | **Gasto** | **Custo/Conversa** |
|---|---|---|---|---|---|---|---|
| META_VENDA_BR_LAL_VIDEO_CPC | META | 1.372 | 1.166 | 85.0% | 700 | 8.400 | 7.20 |
| WHATSAPP_VENDA_BR_DIRECT_CPC | WHATSAPP | 588 | 500 | 85.0% | 300 | 4.200 | 8.40 |

**Seção 3.2: Gráfico de Tendência de Conversas (Line Chart)**

```
Eixo Y: Conversas Iniciadas
Eixo X: Últimos 7 dias

META_VENDA_BR_LAL_VIDEO_CPC (azul): 160 → 165 → 170 → 168 → 166 → 164 → 173
WHATSAPP_VENDA_BR_DIRECT_CPC (laranja): 68 → 70 → 72 → 71 → 70 → 69 → 80
```

---

#### Aba 4: Alertas e Anomalias

**Período**: Últimas 24h

**Seção 4.1: Alertas Críticos**

```
🔴 CRÍTICO: GOOGLE_LEILAO_SP_INT_STATIC_CPM
   Taxa de Habilitação caiu para 42% (vs. 50% esperado)
   Ação recomendada: Revisar segmentação de audiência
   Responsável: Felipe

⚠️ AVISO: META_LEILAO_BR_LAL_VIDEO_CPC
   Custo por Entrante subiu para R$ 9.50 (vs. R$ 8.20 esperado)
   Ação recomendada: Revisar lances de CPC
   Responsável: Bruno

ℹ️ INFO: ORGANIC_LEILAO_BR_SEO_CORE
   Tráfego orgânico cresceu 15% vs. semana passada
   Ação recomendada: Investigar quais páginas estão rankando
   Responsável: Caio
```

**Seção 4.2: Análise de Discrepâncias de Dados**

```
✅ GA4 vs. mLabs: Discrepância 3.2% (dentro do SLA)
✅ Google Ads vs. GA4: Discrepância 8.5% (dentro do SLA)
⚠️ Meta Ads vs. GA4: Discrepância 12.1% (dentro do SLA, mas monitorar)
✅ Copart (Planilhas) vs. RD Station: Discrepância 2.1% (dentro do SLA)
```

---

#### Aba 5: Recomendações Semanais

**Período**: Próxima semana

**Seção 5.1: Recomendações Acionáveis**

```
1️⃣ AUMENTAR ORÇAMENTO
   Campanha: META_LEILAO_BR_LAL_VIDEO_CPC
   Razão: Taxa de habilitação 54% (acima da meta de 50%)
   Impacto Estimado: +200 habilitados/mês
   Orçamento Proposto: +R$ 5.000 (de R$ 16.380 para R$ 21.380)
   Responsável: Bruno
   Prazo: Próxima segunda

2️⃣ REVISAR SEGMENTAÇÃO
   Campanha: GOOGLE_LEILAO_SP_INT_STATIC_CPM
   Razão: Taxa de habilitação caiu para 42% (abaixo da meta)
   Ação: Revisar audiência de interesse, considerar LAL
   Responsável: Felipe
   Prazo: Próxima terça

3️⃣ EXPANDIR COBERTURA ORGÂNICA
   Campanha: ORGANIC_LEILAO_BR_SEO_CORE
   Razão: Tráfego cresceu 15%, custo por entrante = R$ 0
   Ação: Identificar páginas rankando, criar conteúdo similar
   Responsável: Caio
   Prazo: Próxima quarta
```

---

### 3.3 Filtros Globais

- **Período**: Data de início e data de fim (padrão: últimos 7 dias)
- **Campanha**: Filtro multi-select de todas as campanhas ativas
- **Métrica**: Entrantes, Habilitados, Taxa, Gasto, Custo/Entrante, etc.
- **Geo**: Brasil, São Paulo, Rio de Janeiro, etc.

---

### 3.4 Atualização e Latência

- **Frequência**: Real-time (atualização a cada 2 horas)
- **Latência**: Máximo 2h (dados de mídia paga), máximo 24h (dados internos Copart)
- **Alertas**: Notificações em tempo real para anomalias críticas (queda > 30% em métrica)

---

## 4. Especificação Técnica

### 4.1 Plataforma Recomendada

- **BI Tool**: Google Data Studio (nativo BigQuery) ou Looker
- **Data Source**: BigQuery (tabelas `mart_daily_metrics`, `staging_campaign_performance`)
- **Atualização**: Google Cloud Scheduler + BigQuery Scheduled Queries
- **Alertas**: Data Studio Alerts ou Google Cloud Monitoring

### 4.2 Estrutura de Queries

```sql
-- Query para Dashboard Executivo (Últimos 30 dias)
SELECT
  date,
  campaign_type,
  channel,
  SUM(entrantes) as entrantes,
  SUM(habilitados) as habilitados,
  ROUND(SUM(habilitados) / SUM(entrantes) * 100, 1) as taxa_habilitacao,
  ROUND(SUM(spend) / SUM(entrantes), 2) as custo_por_entrante,
  ROUND(SUM(spend) / SUM(habilitados), 2) as custo_por_habilitado,
  SUM(spend) as gasto_total
FROM `project.dataset.mart_daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY date, campaign_type, channel
ORDER BY date DESC, campaign_type, channel;

-- Query para Dashboard Operacional (Últimos 7 dias)
SELECT
  date,
  campaign_name,
  channel,
  SUM(impressions) as impressoes,
  SUM(clicks) as cliques,
  ROUND(SUM(clicks) / SUM(impressions) * 100, 2) as ctr,
  SUM(entrantes) as entrantes,
  SUM(habilitados) as habilitados,
  ROUND(SUM(habilitados) / SUM(entrantes) * 100, 1) as taxa_habilitacao,
  SUM(spend) as gasto,
  ROUND(SUM(spend) / SUM(clicks), 2) as cpc,
  ROUND(SUM(spend) / SUM(entrantes), 2) as custo_por_entrante
FROM `project.dataset.staging_campaign_performance`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY date, campaign_name, channel
ORDER BY date DESC, campaign_name;
```

---

## 5. Roadmap de Implementação

### Fase 1: Estrutura Base (Semana 1-2)
- ✅ Criar queries base em BigQuery
- ✅ Configurar Data Studio com tabelas mart
- ✅ Desenhar layout do Dashboard Executivo
- ✅ Validar dados com Vitória (Copart)

### Fase 2: Dashboards Funcionais (Semana 3-4)
- ✅ Implementar Dashboard Executivo completo
- ✅ Implementar Dashboard Operacional completo
- ✅ Configurar filtros e interatividade
- ✅ Treinar stakeholders

### Fase 3: Refinamento (Mês 2)
- ⏳ Adicionar alertas automáticos
- ⏳ Integrar recomendações semanais
- ⏳ Otimizar performance de queries
- ⏳ Adicionar análise de coortes

---

## 6. Próximos Passos

1. **Validar** layout e métricas com Miriam (Diretora de Mídia)
2. **Confirmar** acesso a BigQuery e Data Studio
3. **Criar** queries base e validar dados
4. **Desenhar** mockups visuais (se necessário)
5. **Implementar** dashboards em Data Studio

---


