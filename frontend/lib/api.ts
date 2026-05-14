const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getApiUrl(path: string) {
  return `${API_URL}${path}`;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean; raw?: boolean } = { auth: true }
): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };

  if (!(init.body instanceof FormData) && init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

import type {
  Anexo,
  DemandaDetalhe,
  DemandaResumo,
  Ilha,
  LoginResponse,
  UserPublic,
} from "./types";

export const api = {
  register: (body: {
    nome: string;
    email: string;
    senha: string;
    role: string;
    ilha_slug?: string | null;
  }) =>
    request<LoginResponse>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(body) },
      { auth: false }
    ),

  login: (email: string, senha: string) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", senha);
    return request<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: form,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      { auth: false }
    );
  },

  me: () => request<UserPublic>("/auth/me"),

  listUsers: () => request<UserPublic[]>("/users"),

  updateMe: (body: { nome?: string; ilha_slug?: string | null; avatar_url?: string }) =>
    request<UserPublic>("/users/me", { method: "PATCH", body: JSON.stringify(body) }),

  listIlhas: () => request<Ilha[]>("/ilhas"),

  listDemandas: () => request<DemandaResumo[]>("/demandas"),

  getDemanda: (id: number) => request<DemandaDetalhe>(`/demandas/${id}`),

  createDemanda: (titulo: string, descricao: string) =>
    request<DemandaDetalhe>("/demandas", {
      method: "POST",
      body: JSON.stringify({ titulo, descricao }),
    }),

  deleteDemanda: (id: number) =>
    request<void>(`/demandas/${id}`, { method: "DELETE" }),

  checkIn: (demandaId: number, slug: string, observacoes: string) =>
    request<DemandaDetalhe>(
      `/demandas/${demandaId}/etapas/${slug}/check-in`,
      { method: "POST", body: JSON.stringify({ observacoes }) }
    ),

  uploadArquivo: (demandaId: number, file: File, etapaId: number | null) => {
    const fd = new FormData();
    fd.append("arquivo", file);
    if (etapaId != null) fd.append("etapa_id", String(etapaId));
    return request<Anexo>(`/demandas/${demandaId}/anexos/arquivo`, {
      method: "POST",
      body: fd,
    });
  },

  addLink: (demandaId: number, url: string, nome: string, etapaId: number | null) =>
    request<Anexo>(`/demandas/${demandaId}/anexos/link`, {
      method: "POST",
      body: JSON.stringify({ url, nome, etapa_id: etapaId }),
    }),

  listAnexos: (demandaId: number) =>
    request<Anexo[]>(`/demandas/${demandaId}/anexos`),
};
