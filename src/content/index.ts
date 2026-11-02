import type { Module, Step } from "./types";
import { modulesA } from "./modules-a";
import { modulesB } from "./modules-b";
import { modulesC } from "./modules-c";
import { modulesD } from "./modules-d";

export const modules: Module[] = [...modulesA, ...modulesB, ...modulesC, ...modulesD];

export const allSteps: { module: Module; step: Step }[] = modules.flatMap((m) => m.steps.map((s) => ({ module: m, step: s })));

export const allTaskIds: string[] = modules.flatMap((m) => m.steps.flatMap((s) => s.tasks.map((t) => t.id)));

export function findModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findStep(stepId: string): { module: Module; step: Step } | undefined {
  return allSteps.find((x) => x.step.id === stepId);
}

export function nextStepId(stepId: string): string | null {
  const i = allSteps.findIndex((x) => x.step.id === stepId);
  return i >= 0 && i < allSteps.length - 1 ? allSteps[i + 1].step.id : null;
}

export function prevStepId(stepId: string): string | null {
  const i = allSteps.findIndex((x) => x.step.id === stepId);
  return i > 0 ? allSteps[i - 1].step.id : null;
}
