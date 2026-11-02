import { describe, expect, it } from "vitest";
import { modules, allTaskIds } from "../content";
import { emptyState, loadState, moduleRatio, nextPending, overallRatio, parseState, saveState, stepRatio, toggleTask, STORAGE_KEY } from "./progress";

describe("progresso", () => {
  it("marca e desmarca uma tarefa", () => {
    const id = allTaskIds[0];
    const marked = toggleTask(emptyState(), id);
    expect(marked.done[id]).toBeTruthy();
    expect(toggleTask(marked, id).done[id]).toBeUndefined();
  });

  it("calcula progresso por etapa, módulo e total", () => {
    const step = modules[0].steps[0];
    let s = emptyState();
    expect(stepRatio(s, step).pct).toBe(0);
    for (const t of step.tasks) s = toggleTask(s, t.id);
    expect(stepRatio(s, step).pct).toBe(100);
    expect(moduleRatio(s, modules[0]).done).toBe(step.tasks.length);
    expect(overallRatio(s, modules).done).toBe(step.tasks.length);
  });

  it("encontra a próxima etapa pendente", () => {
    const first = modules[0].steps[0];
    let s = emptyState();
    expect(nextPending(s, modules)?.step.id).toBe(first.id);
    for (const t of first.tasks) s = toggleTask(s, t.id);
    expect(nextPending(s, modules)?.step.id).toBe(modules[0].steps[1].id);
  });

  it("persiste e recarrega do localStorage", () => {
    const s = toggleTask(emptyState(), allTaskIds[3]);
    expect(saveState({ ...s, last: "m00-mapa" })).toBe(true);
    const loaded = loadState();
    expect(loaded.done[allTaskIds[3]]).toBeTruthy();
    expect(loaded.last).toBe("m00-mapa");
  });

  it("tolera dados corrompidos", () => {
    expect(parseState("{nao é json")).toEqual(emptyState());
    localStorage.setItem(STORAGE_KEY, "[1,2]");
    expect(loadState().done).toEqual({});
  });
});

describe("conteúdo", () => {
  it("ids de tarefas e de etapas são únicos", () => {
    expect(new Set(allTaskIds).size).toBe(allTaskIds.length);
    const stepIds = modules.flatMap((m) => m.steps.map((x) => x.id));
    expect(new Set(stepIds).size).toBe(stepIds.length);
  });

  it("cada etapa tem os blocos obrigatórios", () => {
    for (const m of modules) {
      for (const s of m.steps) {
        expect(s.what, s.id).toBeTruthy();
        expect(s.why, s.id).toBeTruthy();
        expect(s.how.length, s.id).toBeGreaterThan(0);
        expect(s.expected, s.id).toBeTruthy();
        expect(s.verify.length, s.id).toBeGreaterThan(0);
        expect(s.tasks.length, s.id).toBeGreaterThan(0);
        expect(s.problems.length, s.id).toBeGreaterThan(0);
      }
    }
  });

  it("tem os 15 módulos (00 a 14)", () => {
    expect(modules.map((m) => m.id)).toEqual(Array.from({ length: 15 }, (_, i) => String(i).padStart(2, "0")));
  });
});
