# Análise dos Relatórios Anteriores da Copart

Este documento foi criado com base nas capturas de tela dos relatórios/dashboards enviados pela Copart à Binder, com o intuito de registrar a memória do projeto e orientar a arquitetura de dados e especificação dos novos dashboards.

## 1. Visão Geral
Os relatórios atuais da Copart são divididos por visões **Semanais** e **Mensais**, acompanhando a evolução histórica (ex: Novembro a Junho) e variações percentuais semana a semana.

## 2. KPIs e Métricas Mapeadas

### 2.1. Tráfego, Comportamento e Navegação Web
- **Page Views:** Visão semanal e mensal (ex: 23M a 32M por mês).
- **Visitantes Únicos (Total Users):** Visão semanal e mensal.
- **Novos Usuários:** Visão semanal e mensal (Composto por Novos Usuários + Usuários que retornaram).
- **Usuários que Retornaram:** Visão semanal e mensal.
- **First Visit:** Acompanhamento de primeiras visitas ao site.
- **Login:** Volume de usuários que efetuaram login (semanal/mensal).
- **Favoritos (Favoritados):** Ações de favoritar lotes/veículos (semanal/mensal).

### 2.2. Conversão e Cadastros (Funil)
- **Cadastros Gerais:** Comparativo de **Entrantes** (iniciaram o cadastro) vs **Habilitados** (concluíram e estão aptos a comprar). Analisado mensalmente e semanalmente.
- **Leads Venda Direta:** Acompanhamento semanal do volume de leads gerados.

### 2.3. Redes Sociais
- **Crescimento Global:** Acompanhamento do total de seguidores ano a ano (2023, 2024, 2025) com metas de crescimento (ex: meta de 6% para 2025).
- **Distribuição de Base:** Market share das redes (Instagram com ~51%, TikTok com ~27%, Facebook com ~16%, YouTube com ~4%, LinkedIn com ~0.5%).
- **Métricas Específicas por Canal (Instagram, Facebook, YouTube, TikTok):**
  - **Evolução de Seguidores:** Crescimento/queda semanal absoluto e percentual.
  - **Métricas de Engajamento:** Visualizações, Interações e Clicks (ou Impressões/Espectadores Únicos dependendo da rede).
  - **Conteúdo Top Performance:** Tabela de "Postagens de melhor performance" detalhando formato (Reels, Carrossel, Estático, Vídeo Antigo), data/hora da postagem, alcance, visualizações, interações e taxa de engajamento.

## 3. Implicações para o Novo Projeto
As imagens evidenciam a necessidade de:
1. **Granularidade de Tempo:** Os novos dashboards precisarão alternar facilmente entre visões Semanais, Mensais e Anuais, e calcular variações (WoW, MoM).
2. **Visão de Funil de Cadastro:** Importante manter a relação Entrantes -> Habilitados.
3. **Cruzamento de Dados de Redes Sociais:** Os relatórios acompanham métricas nativas granulares (Visualizações, Cliques, Engajamento de posts específicos), o que exigirá extração via APIs nativas (Meta, TikTok, YouTube, LinkedIn) e não apenas dados do Google Analytics.
