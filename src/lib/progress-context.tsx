import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyState, loadState, saveState, toggleTask, type ProgressState } from "./progress";

interface Ctx {
  state: ProgressState;
  toggle: (id: string) => void;
  setLast: (stepId: string) => void;
  reset: () => void;
  /** false quando o navegador não permite salvar (o progresso vale só nesta sessão). */
  persisted: boolean;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);
  const [persisted, setPersisted] = useState(true);

  useEffect(() => {
    setPersisted(saveState(state));
  }, [state]);

  const toggle = useCallback((id: string) => setState((s) => toggleTask(s, id)), []);
  const setLast = useCallback((stepId: string) => setState((s) => (s.last === stepId ? s : { ...s, last: stepId })), []);
  const reset = useCallback(() => setState(emptyState()), []);

  const value = useMemo(() => ({ state, toggle, setLast, reset, persisted }), [state, toggle, setLast, reset, persisted]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressContext);
  if (!c) throw new Error("useProgress fora do ProgressProvider");
  return c;
}
