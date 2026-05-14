"use client";

import type { IlhaSlug } from "@/lib/types";

const TINTS: Record<IlhaSlug, { glow: string; sand: string; rock: string; leaf: string }> = {
  bruna: {
    glow: "#b685ff",
    sand: "#f1d2a8",
    rock: "#5a4980",
    leaf: "#7ac96a",
  },
  design: {
    glow: "#4ee0a8",
    sand: "#f0e1b8",
    rock: "#2f5e58",
    leaf: "#46d99a",
  },
  dev_a: {
    glow: "#5bb0ff",
    sand: "#e8d6a8",
    rock: "#2a4970",
    leaf: "#5fc77a",
  },
  dev_b: {
    glow: "#a08bff",
    sand: "#e8d6a8",
    rock: "#3a3a78",
    leaf: "#5fc77a",
  },
  integracao: {
    glow: "#ffcf66",
    sand: "#f4dba0",
    rock: "#6b4a2a",
    leaf: "#88d770",
  },
};

interface Props {
  slug: IlhaSlug;
}

export default function IslandSvg({ slug }: Props) {
  const t = TINTS[slug];
  const id = `isl-${slug}`;

  return (
    <svg
      viewBox="0 0 200 170"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor={t.glow} stopOpacity="0.85" />
          <stop offset="60%" stopColor={t.glow} stopOpacity="0.18" />
          <stop offset="100%" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.sand} />
          <stop offset="100%" stopColor="#c79a5a" />
        </linearGradient>

        <linearGradient id={`${id}-rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.rock} stopOpacity="1" />
          <stop offset="100%" stopColor={t.rock} stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id={`${id}-trunk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4b2f17" />
          <stop offset="50%" stopColor="#7a4d24" />
          <stop offset="100%" stopColor="#4b2f17" />
        </linearGradient>

        <radialGradient id={`${id}-leaf`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={t.leaf} />
          <stop offset="100%" stopColor="#2a6e3e" />
        </radialGradient>
      </defs>

      {/* Aurora glow underneath the island */}
      <ellipse cx="100" cy="135" rx="95" ry="32" fill={`url(#${id}-glow)`} />

      {/* Rocky underbelly that tapers off */}
      <path
        d="M 50 85
           Q 40 100 55 115
           Q 50 130 65 138
           Q 75 150 90 152
           Q 100 155 110 152
           Q 125 150 138 138
           Q 152 128 148 115
           Q 162 102 152 88
           Q 130 102 100 102
           Q 70 102 50 85 Z"
        fill={`url(#${id}-rock)`}
      />

      {/* Sandy / grassy top mound */}
      <ellipse cx="100" cy="86" rx="56" ry="14" fill={`url(#${id}-sand)`} />
      <ellipse cx="100" cy="83" rx="56" ry="10" fill={t.sand} opacity="0.4" />

      {/* Subtle horizon highlight on sand */}
      <ellipse cx="100" cy="80" rx="48" ry="3" fill="#fff" opacity="0.25" />

      {/* Palm trunk */}
      <path
        d="M 102 86 Q 96 60 88 38"
        stroke={`url(#${id}-trunk)`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Palm leaves — 5 leaves radiating from top of trunk */}
      <g transform="translate(88 38)">
        <ellipse cx="-22" cy="2" rx="24" ry="6" fill={`url(#${id}-leaf)`} transform="rotate(-18)" />
        <ellipse cx="22"  cy="2" rx="24" ry="6" fill={`url(#${id}-leaf)`} transform="rotate(18)" />
        <ellipse cx="-18" cy="-12" rx="26" ry="6" fill={`url(#${id}-leaf)`} transform="rotate(-50)" />
        <ellipse cx="18"  cy="-12" rx="26" ry="6" fill={`url(#${id}-leaf)`} transform="rotate(50)" />
        <ellipse cx="0"   cy="-22" rx="6" ry="22" fill={`url(#${id}-leaf)`} />
      </g>

      {/* Tiny coconuts */}
      <circle cx="86" cy="40" r="3" fill="#5a3a1f" />
      <circle cx="92" cy="42" r="2.5" fill="#5a3a1f" />
    </svg>
  );
}
