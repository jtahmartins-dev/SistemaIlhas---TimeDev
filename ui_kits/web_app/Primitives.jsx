/* ============================================================
   Shared primitives — Button, Input, Field, StatusPill, Brand
   ============================================================ */

function Button({ variant = "ghost", children, ...rest }) {
  const cls = "btn" + (variant === "primary" ? " btn-primary" : variant === "ghost" ? " btn-ghost" : "");
  return <button className={cls} {...rest}>{children}</button>;
}

function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  // status: bruna | design | dev | integracao | concluida | ativa
  const map = {
    bruna: "bruna",
    design: "design",
    dev: "dev",
    integracao: "integracao",
    concluida: "concluida",
    ativa: "ativa",
  };
  return <span className={"status-pill status-" + (map[status] || "bruna")}>{status}</span>;
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-dot"></span>
      Sistema de Ilhas
    </div>
  );
}

function Topbar({ user, onLogout }) {
  if (!user) return null;
  const ROLE_LABEL = {
    bruna: "Bruna",
    lider_design: "Líder de Design",
    designer: "Designer",
    dev_experiente: "Dev Experiente",
    dev_aprendiz: "Dev Aprendiz",
  };
  return (
    <React.Fragment>
      <Brand />
      <div className="user-corner">
        <div className="who">
          <strong>{user.nome.split(" ")[0]}</strong>
          <span>{ROLE_LABEL[user.role]}</span>
        </div>
        <button onClick={onLogout}>Sair</button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { Button, Field, StatusPill, Brand, Topbar });
