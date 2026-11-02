import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Terminal } from "lucide-react";
import type { Module, Quiz, Step } from "../content/types";
import { nextStepId, prevStepId } from "../content";
import { prompts } from "../content/prompts";
import { href } from "../lib/route";
import { useProgress } from "../lib/progress-context";
import { stepRatio } from "../lib/progress";
import { PromptCard } from "./PromptCard";
import { Widget } from "./Widgets";
import { CopyButton, GlassCard, ProgressBar, ToolBadge } from "./ui";

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="glass p-4 sm:p-5" aria-labelledby={`sec-${n}`}>
      <h3 id={`sec-${n}`} className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-gold">
        <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/50 text-xs">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function QuizBox({ quiz }: { quiz: Quiz }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div>
      <p className="mb-2 font-medium">{quiz.question}</p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Opções">
        {quiz.options.map((o, i) => {
          const chosen = pick === i;
          const right = i === quiz.correct;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={chosen}
              onClick={() => setPick(i)}
              className={`rounded-lg border p-2.5 text-left text-sm transition ${chosen ? (right ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10") : "border-white/15 hover:border-gold/50"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <p className="mt-2 text-sm" role="status">
          {pick === quiz.correct ? "✔ Correto. " : "✖ Ainda não. "}
          <span className="text-mute">{quiz.explain}</span>
        </p>
      )}
    </div>
  );
}

export function StepView({ module, step }: { module: Module; step: Step }) {
  const { state, toggle, setLast } = useProgress();
  const reduced = useReducedMotion();
  const ratio = stepRatio(state, step);
  const next = nextStepId(step.id);
  const prev = prevStepId(step.id);
  const prompt = step.promptId ? prompts.find((p) => p.id === step.promptId) : undefined;

  useEffect(() => {
    setLast(step.id);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [step.id, setLast, reduced]);

  return (
    <motion.article initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
      <header>
        <a href={href.module(module.id)} className="text-sm text-gold hover:underline">
          Módulo {module.num} · {module.title}
        </a>
        <h2 className="mt-1 text-3xl font-semibold sm:text-4xl">{step.title}</h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-48">
            <ProgressBar pct={ratio.pct} label={`Progresso da etapa ${step.title}`} />
          </div>
          <span className="text-sm text-mute">
            {ratio.done}/{ratio.total} tarefas
          </span>
        </div>
      </header>

      <Section n={1} title="O que vamos fazer?">
        <p className="leading-relaxed">{step.what}</p>
      </Section>
      <Section n={2} title="Por que isso é importante?">
        <p className="leading-relaxed">{step.why}</p>
      </Section>
      <Section n={3} title="Qual ferramenta utilizar?">
        <div className="flex flex-wrap gap-2">
          {step.tools.map((t) => (
            <ToolBadge key={t} tool={t} />
          ))}
        </div>
      </Section>
      <Section n={4} title="Passo a passo">
        <ol className="flex list-decimal flex-col gap-2 pl-5 marker:font-semibold marker:text-gold">
          {step.how.map((h) => (
            <li key={h} className="pl-1 leading-relaxed">
              {h}
            </li>
          ))}
        </ol>
        {step.commands && (
          <div className="mt-4 flex flex-col gap-3">
            {step.commands.map((c) => (
              <div key={c.cmd} className="rounded-xl border border-sky-300/25 bg-black/30 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <code className="flex items-center gap-2 break-all font-mono text-sm text-sky-100">
                    <Terminal size={14} aria-hidden /> {c.cmd}
                  </code>
                  <CopyButton text={c.cmd} label="COPIAR COMANDO" className="!py-1 !text-xs" />
                </div>
                <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[8rem_1fr]">
                  <dt className="text-mute">Onde executar</dt><dd>{c.where}</dd>
                  <dt className="text-mute">O que faz</dt><dd>{c.does}</dd>
                  <dt className="text-mute">O que esperar</dt><dd>{c.expect}</dd>
                  <dt className="text-mute">Como verificar</dt><dd>{c.check}</dd>
                  {c.care && (<><dt className="text-amber-200">Cuidado</dt><dd className="text-amber-100/90">{c.care}</dd></>)}
                </dl>
              </div>
            ))}
          </div>
        )}
      </Section>

      {step.widget && <Widget id={step.widget} />}
      {prompt && <PromptCard prompt={prompt} compact />}

      <Section n={5} title="O que deve acontecer?">
        <p className="leading-relaxed">{step.expected}</p>
      </Section>
      <Section n={6} title="Como conferir?">
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {step.verify.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </Section>
      <Section n={7} title="Checklist">
        <ul className="flex flex-col gap-2">
          {step.tasks.map((t) => {
            const done = Boolean(state.done[t.id]);
            return (
              <li key={t.id}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${done ? "border-emerald-400/50 bg-emerald-400/5" : "border-white/15 hover:border-gold/50"}`}>
                  <input type="checkbox" className="h-5 w-5 accent-[#c8a45d]" checked={done} onChange={() => toggle(t.id)} />
                  <span className={done ? "text-mute line-through" : ""}>{t.text}</span>
                  {done && <CircleCheck size={16} className="ml-auto text-emerald-300" aria-hidden />}
                </label>
              </li>
            );
          })}
        </ul>
        {ratio.pct === 100 && (
          <motion.p initial={reduced ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 flex items-center gap-2 text-emerald-300" role="status">
            <CircleCheck size={18} aria-hidden /> Etapa concluída! Você pode avançar.
          </motion.p>
        )}
      </Section>
      <Section n={8} title="Problemas comuns">
        <div className="flex flex-col gap-3">
          {step.problems.map((p) => (
            <div key={p.symptom} className="flex gap-2.5">
              <CircleAlert size={16} className="mt-1 shrink-0 text-amber-300" aria-hidden />
              <div>
                <p className="font-medium">{p.symptom}</p>
                <p className="text-sm text-soft/85">{p.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      {step.quiz && (
        <GlassCard className="p-4 sm:p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-gold">Teste rápido</h3>
          <QuizBox key={step.id} quiz={step.quiz} />
        </GlassCard>
      )}
      <Section n={9} title="Próxima etapa">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {prev ? (
            <a href={href.step(prev)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm hover:border-gold/60">
              <ArrowLeft size={16} aria-hidden /> Etapa anterior
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={href.step(next)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-hi px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 active:scale-[0.97]">
              Próxima etapa <ArrowRight size={16} aria-hidden />
            </a>
          ) : (
            <a href={href.done} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-hi px-5 py-2.5 text-sm font-semibold text-ink">
              Ver conclusão <ArrowRight size={16} aria-hidden />
            </a>
          )}
        </div>
      </Section>
    </motion.article>
  );
}
