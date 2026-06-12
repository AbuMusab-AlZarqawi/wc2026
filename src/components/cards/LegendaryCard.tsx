"use client";
import { motion } from "framer-motion";
import { Player, AVATARS } from "@/data/players";

const LEGEND_ACCENTS = [
  { b1: "#C0A060", b2: "#FFE89A", bg: "#0f0900", acc: "#D4AF37" },
  { b1: "#7B68EE", b2: "#C3B1E1", bg: "#08061a", acc: "#9B89FF" },
  { b1: "#40E0D0", b2: "#A0F5EE", bg: "#001a18", acc: "#5EFAF0" },
  { b1: "#FF8C00", b2: "#FFD580", bg: "#120500", acc: "#FFA040" },
  { b1: "#DC143C", b2: "#FF8080", bg: "#140004", acc: "#FF4060" },
  { b1: "#00C957", b2: "#80FFAA", bg: "#001408", acc: "#30FF70" },
];

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{ marginBottom: 3 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: "#888", letterSpacing: 1 }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 900, color: accent }}>{value}</span>
      </div>
      <div style={{ height: 2.5, background: "#ffffff12", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ height: "100%", background: accent, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}

interface LegendaryCardProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
}

export default function LegendaryCard({ player, size = "md", onClick, selected }: LegendaryCardProps) {
  const sizes = { sm: { w: 130, h: 190 }, md: { w: 175, h: 255 }, lg: { w: 220, h: 320 } };
  const { w, h } = sizes[size];
  const fs = size === "sm" ? 0.7 : size === "lg" ? 1.25 : 1;

  // Deterministically pick an accent theme per player
  const theme = LEGEND_ACCENTS[parseInt(player.id.replace(/\D/g, ""), 10) % LEGEND_ACCENTS.length];
  const avatarSrc = AVATARS[player.key] || "/avatars/placeholder.png";

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: w, height: h, borderRadius: 14, cursor: onClick ? "pointer" : "default",
        position: "relative", flexShrink: 0, overflow: "hidden",
        background: `linear-gradient(145deg, ${theme.bg} 0%, #0d0d0d 100%)`,
        border: selected ? `2px solid #fff` : `1px solid ${theme.b1}55`,
        boxShadow: selected
          ? `0 0 0 3px ${theme.b1}, 0 0 40px ${theme.b1}55`
          : `0 4px 24px #0006, 0 0 20px ${theme.b1}22`,
      }}
    >
      {/* Holographic diagonal sheen */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(125deg, transparent 30%, ${theme.b1}18 50%, transparent 70%)`,
        animation: "holoSheen 3s ease-in-out infinite alternate",
      }} />
      <style>{`
        @keyframes holoSheen {
          0%   { background-position: 0% 50%; opacity: 0.4; }
          100% { background-position: 100% 50%; opacity: 0.9; }
        }
      `}</style>

      {/* Top badge */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: `${3 * fs}px ${8 * fs}px`,
        background: `linear-gradient(90deg, ${theme.b1}33, transparent)`,
        borderBottom: `1px solid ${theme.b1}33`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 8 * fs, fontWeight: 900, color: theme.acc, letterSpacing: 2, textTransform: "uppercase" }}>
          ⬟ LEGENDARY
        </span>
        <span style={{ fontSize: 8 * fs, color: theme.b2, fontWeight: 700 }}>WC2026</span>
      </div>

      {/* Avatar */}
      <div style={{
        position: "relative", zIndex: 2, flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        height: h * 0.48,
        overflow: "hidden",
      }}>
        <img
          src={avatarSrc}
          alt={player.name}
          style={{
            width: "80%", height: "100%", objectFit: "cover",
            borderRadius: 8,
            filter: `drop-shadow(0 0 8px ${theme.b1}66)`,
          }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: `linear-gradient(to top, ${theme.bg}, transparent)`,
          pointerEvents: "none",
        }} />
      </div>

      {/* Name + stats */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: `${5 * fs}px ${8 * fs}px`,
        background: `${theme.bg}ee`,
        borderTop: `1px solid ${theme.b1}33`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
          <span style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 13 * fs, color: "#fff",
            textShadow: `0 0 10px ${theme.acc}`,
            letterSpacing: 0.5,
          }}>{player.name.toUpperCase()}</span>
          <div style={{
            background: `linear-gradient(135deg, ${theme.b1}, ${theme.b2})`,
            borderRadius: 6, padding: `${1 * fs}px ${5 * fs}px`,
          }}>
            <span style={{ fontSize: 14 * fs, fontWeight: 900, color: "#000" }}>{player.rating}</span>
          </div>
        </div>
        {size !== "sm" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
            <StatBar label="PAC" value={player.pac} accent={theme.acc} />
            <StatBar label="SHO" value={player.sho} accent={theme.acc} />
            <StatBar label="PAS" value={player.pas} accent={theme.acc} />
            <StatBar label="DRI" value={player.dri} accent={theme.acc} />
            <StatBar label="DEF" value={player.def} accent={theme.acc} />
            <StatBar label="PHY" value={player.phy} accent={theme.acc} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
