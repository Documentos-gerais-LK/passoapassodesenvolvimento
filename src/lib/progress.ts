import type { Module, Step } from "../content/types";

export const STORAGE_KEY = "lk-academy-progress-v1";

export interface ProgressState {
  /** id da tarefa → data/hora ISO da conclusão */
  done: Record<string, string>;
  /** última etapa visitada */
  last: string | null;
}

export const emptyState = (): ProgressState => ({ done: {}, last: null });

export function parseState(raw: string | null): ProgressState {
  if (!raw) return emptyState();
  try {
    const data = JSON.parse(raw) as Partial<ProgressState>;
    const done: Record<string, string> = {};
    if (data.done && typeof data.done === "object") {
      for (const [k, v] of Object.entries(data.done)) if (typeof v === "string") done[k] = v;
    }
    return { done, last: typeof data.last === "string" ? data.last : null };
  } catch {
    return emptyState();
  }
}

export function toggleTask(state: ProgressState, id: string, now = new Date()): ProgressState {
  const done = { ...state.done };
  if (done[id]) delete done[id];
  else done[id] = now.toISOString();
  return { ...state, done };
}

export interface Ratio {
  done: number;
  total: number;
  pct: number;
}

const ratio = (done: number, total: number): Ratio => ({ done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) });

export function stepRatio(state: ProgressState, step: Step): Ratio {
  return ratio(step.tasks.filter((t) => state.done[t.id]).length, step.tasks.length);
}

export function moduleRatio(state: ProgressState, mod: Module): Ratio {
  const tasks = mod.steps.flatMap((s) => s.tasks);
  return ratio(tasks.filter((t) => state.done[t.id]).length, tasks.length);
}

export function overallRatio(state: ProgressState, mods: Module[]): Ratio {
  const tasks = mods.flatMap((m) => m.steps.flatMap((s) => s.tasks));
  return ratio(tasks.filter((t) => state.done[t.id]).length, tasks.length);
}

/** Primeira etapa com tarefas pendentes, na ordem do treinamento. */
export function nextPending(state: ProgressState, mods: Module[]): { module: Module; step: Step } | null {
  for (const module of mods) {
    for (const step of module.steps) {
      if (step.tasks.some((t) => !state.done[t.id])) return { module, step };
    }
  }
  return null;
}

export function loadState(): ProgressState {
  try {
    return parseState(localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyState();
  }
}

/** Retorna false quando o navegador bloqueia o armazenamento (modo privado, por exemplo). */
export function saveState(state: ProgressState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
