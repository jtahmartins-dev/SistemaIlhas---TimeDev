"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/types";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <>
      <div className="brand">
        <span className="brand-dot" />
        Sistema de Ilhas
      </div>
      <div className="user-corner">
        <div className="who">
          <strong>{user.nome.split(" ")[0]}</strong>
          <span>{ROLE_LABEL[user.role]}</span>
        </div>
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Sair
        </button>
      </div>
    </>
  );
}
