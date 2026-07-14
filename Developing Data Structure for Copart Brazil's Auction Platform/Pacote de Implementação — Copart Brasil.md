# Pacote de Implementação — Copart Brasil
## Resumo Executivo de Entregáveis

**Data**: Julho 2026  
**Projeto**: WiseMetrics + Binder + Copart Brasil  
**Preparado por**:

---

## 📦 Arquivos Entregues

### 1. **Documentação Estratégica**

#### `copart_data_architecture.md` (15 páginas)
- Visão geral da arquitetura em 4 camadas
- Mapeamento de fontes de dados e confiabilidade
- Estrutura de tabelas BigQuery (raw, staging, mart)
- Governança de dados e padrões de nomeação
- Fluxo de dados (ETL) com cronograma diário
- Métricas críticas por unidade de negócio
- Roadmap de implementação em 4 fases

**Uso**: Compartilhar com stakeholders técnicos (Luís, Vitória); base para todas as decisões de arquitetura

---

#### `copart_folder_structure_taxonomy.md` (18 páginas)
- Estrutura hierárquica de pastas (Google Drive + SharePoint)
- Convenção de nomes para arquivos
- Taxonomia de campanhas com 6 dimensões (CHANNEL, UNIT, GEO, AUDIENCE, FORMAT, BUY_MODEL)
- Fórmula de nomeação tática: `[CHANNEL]_[UNIT]_[GEO]_[AUDIENCE]_[FORMAT]_[BUY_MODEL]`
- Mapeamento de campanhas para plataformas (Google Ads, Meta Ads)
- UTM parameters obrigatórios
- Calendário de campanhas trimestral
- Governança e checklist de lançamento

**Uso**: Treinar time de mídia (Bruno, Felipe, Maria); implementar nomeação padrão em todas as campanhas

---

#### `copart_data_dictionary.md` (20 páginas)
- Definição completa de 50+ campos críticos
- Tipos de dados e formatos (STRING, INTEGER, FLOAT, DATE, TIMESTAMP, BOOLEAN)
- Enumerações (valores válidos para cada campo)
- Granularidade e agregação (raw, daily, weekly, monthly)
- Regras de validação por campo
- Responsabilidades e SLA de qualidade
- Validação cruzada entre fontes (GA4 vs. mLabs, Google Ads vs. GA4, etc.)

**Uso**: Implementar validações em BigQuery; treinar Vitória em qualidade de dados

---

#### `copart_dashboard_specification.md` (22 páginas)
- Dashboard Executivo (4 abas): Visão Geral, Funil Leilão, Funil Venda, Atribuição
- Dashboard Operacional (5 abas): Performance Diária, Campanhas Leilão, Campanhas Venda, Alertas, Recomendações
- Especificação técnica de queries BigQuery
- Filtros globais e latência de atualização
- Roadmap de implementação em Data Studio

**Uso**: Implementar em Data Studio; compartilhar com Miriam (Diretora de Mídia) e Bruno (Mídia)

---

#### `copart_implementation_roadmap.md` (25 páginas)
- 4 fases de implementação (11 semanas total)
- Fase 1: Estrutura Base (2 semanas)
- Fase 2: Inteligência Inicial (2 semanas)
- Fase 3: Atribuição & Refinamento (3 semanas)
- Fase 4: Otimização & Automação (4 semanas)
- Checklist de validação técnica, dados, dashboards, processos e stakeholders
- Dependências críticas
- Riscos e mitigações
- Orçamento e recursos necessários

**Uso**: Guia de execução; compartilhar com Guto (Liderança); usar para rastreamento de progresso

---

### 2. **Templates de Planilhas (Excel)**

#### `Template_01_Performance_Diária.xlsx`
- Colunas: Data, Canal, Campanha, Impressões, Cliques, CTR, Gasto, Entrantes, Habilitados, Taxa Habilitação, Custo/Entrante, Custo/Habilitado
- 30 dias de dados dummy (exemplo)
- Formatação profissional com cores e bordas
- **Uso**: Ingestão diária de performance de campanhas

#### `Template_02_Campanhas_Master.xlsx`
- Colunas: ID_Campanha, Nome_Campanha, Unidade_Negócio, Canal, Estágio_Funil, Tipo_Campanha, Geo, Audiência, Formato, Modelo_Compra, Data_Início, Data_Fim, Budget_Total, Status, Responsável
- 5 campanhas exemplo
- **Uso**: Manter registro master de todas as campanhas ativas

#### `Template_03_User_Journey.xlsx`
- Colunas: user_id, first_touch_date, first_touch_source, first_touch_campaign, first_touch_channel, last_touch_date, last_touch_source, last_touch_campaign, last_touch_channel, conversion_date, conversion_type, device_category, country
- 100 usuários dummy
- **Uso**: Rastrear jornada de cada usuário (base para atribuição)

#### `Template_04_Métricas_Diárias.xlsx`
- Colunas: Data, Entrantes_Total, Habilitados_Total, Taxa_Habilitação, Licitantes_por_Veículo, Conversas_WhatsApp, Gasto_Total, Custo_por_Entrante, Custo_por_Habilitado, Origem_Pago, Origem_Orgânico
- 30 dias de dados agregados
- **Uso**: Ingestão diária de métricas consolidadas

#### `Template_05_Dicionário_Dados.xlsx`
- Colunas: Campo, Tipo_Dado, Definição, Fonte, Confiabilidade, Responsável, Atualização
- 10 campos críticos documentados
- **Uso**: Referência rápida de campos (compartilhar com Vitória)

---

### 3. **Estrutura de Pastas (Recomendada)**

```
Copart Brasil — WiseMetrics
├── 00_GOVERNANÇA
├── 01_DADOS_BRUTOS (GA4, Google Ads, Meta Ads, RD Station, Copart, mLabs)
├── 02_DADOS_PROCESSADOS (Staging, Mart)
├── 03_CAMPANHAS (LEILÃO, VENDA_DIRETA, por trimestre)
├── 04_DASHBOARDS
├── 05_RELATÓRIOS (Semanais, Mensais, Especiais)
├── 06_INTELIGÊNCIA (Recomendações, Análise de Gargalos, Quick Wins)
├── 07_TEMPLATES
└── 08_HISTÓRICO
```

---

## 🎯 Principais Insights do Projeto

### Problema Central
A Copart Brasil opera com **visibilidade limitada** sobre qual campanha gera qual resultado. Dados estão dispersos em GA4, Google Ads, Meta Ads, RD Station e planilhas Excel, sem integração ou atribuição clara.

### Solução Proposta
**Arquitetura centralizada de dados** em BigQuery que:
- Normaliza dados de múltiplas fontes
- Implementa modelo de atribuição multi-touch
- Gera dashboards em tempo real
- Automatiza recomendações semanais

### Quick Wins Identificados
1. **Limpeza de Campanhas**: Redução de fragmentação resultou em +8% de habilitados com -5% de entrantes (melhor qualidade)
2. **Taxonomia de Campanhas**: Padrão claro de nomeação permite rastreamento preciso
3. **Taxa de Habilitação**: Métrica de eficiência que separa volume de qualidade

---

## 📊 Métricas-Chave a Rastrear

### Leilão (Meta: 22k entrantes / 11k habilitados/mês)
- Entrantes por dia / semana / mês
- Taxa de habilitação (%)
- Custo por entrante (R$)
- Custo por habilitado (R$)
- Licitantes por veículo (média)

### Venda/Compra Direta (Meta: 700-800 conversas/semana)
- Conversas WhatsApp iniciadas
- Taxa de conversa (cliques → conversas)
- Custo por conversa (R$)
- Qualidade de contatos (taxa de qualificação)

---

## 🚀 Próximos Passos Imediatos

### Semana 1
1. Reunião de kickoff com Luís, Mariana, Vitória
2. Criar projeto BigQuery
3. Criar estrutura de pastas em Google Drive
4. Configurar ingestão de GA4, Google Ads, Meta Ads

### Semana 2
1. Validar ingestão de dados
2. Criar tabelas staging
3. Treinar Vitória em protocolo de ingestão manual
4. Documentar dicionário de dados final

### Semana 3-4
1. Criar tabelas mart
2. Implementar Dashboard Executivo em Data Studio
3. Implementar Dashboard Operacional em Data Studio
4. Gerar primeiro relatório semanal

---

## 📋 Checklist de Implementação

- [ ] BigQuery configurado e acessível
- [ ] Ingestão de GA4 funcionando
- [ ] Ingestão de Google Ads funcionando
- [ ] Ingestão de Meta Ads funcionando
- [ ] Tabelas staging criadas e validadas
- [ ] Tabelas mart criadas e validadas
- [ ] Dashboard Executivo implementado
- [ ] Dashboard Operacional implementado
- [ ] Primeiro relatório semanal gerado
- [ ] Ritual semanal estruturado
- [ ] Stakeholders treinados

---

## 💡 Recomendações Finais

1. **Comece com pragmatismo**: Não espere perfeição. Inicie com first-touch/last-touch, refine para multi-touch depois.

2. **Envolva Vitória cedo**: Ela é a porta de entrada para dados internos. Trate como parceira, não como fornecedora.

3. **Demonstre valor rápido**: Os quick wins (limpeza de campanhas, taxa de habilitação) devem aparecer na Semana 2.

4. **Automatize o ritual**: O ritual semanal é o coração do projeto. Dados devem estar prontos, recomendações devem estar prontas.

5. **Documente tudo**: A taxonomia de campanhas e o dicionário de dados são vivos. Atualize conforme aprende.

---



Para dúvidas ou ajustes, contacte a equipe WiseMetrics.
