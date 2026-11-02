import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { ciStates, conceptSteps, flowStages, githubCycle, homologItems, publishLadder, roles, techQuestions } from "../content/widgets";
import { symptoms } from "../content/modules-d";
import type { WidgetId } from "../content/types";
import { homologToMarkdown, specToMarkdown, type SpecDraft } from "../lib/markdown";
import { CopyButton, GlassCard } from "./ui";

/** Percorre uma sequência de itens: chips clicáveis + anterior/próximo. */
function Walkthrough({ items, intro }: { items: { id: string; label: string; text: string; extra?: string }[]; intro: string }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const cur = items[i];
  return (
    <GlassCard className="p-4 sm:p-5">
      <p className="mb-3 text-sm text-mute">{intro}</p>
      <ol className="mb-4 flex flex-wrap items-center gap-1.5" aria-label="Etapas">
        {items.map((it, idx) => (
          <li key={it.id} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setI(idx)}
              aria-current={idx === i ? "step" : undefined}
              className={`rounded-lg border px-3 py-1.5 text-sm transition active:scale-95 ${
                idx === i ? "border-gold bg-gold/20 text-gold-hi" : idx < i ? "border-gold/40 text-soft" : "border-white/15 text-mute hover:border-gold/50"
              }`}
            >
              {idx + 1}. {it.label}
            </button>
            {idx < items.length - 1 && <ArrowRight size={14} className="text-mute" aria-hidden />}
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={cur.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-h-[5.5rem]">
          <h4 className="text-lg font-semibold text-gold-hi">{cur.label}</h4>
          <p className="mt-1 leading-relaxed text-soft/90">{cur.text}</p>
          {cur.extra && <p className="mt-2 text-sm text-mute">{cur.extra}</p>}
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 flex gap-2">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-40">
          <ChevronLeft size={15} aria-hidden /> Anterior
        </button>
        <button type="button" disabled={i === items.length - 1} onClick={() => setI(i + 1)} className="inline-flex items-center gap-1 rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 text-sm text-gold-hi disabled:opacity-40">
          Próximo <ChevronRight size={15} aria-hidden />
        </button>
        <button type="button" onClick={() => setI(0)} className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-mute hover:text-soft">
          <RotateCcw size={14} aria-hidden /> Reiniciar
        </button>
      </div>
    </GlassCard>
  );
}

function FlowDiagram() {
  return <Walkthrough intro="Clique em cada etapa do fluxo." items={flowStages.map((s) => ({ id: s.id, label: s.label, text: s.text, extra: `Ferramenta principal: ${s.tool}` }))} />;
}

function RoleCards() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((r) => (
        <GlassCard key={r.id} hover className="p-0">
          <button type="button" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)} className="w-full p-4 text-left">
            <p className="font-semibold text-gold-hi">{r.title}</p>
            <p className="text-sm text-mute">{r.short}</p>
            {open === r.id && <p className="mt-3 text-sm leading-relaxed text-soft/90">{r.text}</p>}
          </button>
        </GlassCard>
      ))}
    </div>
  );
}

function TechChoice() {
  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const q = techQuestions[qi];
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Perguntas tecnológicas">
        {techQuestions.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={i === qi}
            onClick={() => {
              setQi(i);
              setPick(null);
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${i === qi ? "border-gold bg-gold/20 text-gold-hi" : "border-white/15 text-mute"}`}
          >
            {t.question}
          </button>
        ))}
      </div>
      <p className="mb-3 font-medium">Qual você escolheria? Clique para comparar.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <button key={o.name} type="button" onClick={() => setPick(i)} aria-pressed={pick === i} className={`rounded-xl border p-3 text-left transition ${pick === i ? "border-gold bg-gold/10" : "border-white/15 hover:border-gold/50"}`}>
            <span className="font-semibold">{o.name}</span>
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-live="polite">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Vantagens</p>
            <p className="mt-1 text-sm">{q.options[pick].pros}</p>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Limitações</p>
            <p className="mt-1 text-sm">{q.options[pick].cons}</p>
          </div>
          <p className="text-sm text-mute sm:col-span-2">Nenhuma opção é melhor em todos os casos: depende do problema. Confirme informações atualizadas na documentação oficial.</p>
        </div>
      )}
    </GlassCard>
  );
}

const SPEC_KEY = "lk-academy-spec-draft";
const emptySpec: SpecDraft = { problema: "", objetivo: "", escopo: "", exclusoes: "", criterios: "" };

function loadDraft<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function saveDraft(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* sem armazenamento: o rascunho vale só nesta sessão */
  }
}

function SpecForm() {
  const [d, setD] = useState<SpecDraft>(() => loadDraft(SPEC_KEY, emptySpec));
  useEffect(() => saveDraft(SPEC_KEY, d), [d]);
  const field = (k: keyof SpecDraft, label: string, hint: string, rows = 3) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea rows={rows} value={d[k]} onChange={(e) => setD({ ...d, [k]: e.target.value })} placeholder={hint} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 p-2.5 text-sm placeholder:text-mute/70" />
    </label>
  );
  const md = specToMarkdown(d);
  const empty = Object.values(d).every((v) => !v.trim());
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2">
        {field("problema", "Problema", "Qual dor existe hoje?")}
        {field("objetivo", "Objetivo", "Qual resultado queremos?")}
        {field("escopo", "Escopo (um por linha)", "Criar tarefa\nListar tarefas", 4)}
        {field("exclusoes", "Exclusões (um por linha)", "Login\nBanco de dados remoto", 4)}
        <div className="md:col-span-2">{field("criterios", "Critérios de aceite (um por linha)", "O botão altera o estado da tarefa\nO estado permanece após recarregar", 4)}</div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CopyButton text={md} label="COPIAR MARKDOWN" />
        <button type="button" onClick={() => setD(emptySpec)} className="text-sm text-mute hover:text-soft">Limpar formulário</button>
        {empty && <span className="text-sm text-mute">Preencha ao menos um campo para gerar um texto útil.</span>}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-gold-hi">Ver prévia do Markdown</summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 font-mono text-xs">{md}</pre>
      </details>
    </GlassCard>
  );
}

function HomologForm() {
  const [checked, setChecked] = useState<boolean[]>(() => homologItems.map(() => false));
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState<"GO" | "NO-GO">("NO-GO");
  const all = checked.every(Boolean);
  const md = homologToMarkdown({ checked, items: homologItems, decision, notes });
  return (
    <GlassCard className="p-4 sm:p-5">
      <p className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5 text-sm text-amber-100/90">Exercício: este formulário é só prática. Preenchê-lo não marca nenhuma entrega real como homologada.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {homologItems.map((it, i) => (
          <li key={it}>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/10 p-2.5 hover:border-gold/40">
              <input type="checkbox" className="h-4 w-4 accent-[#c8a45d]" checked={checked[i]} onChange={() => setChecked(checked.map((c, j) => (j === i ? !c : c)))} />
              <span className="text-sm">{it}</span>
            </label>
          </li>
        ))}
      </ul>
      <fieldset className="mt-3">
        <legend className="text-sm font-medium">Decisão</legend>
        <div className="mt-1 flex gap-2">
          {(["GO", "NO-GO"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={decision === v} onClick={() => setDecision(v)} className={`rounded-lg border px-4 py-1.5 text-sm font-semibold ${decision === v ? (v === "GO" ? "border-emerald-400 bg-emerald-400/15 text-emerald-200" : "border-rose-400 bg-rose-400/15 text-rose-200") : "border-white/15 text-mute"}`}>
              {v}
            </button>
          ))}
        </div>
        {decision === "GO" && !all && <p className="mt-1 text-sm text-amber-200">Atenção: há itens não marcados. Um GO exige que os critérios obrigatórios tenham passado.</p>}
      </fieldset>
      <label className="mt-3 block">
        <span className="text-sm font-medium">Observações</span>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 p-2.5 text-sm" placeholder="O que viu, em qual tela, como reproduzir…" />
      </label>
      <div className="mt-3">
        <CopyButton text={md} label="COPIAR REGISTRO (MARKDOWN)" />
      </div>
    </GlassCard>
  );
}

function Symptoms() {
  return (
    <div className="flex flex-col gap-2">
      {symptoms.map((s) => (
        <details key={s.title} className="glass p-0">
          <summary className="cursor-pointer p-3.5 font-medium">{s.title}</summary>
          <dl className="grid gap-2 px-4 pb-4 text-sm">
            <div><dt className="font-semibold text-gold-hi">Possível causa</dt><dd className="text-soft/90">{s.cause}</dd></div>
            <div><dt className="font-semibold text-gold-hi">Como investigar</dt><dd className="text-soft/90">{s.investigate}</dd></div>
            <div><dt className="font-semibold text-gold-hi">Como resolver com segurança</dt><dd className="text-soft/90">{s.solve}</dd></div>
            <div><dt className="font-semibold text-gold-hi">Quando pedir ajuda</dt><dd className="text-soft/90">{s.help}</dd></div>
          </dl>
        </details>
      ))}
    </div>
  );
}

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case "flow-diagram":
      return <FlowDiagram />;
    case "role-cards":
      return <RoleCards />;
    case "tech-choice":
      return <TechChoice />;
    case "spec-form":
      return <SpecForm />;
    case "concept-steps":
      return <Walkthrough intro="Oito passos, do pedido à aprovação. As imagens de exemplo seriam apenas ilustrações." items={conceptSteps.map((t, i) => ({ id: String(i), label: `Passo ${i + 1}`, text: t }))} />;
    case "github-cycle":
      return <Walkthrough intro="Simulação conceitual: nada é enviado ao GitHub." items={githubCycle} />;
    case "ci-sim":
      return <Walkthrough intro="Estados de uma verificação de CI, da fila à aprovação." items={ciStates} />;
    case "homolog-form":
      return <HomologForm />;
    case "publish-ladder":
      return <Walkthrough intro="Cada degrau garante algo diferente." items={publishLadder.map((p) => ({ id: p.id, label: p.label, text: p.guarantees, extra: `Onde: ${p.where}` }))} />;
    case "symptoms":
      return <Symptoms />;
  }
}
