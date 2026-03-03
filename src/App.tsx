import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/Navbar";
import PortfolioContent from "./components/PortfolioContent";
import ProjectScreen from "./components/ProjectScreen";
import Grainient from "./components/Grainient.jsx";
import ShinyText from "./components/ShinyText.jsx";
import type { ProjetoId, SectionId } from "./types";

type ThemeMode = "dark" | "white" | "red";

type RouteState = {
  __portfolio: true;
  section: SectionId;
  project: ProjetoId | null;
  idx: number;
};

const SECTION_PARAM = "s";
const PROJECT_PARAM = "p";

const VALID_SECTIONS: SectionId[] = ["home", "sobre", "projetos"];
const VALID_PROJECTS: ProjetoId[] = ["projeto-1", "projeto-2"];

function getNavigationType(): PerformanceNavigationTiming["type"] | undefined {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    return nav?.type;
  } catch {
    return undefined;
  }
}

function parseRouteFromUrl(): { section: SectionId; project: ProjetoId | null } {
  const url = new URL(window.location.href);

  const s = url.searchParams.get(SECTION_PARAM) as SectionId | null;
  const p = url.searchParams.get(PROJECT_PARAM) as ProjetoId | null;

  const section: SectionId = s && VALID_SECTIONS.includes(s) ? s : "home";
  const project: ProjetoId | null = p && VALID_PROJECTS.includes(p) ? p : null;

  return { section: project ? "projetos" : section, project };
}

function buildUrl(section: SectionId, project: ProjetoId | null) {
  const url = new URL(window.location.href);

  url.searchParams.set(SECTION_PARAM, section);

  if (project) url.searchParams.set(PROJECT_PARAM, project);
  else url.searchParams.delete(PROJECT_PARAM);

  return url.pathname + url.search + url.hash;
}

function App() {
  const shouldReduceMotion = useReducedMotion();

  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // ✅ wheel-snap só em telas >= 640px (sm)
  const [enableSnapNav, setEnableSnapNav] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 640px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const onChange = () => setEnableSnapNav(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const initialRoute = useMemo(() => {
    const navType = getNavigationType();
    if (navType === "reload") {
      return { section: "home" as SectionId, project: null as ProjetoId | null };
    }
    return parseRouteFromUrl();
  }, []);

  const [activeSection, setActiveSection] = useState<SectionId>(initialRoute.section);
  const [navDir, setNavDir] = useState<1 | -1>(1);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjetoId | null>(
    initialRoute.project
  );

  const contentRef = useRef<HTMLDivElement | null>(null);

  // Intro timer
  useEffect(() => {
    const ms = shouldReduceMotion ? 200 : 1400;
    const id = window.setTimeout(() => setShowIntro(false), ms);
    return () => window.clearTimeout(id);
  }, [shouldReduceMotion]);

  const sections = useMemo<SectionId[]>(() => ["home", "sobre", "projetos"], []);

  const getIndex = useCallback((s: SectionId) => sections.indexOf(s), [sections]);

  const routeRef = useRef<{ section: SectionId; project: ProjetoId | null }>({
    section: initialRoute.section,
    project: initialRoute.project,
  });

  useEffect(() => {
    routeRef.current = { section: activeSection, project: projetoSelecionado };
  }, [activeSection, projetoSelecionado]);

  const applyRoute = useCallback(
    (route: { section: SectionId; project: ProjetoId | null }) => {
      const curIdx = getIndex(routeRef.current.section);
      const nextIdx = getIndex(route.section);

      if (curIdx !== -1 && nextIdx !== -1) setNavDir(nextIdx >= curIdx ? 1 : -1);
      else setNavDir(1);

      setActiveSection(route.section);
      setProjetoSelecionado(route.project);

      routeRef.current = route;
    },
    [getIndex]
  );

  const pushRoute = useCallback(
    (route: { section: SectionId; project: ProjetoId | null }, replace = false) => {
      const prev = window.history.state as RouteState | null;
      const prevIdx = prev?.__portfolio ? prev.idx : 0;

      const state: RouteState = {
        __portfolio: true,
        idx: replace ? prevIdx : prevIdx + 1,
        section: route.section,
        project: route.project,
      };

      const url = buildUrl(route.section, route.project);

      if (replace) window.history.replaceState(state, "", url);
      else window.history.pushState(state, "", url);

      applyRoute(route);
    },
    [applyRoute]
  );

  useEffect(() => {
    pushRoute(initialRoute, true);

    const onPop = (e: PopStateEvent) => {
      const st = e.state as RouteState | null;

      if (st?.__portfolio) applyRoute({ section: st.section, project: st.project });
      else applyRoute(parseRouteFromUrl());
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute, pushRoute, initialRoute]);

  const navigateTo = useCallback(
    (next: SectionId) => {
      if (!VALID_SECTIONS.includes(next)) return;
      pushRoute({ section: next, project: null });
    },
    [pushRoute]
  );

  const navigateRelative = useCallback(
    (delta: 1 | -1) => {
      const idx = getIndex(routeRef.current.section);
      if (idx === -1) return;

      const nextIdx = Math.min(sections.length - 1, Math.max(0, idx + delta));
      const next = sections[nextIdx];
      if (next === routeRef.current.section) return;

      pushRoute({ section: next, project: null });
    },
    [getIndex, sections, pushRoute]
  );

  const onSelectProject = useCallback(
    (id: ProjetoId) => pushRoute({ section: "projetos", project: id }),
    [pushRoute]
  );

  const onNavigate = useCallback((section: SectionId) => navigateTo(section), [navigateTo]);

  const onBack = useCallback(() => {
    const st = window.history.state as RouteState | null;

    if (st?.__portfolio && st.idx > 0) {
      window.history.back();
      return;
    }

    pushRoute({ section: "projetos", project: null }, true);
  }, [pushRoute]);

  /** Wheel -> troca de tela (somente sm+) */
  const wheelLockRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const wheelResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!enableSnapNav) return; // ✅ no mobile deixa scroll normal
      if (showIntro) return;
      if (projetoSelecionado) return;
      if (e.ctrlKey) return;

      if (wheelLockRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      wheelAccumRef.current += e.deltaY;

      if (wheelResetTimer.current) window.clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = window.setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 120);

      const THRESHOLD = 60;
      if (Math.abs(wheelAccumRef.current) < THRESHOLD) return;

      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      wheelLockRef.current = true;
      navigateRelative(dir as 1 | -1);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 650);
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelResetTimer.current) window.clearTimeout(wheelResetTimer.current);
    };
  }, [navigateRelative, projetoSelecionado, showIntro, enableSnapNav]);

  const grainColors =
    theme === "red"
      ? { color1: "#781000", color2: "#C91B00", color3: "#781000" }
      : theme === "white"
      ? { color1: "#B3B3B3", color2: "#F2FAFF", color3: "#B3B3B3" }
      : { color1: "#5e5e5e", color2: "#414044", color3: "#525252" };

  const overlayClass =
    theme === "white" ? "bg-white/20" : theme === "red" ? "bg-black/20" : "bg-black/35";

  const getShinyColors = (buttonTheme: ThemeMode) => {
    const isActive = theme === buttonTheme;

    if (theme === "white") {
      return isActive
        ? { color: "#0b0b0c", shineColor: "#4b5563" }
        : { color: "#111827", shineColor: "#9ca3af" };
    }

    return isActive
      ? { color: "#e5e7eb", shineColor: "#ffffff" }
      : { color: "#a1a1aa", shineColor: "#f4f4f5" };
  };

  const switcherShell =
    theme === "white" ? "border border-black/20 bg-white/60" : "border border-white/15 bg-black/40";

  const activePillClass = theme === "white" ? "bg-black/10" : "bg-white/15";

  return (
    <div
      className={[
        "min-h-screen relative overflow-x-hidden text-zinc-100",
        theme === "dark" ? "theme-dark" : theme === "white" ? "theme-white" : "theme-red",
      ].join(" ")}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0">
          <Grainient
            color1={grainColors.color1}
            color2={grainColors.color2}
            color3={grainColors.color3}
            timeSpeed={shouldReduceMotion ? 0 : 2.2}
            colorBalance={-0.27}
            warpStrength={0.8}
            warpFrequency={5}
            warpSpeed={shouldReduceMotion ? 0 : 2.4}
            warpAmplitude={49}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={1.35}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        <div className={["absolute inset-0", overlayClass].join(" ")} />
      </div>

      {/* INTRO OVERLAY */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.55 }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          >
            <div
              className={[
                "absolute inset-0",
                theme === "white" ? "bg-white/30" : "bg-black/30",
                "backdrop-blur-[6px]",
              ].join(" ")}
            />

            <div className="absolute inset-0 p-4 md:p-8">
              <div className="relative h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] border border-white/10 overflow-hidden">
                <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-10">
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.6,
                      ease: "easeOut",
                    }}
                    className="max-w-[420px] text-center"
                  >
                    <div
                      className={[
                        "text-3xl md:text-4xl font-light tracking-tight",
                        theme === "white" ? "text-zinc-900" : "text-zinc-200",
                      ].join(" ")}
                    >
                      Breno Aliotti
                    </div>

                    <div
                      className={[
                        "mt-2 text-[10px] uppercase tracking-[0.38em]",
                        theme === "white" ? "text-zinc-600" : "text-zinc-400/90",
                      ].join(" ")}
                    >
                      Portfólio
                    </div>
                  </motion.div>
                </div>

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(80% 80% at 20% 20%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 55%), radial-gradient(80% 80% at 80% 80%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 60%)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTEÚDO */}
      <div className="relative z-10">
        <AnimatePresence mode="wait" initial={!shouldReduceMotion}>
          {projetoSelecionado ? (
            <div key="project" className="h-screen overflow-y-auto">
              <ProjectScreen projeto={projetoSelecionado} onBack={onBack} />
            </div>
          ) : (
            <div key="shell" className="w-full p-4 md:p-8">
              <div className="relative border border-white/10 h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
                {/* ✅ 2 colunas sempre */}
                <div className="h-full min-h-0 grid grid-cols-[140px_minmax(0,1fr)] sm:grid-cols-[260px_minmax(0,1fr)] md:grid-cols-[360px_minmax(0,1fr)]">
                  {/* ✅ Navbar SEM scroll */}
                  <div className="h-full overflow-hidden min-w-0">
                    <Navbar active={activeSection} onNavigate={onNavigate} />
                  </div>

                  {/* ✅ Conteúdo:
                      - mobile: scroll normal
                      - sm+: overflow-hidden (wheel snap) */}
                  <div
                    ref={contentRef}
                    className="h-full min-h-0 min-w-0 overflow-y-auto sm:overflow-hidden"
                  >
                    <PortfolioContent
                      activeSection={activeSection}
                      direction={navDir}
                      onSelectProject={onSelectProject}
                    />
                  </div>
                </div>

                {/* SWITCHER */}
                <div className="absolute bottom-4 left-4 z-50 pointer-events-auto">
                  <div
                    className={[
                      "relative flex gap-1.5 rounded-full backdrop-blur-md p-1.5",
                      switcherShell,
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className="relative px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] transition"
                    >
                      {theme === "dark" && (
                        <motion.span
                          layoutId="theme-pill"
                          className={["absolute inset-0 rounded-full", activePillClass].join(" ")}
                          transition={{ type: "spring", stiffness: 520, damping: 38 }}
                        />
                      )}
                      <span className="relative z-10">
                        <ShinyText
                          text="Dark"
                          speed={1.4}
                          delay={0}
                          spread={120}
                          direction="left"
                          yoyo={false}
                          pauseOnHover={false}
                          disabled={shouldReduceMotion}
                          color={getShinyColors("dark").color}
                          shineColor={getShinyColors("dark").shineColor}
                        />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("white")}
                      className="relative px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] transition"
                    >
                      {theme === "white" && (
                        <motion.span
                          layoutId="theme-pill"
                          className={["absolute inset-0 rounded-full", activePillClass].join(" ")}
                          transition={{ type: "spring", stiffness: 520, damping: 38 }}
                        />
                      )}
                      <span className="relative z-10">
                        <ShinyText
                          text="Light"
                          speed={1.4}
                          delay={0.15}
                          spread={120}
                          direction="left"
                          yoyo={false}
                          pauseOnHover={false}
                          disabled={shouldReduceMotion}
                          color={getShinyColors("white").color}
                          shineColor={getShinyColors("white").shineColor}
                        />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("red")}
                      className="relative px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] transition"
                    >
                      {theme === "red" && (
                        <motion.span
                          layoutId="theme-pill"
                          className={["absolute inset-0 rounded-full", activePillClass].join(" ")}
                          transition={{ type: "spring", stiffness: 520, damping: 38 }}
                        />
                      )}
                      <span className="relative z-10">
                        <ShinyText
                          text="Red"
                          speed={1.4}
                          delay={0.3}
                          spread={120}
                          direction="left"
                          yoyo={false}
                          pauseOnHover={false}
                          disabled={shouldReduceMotion}
                          color={getShinyColors("red").color}
                          shineColor={getShinyColors("red").shineColor}
                        />
                      </span>
                    </button>
                  </div>
                </div>
                {/* /switcher */}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;