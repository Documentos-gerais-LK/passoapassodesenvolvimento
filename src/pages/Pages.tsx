import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, ListChecks, Play, RotateCcw, Search, Trophy } from "lucide-react";
import { allSteps, findModule, findStep, modules } from "../content";
import { glossary } from "../content/glossary";
import { prompts } from "../content/prompts";
import { href } from "../lib/route";
import { moduleRatio, nextPending, overallRatio, stepRatio } from "../lib/progress";
import { useProgress } from "../lib/progress-context";
import { PromptCard } from "../components/PromptCard";
import { StepView } from "../components/StepView";
import { GlassCard, ProgressBar } from "../components/ui";

export function ResetButton() {
  const { reset } = useProgress();
  const [ask, setAsk] = useState(false);
  if (!ask) {
    return (
      <button type="button" onClick={() => setAsk(true)} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-mute hover:border-rose-400/60 hover:text-rose-200">
        <RotateCcw size={14} aria-hidden /> Reiniciar treinamento
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-label="Confirmar reinício" className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-sm">
      <p className="mb-2">Isso apaga todas as marcações salvas neste navegador. Deseja continuar?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setAsk(false);
          }}
          className="rounded-lg bg-rose-500 px-3 py-1.5 font-semibold text-white"
        >
          Sim, reiniciar
        </button>
        <button type="button" onClick={() => setAsk(false)} className="rounded-lg border border-white/20 px-3 py-1.5">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function Home() {
  const { state, persisted } = useProgress();
  const overall = overallRatio(state, modules);
  const next = nextPending(state, modules);
  const lastStep = state.last ? findStep(state.last) : undefined;
  const started = overall.done > 0 || Boolean(lastStep);
  const resume = lastStep && stepRatio(state, lastStep.step).pct < 100 ? lastStep : next;
  const completed = modules.filter((m) => moduleRatio(state, m).pct === 100).length;
  const minutesLeft = modules.filter((m) => moduleRatio(state, m).pct < 100).reduce((a, m) => a + m.minutes, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">LK Development Academy</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
          Bem-vindo, <span className="gold-text">Léo!</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-mute">Vamos aprender a desenvolver software de forma organizada, rastreável e profissional.</p>
        <p className="mt-1 text-sm text-mute">Do primeiro planejamento à publicação: aprenda desenvolvendo.</p>
      </header>

      <GlassCard className="p-5">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="font-medium">Progresso geral</p>
              <p className="text-2xl font-semibold text-gold-hi">{overall.pct}%</p>
            </div>
            <ProgressBar pct={overall.pct} label="Progresso geral do treinamento" />
            <p className="mt-2 text-sm text-mute">
              {overall.done} de {overall.total} atividades · {completed} de {modules.length} módulos concluídos
              {minutesLeft > 0 && ` · leitura e prática restantes estimadas: ~${Math.round(minutesLeft / 60)} h (estimativa aproximada)`}
            </p>
            {resume ? (
              <p className="mt-3 text-sm">
                <span className="text-mute">Próxima atividade: </span>
                <a className="text-gold-hi hover:underline" href={href.step(resume.step.id)}>
                  Módulo {resume.module.num} · {resume.step.title}
                </a>
              </p>
            ) : (
              <p className="mt-3 text-sm text-emerald-300">Todas as atividades estão concluídas.</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {started && resume && (
              <a href={href.step(resume.step.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-hi px-5 py-3 font-semibold text-ink transition hover:brightness-110 active:scale-[0.97]">
                <Play size={16} aria-hidden /> Continuar de onde parei
              </a>
            )}
            <a href={href.step(allSteps[0].step.id)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition active:scale-[0.97] ${started ? "border-white/15 text-soft hover:border-gold/60" : "border-transparent bg-gradient-to-r from-gold to-gold-hi text-ink"}`}>
              Começar treinamento <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </div>
        {!persisted && <p className="mt-3 text-sm text-amber-200">Seu navegador não permite salvar o progresso. Ele vale apenas nesta sessão.</p>}
      </GlassCard>

      <section aria-labelledby="mods">
        <h2 id="mods" className="mb-3 text-xl font-semibold">Módulos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const r = moduleRatio(state, m);
            return (
              <a key={m.id} href={href.module(m.id)} className="glass glass-hover block p-4">
                <div className="flex items-center justify-between text-xs text-mute">
                  <span className="font-mono text-gold">MÓDULO {m.num}</span>
                  <span>{m.track === "B" ? "Trilha B · LK" : m.track === "A" ? "Trilha A · Pessoal" : "Base"}</span>
                </div>
                <h3 className="mt-1 font-semibold">{m.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-mute">{m.summary}</p>
                <div className="mt-3">
                  <ProgressBar pct={r.pct} label={`Progresso do módulo ${m.title}`} />
                </div>
                <p className="mt-1 text-xs text-mute">{r.done}/{r.total} · ~{m.minutes} min</p>
              </a>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-mute">O progresso é salvo apenas neste navegador, neste dispositivo (localStorage). Não há login nem sincronização entre dispositivos.</p>
      <div><ResetButton /></div>
    </div>
  );
}

export function ModulePage({ id }: { id: string }) {
  const { state } = useProgress();
  const m = findModule(id);
  if (!m) return <NotFound />;
  const r = moduleRatio(state, m);
  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="font-mono text-sm text-gold">MÓDULO {m.num} · {m.track === "B" ? "Trilha B — Desenvolvimento LK" : m.track === "A" ? "Trilha A — Desenvolvimento pessoal" : "Base"}</p>
        <h2 className="mt-1 text-3xl font-semibold sm:text-4xl">{m.title}</h2>
        <p className="mt-2 max-w-2xl text-mute">{m.summary}</p>
        <div className="mt-3 max-w-sm"><ProgressBar pct={r.pct} label="Progresso do módulo" /></div>
      </header>
      <ol className="flex flex-col gap-2">
        {m.steps.map((s, i) => {
          const sr = stepRatio(state, s);
          return (
            <li key={s.id}>
              <a href={href.step(s.id)} className="glass glass-hover flex items-center gap-3 p-4">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm ${sr.pct === 100 ? "border-emerald-400 bg-emerald-400/15 text-emerald-200" : "border-gold/50 text-gold-hi"}`}>{sr.pct === 100 ? "✓" : i + 1}</span>
                <span className="flex-1">
                  <span className="block font-medium">{s.title}</span>
                  <span className="block text-sm text-mute">{sr.done}/{sr.total} tarefas</span>
                </span>
                <ArrowRight size={16} className="text-mute" aria-hidden />
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function StepPage({ id }: { id: string }) {
  const found = findStep(id);
  if (!found) return <NotFound />;
  return <StepView module={found.module} step={found.step} />;
}

type Filter = "all" | "pending" | "done";

export function ChecklistPage() {
  const { state, toggle } = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const overall = overallRatio(state, modules);
  const next = nextPending(state, modules);
  const nextTask = next?.step.tasks.find((t) => !state.done[t.id]);
  const labels: Record<Filter, string> = { all: "Todas", pending: "Pendentes", done: "Concluídas" };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="flex items-center gap-2 text-3xl font-semibold sm:text-4xl"><ListChecks aria-hidden /> Meu checklist de desenvolvimento</h2>
        <p className="mt-2 text-mute">Cada item é uma atividade real e verificável. Marque só o que você de fato fez.</p>
        <div className="mt-3 max-w-md"><ProgressBar pct={overall.pct} label="Progresso geral" /></div>
        <p className="mt-1 text-sm text-mute">{overall.done} de {overall.total} concluídas ({overall.pct}%)</p>
      </header>
      {next && nextTask && (
        <GlassCard className="p-4">
          <p className="text-sm text-mute">Próxima ação</p>
          <p className="font-medium">{nextTask.text}</p>
          <a href={href.step(next.step.id)} className="mt-1 inline-block text-sm text-gold-hi hover:underline">Abrir: Módulo {next.module.num} · {next.step.title}</a>
        </GlassCard>
      )}
      <div role="group" aria-label="Filtro" className="flex gap-2">
        {(Object.keys(labels) as Filter[]).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-lg border px-3 py-1.5 text-sm ${filter === f ? "border-gold bg-gold/20 text-gold-hi" : "border-white/15 text-mute"}`}>
            {labels[f]}
          </button>
        ))}
      </div>
      {modules.map((m) => {
        const r = moduleRatio(state, m);
        const steps = m.steps
          .map((s) => ({ s, tasks: s.tasks.filter((t) => (filter === "all" ? true : filter === "done" ? state.done[t.id] : !state.done[t.id])) }))
          .filter((x) => x.tasks.length);
        if (!steps.length) return null;
        return (
          <section key={m.id} className="glass p-4" aria-labelledby={`cm-${m.id}`}>
            <h3 id={`cm-${m.id}`} className="flex items-center justify-between font-semibold">
              <a href={href.module(m.id)} className="hover:underline">Módulo {m.num} · {m.title}</a>
              <span className="text-sm text-mute">{r.done}/{r.total}</span>
            </h3>
            {steps.map(({ s, tasks }) => (
              <div key={s.id} className="mt-3">
                <a href={href.step(s.id)} className="text-sm text-gold hover:underline">{s.title}</a>
                <ul className="mt-1 flex flex-col gap-1.5">
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-white/5">
                        <input type="checkbox" className="h-4 w-4 accent-[#c8a45d]" checked={Boolean(state.done[t.id])} onChange={() => toggle(t.id)} />
                        <span className={`text-sm ${state.done[t.id] ? "text-mute line-through" : ""}`}>{t.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
      {overall.total > 0 && filter === "pending" && overall.done === overall.total && <p className="text-emerald-300">Nada pendente. Tudo concluído!</p>}
      {filter === "done" && overall.done === 0 && <p className="text-mute">Nenhuma atividade concluída ainda.</p>}
      <div><ResetButton /></div>
    </div>
  );
}

export function PromptsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-3xl font-semibold sm:text-4xl">Biblioteca de prompts</h2>
        <p className="mt-2 max-w-2xl text-mute">Antes de copiar, entenda o que você está enviando: leia a finalidade, preencha os campos e confira o texto final.</p>
      </header>
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? glossary.filter((g) => (g.term + " " + g.meaning).toLowerCase().includes(n)) : glossary;
  }, [q]);
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="flex items-center gap-2 text-3xl font-semibold sm:text-4xl"><BookOpen aria-hidden /> Glossário</h2>
      </header>
      <label className="relative block max-w-md">
        <span className="sr-only">Buscar no glossário</span>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar termo…" className="w-full rounded-lg border border-white/15 bg-black/30 py-2.5 pl-9 pr-3 text-sm" />
      </label>
      {list.length === 0 ? (
        <p className="text-mute" role="status">Nenhum termo encontrado para “{q}”.</p>
      ) : (
        <dl className="grid gap-2">
          {list.map((g) => (
            <div key={g.term} className="glass p-3.5">
              <dt className="font-semibold text-gold-hi">{g.term}</dt>
              <dd className="text-sm text-soft/90">{g.meaning}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function DonePage() {
  const { state } = useProgress();
  const m13 = findModule("13")!;
  const r13 = moduleRatio(state, m13);
  const overall = overallRatio(state, modules);
  if (r13.pct < 100) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Conclusão</h2>
        <GlassCard className="p-5">
          <p>A tela de conclusão aparece quando as três entregas do Módulo 13 estiverem concluídas ({r13.done}/{r13.total} tarefas até agora).</p>
          <a href={href.module("13")} className="mt-2 inline-block text-gold-hi hover:underline">Ir para o Módulo 13</a>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <header className="pt-4 text-center">
        <Trophy size={44} className="mx-auto text-gold-hi" aria-hidden />
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Parabéns, Léo! Você concluiu seu primeiro ciclo de desenvolvimento estruturado.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-mute">Esta conclusão representa a finalização do treinamento, não uma certificação profissional formal.</p>
      </header>
      <GlassCard className="p-5">
        <h3 className="mb-2 font-semibold">Resumo do que você praticou</h3>
        <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              <span className="font-mono text-gold">{m.num}</span> {m.title} — {moduleRatio(state, m).pct}%
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-mute">Progresso geral: {overall.pct}%. {overall.pct < 100 && "Alguns módulos ainda têm atividades pendentes: revise no checklist."}</p>
      </GlassCard>
      <GlassCard className="p-5 text-sm">
        <p className="font-medium">Lembrete para a Trilha B (LK)</p>
        <p className="mt-1 text-mute">Concluir este treinamento não concede acessos nem autoriza publicações. Em projetos da LK, siga as políticas de cada repositório e as orientações do responsável.</p>
      </GlassCard>
    </div>
  );
}

export function NotFound() {
  return (
    <GlassCard className="p-5">
      <p className="font-medium">Página não encontrada.</p>
      <a href={href.home} className="mt-1 inline-block text-gold-hi hover:underline">Voltar ao início</a>
    </GlassCard>
  );
}
