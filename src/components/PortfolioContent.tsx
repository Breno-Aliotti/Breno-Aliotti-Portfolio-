import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ProjetoId, SectionId } from "../types";
import LogoLoop, { type LogoItem } from "./LogoLoop";

type Props = {
  activeSection: SectionId;
  direction: 1 | -1;
  onSelectProject: (id: ProjetoId) => void;
};

export default function PortfolioContent({
  activeSection,
  direction,
  onSelectProject,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const base = import.meta.env.BASE_URL ?? "/";

  const variants = {
    enter: (dir: 1 | -1) => ({
      opacity: 0,
      y: shouldReduceMotion ? 0 : dir === 1 ? 26 : -26,
    }),
    center: { opacity: 1, y: 0 },
    exit: (dir: 1 | -1) => ({
      opacity: 0,
      y: shouldReduceMotion ? 0 : dir === 1 ? -26 : 26,
    }),
  };

  const techLogos: LogoItem[] = [
    { src: `${base}abap-logo.png`, alt: "ABAP", title: "ABAP" },
    { src: `${base}react-logo.png`, alt: "React", title: "React" },
    { src: `${base}JavaScript-logo.png`, alt: "JavaScript", title: "JavaScript" },
    { src: `${base}HTML5_logo.png`, alt: "HTML", title: "HTML" },
    { src: `${base}logo-css.png`, alt: "CSS", title: "CSS" },
    { src: `${base}nodejs-logo.png`, alt: "Node.js", title: "Node.js" },
    { src: `${base}python-logo.png`, alt: "Python", title: "Python" },
    { src: `${base}logo-sql.png`, alt: "SQL", title: "SQL" },
    { src: `${base}github_logo_.webp`, alt: "GitHub", title: "GitHub" },
  ];

  const renderLogoItem = (item: LogoItem) => {
    if (!("src" in item)) return null;

    const label = item.title ?? item.alt ?? "";

    return (
      <div className="relative inline-flex items-center justify-center group/tech">
        <img
          src={item.src}
          alt={item.alt ?? ""}
          title={label}
          className="h-[var(--logoloop-logoHeight)] w-auto object-contain opacity-90"
          loading="eager"
          decoding="async"
          draggable={false}
        />

        {label && (
          <span
            className={[
              "pointer-events-none absolute left-1/2 -translate-x-1/2 z-20",
              "bottom-[calc(100%+6px)]",
              "whitespace-nowrap rounded-md bg-black/85 border border-white/10",
              "px-2 py-1 text-[10px] text-zinc-100",
              "opacity-0 translate-y-1 transition duration-150",
              "group-hover/tech:opacity-100 group-hover/tech:translate-y-0",
            ].join(" ")}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  const oldPortfolioUrl =
    "https://breno-aliotti.github.io/Portifolio-Breno-Aliotti/";

  return (
    <main className="h-full px-4 sm:px-6 md:px-12 py-10 md:py-14">
      <AnimatePresence mode="wait" initial={!shouldReduceMotion} custom={direction}>
        {activeSection === "home" && (
          <motion.section
            key="home"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full flex items-end justify-end"
          >
            <p className="text-xs text-zinc-400 text-right">
              São Paulo - SP • disponível para estágio/trainee/júnior
            </p>
          </motion.section>
        )}

        {activeSection === "sobre" && (
          <motion.section
            key="sobre"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full"
          >
            <div className="w-full flex justify-end">
              <div className="mt-10 sm:mt-28 md:mt-36 w-full min-w-0 max-w-[560px] text-right space-y-7">
                <p className="text-[13px] text-zinc-400 leading-relaxed break-words">
                  Sou formado em Análise e Desenvolvimento de Sistemas.
                  Atualmente estou cursando Big Data e Inteligência Analítica.
                </p>

                <p className="text-[13px] text-zinc-400 leading-relaxed break-words">
                  Tenho facilidade com desenvolvimento de sistemas e análise de
                  dados. Possuo conhecimento em Help Desk, como remanejamento de
                  máquinas, manutenção de hardware, atendimento ao usuário
                  presencial e remoto, configuração de máquinas e instalação de
                  softwares.
                </p>

                <p className="text-[13px] text-zinc-400 leading-relaxed break-words">
                  Estou em busca de uma vaga de estágio/trainee/junior na área de
                  tecnologia para iniciar minha carreira.
                </p>

                <div className="pt-2 space-y-3">
                  <h3 className="w-full text-center text-[10px] md:text-[11px] font-semibold text-zinc-300 uppercase tracking-[0.22em]">
                    Tecnologias que utilizo
                  </h3>

                  <div className="relative h-[78px] overflow-hidden">
                    <LogoLoop
                      logos={techLogos}
                      direction="left"
                      logoHeight={28}
                      gap={26}
                      speed={45}
                      hoverSpeed={15}
                      pauseOnHover={false}
                      scaleOnHover={false}
                      fadeOut={false}
                      ariaLabel="Tecnologias que utilizo"
                      renderItem={(item) => renderLogoItem(item)}
                      className="pt-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeSection === "projetos" && (
          <motion.section
            key="projetos"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full"
          >
            <div className="space-y-10">
              <button
                type="button"
                onClick={() => onSelectProject("projeto-1")}
                className="group w-full text-left md:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              >
                <h3 className="text-3xl md:text-6xl font-light tracking-tight">
                  <span className="inline-block text-zinc-400 transition duration-200 group-hover:text-zinc-200 group-hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]">
                    Projeto ABAP
                  </span>
                </h3>

                <p className="mt-2 text-xs md:text-sm max-w-xl md:ml-auto leading-relaxed">
                  <span className="inline-block text-zinc-600 transition duration-200 group-hover:text-zinc-400 group-hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)]">
                    Relatório ALV Interativo para Gerenciamento de Voos
                  </span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectProject("projeto-2")}
                className="group w-full text-left md:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              >
                <h3 className="text-3xl md:text-6xl font-light tracking-tight">
                  <span className="inline-block text-zinc-400 transition duration-200 group-hover:text-zinc-200 group-hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]">
                    Projeto Python
                  </span>
                </h3>

                <p className="mt-2 text-xs md:text-sm max-w-xl md:ml-auto leading-relaxed">
                  <span className="inline-block text-zinc-600 transition duration-200 group-hover:text-zinc-400 group-hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)]">
                    Ciência de dados aplicada à logística com modelagem preditiva
                  </span>
                </p>
              </button>

              {/* ✅ NOVO PROJETO: Antigo Portfolio (abre em nova aba) */}
              <a
                href={oldPortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="group block w-full text-left md:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              >
                <h3 className="text-3xl md:text-6xl font-light tracking-tight">
                  <span className="inline-block text-zinc-400 transition duration-200 group-hover:text-zinc-200 group-hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]">
                    Antigo Portfolio
                  </span>
                </h3>

                <p className="mt-2 text-xs md:text-sm max-w-xl md:ml-auto leading-relaxed">
                  <span className="inline-block text-zinc-600 transition duration-200 group-hover:text-zinc-400 group-hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)]">
                    Versão anterior do meu portfólio (para comparação)
                  </span>
                </p>
              </a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
