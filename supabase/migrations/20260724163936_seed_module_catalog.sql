-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: seed_module_catalog
-- DESCRIÇÃO: Popula os 4 modulos de BPO e suas frentes/KPIs padrao.
-- ============================================================================

insert into module_catalog (key, name, description, default_kpis, default_sla)
values
(
  'ti',
  'BPO de TI',
  'Gestao de infraestrutura em nuvem, sustentacao de softwares, suporte de nivel 1/2 (Help Desk) e monitoramento de redes.',
  '[
    {"frente": "Help Desk N1/N2", "kpi": "Tempo medio de primeira resposta e taxa de resolucao em N1"},
    {"frente": "Infraestrutura em nuvem", "kpi": "Uptime mensal e tempo medio de recuperacao"},
    {"frente": "Sustentacao de software", "kpi": "Tempo medio de correcao de bugs por severidade"},
    {"frente": "Monitoramento de redes", "kpi": "Tempo de deteccao e tempo de resposta a incidentes"}
  ]'::jsonb,
  '{"first_response_hours": 4, "resolution_hours_p1": 8, "resolution_hours_p2": 24}'::jsonb
),
(
  'financeiro',
  'BPO Financeiro',
  'Contas a pagar e receber, conciliacao bancaria, emissao de notas fiscais, gestao de fluxo de caixa e relatorios de DRE.',
  '[
    {"frente": "Contas a pagar e receber", "kpi": "Percentual de pagamentos dentro do vencimento"},
    {"frente": "Conciliacao bancaria", "kpi": "Tempo de fechamento da conciliacao mensal"},
    {"frente": "Notas fiscais", "kpi": "Percentual de notas emitidas sem erro fiscal"},
    {"frente": "Fluxo de caixa e DRE", "kpi": "Prazo de entrega do relatorio mensal"}
  ]'::jsonb,
  '{"payment_deadline_days": 2, "monthly_report_deadline_day": 5}'::jsonb
),
(
  'rh',
  'BPO de Recursos Humanos',
  'Gestao completa de folha de pagamento, processamento de beneficios, admissoes/demissoes e rotinas de recrutamento e selecao.',
  '[
    {"frente": "Folha de pagamento", "kpi": "Percentual de folhas processadas sem erro e no prazo"},
    {"frente": "Beneficios", "kpi": "Tempo de ativacao de beneficios para novos colaboradores"},
    {"frente": "Admissoes e demissoes", "kpi": "Percentual de rescisoes pagas dentro do prazo legal"},
    {"frente": "Recrutamento e selecao", "kpi": "Tempo medio de preenchimento de vaga"}
  ]'::jsonb,
  '{"payroll_deadline_day": 5, "termination_payment_days": 10}'::jsonb
),
(
  'atendimento',
  'BPO de Atendimento / Comercial',
  'Centrais de atendimento ao cliente, suporte tecnico especializado, qualificacao de leads (SDR) e moderacao de plataformas.',
  '[
    {"frente": "Central de atendimento", "kpi": "CSAT e tempo medio de atendimento"},
    {"frente": "Suporte tecnico especializado", "kpi": "Taxa de resolucao no segundo nivel"},
    {"frente": "Qualificacao de leads (SDR)", "kpi": "Taxa de conversao de lead qualificado"},
    {"frente": "Moderacao de plataformas", "kpi": "Tempo medio de moderacao por conteudo"}
  ]'::jsonb,
  '{"first_response_minutes": 30, "sdr_response_hours": 4}'::jsonb
)
on conflict (key) do nothing;
