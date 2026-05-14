/* ============================================================
   Island — the floating island card with hover popover
   ============================================================ */

const ISLAND_TAG = {
  bruna: "Demanda",
  design: "Design",
  dev_a: "Dev A",
  dev_b: "Dev B",
  integracao: "Integração",
};

const TINT_COLORS = {
  bruna:      { a: "rgba(167, 139, 250, 0.55)" },
  design:     { a: "rgba(34, 211, 238, 0.55)" },
  dev_a:      { a: "rgba(59, 130, 246, 0.55)" },
  dev_b:      { a: "rgba(99, 102, 241, 0.55)" },
  integracao: { a: "rgba(245, 158, 11, 0.55)" },
};

const ROLE_LABEL = {
  bruna: "Bruna",
  lider_design: "Líder de Design",
  designer: "Designer",
  dev_experiente: "Dev Experiente",
  dev_aprendiz: "Dev Aprendiz",
};

function Island({ ilha, etapa, onClick, bloqueada, alternate }) {
  const status = etapa && etapa.status;
  const classes = ["island"];
  if (alternate) classes.push("alt-anim");
  if (status === "ativa") classes.push("ativa");
  if (status === "concluida") classes.push("concluida");
  if (bloqueada) classes.push("bloqueada");

  const tint = TINT_COLORS[ilha.slug];
  const style = { "--tint-a": tint.a };

  return (
    <div className="island-wrap" style={style}>
      <div
        className={classes.join(" ")}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick && onClick(); }}
      >
        <span className="island-tag">{ISLAND_TAG[ilha.slug]}</span>
        <div className="island-svg-wrap">
          <img src={"../../assets/islands/" + ilha.slug + ".png"} alt={ilha.slug} />
        </div>
        <h3 className="island-title">{ilha.nome}</h3>
        <p className="island-subtitle">
          {ilha.membros.length} {ilha.membros.length === 1 ? "pessoa" : "pessoas"}
        </p>
        {status && (
          <span className={"island-status " + status}>
            {status === "ativa" && "em andamento"}
            {status === "concluida" && "concluída"}
            {status === "pendente" && "aguardando"}
          </span>
        )}
      </div>

      <div className="members-pop">
        <h4>{ilha.nome}</h4>
        {ilha.membros.length === 0 ? (
          <p className="empty" style={{ margin: 0 }}>Ninguém atribuído ainda.</p>
        ) : (
          <ul>
            {ilha.membros.map((m) => (
              <li key={m.id}>
                <span>{m.nome}</span>
                <span className="role">{ROLE_LABEL[m.role]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Island, ROLE_LABEL, ISLAND_TAG });
