/* ============================================================
   App router + seed data
   ============================================================ */

const SEED_ILHAS = [
  { id: 1, slug: "bruna", nome: "Bruna", ordem: 1,
    descricao: "Onde as demandas nascem. Bruna abre, anexa contexto e passa adiante.",
    membros: [{ id: 1, nome: "Bruna Pereira", email: "bruna@advec.org", role: "bruna", ilha_id: 1, avatar_url: null }],
  },
  { id: 2, slug: "design", nome: "Ilha Design", ordem: 2,
    descricao: "Onde os protótipos nascem e são validados antes do desenvolvimento.",
    membros: [
      { id: 2, nome: "Marina Silva", email: "marina@advec.org", role: "lider_design", ilha_id: 2, avatar_url: null },
      { id: 3, nome: "João Pedro", email: "joao@advec.org", role: "designer", ilha_id: 2, avatar_url: null },
    ],
  },
  { id: 3, slug: "dev_a", nome: "Ilha Dev A", ordem: 3,
    descricao: "Time experiente — leva a parte mais delicada do desenvolvimento.",
    membros: [{ id: 4, nome: "Carlos Andrade", email: "carlos@advec.org", role: "dev_experiente", ilha_id: 3, avatar_url: null }],
  },
  { id: 4, slug: "dev_b", nome: "Ilha Dev B", ordem: 4,
    descricao: "Time aprendiz — trabalha em paralelo aprendendo com Dev A.",
    membros: [{ id: 5, nome: "Júlia Castro", email: "julia@advec.org", role: "dev_aprendiz", ilha_id: 4, avatar_url: null }],
  },
  { id: 5, slug: "integracao", nome: "Integração", ordem: 5,
    descricao: "Onde as ilhas se encontram. Qualquer pessoa pode fechar o ciclo.",
    membros: [],
  },
];

const SEED_DEMANDAS = [
  {
    id: 101, titulo: "Login social com Google", descricao: "Permitir entrar com Google.",
    status_atual: "design", criado_em: "2026-05-12T10:00:00Z", criado_por_id: 1,
    etapas: [
      { id: 1, ilha_slug: "bruna",      status: "concluida", observacoes: "Bruna abriu, descreveu critérios de aceite.\nLinks anexados: spec antiga, screenshots." },
      { id: 2, ilha_slug: "design",     status: "ativa",     observacoes: "" },
      { id: 3, ilha_slug: "dev_a",      status: "pendente",  observacoes: "" },
      { id: 4, ilha_slug: "dev_b",      status: "pendente",  observacoes: "" },
      { id: 5, ilha_slug: "integracao", status: "pendente",  observacoes: "" },
    ],
    anexos: [
      { id: 1, etapa_id: 1, tipo: "link",    caminho_ou_url: "#", nome_original: "figma.com/file/auth-spec",   enviado_por_id: 1, enviado_em: "12/05 10:14" },
      { id: 2, etapa_id: 1, tipo: "arquivo", caminho_ou_url: "#", nome_original: "criterios-aceite.pdf",       enviado_por_id: 1, enviado_em: "12/05 10:18" },
      { id: 3, etapa_id: 2, tipo: "link",    caminho_ou_url: "#", nome_original: "figma.com/file/login-google-flow-v3", enviado_por_id: 3, enviado_em: "14/05 09:42" },
    ],
  },
  {
    id: 102, titulo: "Onboarding mobile", descricao: "Fluxo de 3 telas.",
    status_atual: "dev", criado_em: "2026-05-10T14:00:00Z", criado_por_id: 1,
    etapas: [
      { id: 6,  ilha_slug: "bruna",      status: "concluida", observacoes: "" },
      { id: 7,  ilha_slug: "design",     status: "concluida", observacoes: "Protótipo v2 aprovado pela Bruna." },
      { id: 8,  ilha_slug: "dev_a",      status: "ativa",     observacoes: "" },
      { id: 9,  ilha_slug: "dev_b",      status: "ativa",     observacoes: "" },
      { id: 10, ilha_slug: "integracao", status: "pendente",  observacoes: "" },
    ],
    anexos: [],
  },
  {
    id: 103, titulo: "Modal de filtros", descricao: "Refazer modal antigo.",
    status_atual: "concluida", criado_em: "2026-05-01T09:00:00Z", criado_por_id: 1,
    etapas: [
      { id: 11, ilha_slug: "bruna",      status: "concluida", observacoes: "" },
      { id: 12, ilha_slug: "design",     status: "concluida", observacoes: "" },
      { id: 13, ilha_slug: "dev_a",      status: "concluida", observacoes: "" },
      { id: 14, ilha_slug: "dev_b",      status: "concluida", observacoes: "" },
      { id: 15, ilha_slug: "integracao", status: "concluida", observacoes: "QA validou. Subiu pra produção 05/05." },
    ],
    anexos: [],
  },
];

function App() {
  const [route, setRoute] = React.useState("login"); // login | register | dashboard
  const [user, setUser] = React.useState(null);
  const [ilhas] = React.useState(SEED_ILHAS);
  const [demandas, setDemandas] = React.useState(SEED_DEMANDAS);

  if (route === "login" || !user) {
    return (
      <LoginScreen
        onLogin={(u) => { setUser(u); setRoute("dashboard"); }}
        onGoToRegister={() => setRoute("register")}
      />
    );
  }
  if (route === "register") {
    return (
      <RegisterScreen
        onRegistered={(u) => { setUser(u); setRoute("dashboard"); }}
        onGoToLogin={() => setRoute("login")}
      />
    );
  }
  return (
    <Dashboard
      user={user}
      onLogout={() => { setUser(null); setRoute("login"); }}
      ilhas={ilhas}
      demandas={demandas}
      setDemandas={setDemandas}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
