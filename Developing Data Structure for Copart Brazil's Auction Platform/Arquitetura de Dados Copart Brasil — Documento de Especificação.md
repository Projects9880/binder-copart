# Arquitetura de Dados Copart Brasil — Documento de Especificação

**Versão**: 1.0  
**Data**: Julho 2026  
**Projeto**: WiseMetrics + Binder + Copart Brasil  
**Objetivo**: Definir a arquitetura utópica de dados para metrificar funis de Leilão e Venda/Compra Direta

---

## 1. Visão Geral da Arquitetura

A Copart Brasil opera dois modelos de negócio distintos que requerem estruturas de dados separadas mas complementares:

| **Unidade de Negócio** | **Meta Mensal** | **Métrica Primária** | **Métrica Secundária** | **Complexidade de Atribuição** |
|---|---|---|---|---|
| **Leilão** | 22k entrantes / 11k habilitados | Entrantes, Habilitados | Licitantes/veículo, Taxa de habilitação | Alta (múltiplos touchpoints) |
| **Venda/Compra Direta** | 700-800 conversas/semana | Conversas WhatsApp iniciadas | Qualidade de contatos | Média (mais direto) |

**Princípio fundamental**: Os dados devem fluir de fontes desorganizadas (GA4, Google Ads, Meta Ads, RD Station, planilhas internas) para um **data lake centralizado** (BigQuery) onde podem ser normalizados, enriquecidos e servir a múltiplos consumidores (dashboards, relatórios, recomendações semanais).

---

## 2. Arquitetura de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                    │
│  (Dashboards, Relatórios, Recomendações Semanais)           │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE INTELIGÊNCIA                     │
│  (Transformações, Cálculos de Atribuição, KPIs)             │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE INTEGRAÇÃO                       │
│  (BigQuery — Data Lake Centralizado)                        │
│  - Raw Tables (dados brutos)                                │
│  - Staging Tables (dados limpos)                            │
│  - Mart Tables (dados prontos para BI)                      │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE FONTES                          │
│  GA4 | Google Ads | Meta Ads | RD Station | Copart (Excel)  │
│  mLabs | SEMrush | Planilhas Google Drive | SharePoint      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Fontes de Dados e Confiabilidade

### 3.1 Fontes Mapeadas

| **Fonte** | **Tipo** | **Confiabilidade** | **Latência** | **Notas** |
|---|---|---|---|---|
| **GA4** | Comportamento web | ⚠️ Média | 24-48h | Possível desorganização; requer auditoria |
| **Google Ads** | Mídia paga | ✅ Alta | Real-time | Fonte confiável; UTMs críticas |
| **Meta Ads** | Mídia paga | ✅ Alta | Real-time | Fonte confiável; UTMs críticas |
| **RD Station** | CRM | ⚠️ Média | 24h | Subutilizado; potencial alto |
| **mLabs** | Comportamento web | ⚠️ Média | 24h | Necessário validar contra GA4 |
| **SEMrush** | Dados de concorrência | ✅ Alta | 48h | Possível via Binder |
| **Copart (Planilhas)** | Dados internos | ❌ Baixa | Manual | Entrantes, habilitados, licitantes |
| **Reportes Vitória** | Dados internos | ⚠️ Média | Diário | Pessoa de dados; parceira crítica |

**Ação imediata**: Estabelecer protocolo de validação cruzada entre GA4 e mLabs; definir SLA de qualidade para dados internos.

### 3.2 Eventos Críticos a Rastrear

#### Leilão
- **Entrante**: Usuário que clica em anúncio/link e chega ao site
- **Habilitado**: Usuário que completa cadastro + verificação (KYC)
- **Licitante**: Usuário que faz lance em veículo
- **Arrematante**: Usuário que vence leilão

#### Venda/Compra Direta
- **Clique em CTA**: Clique em "Vender meu carro" ou botão WhatsApp
- **Conversa iniciada**: Primeira mensagem no WhatsApp
- **Contato qualificado**: Contato que passa por triagem (qualidade)
- **Lead convertido**: Contato que avança para próxima etapa

---

## 4. Estrutura de Dados Ideal (Tabelas BigQuery)

### 4.1 Tabelas Raw (Ingestão Bruta)

```
raw_ga4_events
├── event_timestamp
├── user_id / session_id
├── event_name (page_view, click, form_submit, etc.)
├── page_path
├── utm_source
├── utm_medium
├── utm_campaign
├── utm_content
├── utm_term
├── device_category
└── ...

raw_google_ads_conversions
├── conversion_date
├── campaign_id
├── campaign_name
├── adgroup_id
├── adgroup_name
├── conversion_type
├── conversion_value
├── cost
└── ...

raw_meta_ads_conversions
├── conversion_date
├── campaign_id
├── campaign_name
├── adset_id
├── adset_name
├── conversion_type
├── conversion_value
├── spend
└── ...

raw_rd_station_contacts
├── contact_id
├── email
├── phone
├── created_at
├── lifecycle_stage
├── custom_fields
└── ...

raw_copart_internal
├── date
├── entrantes
├── habilitados
├── licitantes_por_veiculo
├── arremates
├── origem_campanha (se disponível)
└── ...
```

### 4.2 Tabelas Staging (Limpeza e Normalização)

```
staging_user_journey
├── user_id (chave única)
├── first_touch_date
├── first_touch_source
├── first_touch_campaign
├── first_touch_channel (organic, paid, direct, social, etc.)
├── last_touch_date
├── last_touch_source
├── last_touch_campaign
├── last_touch_channel
├── device_category
├── country / region
└── ...

staging_conversion_events
├── conversion_id (chave única)
├── user_id
├── conversion_date
├── conversion_type (entrante, habilitado, licitante, etc.)
├── conversion_value (se aplicável)
├── source_system (GA4, RD Station, Copart, etc.)
├── campaign_id
├── campaign_name
├── channel
├── is_attributed (flag de confiabilidade)
└── ...

staging_campaign_performance
├── campaign_id
├── campaign_name
├── campaign_type (leilao, venda_direta)
├── date
├── impressions
├── clicks
├── spend
├── entrantes
├── habilitados
├── taxa_habilitacao
├── custo_por_entrante
├── custo_por_habilitado
└── ...
```

### 4.3 Tabelas Mart (Prontas para BI)

```
mart_daily_metrics
├── date
├── channel
├── campaign_name
├── campaign_type (leilao, venda_direta)
├── entrantes
├── habilitados
├── taxa_habilitacao
├── licitantes_por_veiculo
├── custo_total
├── custo_por_entrante
├── custo_por_habilitado
├── roas (se conversão com valor)
└── ...

mart_user_cohort
├── cohort_date (data de primeira conversão)
├── cohort_source
├── cohort_campaign
├── days_since_cohort
├── usuarios_ativos
├── conversoes_subsequentes
├── lifetime_value (se disponível)
└── ...

mart_attribution_model
├── conversion_id
├── user_id
├── conversion_type
├── first_touch_credit
├── last_touch_credit
├── linear_credit
├── time_decay_credit
├── campaign_id
├── campaign_name
└── ...
```

---

## 5. Governança de Dados

### 5.1 Padrões de Nomeação

#### Campanhas (Nível Tático)
**Fórmula**: `[CHANNEL]_[SEGMENTATION]_[GEO]_[AUDIENCE]_[FORMAT]_[BUY_MODEL]`

**Exemplo**:
- `META_LEILAO_SP_LAL_VIDEO_CPC` → Meta, Leilão, São Paulo, Look-alike, Vídeo, CPC
- `GOOGLE_VENDA_BR_INT_STATIC_CPM` → Google, Venda/Compra Direta, Brasil, Interesse, Estático, CPM

**Variáveis padrão**:
- **CHANNEL**: META, GOOGLE, TIKTOK, ORGANIC, DIRECT
- **SEGMENTATION**: LEILAO, VENDA, AWARENESS, CONSIDERATION, CONVERSION
- **GEO**: BR (Brasil), SP (São Paulo), RJ (Rio), MG (Minas), etc.
- **AUDIENCE**: INT (Interesse), LAL (Look-alike), RMKT (Remarketing), CUSTOM, LOOKALIKE
- **FORMAT**: VIDEO, STATIC, CAROUSEL, COLLECTION, TEXT
- **BUY_MODEL**: CPC, CPM, CPA, ROAS

#### UTM Parameters (Obrigatório)
```
utm_source = [channel] (google, facebook, organic, direct, etc.)
utm_medium = [medium] (cpc, cpm, organic, referral, etc.)
utm_campaign = [campaign_name] (deve corresponder ao nome da campanha tática)
utm_content = [adset_id ou adset_name]
utm_term = [keyword ou audience_segment] (se aplicável)
```

### 5.2 Dicionário de Dados Mínimo

| **Campo** | **Tipo** | **Definição** | **Confiabilidade** | **Responsável** |
|---|---|---|---|---|
| **entrantes** | INT | Usuários únicos que chegam ao site via campanha | ⚠️ Média | GA4 / mLabs |
| **habilitados** | INT | Usuários que completam cadastro + KYC | ✅ Alta | Copart / RD Station |
| **licitantes_por_veiculo** | FLOAT | Média de licitantes por veículo em leilão | ⚠️ Média | Copart |
| **conversas_whatsapp** | INT | Mensagens iniciadas no WhatsApp | ✅ Alta | Copart / WhatsApp API |
| **custo_total** | FLOAT | Gasto em mídia paga | ✅ Alta | Google Ads / Meta Ads |
| **taxa_habilitacao** | FLOAT | habilitados / entrantes | Calculado | Derivado |
| **custo_por_entrante** | FLOAT | custo_total / entrantes | Calculado | Derivado |
| **custo_por_habilitado** | FLOAT | custo_total / habilitados | Calculado | Derivado |

### 5.3 SLA de Qualidade

- **GA4**: Validar contra mLabs diariamente; discrepância > 5% = alerta
- **Google Ads / Meta Ads**: Dados considerados confiáveis; latência máxima 2h
- **Copart (Planilhas)**: Validar com Vitória; dados devem chegar até 10h da manhã
- **RD Station**: Sincronizar diariamente; validar campos obrigatórios

---

## 6. Fluxo de Dados (ETL)

### 6.1 Ingestão Diária

```
Hora 06:00 → Extração de GA4 (últimas 48h)
Hora 06:30 → Extração de Google Ads (últimas 24h)
Hora 07:00 → Extração de Meta Ads (últimas 24h)
Hora 07:30 → Extração de RD Station (últimas 24h)
Hora 08:00 → Ingestão manual de planilhas Copart (Vitória)
Hora 09:00 → Transformação e staging
Hora 10:00 → Cálculo de KPIs e atribuição
Hora 11:00 → Atualização de dashboards e relatórios
```

### 6.2 Ferramentas Recomendadas

- **Orquestração**: Google Cloud Scheduler + Cloud Functions (nativo BigQuery)
- **Integração**: Zapier / Make (para APIs de terceiros)
- **Alternativa**: Stitch Data / Fivetran (se budget permitir)
- **BI**: Google Data Studio (nativo BigQuery) ou Looker

---

## 7. Métricas Críticas por Unidade

### 7.1 Leilão

**Métricas de Volume**:
- Entrantes por dia / semana / mês
- Habilitados por dia / semana / mês
- Taxa de habilitação (%)

**Métricas de Qualidade**:
- Licitantes por veículo (média)
- Taxa de arrematação (se disponível)
- Tempo médio entre habilitação e primeiro lance

**Métricas de Eficiência**:
- Custo por entrante (por campanha)
- Custo por habilitado (por campanha)
- ROAS (se valor de arrematação disponível)

**Análise de Atribuição**:
- Qual campanha gera mais entrantes?
- Qual campanha gera mais habilitados?
- Qual campanha gera habilitados mais qualificados (maior propensão a licitar)?

### 7.2 Venda/Compra Direta

**Métricas de Volume**:
- Conversas WhatsApp iniciadas por dia / semana
- Origem das conversas (qual CTA, qual página)

**Métricas de Qualidade**:
- Taxa de resposta do vendedor
- Tempo médio até primeira resposta
- Taxa de qualificação (contatos que passam em triagem)

**Métricas de Eficiência**:
- Custo por conversa iniciada
- Custo por contato qualificado
- Conversão posterior (se rastreável)

---

## 8. Roadmap de Implementação (Fases)

### Fase 1: Estrutura Base (Semanas 1-2)
- ✅ Criar data lake BigQuery com tabelas raw
- ✅ Configurar ingestão diária de GA4, Google Ads, Meta Ads
- ✅ Estabelecer protocolo de ingestão manual de dados Copart
- ✅ Criar tabelas staging com limpeza básica

### Fase 2: Inteligência Inicial (Semanas 3-4)
- ✅ Criar tabelas mart com KPIs básicos
- ✅ Implementar dashboard executivo (visão geral)
- ✅ Implementar dashboard operacional (por campanha)
- ✅ Iniciar modelo de atribuição simples (first-touch, last-touch)

### Fase 3: Refinamento (Mês 2)
- ⏳ Integrar RD Station para enriquecimento de dados
- ⏳ Implementar modelo de atribuição multi-touch (linear, time-decay)
- ⏳ Criar análise de coortes (cohort analysis)
- ⏳ Automatizar relatório semanal de recomendações

### Fase 4: Otimização (Mês 3+)
- ⏳ Integrar SEMrush para análise de concorrência
- ⏳ Implementar previsão de demanda (forecasting)
- ⏳ Criar alertas automáticos para anomalias
- ⏳ Otimizar performance de queries BigQuery

---

## 9. Próximos Passos

1. **Validar acesso** a todas as fontes (GA4, Google Ads, Meta Ads, RD Station, BigQuery)
2. **Confirmar** estrutura de pastas em Google Drive e SharePoint
3. **Definir** taxonomia final de campanhas com Binder
4. **Criar** templates de planilhas para ingestão manual
5. **Desenhar** especificação detalhada de dashboards

---


