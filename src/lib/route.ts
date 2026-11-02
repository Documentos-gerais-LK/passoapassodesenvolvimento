import { useEffect, useState } from "react";

export type Route =
  | { page: "home" }
  | { page: "module"; id: string }
  | { page: "step"; id: string }
  | { page: "checklist" }
  | { page: "prompts" }
  | { page: "glossary" }
  | { page: "done" };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [a, b] = parts;
  if (a === "modulo" && b) return { page: "module", id: b };
  if (a === "etapa" && b) return { page: "step", id: b };
  if (a === "checklist") return { page: "checklist" };
  if (a === "prompts") return { page: "prompts" };
  if (a === "glossario") return { page: "glossary" };
  if (a === "conclusao") return { page: "done" };
  return { page: "home" };
}

export const href = {
  home: "#/",
  module: (id: string) => `#/modulo/${id}`,
  step: (id: string) => `#/etapa/${id}`,
  checklist: "#/checklist",
  prompts: "#/prompts",
  glossary: "#/glossario",
  done: "#/conclusao",
};

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
