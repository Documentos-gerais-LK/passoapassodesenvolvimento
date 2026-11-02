import type { Module, Problem, Step } from "./types";

export interface Symptom {
  title: string;
  cause: string;
  investigate: string;
  solve: string;
  help: string;
}

export const symptoms: Symptom[] = [
  { title: "O Git não funciona", cause: "Instalação incompleta ou terminal aberto antes da instalação.", investigate: "Execute git --version em um terminal novo.", solve: "Feche e reabra o terminal. Se persistir, reinstale o Git e mantenha a opção de adicionar ao PATH.", help: "Se git --version continuar falhando após reinstalar." },
  { title: "Não consigo clonar o repositório", cause: "URL errada, falta de permissão ou conta errada logada.", investigate: "Abra a URL no navegador logado. O repositório aparece? Você tem acesso?", solve: "Corrija a URL, faça login na conta certa e conclua a autenticação do Git Credential Manager. Para repositórios privados, a conta precisa ter permissão.", help: "Se a URL abre no navegador mas o clone falha com erro de autenticação." },
  { title: "O Claude Code está na pasta errada", cause: "O comando claude foi executado em outra pasta.", investigate: "Pergunte a pasta atual ao Claude Code e compare com pwd.", solve: "Saia (/exit), entre na pasta correta com cd e abra novamente. Nada precisa ser apagado.", help: "Se ele já alterou arquivos na pasta errada: veja git status lá e peça ajuda antes de reverter." },
  { title: "Não sei qual branch estou usando", cause: "Esqueceu de conferir antes de começar.", investigate: "git branch --show-current ou git status (primeira linha).", solve: "Se estiver na main e precisa de uma branch: git switch -c nome-da-branch. Alterações não comitadas vão junto com você.", help: "Se git status mostrar estado “detached HEAD” e você não sabe como chegou lá." },
  { title: "O comando npm falhou", cause: "Node não instalado, pasta errada (sem package.json) ou dependências ausentes.", investigate: "Leia a primeira linha de erro. Confirme com pwd que está na pasta do projeto e com node --version.", solve: "Na pasta certa, rode npm install e tente de novo. Evite apagar node_modules e package-lock.json como primeira solução: só se o erro apontar para dependências corrompidas.", help: "Se o erro persistir após npm install, copie o erro completo e use o prompt de diagnóstico." },
  { title: "O CI está vermelho", cause: "Alguma verificação configurada falhou: teste, lint, typecheck ou build.", investigate: "No PR, Details → abra a etapa em vermelho → leia o fim do log.", solve: "Reproduza o erro localmente (npm run check, se existir), corrija e envie um novo commit. O CI roda de novo sozinho.", help: "Se o CI falha só no GitHub e passa no seu computador (pode ser diferença de versão do Node)." },
  { title: "O PR contém arquivos que não reconheço", cause: "git add . incluiu arquivos extras ou arquivos gerados.", investigate: "Aba Files changed do PR e git status local.", solve: "Retire do commit os arquivos desconhecidos (git restore --staged arquivo) e ajuste o .gitignore, se forem gerados. Não apague arquivos às cegas e não reescreva histórico compartilhado.", help: "Se aparecerem arquivos que parecem ter dados sensíveis: não faça merge e peça ajuda imediatamente." },
  { title: "Os testes passaram, mas a interface está errada", cause: "Os testes não cobrem o que está visualmente errado.", investigate: "Compare a tela com os critérios de aceite e o concept.", solve: "Registre NO-GO, descreva o problema reproduzível, peça correção e acrescente um teste que o cubra.", help: "Se não sabe como transformar o problema em teste." },
  { title: "Não sei se a tarefa foi publicada", cause: "Confusão entre commit, merge e deploy.", investigate: "A branch foi mergeada? Houve deploy? A versão publicada mostra a mudança?", solve: "Use a escada de publicação do Módulo 11 e confira cada nível.", help: "Se o merge foi feito mas o ambiente real não reflete a mudança." },
  { title: "O ChatGPT não conhece o estado atual do código", cause: "O ChatGPT só sabe o que você mostrou a ele.", investigate: "Você colou os trechos relevantes e a estrutura de arquivos?", solve: "Cole os arquivos ou trechos relevantes e a saída de git status. Para trabalhar em arquivos reais, use o Claude Code.", help: "Quando a resposta continuar inconsistente mesmo com o contexto correto." },
];

const symptomProblems: Problem[] = [
  { symptom: "Não encontro meu problema na lista.", fix: "Descreva o sintoma, o comando que rodou e a mensagem completa de erro no prompt de diagnóstico." },
];

const m12Step: Step = {
  id: "m12-ajuda",
  title: "Ajuda por sintomas",
  what: "Saber consultar a seção de ajuda organizada por sintomas.",
  why: "Quase todo erro de iniciante é comum e tem solução segura. Saber procurar por sintoma poupa horas.",
  tools: ["browser", "chatgpt"],
  widget: "symptoms",
  how: [
    "Leia os sintomas da lista abaixo, para reconhecê-los quando acontecerem.",
    "Cada sintoma tem: causa possível, como investigar, como resolver com segurança e quando pedir ajuda.",
    "Regra geral: investigar antes de agir. Nunca apague arquivos ou histórico como primeira solução.",
    "Você pode voltar a esta seção a qualquer momento pelo menu Ajuda.",
  ],
  expected: "Você sabe onde consultar e segue o roteiro investigar → resolver com segurança → pedir ajuda.",
  verify: ["Escolha um sintoma e explique, com suas palavras, como investigaria."],
  tasks: [{ id: "m12-ajuda-1", text: "Li a lista de sintomas e sei voltar a ela quando precisar." }],
  problems: symptomProblems,
};

const delivery = (n: string, title: string, goal: string): Step => ({
  id: `m13-entrega-${n}`,
  title: `Entrega ${n}: ${title}`,
  what: goal,
  why: "Concluir um ciclo completo, mesmo pequeno, ensina mais do que ler sobre o fluxo. Cada entrega repete o ciclo inteiro.",
  tools: ["chatgpt", "claude", "github", "terminal"],
  how: [
    "Necessidade: descreva no ChatGPT o que esta entrega precisa resolver (Módulo 03).",
    "Pesquisa: confirme se há decisão tecnológica a tomar (Módulo 04). Se não houver, registre “sem decisão nova”.",
    "Especificação: escreva escopo, exclusões e critérios de aceite (Módulo 05).",
    "Issue: crie a Issue no GitHub com checklist (Módulo 07).",
    "Branch: crie a branch da entrega a partir da main atualizada.",
    "Implementação: audite e implemente com o Claude Code (Módulo 08).",
    "Testes: rode typecheck, testes e build e leia os resultados.",
    "PR: abra o Pull Request ligado à Issue.",
    "Homologação: valide os critérios de aceite manualmente e registre GO ou NO-GO (Módulo 10).",
    "Registro de conclusão: faça o merge após o GO e marque abaixo.",
  ],
  expected: "A entrega está na main, com Issue, PR, testes e homologação registrados.",
  verify: ["Os critérios de aceite da Issue estão todos marcados.", "O histórico mostra Issue → PR → merge."],
  tasks: [
    { id: `m13-${n}-necessidade`, text: "Necessidade descrita." },
    { id: `m13-${n}-pesquisa`, text: "Pesquisa adequada realizada (ou registrada como desnecessária)." },
    { id: `m13-${n}-especificacao`, text: "Especificação escrita com critérios de aceite." },
    { id: `m13-${n}-issue`, text: "Issue criada no GitHub." },
    { id: `m13-${n}-branch`, text: "Branch criada." },
    { id: `m13-${n}-implementacao`, text: "Implementação feita e conferida (git diff)." },
    { id: `m13-${n}-testes`, text: "Testes e build executados e lidos." },
    { id: `m13-${n}-pr`, text: "Pull Request aberto." },
    { id: `m13-${n}-homologacao`, text: "Homologação realizada e registrada (GO)." },
    { id: `m13-${n}-registro`, text: "Merge realizado e conclusão registrada." },
  ],
  problems: [{ symptom: "Empaquei no meio do ciclo.", fix: "Volte ao módulo da etapa correspondente, ou use o prompt de diagnóstico. Registre o bloqueio na Issue." }],
});

export const modulesD: Module[] = [
  {
    id: "12",
    num: "12",
    title: "Erros comuns",
    summary: "Ajuda organizada por sintomas, com investigação e solução segura.",
    track: "A",
    minutes: 15,
    steps: [m12Step],
  },
  {
    id: "13",
    num: "13",
    title: "Sua primeira entrega completa",
    summary: "O Mini Gestor de Tarefas em três entregas, cada uma com o ciclo completo.",
    track: "A",
    minutes: 120,
    steps: [
      delivery("01", "estrutura da aplicação", "Criar a estrutura inicial da aplicação (projeto, tela inicial vazia, scripts de teste e build)."),
      delivery("02", "criar e visualizar tarefas", "Permitir criar uma tarefa e visualizar a lista de tarefas."),
      delivery("03", "concluir e persistir tarefas", "Permitir marcar e desmarcar tarefas como concluídas, mantendo o estado após recarregar."),
    ],
  },
  {
    id: "14",
    num: "14",
    title: "Evolução para a LK",
    summary: "O que muda ao trabalhar em projetos corporativos: acessos, segurança, revisão e rastreabilidade.",
    track: "B",
    minutes: 25,
    steps: [
      {
        id: "m14-corporativo",
        title: "O que muda no trabalho corporativo",
        what: "Entender as diferenças entre um projeto pessoal e um projeto da empresa.",
        why: "Na empresa há dados de clientes, outras pessoas dependendo do código e regras de segurança. O mesmo fluxo continua valendo, com mais cuidados.",
        tools: ["browser", "github"],
        how: [
          "Acessos autorizados: use somente o que lhe foi concedido. Ninguém recebe acesso automaticamente; peça ao responsável.",
          "Repositórios da organização: ficam sob a conta da empresa. Clone e trabalhe neles conforme as regras da organização.",
          "Segurança: nunca coloque senhas, chaves ou dados de clientes em código, prompts ou Issues públicas.",
          "Escopo aprovado: trabalhe somente no que foi combinado. Mudanças de escopo passam pelo responsável.",
          "Responsáveis e priorização: cada tarefa tem alguém que decide a prioridade.",
          "Revisão de PR: outra pessoa revisa antes do merge.",
          "CI obrigatório: o merge só ocorre com as verificações exigidas passando.",
          "Homologação e publicação controlada: seguem o processo definido pela empresa.",
          "Histórico e evidências: Issue, PR e registro de homologação contam a história da entrega.",
          "Bloqueios: comunique imediatamente, com o que tentou e o que precisa.",
          "Cada repositório pode ter instruções e políticas próprias (por exemplo, um arquivo CONTRIBUTING.md). Leia-as antes de começar.",
        ],
        expected: "Você sabe o que muda e onde procurar as regras de cada repositório.",
        verify: ["Cite três cuidados extras do trabalho corporativo."],
        tasks: [{ id: "m14-corporativo-1", text: "Li as diferenças entre o trabalho pessoal e o corporativo." }],
        problems: [{ symptom: "Não tenho acesso ao repositório da empresa.", fix: "Peça ao responsável. Não use contas de terceiros nem contornos de acesso." }],
        quiz: {
          question: "Quem concede seu acesso a um repositório da empresa?",
          options: ["Ninguém, é automático ao concluir o treinamento", "O responsável pela organização, conforme a política da empresa", "O Claude Code"],
          correct: 1,
          explain: "Concluir este treinamento não concede acessos. Acessos são concedidos por quem administra a organização.",
        },
      },
      {
        id: "m14-primeira-tarefa",
        title: "Checklist para a primeira tarefa corporativa",
        what: "Preparar-se para a primeira tarefa em um repositório da empresa.",
        why: "Uma preparação curta evita erros caros: repositório errado, escopo errado, acesso incorreto.",
        tools: ["github", "terminal"],
        how: [
          "Confirme com o responsável qual é a tarefa, o escopo e a prioridade.",
          "Confirme que o seu acesso ao repositório foi concedido pelo responsável.",
          "Leia o README e as instruções do repositório.",
          "Confirme em que branch deve começar e qual é o padrão de nomes.",
          "Verifique quais verificações de CI são exigidas.",
          "Abra a Issue (ou receba uma) com critérios de aceite claros.",
        ],
        expected: "Você tem escopo, acesso, regras e Issue definidos antes de escrever código.",
        verify: ["Todos os itens do checklist foram confirmados com uma pessoa ou documento."],
        tasks: [
          { id: "m14-primeira-1", text: "Escopo e prioridade confirmados com o responsável." },
          { id: "m14-primeira-2", text: "Acesso concedido por quem administra (sem contornos)." },
          { id: "m14-primeira-3", text: "Li README e regras do repositório." },
          { id: "m14-primeira-4", text: "Sei quais verificações de CI são obrigatórias." },
        ],
        problems: [{ symptom: "As regras do repositório não estão documentadas.", fix: "Pergunte ao responsável e peça que sejam registradas no README ou em CONTRIBUTING.md." }],
      },
    ],
  },
];
