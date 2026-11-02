import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { modules } from "./content";

const go = (hash: string) => {
  window.location.hash = hash;
};

describe("aplicação", () => {
  it("mostra a tela de boas-vindas", () => {
    go("#/");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Bem-vindo");
    expect(screen.getByText("Começar treinamento")).toBeTruthy();
  });

  it("marca tarefa, persiste após recarregar e desmarca", async () => {
    const user = userEvent.setup();
    go("#/etapa/m00-mapa");
    const first = render(<App />);
    const box = screen.getByLabelText(/Abri cada etapa do diagrama/) as HTMLInputElement;
    await user.click(box);
    expect(box.checked).toBe(true);
    first.unmount();

    render(<App />);
    const again = screen.getByLabelText(/Abri cada etapa do diagrama/) as HTMLInputElement;
    expect(again.checked).toBe(true);
    await user.click(again);
    expect(again.checked).toBe(false);
  });

  it("copia o prompt preenchido", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    go("#/prompts");
    render(<App />);
    const card = screen.getByRole("heading", { name: "Planejamento inicial" }).closest("div.glass") as HTMLElement;
    await user.type(within(card).getByLabelText("Necessidade"), "organizar tarefas");
    await user.click(within(card).getByRole("button", { name: /COPIAR PROMPT/ }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("Necessidade: organizar tarefas");
  });

  it("filtra o checklist por pendentes e concluídas", async () => {
    const user = userEvent.setup();
    go("#/etapa/m00-mapa");
    const view = render(<App />);
    await user.click(screen.getByLabelText(/Abri cada etapa do diagrama/));
    view.unmount();

    go("#/checklist");
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Concluídas" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Pendentes" }));
    expect(screen.queryByLabelText(/Abri cada etapa do diagrama/)).toBeNull();
  });

  it("reinicia o progresso somente após confirmação", async () => {
    const user = userEvent.setup();
    go("#/etapa/m00-mapa");
    const view = render(<App />);
    await user.click(screen.getByLabelText(/Abri cada etapa do diagrama/));
    view.unmount();

    go("#/checklist");
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Reiniciar treinamento/ }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByText(/1 de \d+ concluídas/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Reiniciar treinamento/ }));
    await user.click(screen.getByRole("button", { name: "Sim, reiniciar" }));
    expect(screen.getByText(/0 de \d+ concluídas/)).toBeTruthy();
  });

  it("busca no glossário e trata resultado vazio", async () => {
    const user = userEvent.setup();
    go("#/glossario");
    render(<App />);
    await user.type(screen.getByRole("searchbox"), "rollback");
    expect(screen.getAllByRole("term")).toHaveLength(1);
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "zzzzzz");
    expect(screen.getByRole("status").textContent).toContain("Nenhum termo");
  });

  it("renderiza todas as etapas sem erro", () => {
    for (const m of modules) {
      for (const s of m.steps) {
        go(`#/etapa/${s.id}`);
        const v = render(<App />);
        expect(screen.getByRole("heading", { level: 2, name: s.title }), s.id).toBeTruthy();
        v.unmount();
      }
    }
  });

  it("a conclusão só aparece com o Módulo 13 completo", () => {
    go("#/conclusao");
    render(<App />);
    expect(screen.queryByText(/Parabéns, Léo/)).toBeNull();
  });
});
