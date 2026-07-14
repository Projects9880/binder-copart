# Roadmap de Implementação — Copart Brasil

**Versão**: 1.0  
**Data**: Julho 2026  
**Objetivo**: Guia priorizado de implementação da arquitetura de dados, com fases, dependências e checklist de validação

---

## 1. Visão Geral do Roadmap

A implementação da arquitetura de dados para Copart Brasil será executada em **4 fases principais**, cada uma com duração estimada de 2-4 semanas. O roadmap prioriza **quick wins** (vitórias rápidas) no início para demonstrar valor, enquanto constrói a base para inteligência mais sofisticada nas fases posteriores.

| **Fase** | **Duração** | **Objetivo Principal** | **Público** | **Entregáveis** |
|---|---|---|---|---|
| **Fase 1: Estrutura Base** | 2 semanas | Organizar dados e criar ingestão diária | WiseMetrics + Vitória | Pastas, templates, ingestão manual |
| **Fase 2: Inteligência Inicial** | 2 semanas | Criar dashboards e primeiros insights | Binder + Copart | Dashboards, relatório semanal |
| **Fase 3: Atribuição & Refinamento** | 3 semanas | Implementar modelo de atribuição | WiseMetrics + Binder | Modelo multi-touch, análise de coortes |
| **Fase 4: Otimização & Automação** | 4 semanas | Automatizar recomendações e alertas | Todos | Alertas automáticos, forecasting |

---

## 2. Fase 1: Estrutura Base (Semanas 1-2)

### 2.1 Objetivo

Estabelecer a **infraestrutura mínima viável** para coletar, organizar e armazenar dados de forma confiável. O foco é em **pragmatismo e velocidade**, não em perfeição.

### 2.2 Atividades

#### Semana 1: Configuração de Infraestrutura

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Criar projeto BigQuery e dataset base | Luís (WiseMetrics) | 2h | — | ⏳ Pendente |
| Criar estrutura de pastas em Google Drive | Guto (WiseMetrics) | 3h | — | ⏳ Pendente |
| Documentar acesso e permissões | Luís (WiseMetrics) | 2h | Pastas criadas | ⏳ Pendente |
| Configurar ingestão de GA4 (via BigQuery connector) | Luís (WiseMetrics) | 4h | BigQuery criado | ⏳ Pendente |
| Configurar ingestão de Google Ads (via API) | Luís (WiseMetrics) | 4h | BigQuery criado | ⏳ Pendente |
| Configurar ingestão de Meta Ads (via API) | Luís (WiseMetrics) | 4h | BigQuery criado | ⏳ Pendente |
| Estabelecer protocolo de ingestão manual (Copart) | Mariana (WiseMetrics) + Vitória (Copart) | 3h | Pastas criadas | ⏳ Pendente |

#### Semana 2: Validação e Templates

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Validar ingestão de GA4 vs. mLabs | Luís (WiseMetrics) | 3h | Ingestão configurada | ⏳ Pendente |
| Validar ingestão de Google Ads vs. GA4 | Luís (WiseMetrics) | 3h | Ingestão configurada | ⏳ Pendente |
| Validar ingestão de Meta Ads vs. GA4 | Luís (WiseMetrics) | 3h | Ingestão configurada | ⏳ Pendente |
| Criar tabelas staging (limpeza básica) | Luís (WiseMetrics) | 6h | Ingestão validada | ⏳ Pendente |
| Treinar Vitória no protocolo de ingestão manual | Mariana (WiseMetrics) | 2h | Protocolo definido | ⏳ Pendente |
| Primeira ingestão manual de dados Copart | Vitória (Copart) | 2h | Treinamento completo | ⏳ Pendente |
| Documentar dicionário de dados final | Mariana (WiseMetrics) | 4h | Tabelas staging criadas | ⏳ Pendente |

### 2.3 Entregáveis

- ✅ Projeto BigQuery criado com dataset base
- ✅ Estrutura de pastas em Google Drive (conforme especificação)
- ✅ Ingestão diária de GA4, Google Ads, Meta Ads configurada
- ✅ Protocolo de ingestão manual documentado
- ✅ Tabelas staging criadas com limpeza básica
- ✅ Dicionário de dados finalizado
- ✅ Validação cruzada de fontes (GA4 vs. mLabs, etc.)

### 2.4 Métricas de Sucesso

- ✅ Todas as fontes de dados ingerindo diariamente sem erros
- ✅ Discrepância entre GA4 e mLabs < 5%
- ✅ Discrepância entre Google Ads e GA4 < 10%
- ✅ Discrepância entre Meta Ads e GA4 < 15%
- ✅ Vitória capaz de fazer ingestão manual diariamente

---

## 3. Fase 2: Inteligência Inicial (Semanas 3-4)

### 3.1 Objetivo

Criar **dashboards funcionais** e **primeiros insights acionáveis** para demonstrar valor ao cliente e preparar o terreno para análises mais sofisticadas.

### 3.2 Atividades

#### Semana 3: Dashboards Executivo e Operacional

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Criar tabelas mart (agregações diárias) | Luís (WiseMetrics) | 6h | Tabelas staging validadas | ⏳ Pendente |
| Desenhar mockups dos dashboards | Mariana (WiseMetrics) | 4h | Especificação de dashboards | ⏳ Pendente |
| Implementar Dashboard Executivo em Data Studio | Luís (WiseMetrics) | 8h | Tabelas mart criadas | ⏳ Pendente |
| Implementar Dashboard Operacional em Data Studio | Luís (WiseMetrics) | 8h | Tabelas mart criadas | ⏳ Pendente |
| Configurar filtros e interatividade | Luís (WiseMetrics) | 4h | Dashboards implementados | ⏳ Pendente |
| Validar dados nos dashboards com Vitória | Mariana (WiseMetrics) + Vitória (Copart) | 3h | Dashboards funcionais | ⏳ Pendente |

#### Semana 4: Relatório Semanal e Treinamento

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Gerar primeiro relatório semanal (Semana 1) | Mariana (WiseMetrics) | 4h | Dashboards validados | ⏳ Pendente |
| Incluir primeiras recomendações acionáveis | Mariana (WiseMetrics) | 3h | Relatório gerado | ⏳ Pendente |
| Treinar Miriam, Bruno, Felipe, Maria nos dashboards | Mariana (WiseMetrics) | 2h | Dashboards prontos | ⏳ Pendente |
| Treinar Claudio, Fernando nos dashboards executivos | Guto (WiseMetrics) | 2h | Dashboards prontos | ⏳ Pendente |
| Realizar primeira reunião de inteligência (ritual) | Mariana (WiseMetrics) | 1.5h | Relatório pronto | ⏳ Pendente |
| Documentar quick wins iniciais | Mariana (WiseMetrics) | 2h | Relatório pronto | ⏳ Pendente |

### 3.3 Entregáveis

- ✅ Dashboard Executivo funcional (Visão Geral, Funil Leilão, Funil Venda, Atribuição)
- ✅ Dashboard Operacional funcional (Performance Diária, Campanhas Leilão, Campanhas Venda, Alertas)
- ✅ Primeiro relatório semanal com recomendações
- ✅ Ritual semanal estruturado (45 minutos)
- ✅ Documentação de quick wins (ex: melhora de habilitados após limpeza de campanhas)

### 3.4 Métricas de Sucesso

- ✅ Dashboards atualizando diariamente sem erros
- ✅ Stakeholders conseguem navegar e entender os dashboards
- ✅ Primeira reunião de inteligência gera 3+ recomendações acionáveis
- ✅ Quick wins documentados e comunicados ao cliente

---

## 4. Fase 3: Atribuição & Refinamento (Semanas 5-7)

### 4.1 Objetivo

Implementar **modelo de atribuição multi-touch** e **análise de coortes** para responder às perguntas críticas do projeto sobre qual campanha gera qual resultado.

### 4.2 Atividades

#### Semana 5: Modelo de Atribuição

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Desenhar modelo de atribuição (first-touch, last-touch, linear, time-decay) | Mariana (WiseMetrics) | 4h | Dados validados | ⏳ Pendente |
| Implementar modelo first-touch em BigQuery | Luís (WiseMetrics) | 6h | Modelo desenhado | ⏳ Pendente |
| Implementar modelo last-touch em BigQuery | Luís (WiseMetrics) | 6h | Modelo desenhado | ⏳ Pendente |
| Implementar modelo linear em BigQuery | Luís (WiseMetrics) | 6h | Modelo desenhado | ⏳ Pendente |
| Implementar modelo time-decay em BigQuery | Luís (WiseMetrics) | 6h | Modelo desenhado | ⏳ Pendente |
| Validar modelos com dados históricos | Mariana (WiseMetrics) | 4h | Modelos implementados | ⏳ Pendente |

#### Semana 6: Análise de Coortes

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Desenhar análise de coortes (por data, campanha, canal) | Mariana (WiseMetrics) | 3h | Modelo de atribuição validado | ⏳ Pendente |
| Implementar coortes por data de primeira conversão | Luís (WiseMetrics) | 6h | Análise desenhada | ⏳ Pendente |
| Implementar coortes por campanha | Luís (WiseMetrics) | 6h | Análise desenhada | ⏳ Pendente |
| Implementar coortes por canal | Luís (WiseMetrics) | 6h | Análise desenhada | ⏳ Pendente |
| Criar visualizações de coortes em Data Studio | Luís (WiseMetrics) | 6h | Coortes implementadas | ⏳ Pendente |

#### Semana 7: Refinamento e Documentação

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Gerar relatório de atribuição (comparação de modelos) | Mariana (WiseMetrics) | 4h | Modelos validados | ⏳ Pendente |
| Gerar análise de coortes por campanha | Mariana (WiseMetrics) | 4h | Coortes implementadas | ⏳ Pendente |
| Identificar campanhas com maior lifetime value | Mariana (WiseMetrics) | 3h | Coortes validadas | ⏳ Pendente |
| Documentar metodologia de atribuição | Mariana (WiseMetrics) | 3h | Análise completa | ⏳ Pendente |
| Apresentar findings ao cliente | Guto (WiseMetrics) | 2h | Relatórios prontos | ⏳ Pendente |

### 4.3 Entregáveis

- ✅ Modelo de atribuição multi-touch implementado (4 modelos)
- ✅ Análise de coortes por data, campanha e canal
- ✅ Visualizações de coortes em Data Studio
- ✅ Relatório de atribuição (comparação de modelos)
- ✅ Identificação de campanhas com maior lifetime value

### 4.4 Métricas de Sucesso

- ✅ Modelo de atribuição validado com dados históricos
- ✅ Discrepâncias entre modelos < 10%
- ✅ Coortes mostrando padrões claros de retenção/conversão
- ✅ Cliente consegue responder: "Qual campanha gera qual resultado?"

---

## 5. Fase 4: Otimização & Automação (Semanas 8-11)

### 5.1 Objetivo

Automatizar **recomendações semanais**, **alertas em tempo real** e **previsão de demanda** para transformar dados em ações contínuas.

### 5.2 Atividades

#### Semana 8: Alertas Automáticos

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Definir regras de alerta (queda > 20%, anomalias) | Mariana (WiseMetrics) | 3h | Dashboards operacionais | ⏳ Pendente |
| Implementar alertas em Data Studio | Luís (WiseMetrics) | 6h | Regras definidas | ⏳ Pendente |
| Configurar notificações por email/Slack | Luís (WiseMetrics) | 4h | Alertas implementados | ⏳ Pendente |
| Testar alertas com dados simulados | Mariana (WiseMetrics) | 3h | Notificações configuradas | ⏳ Pendente |

#### Semana 9: Recomendações Automáticas

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Desenhar lógica de recomendações (aumento orçamento, revisão segmentação, etc.) | Mariana (WiseMetrics) | 4h | Modelo de atribuição | ⏳ Pendente |
| Implementar scoring de campanhas (eficiência, potencial) | Luís (WiseMetrics) | 8h | Lógica desenhada | ⏳ Pendente |
| Gerar recomendações automáticas via query | Luís (WiseMetrics) | 6h | Scoring implementado | ⏳ Pendente |
| Integrar recomendações no relatório semanal | Mariana (WiseMetrics) | 3h | Recomendações geradas | ⏳ Pendente |

#### Semana 10: Forecasting

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Desenhar modelo de forecasting (séries temporais) | Mariana (WiseMetrics) | 4h | Histórico de 3+ meses | ⏳ Pendente |
| Implementar forecasting de entrantes (próximas 4 semanas) | Luís (WiseMetrics) | 8h | Modelo desenhado | ⏳ Pendente |
| Implementar forecasting de habilitados (próximas 4 semanas) | Luís (WiseMetrics) | 8h | Modelo desenhado | ⏳ Pendente |
| Criar visualizações de forecast em Data Studio | Luís (WiseMetrics) | 6h | Forecasting implementado | ⏳ Pendente |

#### Semana 11: Integração e Documentação

| **Atividade** | **Responsável** | **Duração** | **Dependência** | **Status** |
|---|---|---|---|---|
| Integrar alertas, recomendações e forecast nos dashboards | Luís (WiseMetrics) | 6h | Todos implementados | ⏳ Pendente |
| Otimizar performance de queries BigQuery | Luís (WiseMetrics) | 6h | Todas as queries criadas | ⏳ Pendente |
| Documentar arquitetura final | Mariana (WiseMetrics) | 4h | Tudo implementado | ⏳ Pendente |
| Treinar time de Binder em alertas e recomendações | Guto (WiseMetrics) | 2h | Tudo pronto | ⏳ Pendente |

### 5.3 Entregáveis

- ✅ Sistema de alertas automáticos (Data Studio + Email/Slack)
- ✅ Recomendações automáticas geradas semanalmente
- ✅ Modelo de forecasting (entrantes e habilitados, 4 semanas)
- ✅ Dashboards integrados com alertas, recomendações e forecast
- ✅ Documentação técnica completa

### 5.4 Métricas de Sucesso

- ✅ Alertas funcionando sem falsos positivos
- ✅ Recomendações implementadas resultam em ações (aumento de orçamento, revisão de segmentação)
- ✅ Forecast com erro < 15% (MAPE)
- ✅ Ritual semanal totalmente automatizado (dados prontos, recomendações prontas)

---

## 6. Checklist de Validação

### 6.1 Validação Técnica

- [ ] BigQuery configurado e acessível
- [ ] Ingestão de GA4 funcionando diariamente
- [ ] Ingestão de Google Ads funcionando diariamente
- [ ] Ingestão de Meta Ads funcionando diariamente
- [ ] Tabelas staging criadas e validadas
- [ ] Tabelas mart criadas e validadas
- [ ] Discrepância GA4 vs. mLabs < 5%
- [ ] Discrepância Google Ads vs. GA4 < 10%
- [ ] Discrepância Meta Ads vs. GA4 < 15%
- [ ] Discrepância Copart vs. RD Station < 5%

### 6.2 Validação de Dados

- [ ] Dicionário de dados documentado e aprovado
- [ ] Campos obrigatórios preenchidos (campaign_name, utm_source, etc.)
- [ ] Enumerações validadas (conversion_type, channel, etc.)
- [ ] Regras de negócio implementadas (entrantes >= habilitados, etc.)
- [ ] Alertas configurados para dados inválidos

### 6.3 Validação de Dashboards

- [ ] Dashboard Executivo mostrando dados corretos
- [ ] Dashboard Operacional mostrando dados corretos
- [ ] Filtros funcionando corretamente
- [ ] Gráficos renderizando sem erros
- [ ] Latência de atualização dentro do SLA

### 6.4 Validação de Processos

- [ ] Ritual semanal estruturado (45 minutos)
- [ ] Relatório semanal gerado automaticamente
- [ ] Recomendações acionáveis sendo implementadas
- [ ] Alertas sendo recebidos e respondidos
- [ ] Vitória capaz de fazer ingestão manual diariamente

### 6.5 Validação com Stakeholders

- [ ] Claudio Romano validou Dashboard Executivo
- [ ] Miriam validou Dashboard Operacional
- [ ] Vitória validou protocolo de ingestão manual
- [ ] Binder confirmou que recomendações são acionáveis
- [ ] Cliente satisfeito com qualidade dos dados

---

## 7. Dependências Críticas

| **Dependência** | **Responsável** | **Status** | **Impacto** |
|---|---|---|---|
| Acesso a BigQuery | Luís (WiseMetrics) | ⏳ Pendente | CRÍTICO — sem isso, nada funciona |
| Acesso a GA4 | Luís (WiseMetrics) | ⏳ Pendente | CRÍTICO — fonte principal de dados |
| Acesso a Google Ads | Luís (WiseMetrics) | ⏳ Pendente | CRÍTICO — fonte de mídia paga |
| Acesso a Meta Ads | Luís (WiseMetrics) | ⏳ Pendente | CRÍTICO — fonte de mídia paga |
| Acesso a RD Station | Luís (WiseMetrics) | ⏳ Pendente | ALTO — enriquecimento de dados |
| Dados históricos de Copart | Vitória (Copart) | ⏳ Pendente | ALTO — validação inicial |
| Acesso a Google Drive / SharePoint | Guto (WiseMetrics) | ⏳ Pendente | MÉDIO — organização de arquivos |
| Acesso a Data Studio | Luís (WiseMetrics) | ⏳ Pendente | CRÍTICO — visualização de dados |

---

## 8. Riscos e Mitigações

| **Risco** | **Probabilidade** | **Impacto** | **Mitigação** |
|---|---|---|---|
| GA4 desorganizado ou com tags incorretas | ALTA | ALTO | Auditoria de tags na Semana 1; trabalhar com Caio (SEO) |
| Dados de Copart em planilhas desorganizadas | ALTA | ALTO | Estabelecer protocolo claro na Semana 1; treinar Vitória |
| Discrepâncias entre GA4 e mLabs > 5% | MÉDIA | MÉDIO | Investigar com Vitória; ajustar regras de validação |
| Cliente não consegue usar dashboards | MÉDIA | MÉDIO | Treinar intensivamente na Semana 4; criar guia de uso |
| Atribuição frágil (muitos dados incompletos) | ALTA | ALTO | Começar com first-touch/last-touch; refinar gradualmente |
| Falta de dados históricos para forecasting | MÉDIA | MÉDIO | Começar forecasting na Semana 10 (após 3 meses de dados) |

---

## 9. Próximos Passos Imediatos

1. **Semana 1 — Segunda-feira**: Reunião de kickoff com Luís, Mariana, Vitória para confirmar acesso e dependências
2. **Semana 1 — Terça-feira**: Criar projeto BigQuery e estrutura de pastas
3. **Semana 1 — Quarta-feira**: Participar da reunião de mídia com cliente (observar)
4. **Semana 1 — Quinta-feira**: Cozinha de mídia com Bruno, Felipe, Maria (entender fluxos)
5. **Semana 2 — Segunda-feira**: Primeira validação de dados (GA4 vs. mLabs)
6. **Semana 2 — Quarta-feira**: Apresentar primeiros dados ao cliente (quick wins)

---

## 10. Orçamento e Recursos

### 10.1 Equipe Necessária

| **Função** | **Pessoa** | **Dedicação** | **Período** |
|---|---|---|---|
| Liderança Estratégica | Guto (WiseMetrics) | 20% | Contínuo |
| Engenharia de Dados | Luís (WiseMetrics) | 100% | Fases 1-4 |
| Inteligência de Dados | Mariana (WiseMetrics) | 80% | Fases 1-4 |
| Acompanhamento Estratégico | Rodrigo (WiseMetrics) | 10% | Contínuo |
| Dados Internos | Vitória (Copart) | 30% | Contínuo |

### 10.2 Ferramentas Necessárias

| **Ferramenta** | **Custo Mensal** | **Uso** | **Crítico** |
|---|---|---|---|
| BigQuery | ~R$ 500-1.000 | Data Lake | ✅ SIM |
| Google Data Studio | Gratuito | BI / Dashboards | ✅ SIM |
| Google Cloud Scheduler | ~R$ 50 | Orquestração | ✅ SIM |
| Zapier / Make | ~R$ 200-500 | Integrações | ⚠️ OPCIONAL |
| Looker (alternativa Data Studio) | ~R$ 2.000+ | BI avançado | ⚠️ OPCIONAL |

---


