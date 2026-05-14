"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/lib/auth";
import { ROLE_LABEL, type Role } from "@/lib/types";

const ROLES: Role[] = [
  "bruna",
  "lider_design",
  "designer",
  "dev_experiente",
  "dev_aprendiz",
];

const ILHAS = [
  { slug: "", nome: "— Sem ilha —" },
  { slug: "bruna", nome: "Bruna" },
  { slug: "design", nome: "Ilha Design" },
  { slug: "dev_a", nome: "Ilha Dev A" },
  { slug: "dev_b", nome: "Ilha Dev B" },
  { slug: "integracao", nome: "Integração" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<Role>("designer");
  const [ilhaSlug, setIlhaSlug] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await register({
        nome,
        email,
        senha,
        role,
        ilha_slug: ilhaSlug || null,
      });
      router.replace("/dashboard");
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="glass-strong auth-card">
        <h2>Cadastrar</h2>
        <p className="subtitle">Escolha sua função e a ilha em que vai trabalhar.</p>

        {erro && <div className="error-msg">{erro}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Nome</label>
            <input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Senha (mínimo 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Função</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Ilha</label>
            <select value={ilhaSlug} onChange={(e) => setIlhaSlug(e.target.value)}>
              {ILHAS.map((i) => (
                <option key={i.slug || "none"} value={i.slug}>
                  {i.nome}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Cadastrando…" : "Criar conta"}
          </button>
        </form>

        <div className="switch">
          Já tem conta? <Link href="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
