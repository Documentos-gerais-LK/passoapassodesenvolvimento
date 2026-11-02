import type { PromptTemplate } from "./types";

export const prompts: PromptTemplate[] = [
  {
    id: "planejamento",
    title: "Planejamento inicial",
    purpose: "Transformar uma necessidade em um plano enxuto, com perguntas de esclarecimento.",
    tool: "chatgpt",
    fields: [
      { key: "necessidade", label: "Necessidade", placeholder: "Preciso registrar tarefas e marcar as que já concluí." },
      { key: "usuario", label: "Quem vai usar", placeholder: "Uma pessoa que organiza o próprio dia." },
      { key: "problema", label: "Problema atual", placeholder: "Hoje anoto em papel e perco as tarefas." },
      { key: "resultado", label: "Resultado esperado", placeholder: "Ver minhas tarefas e saber quais já fiz." },
    ],
    text: `Atue como parceiro de planejamento de software.

Necessidade: {{necessidade}}
Quem vai usar: {{usuario}}
Problema atual: {{problema}}
Resultado esperado: {{resultado}}

Pedidos:
1. Faça até 5 perguntas de esclarecimento antes de propor qualquer solução.
2. Depois, proponha uma primeira versão MÍNIMA.
3. Liste o que fica de fora desta primeira versão e por quê.
4. Aponte riscos e suposições que você está fazendo.
Não proponha funcionalidades que eu não pedi sem justificar.`,
  },
  {
    id: "pesquisa",
    title: "Pesquisa tecnológica",
    purpose: "Comparar alternativas por complexidade, risco, custo e manutenção.",
    tool: "chatgpt",
    fields: [
      { key: "duvida", label: "Dúvida tecnológica", placeholder: "Armazenamento local ou banco de dados remoto?" },
      { key: "contexto", label: "Contexto do projeto", placeholder: "App de tarefas para uso individual, sem login." },
    ],
    text: `Preciso decidir: {{duvida}}
Contexto: {{contexto}}

Compare pelo menos duas alternativas considerando: complexidade, riscos, custos, manutenção e adequação ao meu problema.
Para cada uma, diga quando é a melhor escolha e quando NÃO é.
Cite a documentação oficial para cada afirmação importante e diga o que eu devo confirmar lá, pois versões e preços mudam.
Termine com uma recomendação condicional ("se X, então A; se Y, então B").`,
  },
  {
    id: "especificacao",
    title: "Especificação",
    purpose: "Revisar e melhorar uma especificação com critérios de aceite verificáveis.",
    tool: "chatgpt",
    fields: [{ key: "spec", label: "Sua especificação (Markdown)", placeholder: "Cole aqui o Markdown copiado do formulário." }],
    text: `Revise a especificação abaixo.

{{spec}}

Aponte: ambiguidades, critérios de aceite que não podem ser respondidos com sim ou não, itens de escopo faltando e riscos.
Sugira melhorias sem aumentar o escopo.`,
  },
  {
    id: "issues",
    title: "Criação de Issues",
    purpose: "Gerar o texto de uma Issue com checklist de critérios de aceite.",
    tool: "chatgpt",
    fields: [{ key: "spec", label: "Especificação da entrega", placeholder: "Cole a especificação da entrega." }],
    text: `Com base na especificação abaixo, escreva uma Issue de GitHub em Markdown com:
- Título curto
- Objetivo
- Escopo
- Fora do escopo
- Critérios de aceite como checklist (- [ ] ...)

Especificação:
{{spec}}`,
  },
  {
    id: "concept",
    title: "Concept visual",
    purpose: "Gerar uma referência visual de uma tela antes de implementá-la.",
    tool: "chatgpt",
    fields: [
      { key: "tela", label: "Tela", placeholder: "Tela principal do Mini Gestor de Tarefas" },
      { key: "estilo", label: "Estilo desejado", placeholder: "Escuro, minimalista, destaque dourado" },
      { key: "elementos", label: "Elementos obrigatórios", placeholder: "Campo para nova tarefa, lista, botão concluir" },
    ],
    text: `Crie um concept visual (ilustração de referência, não um sistema real) para: {{tela}}.
Estilo: {{estilo}}.
Elementos obrigatórios: {{elementos}}.
Priorize hierarquia clara, bom contraste e legibilidade. Mostre a versão para celular e para desktop.`,
  },
  {
    id: "auditoria",
    title: "Auditoria do repositório",
    purpose: "Pedir ao Claude Code que apenas leia o projeto e proponha um plano.",
    tool: "claude",
    fields: [{ key: "issue", label: "Issue (número e texto)", placeholder: "#1 Criar e listar tarefas — critérios: …" }],
    text: `Faça uma AUDITORIA DE LEITURA. Não altere, crie nem apague nenhum arquivo.

Issue:
{{issue}}

Entregue:
1. Pasta atual e branch atual.
2. Estrutura relevante do projeto.
3. Arquivos que você pretende alterar e por quê.
4. Plano de implementação em passos pequenos.
5. Riscos e dúvidas.
Aguarde minha autorização antes de implementar.`,
  },
  {
    id: "implementacao",
    title: "Implementação com Claude Code",
    purpose: "Autorizar uma implementação específica, com limites claros.",
    tool: "claude",
    fields: [
      { key: "issue", label: "Issue e critérios de aceite", placeholder: "#1 …" },
      { key: "limites", label: "Restrições", placeholder: "Não instalar novas dependências sem me perguntar." },
    ],
    text: `Implemente SOMENTE o que está descrito na Issue abaixo, seguindo o plano que aprovei.

{{issue}}

Restrições:
- {{limites}}
- Não altere arquivos que não sejam necessários.
- Não apague arquivos nem reescreva histórico git.
- Preserve alterações que eu já tenha feito.
- Pare e me pergunte se encontrar algo ambíguo.

Ao final, rode typecheck, testes e build (se existirem) e informe o resultado REAL, inclusive falhas.`,
  },
  {
    id: "diagnostico",
    title: "Diagnóstico de falhas",
    purpose: "Entender a causa de um erro antes de corrigir.",
    tool: "claude",
    fields: [
      { key: "comando", label: "Comando executado", placeholder: "npm test" },
      { key: "erro", label: "Mensagem de erro completa", placeholder: "Cole a saída inteira" },
    ],
    text: `Rodei: {{comando}}

Erro:
{{erro}}

Antes de corrigir:
1. Explique a causa provável em linguagem simples.
2. Diga como confirmar essa causa.
3. Proponha a correção mais segura e menor possível.
Não apague arquivos nem histórico como solução.`,
  },
  {
    id: "homologacao",
    title: "Homologação",
    purpose: "Gerar um roteiro de teste manual a partir dos critérios de aceite.",
    tool: "chatgpt",
    fields: [{ key: "criterios", label: "Critérios de aceite", placeholder: "Cole os critérios da Issue" }],
    text: `Crie um roteiro de teste manual (passo a passo, com resultado esperado) para validar estes critérios de aceite:

{{criterios}}

Inclua: teste no desktop, teste em tela pequena, e verificação de que funcionalidades anteriores continuam funcionando.`,
  },
  {
    id: "relatorio",
    title: "Relatório de desenvolvimento",
    purpose: "Pedir um resumo honesto do que foi feito, testado e pendente.",
    tool: "claude",
    fields: [{ key: "issue", label: "Issue", placeholder: "#1 Criar e listar tarefas" }],
    text: `Escreva um relatório da implementação da Issue {{issue}} para colar na descrição do Pull Request:
- O que foi alterado (por arquivo)
- Comandos executados e resultado resumido de cada um
- O que NÃO foi testado
- Pendências e riscos conhecidos
Seja factual: não afirme que algo passou se você não o executou.`,
  },
];

export function fillPrompt(t: PromptTemplate, values: Record<string, string>): string {
  return t.text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const v = values[k]?.trim();
    return v ? v : `[${k}]`;
  });
}
