import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  text: string | string[];
  className?: string;

  startDelayMs?: number;
  typingMs?: number;
  deletingMs?: number;
  pauseMs?: number;

  loop?: boolean;
  showCursor?: boolean;
  cursorClassName?: string;
};

type Mode = "typing" | "pausing" | "deleting";

export default function TextType({
  text,
  className,

  startDelayMs = 200,
  typingMs = 55,
  deletingMs = 28,
  pauseMs = 1100,

  loop = true,
  showCursor = true,
  cursorClassName = "type-cursor",
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // texto “maior” para reservar espaço e evitar o layout ficar pulando
  const reserveText = useMemo(() => {
    return texts.reduce((acc, t) => (t.length > acc.length ? t : acc), "");
  }, [texts]);

  const [started, setStarted] = useState(startDelayMs === 0);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("typing");

  const currentText = texts[textIndex] ?? "";
  const lastIndex = texts.length - 1;

  // Reduced motion: mostra o texto final inteiro (sem animação)
  useEffect(() => {
    if (!shouldReduceMotion) return;

    const finalText = texts[lastIndex] ?? "";
    setStarted(true);
    setTextIndex(lastIndex);
    setCharIndex(finalText.length);
    setMode("pausing");
  }, [shouldReduceMotion, texts, lastIndex]);

  // Delay inicial
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (started) return;

    const id = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(id);
  }, [shouldReduceMotion, started, startDelayMs]);

  // Máquina de estados
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!started) return;

    let id: number | undefined;

    if (mode === "typing") {
      if (charIndex < currentText.length) {
        id = window.setTimeout(() => setCharIndex((c) => c + 1), typingMs);
      } else {
        setMode("pausing");
      }
    }

    if (mode === "pausing") {
      // se não tiver loop e estiver no último texto, para aqui
      if (!loop && textIndex === lastIndex) return;

      id = window.setTimeout(() => setMode("deleting"), pauseMs);
    }

    if (mode === "deleting") {
      if (charIndex > 0) {
        id = window.setTimeout(() => setCharIndex((c) => c - 1), deletingMs);
      } else {
        setTextIndex((i) => (i + 1) % texts.length);
        setMode("typing");
      }
    }

    return () => {
      if (id) window.clearTimeout(id);
    };
  }, [
    shouldReduceMotion,
    started,
    mode,
    charIndex,
    currentText,
    typingMs,
    deletingMs,
    pauseMs,
    loop,
    textIndex,
    lastIndex,
    texts.length,
  ]);

  return (
    <span className="relative inline-block align-top">
      {/* Reserva o espaço do maior texto (invisível) para não empurrar o conteúdo abaixo */}
      <span
        className={["invisible pointer-events-none select-none", className]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {reserveText}
      </span>

      {/* Texto animado por cima */}
      <span
        className={["absolute inset-0", className].filter(Boolean).join(" ")}
        aria-label={currentText}
      >
        {currentText.slice(0, charIndex)}
        {showCursor && (
          <span className={cursorClassName} aria-hidden="true">
            |
          </span>
        )}
      </span>
    </span>
  );
}