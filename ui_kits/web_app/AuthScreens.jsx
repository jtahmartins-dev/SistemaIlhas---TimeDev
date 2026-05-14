/* ============================================================
   Login + Register screens
   ============================================================ */

function LoginScreen({ onLogin, onGoToRegister }) {
  const [email, setEmail] = React.useState("bruna@advec.org");
  const [senha, setSenha] = React.useState("••••••");
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setTimeout(() => {
      setLoading(false);
      if (!email || !senha) { setErro("Erro ao entrar."); return; }
      onLogin({
        id: 1, nome: "Bruna Pereira", email, role: "bruna",
        ilha_id: null, avatar_url: null,
      });
    }, 500);
  };

  return (
    <div className="auth-shell">
      <div className="glass glass-xl auth-card">
        <h2>Entrar</h2>
        <p className="subtitle">Acessa o arquipélago de ilhas.</p>
        {erro && <div className="error-msg">{erro}</div>}
        <form onSubmit={submit}>
          <Field label="E-mail">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Senha">
            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          </Field>
          <Button variant="primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <div className="switch">
          Ainda não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); onGoToRegister(); }}>Cadastrar</a>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onRegistered, onGoToLogin }) {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [role, setRole] = React.useState("designer");
  const [ilha, setIlha] = React.useState("design");
  const [loading, setLoading] = React.useState(false);

  const ROLE_LABEL = {
    bruna: "Bruna",
    lider_design: "Líder de Design",
    designer: "Designer",
    dev_experiente: "Dev Experiente",
    dev_aprendiz: "Dev Aprendiz",
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegistered({
        id: Math.floor(Math.random() * 1000),
        nome: nome || "Sem Nome",
        email, role, ilha_id: 1, avatar_url: null,
      });
    }, 400);
  };

  return (
    <div className="auth-shell">
      <div className="glass glass-xl auth-card">
        <h2>Cadastrar</h2>
        <p className="subtitle">Escolha sua função e a ilha em que vai trabalhar.</p>
        <form onSubmit={submit}>
          <Field label="Nome">
            <input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
          <Field label="E-mail">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Senha (mínimo 6)">
            <input type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} />
          </Field>
          <Field label="Função">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {Object.keys(ROLE_LABEL).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </Field>
          <Field label="Ilha">
            <select value={ilha} onChange={(e) => setIlha(e.target.value)}>
              <option value="">— Sem ilha —</option>
              <option value="bruna">Bruna</option>
              <option value="design">Ilha Design</option>
              <option value="dev_a">Ilha Dev A</option>
              <option value="dev_b">Ilha Dev B</option>
              <option value="integracao">Integração</option>
            </select>
          </Field>
          <Button variant="primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Cadastrando…" : "Criar conta"}
          </Button>
        </form>
        <div className="switch">
          Já tem conta? <a href="#" onClick={(e) => { e.preventDefault(); onGoToLogin(); }}>Entrar</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen, RegisterScreen });
