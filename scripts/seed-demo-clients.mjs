// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Povoamento Robusto / Seed de Demonstracao
// ARQUIVO: scripts/seed-demo-clients.mjs
// DESCRICAO: Povoa o tenant informado com 10 clientes reais (dados de CNPJ via
//            lookup-cnpj), identidade visual por cliente (client_themes) e
//            diagnosticos ficticios (mas ancorados no CNAE real) nos 4 pilares.
// USO:       node scripts/seed-demo-clients.mjs <admin_email> <admin_senha>
// ============================================================================

import fs from "fs";

const BPO_ID = "dc8ab342-74e4-4fb1-a5c1-914891e91f48";

const [, , ADMIN_EMAIL, ADMIN_PASSWORD] = process.argv;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Uso: node scripts/seed-demo-clients.mjs <admin_email> <admin_senha>");
  process.exit(1);
}

function readEnvLocal() {
  const raw = fs.readFileSync(".env.local", "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = readEnvLocal();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Nao encontrei NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local");
  process.exit(1);
}

const THEMES = [
  { primary_color: "#0F6E56", secondary_color: "#E1F5EE", font_family: "Inter" },
  { primary_color: "#185FA5", secondary_color: "#E6F1FB", font_family: "Inter" },
  { primary_color: "#534AB7", secondary_color: "#EEEDFE", font_family: "Inter" },
  { primary_color: "#993C1D", secondary_color: "#FAECE7", font_family: "Inter" },
  { primary_color: "#0E7C7B", secondary_color: "#E0F4F4", font_family: "Inter" },
  { primary_color: "#B4832A", secondary_color: "#FBF1DE", font_family: "Inter" },
  { primary_color: "#2E5E3E", secondary_color: "#E7F2EA", font_family: "Inter" },
  { primary_color: "#7A2E5C", secondary_color: "#F7E8F1", font_family: "Inter" },
  { primary_color: "#3A4750", secondary_color: "#EAEDEF", font_family: "Inter" },
  { primary_color: "#B23A48", secondary_color: "#FBE7E9", font_family: "Inter" },
];

const CLIENTS = [
  {
    cnpj: "26223863000111",
    findings: {
      ti: "A confeitaria recebia todos os pedidos por uma unica linha de WhatsApp, e picos de fim de semana faziam pedidos se perderem no meio da conversa. A decisao de terceirizar o suporte de TI trouxe um sistema simples de fila de pedidos integrado ao WhatsApp Business, com backup automatico diario. Depois disso, a confeitaria nunca mais perdeu um pedido de aniversario por falha de anotacao.",
      financeiro: "Eliana fechava o caixa manualmente numa caderneta, e descobriu meses depois que estava contabilizando prejuizo num produto que na verdade dava lucro. A decisao de terceirizar o financeiro trouxe controle de custo por receita e conciliacao bancaria semanal. Em tres meses, a margem real apareceu e a confeitaria descontinuou o unico produto que de fato dava prejuizo havia dois anos.",
      rh: "Com o crescimento, Eliana contratou a primeira funcionaria sem saber calcular ferias e decimo terceiro corretamente. A decisao de terceirizar a folha evitou uma autuacao trabalhista que um contador amigo alertou ser praticamente certa no formato anterior. Hoje a confeitaria tem duas funcionarias registradas sem nenhum problema com a folha.",
      atendimento: "Nos dias de maior demanda, ninguem respondia as mensagens de clientes querendo saber se ainda dava tempo de encomendar um bolo para o mesmo dia. A decisao de terceirizar o atendimento trouxe uma central que responde em minutos, mesmo na correria da producao. As encomendas de ultima hora, que antes eram perdidas, hoje sao a parte que mais cresce do faturamento.",
    },
  },
  {
    cnpj: "09557258000168",
    findings: {
      ti: "O sistema de ponto de venda da loja travava toda sexta-feira, justamente no dia de maior movimento, e ninguem sabia consertar. A decisao de terceirizar a TI trouxe suporte remoto com atendimento no mesmo dia e monitoramento do equipamento. A loja nunca mais fechou o caixa na mao numa sexta-feira.",
      financeiro: "A loja comprava mercadoria sem comparar o preco de reposicao com o preco de venda, e vivia sem saber se o mes tinha sido bom ou ruim. A decisao de terceirizar o financeiro trouxe relatorio mensal de fluxo de caixa e DRE simplificado. Pela primeira vez, o dono conseguiu decidir com numero na mao quais linhas de produto valia a pena ampliar.",
      rh: "A rotatividade de vendedores era alta e cada contratacao nova recomecava o aprendizado de calculo de comissao do zero. A decisao de terceirizar o RH trouxe uma rotina padronizada de admissao e um calculo de comissao automatizado e transparente. A rotatividade caiu porque os vendedores passaram a confiar que o pagamento estava sempre certo.",
      atendimento: "Clientes que perguntavam sobre disponibilidade de produto pelo Instagram raramente recebiam resposta a tempo de decidir a compra. A decisao de terceirizar o atendimento trouxe uma central que responde consultas de estoque em poucos minutos. As vendas originadas do Instagram triplicaram no primeiro trimestre.",
    },
  },
  {
    cnpj: "10427822000107",
    findings: {
      ti: "O controle de estoque de milhares de itens pequenos (linhas, botoes, aviamentos) era feito em planilha, e vivia desatualizado. A decisao de terceirizar a TI trouxe um sistema de estoque com codigo de barras, sincronizado em tempo real. Hoje a loja sabe exatamente quando um item esta acabando, antes que a cliente pergunte e nao tenha.",
      financeiro: "Vendas fiadas para costureiras clientes antigas nunca eram cobradas com metodo - cada uma era lembrada de cabeca. A decisao de terceirizar o financeiro trouxe controle de contas a receber com lembrete automatico. A inadimplencia informal, que corroia a margem havia anos, praticamente desapareceu.",
      rh: "A dona sempre contratava por indicacao, sem processo formal, e teve dois casos de funcionarias que nao bateram com a rotina da loja e sairam em poucas semanas. A decisao de terceirizar o RH trouxe um processo simples de selecao e integracao. A ultima contratacao, feita com esse processo, completa dois anos na loja.",
      atendimento: "Clientes de fora da cidade que compravam por WhatsApp reclamavam de demora para saber se um tecido ainda estava disponivel. A decisao de terceirizar o atendimento trouxe resposta padronizada em ate 15 minutos. As vendas para fora de Sao Bernardo, que eram raras, hoje sao regulares.",
    },
  },
  {
    cnpj: "11874249000142",
    findings: {
      ti: "Nas epocas de pico (volta as aulas, dia das maes), o sistema de vendas nao aguentava o movimento e travava na fila do caixa. A decisao de terceirizar a TI trouxe upgrade de infraestrutura e suporte de plantao nas datas sazonais criticas. A ultima volta as aulas passou sem nenhuma trava no caixa, pela primeira vez em anos.",
      financeiro: "A loja comprava para o estoque de temporada sem saber quanto sobrou da temporada anterior parado na prateleira. A decisao de terceirizar o financeiro trouxe relatorio de giro de estoque por categoria. A compra da temporada seguinte foi ajustada com esse dado, e sobrou menos da metade do que sobrava antes.",
      rh: "A loja contratava temporarios para as datas de pico sem contrato formal, correndo risco trabalhista todo ano. A decisao de terceirizar o RH trouxe contratos temporarios corretos e calculo automatico de encargos. A loja deixou de operar no risco que corria havia anos sem perceber.",
      atendimento: "Clientes perguntavam por tamanho e modelo especifico pelo WhatsApp e a resposta so vinha quando alguem tinha tempo livre na loja. A decisao de terceirizar o atendimento trouxe resposta rapida com consulta direta ao estoque. Reservas feitas pelo WhatsApp, que antes eram raras, hoje representam parte relevante das vendas.",
    },
  },
  {
    cnpj: "17210928000101",
    findings: {
      ti: "Orcamentos para obras eram feitos a mao e muitas vezes o cliente esperava dias pela resposta, perdendo a venda para o concorrente mais rapido. A decisao de terceirizar a TI trouxe um sistema simples de orcamento digital com resposta no mesmo dia. O tempo de resposta caiu de dias para horas, e a taxa de fechamento de orcamento subiu.",
      financeiro: "A loja vendia parcelado para pequenas construtoras locais sem controle formal de quem devia o que. A decisao de terceirizar o financeiro trouxe controle de contas a receber por cliente e alerta de atraso. Um caso de inadimplencia que vinha se arrastando havia um ano foi finalmente resolvido com a cobranca estruturada.",
      rh: "Os ajudantes de deposito trabalhavam sem registro formal de horas, e um episodio de reclamacao trabalhista assustou o dono. A decisao de terceirizar o RH trouxe controle de ponto e folha corretos. Desde entao, a empresa nao teve mais nenhum problema trabalhista.",
      atendimento: "Pedreiros e clientes ligavam perguntando se um material estava disponivel e muitas vezes ninguem atendia no horario de pico da manha. A decisao de terceirizar o atendimento trouxe uma central que confirma disponibilidade em tempo real. As vendas por telefone, que vinham caindo, voltaram a crescer.",
    },
  },
  {
    cnpj: "61905792000138",
    findings: {
      ti: "O controle de validade dos doces era feito de memoria, e produtos vencidos as vezes ainda estavam na prateleira. A decisao de terceirizar a TI trouxe um sistema de estoque com alerta de validade proxima. As perdas por produto vencido, que comiam parte relevante da margem, cairam quase a zero.",
      financeiro: "O dono nao separava o dinheiro da loja do dinheiro pessoal, e nunca sabia ao certo se a loja estava dando lucro de verdade. A decisao de terceirizar o financeiro trouxe separacao formal de caixa e relatorio mensal simples. Pela primeira vez, Mauricio conseguiu tirar um pro-labore fixo sabendo que a loja aguentava.",
      rh: "A unica funcionaria que ajudava no balcao saiu sem aviso, e o dono descobriu que nao sabia calcular corretamente o que devia pagar na rescisao. A decisao de terceirizar o RH evitou um erro de calculo que teria gerado uma reclamacao trabalhista. A proxima contratacao ja comecou com contrato e calculo corretos desde o primeiro dia.",
      atendimento: "Revendedores que compravam doces por atacado para revender em festas reclamavam de demora para saber preco e quantidade minima. A decisao de terceirizar o atendimento trouxe resposta rapida e tabela de precos sempre atualizada. A carteira de revendedores, que estava estagnada, voltou a crescer.",
    },
  },
  {
    cnpj: "19971419000119",
    findings: {
      ti: "A agenda de manutencao de bicicletas era feita em papel, e duas vezes uma bicicleta de cliente ficou esquecida na fila sem ninguem perceber. A decisao de terceirizar a TI trouxe um sistema simples de ordem de servico digital com prazo visivel. Nenhuma bicicleta ficou esquecida na oficina desde entao.",
      financeiro: "A loja nao separava o que vinha da venda de bicicletas novas do que vinha da oficina de manutencao, entao nao sabia qual das duas frentes realmente dava lucro. A decisao de terceirizar o financeiro trouxe separacao de resultado por linha de negocio. Descobriu-se que a oficina de manutencao dava mais lucro proporcional que a venda de bicicletas, e o dono redirecionou o foco.",
      rh: "O mecanico mais experiente pediu demissao e o dono percebeu que nao tinha nenhum processo formal para treinar um substituto rapido. A decisao de terceirizar o RH trouxe um processo de contratacao e integracao estruturado. O novo mecanico ficou produtivo em semanas, nao meses, como da ultima vez.",
      atendimento: "Clientes perguntavam pelo status do conserto da bicicleta e muitas vezes tinham que ir ate a loja pessoalmente para saber, porque ninguem respondia o WhatsApp durante o expediente da oficina. A decisao de terceirizar o atendimento trouxe atualizacao de status por mensagem automatica. As reclamacoes por falta de retorno, que eram frequentes, praticamente acabaram.",
    },
  },
  {
    cnpj: "02975098000128",
    findings: {
      ti: "A loja, administrada por dois irmaos, tinha dois cadernos de anotacao diferentes para o mesmo estoque, e as contagens nunca batiam. A decisao de terceirizar a TI unificou o controle num sistema unico acessado pelos dois. A divergencia de estoque entre os dois irmaos, motivo de discussao havia anos, acabou.",
      financeiro: "Cada irmao retirava dinheiro do caixa quando precisava, sem registro, e no fim do mes nenhum dos dois sabia exatamente quanto a loja tinha lucrado. A decisao de terceirizar o financeiro trouxe controle formal de retiradas e relatorio mensal compartilhado. As discussoes sobre dinheiro entre os irmaos, que eram frequentes, diminuiram muito.",
      rh: "A loja empregava um sobrinho como ajudante sem nenhum registro formal, e um comentario de um cliente sobre fiscalizacao trabalhista deixou os dois irmaos preocupados. A decisao de terceirizar o RH regularizou o registro do funcionario dentro da lei. A loja deixou de operar com esse risco escondido.",
      atendimento: "Uma cliente antiga reclamou publicamente nas redes sociais porque ninguem respondeu sua pergunta sobre um tecido durante tres dias. A decisao de terceirizar o atendimento trouxe resposta padronizada em poucas horas. Reviews negativos sobre demora, que a loja vinha recebendo, pararam de aparecer.",
    },
  },
  {
    cnpj: "44164681000107",
    findings: {
      ti: "Os desenhos tecnicos das pecas encomendadas por industrias locais eram guardados em papel, e uma vez um pedido urgente atrasou porque o desenho certo nao foi encontrado a tempo. A decisao de terceirizar a TI trouxe digitalizacao e backup em nuvem dos desenhos tecnicos. Nenhum pedido atrasou por desenho perdido desde entao.",
      financeiro: "A oficina calculava o preco de cada peca usinada de cabeca, sem considerar direito o custo real de material e hora de maquina, e descobriu que estava cobrando abaixo do custo em pecas complexas. A decisao de terceirizar o financeiro trouxe uma planilha de custo por hora de maquina e por material. A precificacao corrigida aumentou a margem sem perder nenhum cliente industrial.",
      rh: "A oficina precisava contratar um segundo tornearo para dar conta da demanda, mas nao sabia como estruturar o registro e os encargos de um funcionario tecnico especializado. A decisao de terceirizar o RH resolveu a contratacao dentro da lei, sem erro de calculo. A oficina dobrou a capacidade de producao com a nova contratacao.",
      atendimento: "Industrias clientes ligavam pedindo prazo de entrega e muitas vezes o telefone tocava sem resposta porque o unico numero era o celular pessoal do dono, que estava no torno. A decisao de terceirizar o atendimento trouxe uma central que responde prazos e status de producao. Um grande cliente industrial que ameacava trocar de fornecedor por falta de resposta permaneceu na carteira.",
    },
  },
  {
    cnpj: "57796526000147",
    findings: {
      ti: "A loja vendia tambem por um catalogo simples no WhatsApp, mas o catalogo desatualizava toda semana e clientes reclamavam de pedir um produto que ja tinha acabado. A decisao de terceirizar a TI trouxe um catalogo digital sincronizado automaticamente com o estoque. As reclamacoes de produto indisponivel apos o pedido confirmado acabaram.",
      financeiro: "A empresa comprava lotes grandes de doces para revenda sem calcular o prazo de validade contra o giro real de venda, e perdia lotes inteiros vencidos periodicamente. A decisao de terceirizar o financeiro trouxe planejamento de compra baseado em giro historico. As perdas por vencimento, que eram recorrentes a cada trimestre, praticamente desapareceram.",
      rh: "A empresa tinha dificuldade para reter empacotadores durante a alta demanda de datas festivas, porque nao tinha uma politica clara de bonificacao sazonal. A decisao de terceirizar o RH trouxe uma politica de bonificacao formal para os periodos de pico. A retencao da equipe temporaria melhorou, e a empresa parou de perder producao por falta de gente treinada.",
      atendimento: "Compradores de festa infantil perguntavam sobre kits promocionais por mensagem e recebiam resposta so no dia seguinte, quando muitas vezes ja tinham comprado em outro lugar. A decisao de terceirizar o atendimento trouxe resposta no mesmo dia com sugestao automatica de kits. A conversao de pedidos de festa, que era baixa, melhorou visivelmente.",
    },
  },
];

async function main() {
  console.log("1) Login como admin...");
  const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON_KEY },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error("Falha no login:", loginData);
    process.exit(1);
  }
  const accessToken = loginData.access_token;
  const adminUserId = loginData.user.id;
  console.log("   ok, user_id =", adminUserId);

  const authHeaders = {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
  };

  console.log("2) Lendo module_catalog (SLA padrao por modulo)...");
  const catalogRes = await fetch(`${SUPABASE_URL}/rest/v1/module_catalog?select=key,default_sla`, {
    headers: authHeaders,
  });
  const catalog = await catalogRes.json();
  const slaByKey = Object.fromEntries(catalog.map((m) => [m.key, m.default_sla]));
  console.log("   ok,", catalog.length, "modulos encontrados");

  for (let i = 0; i < CLIENTS.length; i++) {
    const c = CLIENTS[i];
    const theme = THEMES[i % THEMES.length];
    console.log(`\n[${i + 1}/10] CNPJ ${c.cnpj}`);

    console.log("   consultando lookup-cnpj...");
    const lookupRes = await fetch(`${SUPABASE_URL}/functions/v1/lookup-cnpj`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ cnpj: c.cnpj }),
    });
    const lookup = await lookupRes.json();
    if (!lookupRes.ok || !lookup.success) {
      console.error("   ERRO no lookup-cnpj:", lookup);
      continue;
    }
    const d = lookup.data;
    const companyName = d.nome_fantasia && d.nome_fantasia.trim() ? d.nome_fantasia.trim() : d.company_name;
    console.log("   ->", companyName);

    console.log("   gravando bpo_clients...");
    const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/bpo_clients`, {
      method: "POST",
      headers: { ...authHeaders, Prefer: "return=representation" },
      body: JSON.stringify({
        bpo_id: BPO_ID,
        company_name: companyName,
        cnpj: d.cnpj,
        cnae_principal: d.cnae_principal,
        cnae_descricao: d.cnae_descricao,
        porte_receita: d.porte_receita,
        situacao_cadastral: d.situacao_cadastral,
        municipio: d.municipio,
        uf: d.uf,
        data_abertura: d.data_abertura,
        natureza_juridica: d.natureza_juridica,
        dados_receita_raw: d.dados_receita_raw,
      }),
    });
    const clientRows = await clientRes.json();
    if (!clientRes.ok) {
      console.error("   ERRO ao gravar bpo_clients:", clientRows);
      continue;
    }
    const clientId = clientRows[0].id;
    console.log("   client_id =", clientId);

    console.log("   gravando client_themes...");
    await fetch(`${SUPABASE_URL}/rest/v1/client_themes`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        bpo_id: BPO_ID,
        client_id: clientId,
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        font_family: theme.font_family,
      }),
    });

    console.log("   gravando diagnostics (4 pilares)...");
    const pilares = ["ti", "financeiro", "rh", "atendimento"];
    for (const pilar of pilares) {
      await fetch(`${SUPABASE_URL}/rest/v1/diagnostics`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          bpo_id: BPO_ID,
          client_id: clientId,
          department: pilar,
          findings: c.findings[pilar],
          recommended_modules: [pilar],
          created_by: adminUserId,
        }),
      });
    }

    console.log("   gravando client_modules (4 pilares, status ativo)...");
    for (const pilar of pilares) {
      await fetch(`${SUPABASE_URL}/rest/v1/client_modules`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          bpo_id: BPO_ID,
          client_id: clientId,
          module_key: pilar,
          status: "ativo",
          sla: slaByKey[pilar] ?? {},
          activated_at: new Date().toISOString(),
        }),
      });
    }

    console.log("   OK:", companyName, "populado com sucesso.");
  }

  console.log("\nSeed finalizado.");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
