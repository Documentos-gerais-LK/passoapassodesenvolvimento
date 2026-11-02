import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, Copy, GitBranch, Globe, MessageSquare, SquareTerminal, Sparkles, FileCode2, TriangleAlert } from "lucide-react";
import type { ToolId } from "../content/types";
import { copyText } from "../lib/clipboard";

export function GlassCard({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`glass ${hover ? "glass-hover" : ""} ${className}`}>{children}</div>;
}

const toolMeta: Record<ToolId, { label: string; icon: typeof Globe; cls: string }> = {
  chatgpt: { label: "ChatGPT", icon: MessageSquare, cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" },
  claude: { label: "Claude Code", icon: Sparkles, cls: "border-orange-300/40 bg-orange-300/10 text-orange-200" },
  github: { label: "GitHub", icon: GitBranch, cls: "border-violet-300/40 bg-violet-300/10 text-violet-200" },
  terminal: { label: "Terminal", icon: SquareTerminal, cls: "border-sky-300/40 bg-sky-300/10 text-sky-200" },
  browser: { label: "Navegador", icon: Globe, cls: "border-gold/40 bg-gold/10 text-gold-hi" },
  editor: { label: "Editor de código", icon: FileCode2, cls: "border-white/25 bg-white/5 text-soft" },
};

export function ToolBadge({ tool }: { tool: ToolId }) {
  const m = toolMeta[tool];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${m.cls}`}>
      <Icon size={13} aria-hidden /> {m.label}
    </span>
  );
}

export function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label} className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-hi" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
    </div>
  );
}

export function CopyButton({ text, label = "COPIAR", className = "" }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? "ok" : "fail");
    window.setTimeout(() => setState("idle"), 2200);
  };
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-3.5 py-2 text-sm font-semibold tracking-wide text-gold-hi transition hover:bg-gold/20 active:scale-[0.97] ${className}`}
      >
        {state === "ok" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
        {state === "ok" ? "COPIADO!" : state === "fail" ? "NÃO FOI POSSÍVEL" : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "ok" ? "Texto copiado" : state === "fail" ? "Não foi possível copiar. Selecione o texto e copie manualmente." : ""}
      </span>
      {state === "fail" && (
        <span className="text-xs text-amber-200">
          <TriangleAlert size={12} className="mr-1 inline" aria-hidden />
          Selecione o texto e copie manualmente.
        </span>
      )}
    </>
  );
}
