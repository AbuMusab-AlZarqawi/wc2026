"use client";
import { motion } from "framer-motion";
import { Player, AVATARS } from "@/data/players";

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#aaa", letterSpacing: 1 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 900, color: accent }}>{value}</span>
      </div>
      <div style={{ height: 3, background: "#ffffff15", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 100) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: accent, borderRadius: 2, boxShadow: `0 0 6px ${accent}` }}
        />
      </div>
    </div>
  );
}

interface UltraCardProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
}

export default function UltraCard({ player, size = "md", onClick, selected }: UltraCardProps) {
  const sizes = { sm: { w: 130, h: 190 }, md: { w: 175, h: 255 }, lg: { w: 220, h: 320 } };
  const { w, h } = sizes[size];
  const fontSize = size === "sm" ? 0.7 : size === "lg" ? 1.25 : 1;

  const avatarSrc = AVATARS[player.key] || "/avatars/placeholder.png";
  const accent = player.acc || player.glow || "#FFD700";
  const bg1 = player.bg1 || "#1a1200";
  const bg2 = player.bg2 || "#2d1f00";
  const b1 = player.b1 || "#FFD700";
  const b2 = player.b2 || "#FFF8C0";
  const b3 = player.b3 || "#B8860B";

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: w, height: h, borderRadius: 16, cursor: onClick ? "pointer" : "default",
        position: "relative", flexShrink: 0,
        background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)`,
        border: selected ? `2px solid #fff` : `1px solid ${b1}66`,
        boxShadow: selected
          ? `0 0 0 3px ${b1}, 0 0 40px ${b1}66`
          : `0 0 30px ${b1}33, 0 8px 32px #0008`,
      }}
    >
      {/* Animated border ring */}
      <div style={{
        position: "absolute", inset: -2, borderRadius: 18, zIndex: 0,
        background: `conic-gradient(from 0deg, ${b1}, ${b2}, ${b3}, ${b1})`,
        animation: "spin 4s linear infinite",
        opacity: 0.6,
        maskImage: "radial-gradient(transparent 85%, black 100%)",
        WebkitMaskImage: "radial-gradient(transparent 85%, black 100%)",
      }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Inner card */}
      <div style={{
        position: "absolute", inset: 2, borderRadius: 14, overflow: "hidden",
        background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)`,
        display: "flex", flexDirection: "column",
      }}>
        {/* Element strip */}
        <div style={{
          padding: `${4 * fontSize}px ${8 * fontSize}px`,
          background: `${b1}22`,
          borderBottom: `1px solid ${b1}33`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 9 * fontSize, fontWeight: 900, color: accent, letterSpacing: 2 }}>
            {player.element}
          </span>
          <span style={{ fontSize: 9 * fontSize, color: b2, fontWeight: 700 }}>
            {player.sym}
          </span>
        </div>

        {/* Avatar */}
        <div style={{
          flex: 1, position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src={avatarSrc}
            alt={player.name}
            style={{
              width: "85%", height: "85%", objectFit: "cover",
              borderRadius: 8,
              filter: `drop-shadow(0 0 12px ${b1}88)`,
            }}
          />
          {/* Glow overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 80%, ${b1}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
        </div>

        {/* Name + rating */}
        <div style={{
          padding: `${4 * fontSize}px ${8 * fontSize}px`,
          borderTop: `1px solid ${b1}33`,
          background: `${bg1}cc`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 14 * fontSize, color: "#fff",
              textShadow: `0 0 12px ${accent}`,
              letterSpacing: 1,
            }}>{player.name.toUpperCase()}</span>
            <span style={{ fontSize: 18 * fontSize, fontWeight: 900, color: accent }}>{player.rating}</span>
          </div>
          {size !== "sm" && (
            <div>
              <StatBar label="PAC" value={player.pac} accent={accent} />
              <StatBar label="SHO" value={player.sho} accent={accent} />
              <StatBar label="PAS" value={player.pas} accent={accent} />
              <StatBar label="DRI" value={player.dri} accent={accent} />
              <StatBar label="DEF" value={player.def} accent={accent} />
              <StatBar label="PHY" value={player.phy} accent={accent} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
