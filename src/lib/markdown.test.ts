import { describe, expect, it } from "vitest";
import { homologToMarkdown, specToMarkdown } from "./markdown";

describe("markdown", () => {
  it("gera a especificação com checklist de critérios", () => {
    const md = specToMarkdown({ problema: "P", objetivo: "O", escopo: "- a\nb", exclusoes: "", criterios: "x\n- y" });
    expect(md).toContain("## Problema\nP");
    expect(md).toContain("- a\n- b");
    expect(md).toContain("- [ ] x\n- [ ] y");
    expect(md).toContain("_(não informado)_");
  });

  it("marca o registro de homologação como fictício", () => {
    const md = homologToMarkdown({ checked: [true, false], items: ["A", "B"], decision: "NO-GO", notes: "" }, new Date(2026, 0, 2));
    expect(md).toContain("**NO-GO**");
    expect(md).toContain("- [x] A");
    expect(md).toContain("- [ ] B");
    expect(md).toContain("Registro fictício");
  });
});
