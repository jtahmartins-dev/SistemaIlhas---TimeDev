"use client";

import { useRef, useState } from "react";

import Island from "./Island";
import type { Etapa, Ilha, IlhaSlug } from "@/lib/types";

const ORDER: IlhaSlug[] = ["bruna", "design", "dev_a", "dev_b", "integracao"];
const TRANSITION_MS = 650;
const SWIPE_THRESHOLD = 50;

interface Props {
  ilhas: Ilha[];
  etapaPorSlug: Map<IlhaSlug, Etapa>;
  isBloqueada: (s: IlhaSlug) => boolean;
  onIslandClick: (s: IlhaSlug) => void;
}

export default function MobileArchipelago({
  ilhas,
  etapaPorSlug,
  isBloqueada,
  onIslandClick,
}: Props) {
  const [index, setIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const startX = useRef<number | null>(null);
  const movingTimer = useRef<number | null>(null);

  const goTo = (next: number) => {
    if (next < 0 || next >= ORDER.length || next === index || moving) return;
    setMoving(true);
    setIndex(next);
    if (movingTimer.current) window.clearTimeout(movingTimer.current);
    movingTimer.current = window.setTimeout(() => setMoving(false), TRANSITION_MS);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(index + (delta < 0 ? 1 : -1));
    }
    startX.current = null;
  };

  const currentSlug = ORDER[index];

  return (
    <div className={`mobile-stage ${moving ? "moving" : ""}`}>
      <div className="mobile-stage-bg" aria-hidden />

      <div
        className="mobile-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="mobile-track"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {ORDER.map((slug) => {
            const ilha = ilhas.find((i) => i.slug === slug);
            if (!ilha) return null;
            return (
              <div key={slug} className="mobile-slide">
                <Island
                  ilha={ilha}
                  etapa={etapaPorSlug.get(slug)}
                  bloqueada={isBloqueada(slug)}
                  onClick={() => onIslandClick(slug)}
                  size="large"
                />
              </div>
            );
          })}
        </div>
      </div>

      {index > 0 && (
        <button
          className="mobile-nav left"
          onClick={() => goTo(index - 1)}
          aria-label="Ilha anterior"
        >
          ‹
        </button>
      )}
      {index < ORDER.length - 1 && (
        <button
          className="mobile-nav right"
          onClick={() => goTo(index + 1)}
          aria-label="Próxima ilha"
        >
          ›
        </button>
      )}

      <div className="mobile-dots" role="tablist">
        {ORDER.map((slug, i) => (
          <button
            key={slug}
            role="tab"
            aria-selected={i === index}
            className={`mobile-dot ${i === index ? "active" : ""} ${
              isBloqueada(slug) ? "locked" : ""
            }`}
            onClick={() => goTo(i)}
            aria-label={`Ir para ${slug}`}
          />
        ))}
      </div>

      <p className="mobile-stage-hint">
        {index + 1} de {ORDER.length} · arraste pro lado
      </p>
      {/* Hidden but keeps slug in DOM for testing */}
      <span data-current={currentSlug} hidden />
    </div>
  );
}
