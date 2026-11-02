import { useEffect, useState } from "react";
import { BookOpen, ListChecks, Menu, MessageSquareText, X } from "lucide-react";
import { modules } from "./content";
import { href, useRoute } from "./lib/route";
import { moduleRatio, overallRatio } from "./lib/progress";
import { ProgressProvider, useProgress } from "./lib/progress-context";
import { ChecklistPage, DonePage, GlossaryPage, Home, ModulePage, PromptsPage, StepPage } from "./pages/Pages";
import { ProgressBar } from "./components/ui";

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { state } = useProgress();
  const route = useRoute();
  const activeModule = route.page === "module" ? route.id : route.page === "step" ? route.id.slice(1, 3) : null;
  const link = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5";
  return (
    <nav aria-label="Módulos" className="flex flex-col gap-1">
      <a href={href.checklist} onClick={onNavigate} className={link}><ListChecks size={15} aria-hidden /> Meu checklist</a>
      <a href={href.prompts} onClick={onNavigate} className={link}><MessageSquareText size={15} aria-hidden /> Biblioteca de prompts</a>
      <a href={href.glossary} onClick={onNavigate} className={link}><BookOpen size={15} aria-hidden /> Glossário</a>
      <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-mute">Módulos</p>
      {modules.map((m) => {
        const r = moduleRatio(state, m);
        return (
          <a key={m.id} href={href.module(m.id)} onClick={onNavigate} aria-current={activeModule === m.id ? "page" : undefined} className={`${link} ${activeModule === m.id ? "bg-gold/10 text-gold-hi" : ""}`}>
            <span className="font-mono text-xs text-gold">{m.num}</span>
            <span className="flex-1 truncate">{m.title}</span>
            <span className={`text-xs ${r.pct === 100 ? "text-emerald-300" : "text-mute"}`}>{r.pct === 100 ? "✓" : `${r.pct}%`}</span>
          </a>
        );
      })}
    </nav>
  );
}

function Shell() {
  const route = useRoute();
  const { state } = useProgress();
  const [open, setOpen] = useState(false);
  const overall = overallRatio(state, modules);

  useEffect(() => {
    if (route.page !== "step") window.scrollTo({ top: 0 });
  }, [route]);

  return (
    <>
      <div className="aurora" aria-hidden>
        <div className="grid-bg" />
      </div>
      <a href="#main" className="sr-only-focusable fixed left-2 top-2 z-50 rounded bg-gold px-3 py-2 text-ink">Pular para o conteúdo</a>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <button type="button" className="rounded-lg border border-white/15 p-2 lg:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
          <a href={href.home} className="flex items-center gap-2.5">
            <img src="./brand/lk-marca.png" alt="" className="h-8 w-8 object-contain" />
            <span className="font-semibold tracking-wide">LK <span className="gold-text">DEVELOPMENT ACADEMY</span></span>
          </a>
          <div className="ml-auto hidden w-48 items-center gap-2 sm:flex">
            <ProgressBar pct={overall.pct} label="Progresso geral" />
            <span className="w-10 text-right text-xs text-mute">{overall.pct}%</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[17rem_1fr]">
        <aside className={`${open ? "block" : "hidden"} lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto`}>
          <div className="glass p-2"><Sidebar onNavigate={() => setOpen(false)} /></div>
        </aside>
        <main id="main" tabIndex={-1} className="min-w-0 max-w-4xl outline-none">
          {route.page === "home" && <Home />}
          {route.page === "module" && <ModulePage id={route.id} />}
          {route.page === "step" && <StepPage id={route.id} />}
          {route.page === "checklist" && <ChecklistPage />}
          {route.page === "prompts" && <PromptsPage />}
          {route.page === "glossary" && <GlossaryPage />}
          {route.page === "done" && <DonePage />}
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}
