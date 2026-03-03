import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SectionId } from "../types";

type NavbarProps = {
  active: SectionId;
  onNavigate: (section: SectionId) => void;
};

export default function Navbar({ active, onNavigate }: NavbarProps) {
  const base = import.meta.env.BASE_URL ?? "/";
  const shouldReduceMotion = useReducedMotion();

  const items = useMemo(
    () =>
      [
        { label: "Home", id: "home" as const },
        { label: "Sobre", id: "sobre" as const },
        { label: "Projetos", id: "projetos" as const },
      ] satisfies Array<{ label: string; id: Exclude<SectionId, "contato"> }>,
    []
  );

  const [contactOpen, setContactOpen] = useState(false);

  const handleNavigate = (id: Exclude<SectionId, "contato">) => {
    setContactOpen(false);
    onNavigate(id);
  };

  return (
    <aside className="h-full p-4 sm:p-6 md:p-10 min-w-0 overflow-hidden">
      <div className="mb-10 min-w-0">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight whitespace-normal break-words">
          Breno Aliotti
        </h1>
        <p className="mt-2 text-xs text-zinc-400">Desenvolvedor</p>
      </div>

      <nav aria-label="Navegação">
        <ul className="space-y-3">
          {items.map((item) => {
            const isActive = active === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-flex items-center",
                    "uppercase tracking-[0.22em] text-[12px]",
                    "transition-opacity duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm px-1 py-1",
                    isActive
                      ? "opacity-100 font-medium"
                      : "opacity-55 hover:opacity-85",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              </li>
            );
          })}

          <li>
            <a
              href={`${base}CV-Breno-Aliotti.pdf`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setContactOpen(false)}
              className={[
                "inline-flex items-center",
                "uppercase tracking-[0.22em] text-[12px]",
                "transition-opacity duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm px-1 py-1",
                "opacity-55 hover:opacity-85",
              ].join(" ")}
            >
              Currículo
            </a>
          </li>

          <li>
            <button
              type="button"
              onClick={() => setContactOpen((v) => !v)}
              aria-expanded={contactOpen}
              className={[
                "inline-flex items-center",
                "uppercase tracking-[0.22em] text-[12px]",
                "transition-opacity duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm px-1 py-1",
                contactOpen
                  ? "opacity-100 font-medium"
                  : "opacity-55 hover:opacity-85",
              ].join(" ")}
            >
              Contato
            </button>

            <AnimatePresence initial={false}>
              {contactOpen && (
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? false
                      : { height: 0, opacity: 0, marginTop: 0 }
                  }
                  animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0, marginTop: 0 }
                  }
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pl-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.linkedin.com/in/breno-aliotti/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 transition opacity-75 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
                        aria-label="LinkedIn"
                      >
                        <img
                          src={`${base}linkedinlogo.png`}
                          alt="LinkedIn"
                          className="w-6 h-6"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>

                      <a
                        href="https://github.com/Breno-Aliotti"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 transition opacity-75 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
                        aria-label="GitHub"
                      >
                        <img
                          src={`${base}github_logo_.webp`}
                          alt="GitHub"
                          className="w-6 h-6"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    </div>

                    <a
                      href="mailto:aliottibreno@gmail.com"
                      className="font-sans block text-[12px] opacity-75 hover:opacity-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm px-1 py-1 w-fit break-words"
                    >
                      aliottibreno@gmail.com
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>

      <div className="mt-12 text-[11px] text-zinc-500">
        © {new Date().getFullYear()} Breno
      </div>
    </aside>
  );
}