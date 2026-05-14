export type Role =
  | "bruna"
  | "lider_design"
  | "designer"
  | "dev_experiente"
  | "dev_aprendiz";

export type EtapaStatus = "pendente" | "ativa" | "concluida";

export type IlhaSlug = "bruna" | "design" | "dev_a" | "dev_b" | "integracao";

export interface UserPublic {
  id: number;
  nome: string;
  email: string;
  role: Role;
  ilha_id: number | null;
  avatar_url: string | null;
}

export interface Ilha {
  id: number;
  slug: IlhaSlug;
  nome: string;
  descricao: string;
  ordem: number;
  membros: UserPublic[];
}

export interface Etapa {
  id: number;
  ilha_slug: IlhaSlug;
  status: EtapaStatus;
  iniciada_em: string | null;
  concluida_em: string | null;
  observacoes: string;
}

export interface Anexo {
  id: number;
  etapa_id: number | null;
  tipo: "arquivo" | "link";
  caminho_ou_url: string;
  nome_original: string;
  enviado_por_id: number;
  enviado_em: string;
}

export interface DemandaResumo {
  id: number;
  titulo: string;
  status_atual: string;
  criado_em: string;
  criado_por_id: number;
}

export interface DemandaDetalhe extends DemandaResumo {
  descricao: string;
  etapas: Etapa[];
  anexos: Anexo[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserPublic;
}

export const ROLE_LABEL: Record<Role, string> = {
  bruna: "Bruna",
  lider_design: "Líder de Design",
  designer: "Designer",
  dev_experiente: "Dev Experiente",
  dev_aprendiz: "Dev Aprendiz",
};

export const ILHA_ORDEM: IlhaSlug[] = ["bruna", "design", "dev_a", "dev_b", "integracao"];
