export type ToolId = "chatgpt" | "claude" | "github" | "terminal" | "browser" | "editor";

export interface Command {
  cmd: string;
  where: string;
  does: string;
  expect: string;
  check: string;
  care?: string;
}

export interface Task {
  /** Id global e estável: é a chave salva no localStorage. */
  id: string;
  text: string;
}

export interface Problem {
  symptom: string;
  fix: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explain: string;
}

export type WidgetId =
  | "flow-diagram"
  | "role-cards"
  | "tech-choice"
  | "spec-form"
  | "concept-steps"
  | "github-cycle"
  | "ci-sim"
  | "homolog-form"
  | "publish-ladder"
  | "symptoms";

export interface Step {
  id: string;
  title: string;
  what: string;
  why: string;
  tools: ToolId[];
  how: string[];
  commands?: Command[];
  promptId?: string;
  widget?: WidgetId;
  expected: string;
  verify: string[];
  tasks: Task[];
  problems: Problem[];
  quiz?: Quiz;
}

export interface Module {
  id: string;
  num: string;
  title: string;
  summary: string;
  track: "base" | "A" | "B";
  minutes: number;
  steps: Step[];
}

export interface PromptField {
  key: string;
  label: string;
  placeholder: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  purpose: string;
  tool: ToolId;
  fields: PromptField[];
  /** Use {{chave}} para os campos personalizáveis. */
  text: string;
}

export interface GlossaryTerm {
  term: string;
  meaning: string;
}
