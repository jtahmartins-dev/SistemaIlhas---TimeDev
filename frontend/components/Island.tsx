"use client";

import type { CSSProperties } from "react";

import { ROLE_LABEL, type Etapa, type Ilha, type IlhaSlug } from "@/lib/types";

const TAG: Record<IlhaSlug, string> = {
  bruna: "Demanda",
  design: "Design",
  dev_a: "Dev A",
  dev_b: "Dev B",
  integracao: "Integração",
};

// Aurora glow under each island — uses the design-system tint palette
// (Bruna=violet, Design=turquesa, Dev A=azul-real, Dev B=índigo, Integração=âmbar)
const TINT_COLORS: Record<IlhaSlug, { a: string; b: string }> = {
  bruna:      { a: "rgba(167, 139, 250, 0.45)", b: "rgba(125, 211, 252, 0.35)" },
  design:     { a: "rgba(34, 211, 238, 0.45)",  b: "rgba(56, 189, 248, 0.35)" },
  dev_a:      { a: "rgba(59, 130, 246, 0.45)",  b: "rgba(125, 211, 252, 0.35)" },
  dev_b:      { a: "rgba(99, 102, 241, 0.45)",  b: "rgba(56, 189, 248, 0.35)" },
  integracao: { a: "rgba(245, 158, 11, 0.45)",  b: "rgba(251, 146, 60, 0.30)" },
};

interface IslandProps {
  ilha: Ilha;
  etapa?: Etapa;
  onClick?: () => void;
  bloqueada?: boolean;
  alternate?: boolean;
  size?: "default" | "large";
}

export default function Island({ ilha, etapa, onClick, bloqueada, alternate, size = "default" }: IslandProps) {
  const status = etapa?.status;
  const classes = ["island"];
  if (size === "large") classes.push("island-large");
  if (alternate) classes.push("alt-anim");
  if (status === "ativa") classes.push("ativa");
  if (status === "concluida") classes.push("concluida");
  if (bloqueada) classes.push("bloqueada");

  const tint = TINT_COLORS[ilha.slug];
  const style: CSSProperties = {
    ["--tint-a" as string]: tint.a,
    ["--tint-b" as string]: tint.b,
  };

  return (
    <div className="island-wrap" style={style}>
      <div
        className={classes.join(" ")}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        }}
      >
        <span className="island-tag">{TAG[ilha.slug]}</span>

        <div className="island-svg-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/islands/${ilha.slug}.png`} alt={ilha.slug} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <h3 className="island-title">{ilha.nome}</h3>
        <p className="island-subtitle">
          {ilha.membros.length} {ilha.membros.length === 1 ? "pessoa" : "pessoas"}
        </p>

        {status && (
          <span className={`island-status ${status}`}>
            {status === "ativa" && "em andamento"}
            {status === "concluida" && "concluída"}
            {status === "pendente" && "aguardando"}
          </span>
        )}
      </div>

      <div className="members-pop">
        <h4>{ilha.nome}</h4>
        {ilha.membros.length === 0 ? (
          <p className="empty" style={{ margin: 0 }}>
            Ninguém atribuído ainda.
          </p>
        ) : (
          <ul>
            {ilha.membros.map((m) => (
              <li key={m.id}>
                <span>
                  {m.nome}
                  {m.is_admin && <span className="admin-pill" title="Admin (todas as ilhas)">admin</span>}
                </span>
                <span className="role">{ROLE_LABEL[m.role]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
