export interface SpecDraft {
  problema: string;
  objetivo: string;
  escopo: string;
  exclusoes: string;
  criterios: string;
}

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s*(\[[ xX]\]\s*)?/, "").trim())
    .filter(Boolean);

const asList = (s: string, checkbox = false) => {
  const items = lines(s);
  return items.length ? items.map((i) => `- ${checkbox ? "[ ] " : ""}${i}`).join("\n") : "_(não informado)_";
};

export function specToMarkdown(d: SpecDraft): string {
  return [
    "# Especificação",
    "",
    "## Problema",
    d.problema.trim() || "_(não informado)_",
    "",
    "## Objetivo",
    d.objetivo.trim() || "_(não informado)_",
    "",
    "## Escopo",
    asList(d.escopo),
    "",
    "## Exclusões (fora do escopo)",
    asList(d.exclusoes),
    "",
    "## Critérios de aceite",
    asList(d.criterios, true),
    "",
  ].join("\n");
}

export interface HomologDraft {
  checked: boolean[];
  items: string[];
  decision: "GO" | "NO-GO";
  notes: string;
}

export function homologToMarkdown(d: HomologDraft, date = new Date()): string {
  return [
    "# Registro de homologação (exercício de treinamento)",
    "",
    `Data: ${date.toLocaleDateString("pt-BR")}`,
    `Decisão: **${d.decision}**`,
    "",
    "## Verificações",
    ...d.items.map((it, i) => `- [${d.checked[i] ? "x" : " "}] ${it}`),
    "",
    "## Observações",
    d.notes.trim() || "_(nenhuma)_",
    "",
    "> Registro fictício de prática. Não representa homologação de entrega real.",
    "",
  ].join("\n");
}
