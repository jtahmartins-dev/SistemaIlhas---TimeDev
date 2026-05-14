"use client";

import { useState } from "react";

import { api, getApiUrl } from "@/lib/api";
import { ROLE_LABEL, type Anexo, type DemandaDetalhe, type Etapa, type Ilha } from "@/lib/types";

interface IslandModalProps {
  ilha: Ilha;
  etapa: Etapa | null;
  demanda: DemandaDetalhe | null;
  anexos: Anexo[];
  canCheckIn: boolean;
  onClose: () => void;
  onDemandaChange: (d: DemandaDetalhe) => void;
  readOnly?: boolean;
}

export default function IslandModal({
  ilha,
  etapa,
  demanda,
  anexos,
  canCheckIn,
  onClose,
  onDemandaChange,
  readOnly = false,
}: IslandModalProps) {
  const [obs, setObs] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNome, setLinkNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleCheckIn = async () => {
    if (!demanda || !etapa) return;
    setErro(null);
    setBusy(true);
    try {
      const atualizada = await api.checkIn(demanda.id, ilha.slug, obs);
      onDemandaChange(atualizada);
      setObs("");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro no check-in.");
    } finally {
      setBusy(false);
    }
  };

  const handleLink = async () => {
    if (!demanda) return;
    setErro(null);
    setBusy(true);
    try {
      await api.addLink(demanda.id, linkUrl, linkNome, etapa?.id ?? null);
      const refresh = await api.getDemanda(demanda.id);
      onDemandaChange(refresh);
      setLinkUrl("");
      setLinkNome("");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao adicionar link.");
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!demanda) return;
    setErro(null);
    setBusy(true);
    try {
      await api.uploadArquivo(demanda.id, file, etapa?.id ?? null);
      const refresh = await api.getDemanda(demanda.id);
      onDemandaChange(refresh);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar arquivo.");
    } finally {
      setBusy(false);
    }
  };

  const anexosDaIlha = anexos.filter((a) => a.etapa_id === etapa?.id);
  const podeEnviarAnexo = !readOnly && !!demanda && etapa?.status === "ativa";
  const podeFinalizar = !readOnly && canCheckIn;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-strong modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

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
                  <span className="muted" style={{ fontSize: 11 }}>
                    · {ROLE_LABEL[m.role]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {demanda && etapa && (
          <>
            <hr className="soft" />
            <section>
              <h4>Estado nesta demanda</h4>
              <p style={{ margin: "4px 0" }}>
                <strong>{demanda.titulo}</strong>{" "}
                <span className={`island-status ${etapa.status}`}>
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
                      <a
                        href={
                          a.tipo === "arquivo"
                            ? getApiUrl(a.caminho_ou_url)
                            : a.caminho_ou_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {a.nome_original}
                      </a>
                      <span className="anexo-meta">
                        {new Date(a.enviado_em).toLocaleString("pt-BR")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {podeEnviarAnexo && (
                <>
                  <h4 style={{ marginTop: 14 }}>Enviar arquivo</h4>
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                    disabled={busy}
                  />

                  <h4 style={{ marginTop: 14 }}>Anexar link</h4>
                  <div className="field">
                    <input
                      placeholder="https://…"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <input
                      placeholder="Nome (opcional)"
                      value={linkNome}
                      onChange={(e) => setLinkNome(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn"
                    onClick={handleLink}
                    disabled={busy || !linkUrl}
                  >
                    Adicionar link
                  </button>
                </>
              )}

              {podeFinalizar && etapa.status === "ativa" && (
                <>
                  <hr className="soft" />
                  <h4>Concluir esta etapa (check-in)</h4>
                  <div className="field">
                    <textarea
                      placeholder="Observações sobre o que foi entregue…"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckIn}
                    disabled={busy}
                  >
                    {busy ? "Concluindo…" : "Concluir e passar adiante"}
                  </button>
                </>
              )}

              {!podeFinalizar && etapa.status === "ativa" && !readOnly && (
                <p className="muted" style={{ marginTop: 8 }}>
                  Apenas membros desta ilha podem dar check-in.
                </p>
              )}
              {readOnly && (
                <p className="muted" style={{ marginTop: 8 }}>
                  No celular você só visualiza. Pra anexar ou dar check-in, abra no computador.
                </p>
              )}
            </section>
          </>
        )}

        {!demanda && (
          <p className="muted" style={{ marginTop: 12 }}>
            Selecione uma demanda no topo pra ver o estado desta ilha nela.
          </p>
        )}

        {erro && (
          <div className="error-msg" style={{ marginTop: 12 }}>
            {erro}
          </div>
        )}
      </div>
    </div>
  );
}
