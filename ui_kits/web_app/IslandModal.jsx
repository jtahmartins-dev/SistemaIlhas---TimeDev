/* ============================================================
   IslandModal — the floating window opened when clicking an island
   ============================================================ */

function IslandModal({ ilha, etapa, demanda, anexos, canCheckIn, onClose, onCheckIn, onAddLink, onAddFile }) {
  const [obs, setObs] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkNome, setLinkNome] = React.useState("");

  const anexosDaIlha = (anexos || []).filter((a) => a.etapa_id === (etapa && etapa.id));
  const podeEnviarAnexo = !!demanda && etapa && etapa.status === "ativa";

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        <h3>{ilha.nome}</h3>
        <p className="modal-sub">{ilha.descricao}</p>

        <section>
          <h4>Pessoas atribuídas</h4>
          {ilha.membros.length === 0 ? (
            <p className="empty">Ninguém atribuído ainda.</p>
          ) : (
            <ul className="member-list">
              {ilha.membros.map((m) => (
                <li key={m.id} className="member-chip">
                  <strong>{m.nome}</strong>
                  <span className="muted" style={{ fontSize: 11 }}>· {ROLE_LABEL[m.role]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {demanda && etapa && (
          <React.Fragment>
            <hr className="soft" />
            <section>
              <h4>Estado nesta demanda</h4>
              <p style={{ margin: "4px 0", color: "var(--ink-1)" }}>
                <strong>{demanda.titulo}</strong>{" "}
                <span className={"island-status " + etapa.status} style={{ marginLeft: 6, verticalAlign: "middle" }}>
                  {etapa.status === "pendente" && "aguardando"}
                  {etapa.status === "ativa" && "em andamento"}
                  {etapa.status === "concluida" && "concluída"}
                </span>
              </p>
              {etapa.observacoes && (
                <pre className="preformatted">{etapa.observacoes.trim()}</pre>
              )}

              <h4 style={{ marginTop: 14 }}>Anexos desta etapa</h4>
              {anexosDaIlha.length === 0 ? (
                <p className="empty">Nenhum anexo ainda.</p>
              ) : (
                <ul className="anexo-list">
                  {anexosDaIlha.map((a) => (
                    <li key={a.id} className="anexo-item">
                      <span>{a.tipo === "arquivo" ? "📎" : "🔗"}</span>
                      <a href="#" onClick={(e) => e.preventDefault()}>{a.nome_original}</a>
                      <span className="anexo-meta">{a.enviado_em}</span>
                    </li>
                  ))}
                </ul>
              )}

              {podeEnviarAnexo && (
                <React.Fragment>
                  <h4 style={{ marginTop: 18 }}>Anexar link</h4>
                  <div className="field" style={{ marginBottom: 8 }}>
                    <input placeholder="https://…" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <input placeholder="Nome (opcional)" value={linkNome} onChange={(e) => setLinkNome(e.target.value)} />
                  </div>
                  <Button onClick={() => { if (linkUrl) { onAddLink && onAddLink(linkUrl, linkNome); setLinkUrl(""); setLinkNome(""); } }} disabled={!linkUrl}>
                    Adicionar link
                  </Button>
                </React.Fragment>
              )}

              {canCheckIn && etapa.status === "ativa" && (
                <React.Fragment>
                  <hr className="soft" />
                  <h4>Concluir esta etapa (check-in)</h4>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <textarea
                      placeholder="Observações sobre o que foi entregue…"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                    />
                  </div>
                  <Button variant="primary" onClick={() => { onCheckIn && onCheckIn(obs); setObs(""); }}>
                    Concluir e passar adiante
                  </Button>
                </React.Fragment>
              )}

              {!canCheckIn && etapa.status === "ativa" && (
                <p className="muted" style={{ marginTop: 8 }}>
                  Apenas membros desta ilha podem dar check-in.
                </p>
              )}
            </section>
          </React.Fragment>
        )}

        {!demanda && (
          <p className="muted" style={{ marginTop: 12 }}>
            Selecione uma demanda no topo pra ver o estado desta ilha nela.
          </p>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { IslandModal });
