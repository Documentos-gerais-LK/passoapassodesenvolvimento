export const flowStages = [
  { id: "need", label: "Necessidade", tool: "ChatGPT", text: "Descrever o problema, quem é o usuário e o resultado esperado. Saída: um texto claro da necessidade." },
  { id: "research", label: "Pesquisa", tool: "ChatGPT + documentação", text: "Comparar alternativas e conferir informações em documentação oficial. Saída: decisões tecnológicas justificadas." },
  { id: "spec", label: "Especificação", tool: "ChatGPT", text: "Escrever escopo, exclusões e critérios de aceite. Saída: especificação verificável." },
  { id: "org", label: "Organização", tool: "GitHub", text: "Registrar Issues (e Epics, se fizer sentido) com critérios de aceite. Saída: tarefas rastreáveis." },
  { id: "impl", label: "Implementação", tool: "Claude Code", text: "Auditar, planejar, autorizar e acompanhar a implementação em uma branch. Saída: alterações em uma branch." },
  { id: "tests", label: "Testes", tool: "Claude Code + CI", text: "Rodar typecheck, lint, testes e build, localmente e no CI. Saída: resultados reais." },
  { id: "homolog", label: "Homologação", tool: "Você", text: "Testar manualmente os critérios de aceite e decidir GO ou NO-GO. Saída: registro de homologação." },
  { id: "publish", label: "Publicação", tool: "GitHub + deploy", text: "Merge, deploy autorizado, verificação e registro de versão. Saída: versão publicada e registrada." },
];

export const roles = [
  { id: "chatgpt", title: "ChatGPT", short: "Pesquisa, planejamento e especificação", text: "Parceiro de raciocínio. Ajuda a esclarecer a necessidade, comparar alternativas e escrever especificações. Ele só conhece o que você mostra a ele; confirme fatos em documentação oficial." },
  { id: "claude", title: "Claude Code", short: "Implementação e testes técnicos", text: "Trabalha no terminal lendo e alterando o projeto. Executa tarefas bem definidas, roda testes e relata resultados. Você autoriza o escopo e confere as alterações." },
  { id: "github", title: "GitHub", short: "Organização, histórico e rastreabilidade", text: "Guarda o código, as Issues, os Pull Requests e os resultados do CI. É o registro do que foi pedido, feito e revisado." },
  { id: "leo", title: "Você (Léo)", short: "Decisões, acompanhamento e homologação", text: "A responsabilidade humana permanece em todas as decisões relevantes: o que construir, o que aceitar, quando publicar." },
  { id: "publish", title: "Publicação", short: "Execução autorizada após as verificações", text: "Só acontece depois de testes, homologação e autorização. Ter terminado o treinamento não autoriza nenhum deploy." },
];

export const techQuestions = [
  {
    id: "stack",
    question: "React ou outra stack?",
    options: [
      { name: "React + TypeScript", pros: "Grande ecossistema, componentes reutilizáveis, tipagem que previne erros.", cons: "Mais conceitos e ferramentas do que uma página simples; exige etapa de build." },
      { name: "HTML + JavaScript puro", pros: "Muito simples, sem build, ótimo para páginas pequenas.", cons: "Mais difícil de organizar quando o app cresce; sem tipagem por padrão." },
    ],
  },
  {
    id: "storage",
    question: "Armazenamento local ou banco de dados?",
    options: [
      { name: "Armazenamento local (localStorage)", pros: "Zero infraestrutura, grátis, imediato; ótimo para uso individual.", cons: "Fica só naquele navegador; não sincroniza entre dispositivos; pode ser limpo pelo usuário." },
      { name: "Banco de dados remoto", pros: "Dados acessíveis de vários dispositivos e usuários; backup centralizado.", cons: "Exige backend, segurança, custos e manutenção; mais complexo para começar." },
    ],
  },
  {
    id: "lib",
    question: "Biblioteca pronta ou componente próprio?",
    options: [
      { name: "Biblioteca pronta", pros: "Economiza tempo, já testada por muitas pessoas.", cons: "Dependência externa para manter; pode trazer mais do que você precisa." },
      { name: "Componente próprio", pros: "Controle total, sem dependências extras.", cons: "Você mantém e testa; pode reinventar algo difícil de acertar (acessibilidade, por exemplo)." },
    ],
  },
  {
    id: "ui",
    question: "Interface simples ou animação complexa?",
    options: [
      { name: "Interface simples", pros: "Rápida de construir e manter; boa legibilidade e desempenho.", cons: "Menos impacto visual." },
      { name: "Animação complexa", pros: "Experiência mais marcante quando bem usada.", cons: "Mais código, risco de desempenho e acessibilidade (respeitar redução de movimento)." },
    ],
  },
];

export const conceptSteps = [
  "Identificar a tela que precisa de referência visual.",
  "Separar referências: imagens, cores, exemplos que você gosta.",
  "Preparar o prompt com tela, estilo e elementos obrigatórios.",
  "Gerar o concept no chat de imagens.",
  "Analisar: hierarquia, contraste, o que está faltando.",
  "Solicitar ajustes, um por vez.",
  "Aprovar o resultado.",
  "Encaminhar ao desenvolvimento, anexando a imagem à Issue.",
];

export const githubCycle = [
  { id: "issue", label: "Issue", text: "A tarefa é registrada com objetivo e critérios de aceite." },
  { id: "branch", label: "Branch", text: "Cria-se uma branch separada, por exemplo feat/criar-tarefa." },
  { id: "commit", label: "Commit", text: "As alterações são registradas em commits pequenos e descritivos." },
  { id: "pr", label: "Pull Request", text: "A branch é enviada e um PR pede revisão, ligado à Issue." },
  { id: "ci", label: "CI", text: "Verificações automáticas configuradas rodam no PR." },
  { id: "homolog", label: "Homologação", text: "A pessoa responsável testa os critérios de aceite e decide GO ou NO-GO." },
  { id: "merge", label: "Merge", text: "Com GO e verificações aprovadas, a branch é juntada à main." },
];

export const ciStates = [
  { id: "wait", label: "Aguardando", text: "O PR foi aberto e a verificação entrou na fila." },
  { id: "run", label: "Executando", text: "O GitHub Actions está rodando typecheck, lint, testes e build." },
  { id: "fail", label: "Falha", text: "Uma verificação falhou. Abra Details no PR e leia o log da etapa em vermelho." },
  { id: "fix", label: "Correção", text: "Você (ou o Claude Code) corrige a causa e envia um novo commit." },
  { id: "pass", label: "Aprovado", text: "Todas as verificações configuradas passaram. Isso não substitui a homologação humana." },
];

export const publishLadder = [
  { id: "commit", label: "Commit", where: "Seu computador", guarantees: "A alteração está registrada localmente. Ninguém mais a vê." },
  { id: "push", label: "Push", where: "GitHub (branch)", guarantees: "Os commits estão no GitHub, mas ainda não na main." },
  { id: "pr", label: "Pull Request", where: "GitHub (revisão)", guarantees: "A alteração está proposta para revisão. Nada mudou na main." },
  { id: "merge", label: "Merge", where: "GitHub (main)", guarantees: "O código está na main. Isso não significa que está no ar." },
  { id: "deploy", label: "Deploy", where: "Ambiente de publicação", guarantees: "Uma versão foi colocada em um ambiente acessível, que pode ser de teste." },
  { id: "prod", label: "Produção", where: "Ambiente real", guarantees: "Pessoas reais usam essa versão. Exige autorização e verificação pós-publicação." },
];

export const homologItems = [
  "A página carrega?",
  "A funcionalidade aparece?",
  "O comportamento corresponde ao solicitado?",
  "Os critérios de aceite passaram?",
  "Funciona no celular?",
  "Funciona no desktop?",
  "Há erros (tela ou console)?",
  "Algo anterior parou de funcionar?",
];
