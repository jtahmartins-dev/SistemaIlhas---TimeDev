"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Island from "@/components/Island";
import IslandModal from "@/components/IslandModal";
import MobileArchipelago from "@/components/MobileArchipelago";
import Topbar from "@/components/Topbar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/lib/useIsMobile";
import type {
  DemandaDetalhe,
  DemandaResumo,
  Etapa,
  Ilha,
  IlhaSlug,
  Role,
} from "@/lib/types";

const ROLES_POR_ILHA: Record<IlhaSlug, Role[]> = {
  bruna: ["bruna"],
  design: ["lider_design", "designer"],
  dev_a: ["dev_experiente", "dev_aprendiz"],
  dev_b: ["dev_experiente", "dev_aprendiz"],
  integracao: ["bruna", "lider_design", "designer", "dev_experiente", "dev_aprendiz"],
};

function statusPillClass(s: string) {
  if (s === "concluida") return "status-pill status-concluida";
  if (s === "dev") return "status-pill status-dev";
  if (s === "design") return "status-pill status-design";
  if (s === "integracao") return "status-pill status-integracao";
  return "status-pill status-bruna";
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [ilhas, setIlhas] = useState<Ilha[]>([]);
  const [demandas, setDemandas] = useState<DemandaResumo[]>([]);
  const [selecionadaId, setSelecionadaId] = useState<number | null>(null);
  const [demanda, setDemanda] = useState<DemandaDetalhe | null>(null);
  const [openIlha, setOpenIlha] = useState<IlhaSlug | null>(null);

  const [showNovaForm, setShowNovaForm] = useState(false);
  const [novaTitulo, setNovaTitulo] = useState("");
  const [novaDesc, setNovaDesc] = useState("");
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const refreshAll = async () => {
    const [ilhaList, demandaList] = await Promise.all([api.listIlhas(), api.listDemandas()]);
    setIlhas(ilhaList);
    setDemandas(demandaList);
  };

  useEffect(() => {
    if (!user) return;
    refreshAll().catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [user]);

  useEffect(() => {
    if (selecionadaId == null) {
      setDemanda(null);
      return;
    }
    api
      .getDemanda(selecionadaId)
      .then(setDemanda)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro"));
  }, [selecionadaId]);

  const etapaPorSlug = useMemo(() => {
    const map = new Map<IlhaSlug, Etapa>();
    if (demanda) {
      for (const e of demanda.etapas) map.set(e.ilha_slug as IlhaSlug, e);
    }
    return map;
  }, [demanda]);

  const isBloqueada = (slug: IlhaSlug): boolean => {
    if (!demanda) return false;
    const etapa = etapaPorSlug.get(slug);
    return etapa?.status === "pendente";
  };

  const ilhaPorSlug = (slug: IlhaSlug) => ilhas.find((i) => i.slug === slug);

  const handleCreateDemanda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== "bruna") return;
    setCriando(true);
    setErro(null);
    try {
      const nova = await api.createDemanda(novaTitulo, novaDesc);
      setNovaTitulo("");
      setNovaDesc("");
      setShowNovaForm(false);
      await refreshAll();
      setSelecionadaId(nova.id);
      setDemanda(nova);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao criar.");
    } finally {
      setCriando(false);
    }
  };

  const onDemandaChange = async (d: DemandaDetalhe) => {
    setDemanda(d);
    const list = await api.listDemandas();
    setDemandas(list);
  };

  const handleDeleteDemanda = async (e: React.MouseEvent, d: DemandaResumo) => {
    e.stopPropagation();
    const ok = window.confirm(
      `Apagar "${d.titulo}"? Isso remove a demanda, etapas e anexos. Não dá pra desfazer.`
    );
    if (!ok) return;
    try {
      await api.deleteDemanda(d.id);
      if (selecionadaId === d.id) {
        setSelecionadaId(null);
        setDemanda(null);
      }
      await refreshAll();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao apagar.");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="auth-shell">
        <p className="muted">Carregando…</p>
      </div>
    );
  }

  const ilhaAberta = openIlha ? ilhaPorSlug(openIlha) : null;
  const etapaAberta = openIlha ? etapaPorSlug.get(openIlha) ?? null : null;
  const podeCheckIn =
    openIlha != null && user && ROLES_POR_ILHA[openIlha].includes(user.role);

  return (
    <div className="page">
      <Topbar />

      {erro && (
        <div
          className="error-msg"
          style={{ maxWidth: 1500, margin: "70px auto 0" }}
        >
          {erro}
        </div>
      )}

      <div className="top-strip">
        <div className="glass demandas-card">
          <div className="head">
            <h3>Demandas</h3>
            {selecionadaId !== null && (
              <button className="btn btn-ghost" onClick={() => setSelecionadaId(null)}>
                Limpar seleção
              </button>
            )}
          </div>
          {demandas.length === 0 ? (
            <p className="empty">Nenhuma demanda ainda.</p>
          ) : (
            <div className="demandas-row">
              <button
                className={`demanda-chip ${selecionadaId === null ? "active" : ""}`}
                onClick={() => setSelecionadaId(null)}
              >
                Visão geral
              </button>
              {demandas.map((d) => (
                <span
                  key={d.id}
                  className={`demanda-chip ${selecionadaId === d.id ? "active" : ""}`}
                  onClick={() => setSelecionadaId(d.id)}
                  role="button"
                  tabIndex={0}
                >
                  {d.titulo}
                  <span className={statusPillClass(d.status_atual)}>{d.status_atual}</span>
                  {user.role === "bruna" && !isMobile && (
                    <button
                      type="button"
                      className="chip-del"
                      title="Apagar demanda"
                      onClick={(e) => handleDeleteDemanda(e, d)}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {user.role === "bruna" && !isMobile && (
          <div className="glass nova-demanda">
            <h3>Nova demanda</h3>
            {!showNovaForm ? (
              <button className="btn btn-primary" onClick={() => setShowNovaForm(true)}>
                + Criar
              </button>
            ) : (
              <form
                onSubmit={handleCreateDemanda}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div className="field">
                  <input
                    required
                    placeholder="Título"
                    value={novaTitulo}
                    onChange={(e) => setNovaTitulo(e.target.value)}
                  />
                </div>
                <div className="field">
                  <textarea
                    placeholder="Descrição"
                    value={novaDesc}
                    onChange={(e) => setNovaDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary" disabled={criando} style={{ flex: 1 }}>
                    {criando ? "Criando…" : "Criar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowNovaForm(false)}
                  >
                    Cancelar
                  </button>
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
            {demanda && (
              <span className={statusPillClass(demanda.status_atual)}>
                {demanda.status_atual}
              </span>
            )}
          </h2>
          <p>
            {isMobile
              ? demanda
                ? "Toque numa ilha pra ver detalhes e anexos. Arraste pro lado pra navegar."
                : "Arraste pro lado pra viajar pelas ilhas."
              : demanda
              ? "Clique numa ilha pra ver detalhes, anexos e (se for da equipe) dar check-in."
              : "Sem demanda selecionada — passe o mouse pra ver quem está em cada ilha."}
          </p>
        </div>

        {isMobile ? (
          <MobileArchipelago
            ilhas={ilhas}
            etapaPorSlug={etapaPorSlug}
            isBloqueada={isBloqueada}
            onIslandClick={setOpenIlha}
          />
        ) : (
          <div className="archipelago">
            <div className="archipelago-column">
              <IslandWrap slug="bruna" ilhaPorSlug={ilhaPorSlug} etapaPorSlug={etapaPorSlug} isBloqueada={isBloqueada} setOpenIlha={setOpenIlha} />
            </div>
            <div className="archipelago-column">
              <IslandWrap slug="design" ilhaPorSlug={ilhaPorSlug} etapaPorSlug={etapaPorSlug} isBloqueada={isBloqueada} setOpenIlha={setOpenIlha} />
            </div>
            <div className="archipelago-column">
              <IslandWrap slug="dev_a" ilhaPorSlug={ilhaPorSlug} etapaPorSlug={etapaPorSlug} isBloqueada={isBloqueada} setOpenIlha={setOpenIlha} />
              <IslandWrap slug="dev_b" ilhaPorSlug={ilhaPorSlug} etapaPorSlug={etapaPorSlug} isBloqueada={isBloqueada} setOpenIlha={setOpenIlha} alternate />
            </div>
            <div className="archipelago-column">
              <IslandWrap slug="integracao" ilhaPorSlug={ilhaPorSlug} etapaPorSlug={etapaPorSlug} isBloqueada={isBloqueada} setOpenIlha={setOpenIlha} />
            </div>
          </div>
        )}
      </div>

      {ilhaAberta && (
        <IslandModal
          ilha={ilhaAberta}
          etapa={etapaAberta}
          demanda={demanda}
          anexos={demanda?.anexos ?? []}
          canCheckIn={!!podeCheckIn}
          onClose={() => setOpenIlha(null)}
          onDemandaChange={onDemandaChange}
          readOnly={isMobile}
        />
      )}
    </div>
  );
}

function IslandWrap({
  slug,
  ilhaPorSlug,
  etapaPorSlug,
  isBloqueada,
  setOpenIlha,
  alternate,
}: {
  slug: IlhaSlug;
  ilhaPorSlug: (s: IlhaSlug) => Ilha | undefined;
  etapaPorSlug: Map<IlhaSlug, Etapa>;
  isBloqueada: (s: IlhaSlug) => boolean;
  setOpenIlha: (s: IlhaSlug) => void;
  alternate?: boolean;
}) {
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
