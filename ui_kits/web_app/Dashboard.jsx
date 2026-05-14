/* ============================================================
   Dashboard — top-strip (demandas + nova demanda) + archipelago
   ============================================================ */

function statusPillClass(s) {
  if (s === "concluida") return "status-pill status-concluida";
  if (s === "dev") return "status-pill status-dev";
  if (s === "design") return "status-pill status-design";
  if (s === "integracao") return "status-pill status-integracao";
  if (s === "ativa") return "status-pill status-ativa";
  return "status-pill status-bruna";
}

const ROLES_POR_ILHA = {
  bruna: ["bruna"],
  design: ["lider_design", "designer"],
  dev_a: ["dev_experiente", "dev_aprendiz"],
  dev_b: ["dev_experiente", "dev_aprendiz"],
  integracao: ["bruna", "lider_design", "designer", "dev_experiente", "dev_aprendiz"],
};

function Dashboard({ user, onLogout, ilhas, demandas, setDemandas }) {
  const [selecionadaId, setSelecionadaId] = React.useState(demandas[0] ? demandas[0].id : null);
  const [openIlha, setOpenIlha] = React.useState(null);
  const [showNovaForm, setShowNovaForm] = React.useState(false);
  const [novaTitulo, setNovaTitulo] = React.useState("");
  const [novaDesc, setNovaDesc] = React.useState("");

  const demanda = demandas.find((d) => d.id === selecionadaId) || null;

  const etapaPorSlug = React.useMemo(() => {
    const map = new Map();
    if (demanda) demanda.etapas.forEach((e) => map.set(e.ilha_slug, e));
    return map;
  }, [demanda]);

  const isBloqueada = (slug) => {
    if (!demanda) return false;
    const etapa = etapaPorSlug.get(slug);
    return etapa && etapa.status === "pendente";
  };

  const ilhaPorSlug = (slug) => ilhas.find((i) => i.slug === slug);

  const handleCreateDemanda = (e) => {
    e.preventDefault();
    const id = Date.now();
    const novaDemanda = {
      id, titulo: novaTitulo, descricao: novaDesc, status_atual: "bruna",
      criado_em: new Date().toISOString(), criado_por_id: user.id,
      etapas: [
        { id: id + 1, ilha_slug: "bruna",      status: "ativa",     observacoes: "" },
        { id: id + 2, ilha_slug: "design",     status: "pendente",  observacoes: "" },
        { id: id + 3, ilha_slug: "dev_a",      status: "pendente",  observacoes: "" },
        { id: id + 4, ilha_slug: "dev_b",      status: "pendente",  observacoes: "" },
        { id: id + 5, ilha_slug: "integracao", status: "pendente",  observacoes: "" },
      ],
      anexos: [],
    };
    setDemandas([novaDemanda, ...demandas]);
    setSelecionadaId(id);
    setNovaTitulo(""); setNovaDesc(""); setShowNovaForm(false);
  };

  const handleDeleteDemanda = (e, d) => {
    e.stopPropagation();
    const ok = window.confirm(`Apagar "${d.titulo}"? Isso remove a demanda, etapas e anexos. Não dá pra desfazer.`);
    if (!ok) return;
    setDemandas(demandas.filter((x) => x.id !== d.id));
    if (selecionadaId === d.id) setSelecionadaId(null);
  };

  const handleCheckIn = (obs) => {
    if (!demanda || !openIlha) return;
    const ORDER = ["bruna", "design", "dev_a", "dev_b", "integracao"];
    const updated = { ...demanda, etapas: demanda.etapas.map((e) => ({ ...e })) };
    const cur = updated.etapas.find((e) => e.ilha_slug === openIlha);
    if (cur) { cur.status = "concluida"; cur.observacoes = obs; }

    // simple advance: if bruna concluida -> design ativa; design -> dev_a + dev_b; both devs -> integracao; integracao -> concluida
    if (openIlha === "bruna") {
      const next = updated.etapas.find((e) => e.ilha_slug === "design");
      if (next) next.status = "ativa";
      updated.status_atual = "design";
    } else if (openIlha === "design") {
      updated.etapas.find((e) => e.ilha_slug === "dev_a").status = "ativa";
      updated.etapas.find((e) => e.ilha_slug === "dev_b").status = "ativa";
      updated.status_atual = "dev";
    } else if (openIlha === "dev_a" || openIlha === "dev_b") {
      const dA = updated.etapas.find((e) => e.ilha_slug === "dev_a");
      const dB = updated.etapas.find((e) => e.ilha_slug === "dev_b");
      if (dA.status === "concluida" && dB.status === "concluida") {
        updated.etapas.find((e) => e.ilha_slug === "integracao").status = "ativa";
        updated.status_atual = "integracao";
      }
    } else if (openIlha === "integracao") {
      updated.status_atual = "concluida";
    }
    setDemandas(demandas.map((d) => d.id === demanda.id ? updated : d));
    setOpenIlha(null);
  };

  const ilhaAberta = openIlha ? ilhaPorSlug(openIlha) : null;
  const etapaAberta = openIlha ? (etapaPorSlug.get(openIlha) || null) : null;
  const podeCheckIn = openIlha != null && user && ROLES_POR_ILHA[openIlha].includes(user.role);

  return (
    <div className="page">
      <Topbar user={user} onLogout={onLogout} />

      <div className="top-strip">
        <div className="glass demandas-card">
          <div className="head">
            <h3>Demandas</h3>
            {selecionadaId !== null && (
              <button className="btn btn-ghost" onClick={() => setSelecionadaId(null)}>Limpar seleção</button>
            )}
          </div>
          {demandas.length === 0 ? (
            <p className="empty">Nenhuma demanda ainda.</p>
          ) : (
            <div className="demandas-row">
              <button
                className={"demanda-chip " + (selecionadaId === null ? "active" : "")}
                onClick={() => setSelecionadaId(null)}
              >Visão geral</button>
              {demandas.map((d) => (
                <span
                  key={d.id}
                  className={"demanda-chip " + (selecionadaId === d.id ? "active" : "")}
                  onClick={() => setSelecionadaId(d.id)}
                  role="button"
                  tabIndex={0}
                >
                  {d.titulo}
                  <span className={statusPillClass(d.status_atual)}>{d.status_atual}</span>
                  {user.role === "bruna" && (
                    <button type="button" className="chip-del" title="Apagar demanda" onClick={(e) => handleDeleteDemanda(e, d)}>×</button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {user.role === "bruna" && (
          <div className="glass nova-demanda">
            <h3>Nova demanda</h3>
            {!showNovaForm ? (
              <Button variant="primary" onClick={() => setShowNovaForm(true)}>+ Criar</Button>
            ) : (
              <form onSubmit={handleCreateDemanda} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Field><input required placeholder="Título" value={novaTitulo} onChange={(e) => setNovaTitulo(e.target.value)} /></Field>
                <Field><textarea placeholder="Descrição" value={novaDesc} onChange={(e) => setNovaDesc(e.target.value)} /></Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="primary" type="submit" style={{ flex: 1 }}>Criar</Button>
                  <Button type="button" onClick={() => setShowNovaForm(false)}>Cancelar</Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="glass archipelago-section">
        <div className="section-head">
          <h2>
            {demanda ? demanda.titulo : "Arquipélago"}
            {demanda && <span className={statusPillClass(demanda.status_atual)}>{demanda.status_atual}</span>}
          </h2>
          <p>
            {demanda
              ? "Clique numa ilha pra ver detalhes, anexos e (se for da equipe) dar check-in."
              : "Sem demanda selecionada — passe o mouse pra ver quem está em cada ilha."}
          </p>
        </div>

        <div className="archipelago">
          <div className="archipelago-column">
            <IslandWrap slug="bruna" {...{ ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha }} />
          </div>
          <div className="archipelago-column">
            <IslandWrap slug="design" {...{ ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha }} />
          </div>
          <div className="archipelago-column">
            <IslandWrap slug="dev_a" {...{ ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha }} />
            <IslandWrap slug="dev_b" alternate {...{ ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha }} />
          </div>
          <div className="archipelago-column">
            <IslandWrap slug="integracao" {...{ ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha }} />
          </div>
        </div>
      </div>

      {ilhaAberta && (
        <IslandModal
          ilha={ilhaAberta}
          etapa={etapaAberta}
          demanda={demanda}
          anexos={(demanda && demanda.anexos) || []}
          canCheckIn={!!podeCheckIn}
          onClose={() => setOpenIlha(null)}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}

function IslandWrap({ slug, ilhaPorSlug, etapaPorSlug, isBloqueada, setOpenIlha, alternate }) {
  const ilha = ilhaPorSlug(slug);
  if (!ilha) return null;
  return (
    <Island
      ilha={ilha}
      etapa={etapaPorSlug.get(slug)}
      bloqueada={isBloqueada(slug)}
      onClick={() => setOpenIlha(slug)}
      alternate={alternate}
    />
  );
}

Object.assign(window, { Dashboard });
