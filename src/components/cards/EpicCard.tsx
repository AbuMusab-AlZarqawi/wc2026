"use client";
import { motion } from "framer-motion";
import { Player, AVATARS } from "@/data/players";

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#E5E7EB" }}>{value}</div>
      <div style={{ fontSize: 7, color: "#6B7280", fontWeight: 700, letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

interface EpicCardProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
}

export default function EpicCard({ player, size = "md", onClick, selected }: EpicCardProps) {
  const sizes = { sm: { w: 130, h: 190 }, md: { w: 175, h: 255 }, lg: { w: 220, h: 320 } };
  const { w, h } = sizes[size];
  const fs = size === "sm" ? 0.7 : size === "lg" ? 1.25 : 1;
  const avatarSrc = AVATARS[player.key] || "/avatars/placeholder.png";

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: w, height: h, borderRadius: 12, cursor: onClick ? "pointer" : "default",
        position: "relative", flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(145deg, #0e1421 0%, #161e2e 100%)",
        border: selected ? "2px solid #fff" : "1px solid #ffffff18",
        boxShadow: selected
          ? "0 0 0 3px #6366F1, 0 0 30px #6366F155"
          : "0 4px 20px #0005",
      }}
    >
      {/* Top strip */}
      <div style={{
        padding: `${3 * fs}px ${8 * fs}px`,
        background: "linear-gradient(90deg, #6366F122, transparent)",
        borderBottom: "1px solid #ffffff0f",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 8 * fs, fontWeight: 900, color: "#818CF8", letterSpacing: 2 }}>◆ EPIC</span>
        <span style={{ fontSize: 8 * fs, color: "#4B5563", fontWeight: 700 }}>WC2026</span>
      </div>

      {/* Avatar area */}
      <div style={{
        position: "relative",
        height: h * 0.46,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0d1117, #0e1421)",
      }}>
        <img
          src={avatarSrc}
          alt={player.name}
          style={{
            width: "75%", height: "90%", objectFit: "cover",
            borderRadius: 8,
            opacity: 0.92,
          }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
          background: "linear-gradient(to top, #0e1421, transparent)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Name + rating */}
      <div style={{
        padding: `${5 * fs}px ${8 * fs}px`,
        borderTop: "1px solid #ffffff0a",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 12 * fs, color: "#E5E7EB",
            letterSpacing: 0.5,
          }}>{player.name.toUpperCase()}</span>
          <span style={{
            fontSize: 16 * fs, fontWeight: 900,
            color: "#6366F1",
          }}>{player.rating}</span>
        </div>
        {size !== "sm" && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
            gap: 2, borderTop: "1px solid #ffffff0a", paddingTop: 6,
          }}>
            <MiniStat label="PAC" value={player.pac} />
            <MiniStat label="SHO" value={player.sho} />
            <MiniStat label="PAS" value={player.pas} />
            <MiniStat label="DRI" value={player.dri} />
            <MiniStat label="DEF" value={player.def} />
            <MiniStat label="PHY" value={player.phy} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
