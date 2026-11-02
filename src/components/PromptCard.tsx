import { useState } from "react";
import type { PromptTemplate } from "../content/types";
import { fillPrompt } from "../content/prompts";
import { CopyButton, GlassCard, ToolBadge } from "./ui";

export function PromptCard({ prompt, compact = false }: { prompt: PromptTemplate; compact?: boolean }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const text = fillPrompt(prompt, values);
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{prompt.title}</h3>
          <p className="text-sm text-mute">{prompt.purpose}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-mute">
          Use em: <ToolBadge tool={prompt.tool} />
        </div>
      </div>
      <div className={`mt-3 grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
        {prompt.fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm font-medium">{f.label}</span>
            <textarea
              rows={2}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 p-2.5 text-sm placeholder:text-mute/70"
            />
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs text-mute">Texto que será enviado (campos vazios aparecem entre colchetes: preencha antes de enviar):</p>
      <pre className="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed" tabIndex={0} aria-label={`Texto do prompt: ${prompt.title}`}>
        {text}
      </pre>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CopyButton text={text} label="COPIAR PROMPT" />
      </div>
    </GlassCard>
  );
}
