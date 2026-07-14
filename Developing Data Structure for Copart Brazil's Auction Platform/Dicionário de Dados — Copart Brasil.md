# Dicionário de Dados — Copart Brasil

**Versão**: 1.0  
**Data**: Julho 2026  
**Objetivo**: Definição completa de campos, tipos, granularidade e responsabilidades

---

## 1. Tabelas Core

### 1.1 Tabela: `staging_conversion_events`

| **Campo** | **Tipo** | **Descrição** | **Exemplo** | **Fonte** | **Confiabilidade** | **Atualização** |
|---|---|---|---|---|---|---|
| `conversion_id` | STRING (PK) | Identificador único da conversão | `CONV_20260701_001234` | Sistema | ✅ ALTA | Real-time |
| `user_id` | STRING (FK) | Identificador único do usuário | `USER_1000001` | GA4 / RD Station | ✅ ALTA | Real-time |
| `conversion_date` | DATE | Data da conversão | `2026-07-01` | GA4 / Copart | ✅ ALTA | Diária |
| `conversion_type` | STRING | Tipo de conversão (entrante, habilitado, licitante, conversa_whatsapp) | `habilitado` | Copart / GA4 | ⚠️ MÉDIA | Diária |
| `conversion_value` | FLOAT | Valor da conversão (se aplicável) | `0.00` | Copart | ⚠️ MÉDIA | Diária |
| `source_system` | STRING | Sistema de origem dos dados | `GA4`, `RD_STATION`, `COPART_INTERNAL` | Múltiplas | ✅ ALTA | Real-time |
| `campaign_id` | STRING (FK) | ID da campanha no sistema de mídia | `123456789` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `campaign_name` | STRING | Nome da campanha tática | `META_LEILAO_BR_LAL_VIDEO_CPC` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `channel` | STRING | Canal de mídia | `META`, `GOOGLE`, `ORGANIC`, `WHATSAPP` | Derivado de UTM | ✅ ALTA | Real-time |
| `is_attributed` | BOOLEAN | Flag indicando se a atribuição é confiável | `true`, `false` | Validação | ⚠️ MÉDIA | Diária |
| `attribution_model` | STRING | Modelo de atribuição aplicado | `first_touch`, `last_touch`, `linear`, `time_decay` | Sistema | ✅ ALTA | Diária |
| `created_at` | TIMESTAMP | Timestamp de criação do registro | `2026-07-01 14:30:45 UTC` | Sistema | ✅ ALTA | Real-time |

**Regras de Validação**:
- `conversion_id` não pode ser nulo e deve ser único
- `conversion_type` deve estar em lista pré-definida
- `conversion_date` não pode ser no futuro
- `is_attributed` deve ser `true` apenas se `campaign_name` não for nulo

---

### 1.2 Tabela: `staging_campaign_performance`

| **Campo** | **Tipo** | **Descrição** | **Exemplo** | **Fonte** | **Confiabilidade** | **Atualização** |
|---|---|---|---|---|---|---|
| `performance_id` | STRING (PK) | Identificador único do registro de performance | `PERF_20260701_META_LEILAO_BR_LAL_VIDEO_CPC` | Sistema | ✅ ALTA | Diária |
| `date` | DATE | Data do registro | `2026-07-01` | Fonte | ✅ ALTA | Diária |
| `campaign_id` | STRING (FK) | ID da campanha | `123456789` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `campaign_name` | STRING | Nome da campanha tática | `META_LEILAO_BR_LAL_VIDEO_CPC` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `campaign_type` | STRING | Tipo de campanha (leilao, venda_direta) | `leilao` | Derivado | ✅ ALTA | Diária |
| `channel` | STRING | Canal de mídia | `META`, `GOOGLE`, `ORGANIC` | Derivado | ✅ ALTA | Diária |
| `impressions` | INTEGER | Número de impressões | `45000` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `clicks` | INTEGER | Número de cliques | `1200` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `spend` | FLOAT | Gasto em mídia paga (R$) | `3500.50` | Google Ads / Meta Ads | ✅ ALTA | Real-time |
| `entrantes` | INTEGER | Número de entrantes | `450` | GA4 / Copart | ⚠️ MÉDIA | Diária |
| `habilitados` | INTEGER | Número de habilitados | `180` | Copart / RD Station | ✅ ALTA | Diária |
| `licitantes_por_veiculo` | FLOAT | Média de licitantes por veículo | `2.45` | Copart | ⚠️ MÉDIA | Diária |
| `conversas_whatsapp` | INTEGER | Número de conversas WhatsApp iniciadas | `25` | Copart / WhatsApp API | ✅ ALTA | Diária |
| `taxa_habilitacao` | FLOAT | Taxa de habilitação (habilitados / entrantes) | `0.40` | Calculado | Derivado | Diária |
| `ctr` | FLOAT | Click-through rate (clicks / impressions) | `0.0267` | Calculado | Derivado | Real-time |
| `cpc` | FLOAT | Custo por clique (spend / clicks) | `2.92` | Calculado | Derivado | Real-time |
| `custo_por_entrante` | FLOAT | Custo por entrante (spend / entrantes) | `7.78` | Calculado | Derivado | Diária |
| `custo_por_habilitado` | FLOAT | Custo por habilitado (spend / habilitados) | `19.45` | Calculado | Derivado | Diária |
| `roas` | FLOAT | Retorno sobre gasto em anúncios (se valor disponível) | `2.50` | Calculado | Derivado | Diária |
| `created_at` | TIMESTAMP | Timestamp de criação | `2026-07-02 10:00:00 UTC` | Sistema | ✅ ALTA | Diária |

**Regras de Validação**:
- `date` não pode ser no futuro
- `impressions` >= `clicks` (sempre)
- `clicks` >= `entrantes` (sempre, pois entrantes são subset de cliques)
- `entrantes` >= `habilitados` (sempre)
- `taxa_habilitacao` deve estar entre 0 e 1
- `spend` > 0 para campanhas pagas

---

### 1.3 Tabela: `staging_user_journey`

| **Campo** | **Tipo** | **Descrição** | **Exemplo** | **Fonte** | **Confiabilidade** | **Atualização** |
|---|---|---|---|---|---|---|
| `user_id` | STRING (PK) | Identificador único do usuário | `USER_1000001` | GA4 / RD Station | ✅ ALTA | Real-time |
| `first_touch_date` | DATE | Data do primeiro touchpoint | `2026-06-15` | GA4 | ✅ ALTA | Não muda |
| `first_touch_source` | STRING | Fonte do primeiro touchpoint | `google`, `facebook`, `organic`, `direct` | GA4 | ✅ ALTA | Não muda |
| `first_touch_campaign` | STRING | Campanha do primeiro touchpoint | `META_LEILAO_BR_LAL_VIDEO_CPC` | GA4 / UTM | ✅ ALTA | Não muda |
| `first_touch_channel` | STRING | Canal do primeiro touchpoint | `PAID`, `ORGANIC`, `DIRECT` | Derivado | ✅ ALTA | Não muda |
| `last_touch_date` | DATE | Data do último touchpoint | `2026-07-01` | GA4 | ✅ ALTA | Diária |
| `last_touch_source` | STRING | Fonte do último touchpoint | `google`, `facebook`, `organic`, `direct` | GA4 | ✅ ALTA | Diária |
| `last_touch_campaign` | STRING | Campanha do último touchpoint | `META_LEILAO_BR_LAL_VIDEO_CPC` | GA4 / UTM | ✅ ALTA | Diária |
| `last_touch_channel` | STRING | Canal do último touchpoint | `PAID`, `ORGANIC`, `DIRECT` | Derivado | ✅ ALTA | Diária |
| `touchpoint_count` | INTEGER | Número total de touchpoints | `5` | GA4 | ✅ ALTA | Diária |
| `days_to_conversion` | INTEGER | Dias entre primeiro touchpoint e conversão | `16` | Calculado | Derivado | Diária |
| `conversion_date` | DATE | Data da conversão (primeira conversão) | `2026-07-01` | GA4 / Copart | ⚠️ MÉDIA | Não muda |
| `conversion_type` | STRING | Tipo de conversão (entrante, habilitado, licitante) | `habilitado` | GA4 / Copart | ⚠️ MÉDIA | Não muda |
| `device_category` | STRING | Categoria de dispositivo | `desktop`, `mobile`, `tablet` | GA4 | ✅ ALTA | Não muda |
| `country` | STRING | País | `BR` | GA4 | ✅ ALTA | Não muda |
| `region` | STRING | Região/Estado | `SP`, `RJ`, `MG` | GA4 | ✅ ALTA | Não muda |
| `is_converter` | BOOLEAN | Flag indicando se o usuário converteu | `true`, `false` | Derivado | ✅ ALTA | Diária |
| `created_at` | TIMESTAMP | Timestamp de criação | `2026-07-01 14:30:45 UTC` | Sistema | ✅ ALTA | Real-time |

**Regras de Validação**:
- `user_id` não pode ser nulo
- `first_touch_date` <= `last_touch_date` (sempre)
- `last_touch_date` <= `conversion_date` (se converter)
- `days_to_conversion` = `conversion_date` - `first_touch_date`

---

### 1.4 Tabela: `mart_daily_metrics`

| **Campo** | **Tipo** | **Descrição** | **Exemplo** | **Granularidade** | **Atualização** |
|---|---|---|---|---|---|
| `date` | DATE | Data do registro | `2026-07-01` | Diária | Diária |
| `channel` | STRING | Canal de mídia | `META`, `GOOGLE`, `ORGANIC`, `TOTAL` | Por canal | Diária |
| `campaign_name` | STRING | Nome da campanha tática | `META_LEILAO_BR_LAL_VIDEO_CPC` | Por campanha | Diária |
| `campaign_type` | STRING | Tipo de campanha | `leilao`, `venda_direta` | Por tipo | Diária |
| `entrantes` | INTEGER | Total de entrantes | `450` | Agregado | Diária |
| `habilitados` | INTEGER | Total de habilitados | `180` | Agregado | Diária |
| `taxa_habilitacao` | FLOAT | Taxa de habilitação (%) | `40.0` | Calculado | Diária |
| `licitantes_por_veiculo` | FLOAT | Média de licitantes por veículo | `2.45` | Agregado | Diária |
| `conversas_whatsapp` | INTEGER | Total de conversas WhatsApp | `25` | Agregado | Diária |
| `custo_total` | FLOAT | Gasto total em mídia paga (R$) | `3500.50` | Agregado | Real-time |
| `custo_por_entrante` | FLOAT | Custo por entrante (R$) | `7.78` | Calculado | Diária |
| `custo_por_habilitado` | FLOAT | Custo por habilitado (R$) | `19.45` | Calculado | Diária |
| `roas` | FLOAT | Retorno sobre gasto em anúncios | `2.50` | Calculado | Diária |

---

## 2. Campos Críticos e Validações

### 2.1 Campos de Atribuição

**`campaign_name`** (Obrigatório para análise de atribuição)
- Deve seguir padrão: `[CHANNEL]_[UNIT]_[GEO]_[AUDIENCE]_[FORMAT]_[BUY_MODEL]`
- Exemplos válidos: `META_LEILAO_BR_LAL_VIDEO_CPC`, `GOOGLE_LEILAO_SP_INT_STATIC_CPM`
- Se nulo ou inválido, marcar `is_attributed = false`

**`utm_campaign`** (Obrigatório para rastreamento)
- Deve corresponder a `campaign_name`
- Se discrepância > 5%, investigar com Binder

**`utm_source`** (Obrigatório)
- Valores válidos: `google`, `facebook`, `instagram`, `tiktok`, `organic`, `direct`, `email`, etc.
- Deve ser consistente com `channel`

### 2.2 Campos de Qualidade

**`is_attributed`** (Flag de Confiabilidade)
- `true`: Conversão pode ser atribuída com confiança a uma campanha
- `false`: Conversão não pode ser atribuída (dados incompletos, UTM inválido, etc.)
- Regra: `is_attributed = true` APENAS se `campaign_name` é válido E `conversion_type` é válido

**`source_system`** (Rastreabilidade)
- Indica qual sistema originou o dado
- Importante para validação cruzada (ex: GA4 vs. mLabs)

### 2.3 Campos Calculados

**`taxa_habilitacao`** = `habilitados` / `entrantes` (%)
- Métrica de eficiência do funil
- Deve estar entre 0% e 100%
- Alerta se < 20% ou > 60% (fora do esperado)

**`custo_por_entrante`** = `spend` / `entrantes` (R$)
- Métrica de eficiência de mídia
- Deve estar entre R$ 5 e R$ 50 (range esperado)

**`custo_por_habilitado`** = `spend` / `habilitados` (R$)
- Métrica de eficiência de conversão
- Deve estar entre R$ 10 e R$ 100 (range esperado)

**`days_to_conversion`** = `conversion_date` - `first_touch_date` (dias)
- Métrica de velocidade de funil
- Deve estar entre 0 e 90 dias (range esperado)

---

## 3. Tipos de Dados e Formatos

### 3.1 Tipos Primitivos

| **Tipo** | **Formato** | **Exemplo** | **Notas** |
|---|---|---|---|
| **STRING** | Texto livre | `META_LEILAO_BR_LAL_VIDEO_CPC` | Máx 255 caracteres |
| **INTEGER** | Número inteiro | `450` | Sem decimais |
| **FLOAT** | Número decimal | `19.45` | Máx 2 casas decimais |
| **DATE** | YYYY-MM-DD | `2026-07-01` | ISO 8601 |
| **TIMESTAMP** | YYYY-MM-DD HH:MM:SS UTC | `2026-07-01 14:30:45 UTC` | ISO 8601 com timezone |
| **BOOLEAN** | true / false | `true` | Sem aspas |

### 3.2 Enumerações (Valores Válidos)

**`conversion_type`**:
- `entrante` — Usuário que chega ao site
- `habilitado` — Usuário que completa cadastro + KYC
- `licitante` — Usuário que faz lance em leilão
- `arrematante` — Usuário que vence leilão
- `conversa_whatsapp` — Conversa WhatsApp iniciada

**`channel`**:
- `META` — Meta Ads (Facebook + Instagram)
- `GOOGLE` — Google Ads
- `TIKTOK` — TikTok Ads
- `ORGANIC` — Tráfego orgânico (SEO + Social)
- `WHATSAPP` — WhatsApp Business
- `DIRECT` — Tráfego direto

**`campaign_type`**:
- `leilao` — Campanha de Leilão
- `venda_direta` — Campanha de Venda/Compra Direta

**`device_category`**:
- `desktop` — Computador
- `mobile` — Celular
- `tablet` — Tablet

---

## 4. Granularidade e Agregação

### 4.1 Níveis de Agregação

| **Nível** | **Dimensões** | **Uso** | **Atualização** |
|---|---|---|---|
| **Raw** | Evento individual | Auditoria, análise ad-hoc | Real-time |
| **Daily** | Data + Canal + Campanha | Dashboards operacionais | Diária |
| **Weekly** | Semana + Canal + Campanha | Relatórios semanais | Semanal |
| **Monthly** | Mês + Unidade de Negócio | Relatórios mensais | Mensal |

### 4.2 Exemplo de Agregação

```
Raw: 1 evento por usuário por touchpoint
└── Daily: Agregado por data + canal + campanha
    └── Weekly: Agregado por semana + canal + campanha
        └── Monthly: Agregado por mês + unidade de negócio
```

---

## 5. Responsabilidades e Atualização

### 5.1 Proprietários de Dados

| **Tabela** | **Proprietário** | **Atualização** | **SLA** |
|---|---|---|---|
| `staging_conversion_events` | WiseMetrics + Binder | Real-time | 2h |
| `staging_campaign_performance` | WiseMetrics + Binder | Real-time | 2h |
| `staging_user_journey` | WiseMetrics | Diária | 10h |
| `mart_daily_metrics` | WiseMetrics | Diária | 11h |

### 5.2 Validação Cruzada

- **GA4 vs. mLabs**: Discrepância máxima 5% (diária)
- **Google Ads vs. GA4**: Discrepância máxima 10% (real-time)
- **Meta Ads vs. GA4**: Discrepância máxima 15% (real-time)
- **Copart (Planilhas) vs. RD Station**: Discrepância máxima 5% (diária)

Se discrepância > limite, gerar alerta e investigar com Vitória (Copart).

---

## 6. Próximos Passos

1. **Validar** dicionário com stakeholders
2. **Configurar** validações no BigQuery
3. **Documentar** exceções e casos especiais
4. **Treinar** time de ingestão de dados
5. **Monitorar** qualidade de dados semanalmente

---
