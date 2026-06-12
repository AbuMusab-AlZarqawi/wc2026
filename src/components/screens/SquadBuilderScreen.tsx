"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";
import { FORMATIONS, ALL_PLAYERS, Player } from "@/data/players";
import PlayerCard from "@/components/cards/PlayerCard";

export default function SquadBuilderScreen() {
  const { state, dispatch, sounds } = useGame();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "ultra" | "legendary" | "epic">("all");

  const filledCount = state.squad.filter(s => s.player !== null).length;
  const allFilled = filledCount === 11;

  const usedIds = new Set(state.squad.filter(s => s.player).map(s => s.player!.id));

  const filteredPool = ALL_PLAYERS.filter(p => {
    if (usedIds.has(p.id)) return false;
    if (tierFilter !== "all" && p.tier !== tierFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSlotClick = (idx: number) => {
    if (state.squad[idx].player) {
      // Remove player from slot
      dispatch({ type: "REMOVE_PLAYER", slotIndex: idx });
      return;
    }
    setActiveSlot(activeSlot === idx ? null : idx);
  };

  const handlePickPlayer = (player: Player) => {
    if (activeSlot === null) return;
    sounds.playFlip();
    dispatch({ type: "PLACE_PLAYER", slotIndex: activeSlot, player });
    setActiveSlot(null);
  };

  const handleBegin = () => {
    if (!allFilled) return;
    dispatch({ type: "SET_OPPONENT" });
    dispatch({ type: "SET_SCREEN", screen: "atmosphere" });
  };

  // Field dimensions
  const FIELD_W = 320;
  const FIELD_H = 480;

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", color: "#fff", padding: "20px 16px", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, maxWidth: 1100, margin: "0 auto 20px" }}>
        <button
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "setup" })}
          style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >← Back</button>
        <div style={{ textAlign: "center" }}>
          <h1 className="font-anton" style={{ fontSize: 28, margin: 0 }}>SQUAD <span style={{ color: "#EF4444" }}>BUILDER</span></h1>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            {state.userNation?.flag} {state.userName} · {filledCount}/11 players
          </div>
        </div>
        <motion.button
          whileHover={{ scale: allFilled ? 1.04 : 1 }}
          whileTap={{ scale: allFilled ? 0.97 : 1 }}
          onClick={handleBegin}
          style={{
            padding: "10px 24px", borderRadius: 24,
            background: allFilled ? "linear-gradient(90deg,#EF4444,#B91C1C)" : "rgba(255,255,255,0.08)",
            border: "none", color: allFilled ? "#fff" : "#4B5563",
            fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: 1,
            cursor: allFilled ? "pointer" : "not-allowed",
            boxShadow: allFilled ? "0 0 20px rgba(239,68,68,0.4)" : "none",
            transition: "all 0.3s",
          }}
        >
          {allFilled ? "BEGIN ⚽" : `${filledCount}/11`}
        </motion.button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>

        {/* Left: Formation + Field */}
        <div style={{ flex: "0 0 auto" }}>
          {/* Formation picker */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Formation</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FORMATIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => dispatch({ type: "SET_FORMATION", formation: f })}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: state.formation.id === f.id
                      ? "linear-gradient(90deg,#EF4444,#B91C1C)"
                      : "rgba(255,255,255,0.07)",
                    color: state.formation.id === f.id ? "#fff" : "#9CA3AF",
                    fontSize: 13, fontWeight: 700,
                    boxShadow: state.formation.id === f.id ? "0 0 12px rgba(239,68,68,0.4)" : "none",
                  }}
                >{f.name}</button>
              ))}
            </div>
          </div>

          {/* Pitch */}
          <div style={{
            width: FIELD_W, height: FIELD_H, position: "relative", borderRadius: 16, overflow: "hidden",
            background: "linear-gradient(to bottom, #1a3a1a, #0f2a0f)",
            border: "2px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.4)",
          }}>
            {/* Pitch markings */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
              {/* Stripes */}
              {[0,1,2,3,4,5,6,7].map(i => (
                <rect key={i} x={0} y={i*60} width="100%" height={30} fill="rgba(255,255,255,0.03)" />
              ))}
              {/* Center circle */}
              <circle cx="50%" cy="50%" r="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <circle cx="50%" cy="50%" r="3" fill="rgba(255,255,255,0.7)" />
              {/* Center line */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              {/* Penalty boxes */}
              <rect x="25%" y="78%" width="50%" height="20%" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <rect x="25%" y="2%" width="50%" height="20%" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              {/* Outer border */}
              <rect x="4%" y="1%" width="92%" height="98%" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            </svg>

            {/* Player slots */}
            {state.squad.map((slot, idx) => {
              const px = (slot.x / 100) * FIELD_W;
              const py = (slot.y / 100) * FIELD_H;
              const isActive = activeSlot === idx;
              const hasPlayer = !!slot.player;

              return (
                <motion.div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: px, top: py,
                    transform: "translate(-50%,-50%)",
                    zIndex: isActive ? 10 : 2,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotClick(idx)}
                    style={{
                      width: hasPlayer ? 44 : 40,
                      height: hasPlayer ? 44 : 40,
                      borderRadius: "50%",
                      cursor: "pointer",
                      position: "relative",
                      overflow: hasPlayer ? "visible" : "hidden",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {hasPlayer ? (
                      <>
                        {/* Pulse ring for active */}
                        {isActive && (
                          <div style={{
                            position: "absolute", inset: -4, borderRadius: "50%",
                            border: "2px solid #fff", animation: "pulseRing 1s ease-out infinite",
                          }} />
                        )}
                        <img
                          src={`/avatars/${slot.player!.key}.png`}
                          alt={slot.player!.name}
                          style={{
                            width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                            border: `2px solid ${
                              slot.player!.tier === "ultra" ? "#F59E0B"
                              : slot.player!.tier === "legendary" ? "#8B5CF6"
                              : "#6366F1"
                            }`,
                            boxShadow: `0 0 10px ${
                              slot.player!.tier === "ultra" ? "#F59E0B88"
                              : slot.player!.tier === "legendary" ? "#8B5CF688"
                              : "#6366F155"
                            }`,
                          }}
                        />
                        {/* Remove hint */}
                        <div style={{
                          position: "absolute", inset: 0, borderRadius: "50%",
                          background: "rgba(239,68,68,0)", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, color: "transparent", transition: "all 0.2s",
                        }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.background = "rgba(239,68,68,0.7)";
                            (e.currentTarget as HTMLDivElement).style.color = "#fff";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.background = "rgba(239,68,68,0)";
                            (e.currentTarget as HTMLDivElement).style.color = "transparent";
                          }}
                        >✕</div>
                        {/* Name tag */}
                        <div style={{
                          position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                          marginTop: 3, whiteSpace: "nowrap",
                          background: "rgba(0,0,0,0.85)", borderRadius: 4,
                          padding: "1px 5px", fontSize: 9, fontWeight: 700, color: "#E5E7EB",
                        }}>{slot.player!.name}</div>
                      </>
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: isActive
                          ? "rgba(239,68,68,0.3)"
                          : "rgba(255,255,255,0.08)",
                        border: isActive
                          ? "2px solid #EF4444"
                          : "2px dashed rgba(255,255,255,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexDirection: "column", gap: 1,
                      }}>
                        <span style={{ fontSize: isActive ? 14 : 12, color: isActive ? "#EF4444" : "#4B5563" }}>
                          {isActive ? "+" : "+"}
                        </span>
                        <span style={{ fontSize: 7, color: isActive ? "#EF4444" : "#374151", fontWeight: 700, letterSpacing: 0.5 }}>
                          {slot.role}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Nation badge */}
          {state.userNation && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>{state.userNation.flag}</span>
              <span style={{ fontWeight: 700, color: "#E5E7EB", fontSize: 14 }}>{state.userNation.name}</span>
            </div>
          )}
        </div>

        {/* Right: Player pool */}
        <div style={{ flex: "1 1 340px", minWidth: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
            {activeSlot !== null
              ? `Pick player for ${state.squad[activeSlot].role} slot`
              : "Player Pool — click a slot on the pitch first"}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {(["all","ultra","legendary","epic"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                style={{
                  padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
                  background: tierFilter === t
                    ? t === "ultra" ? "#F59E0B"
                    : t === "legendary" ? "#8B5CF6"
                    : t === "epic" ? "#6366F1"
                    : "#EF4444"
                    : "rgba(255,255,255,0.07)",
                  color: tierFilter === t ? "#000" : "#9CA3AF",
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                }}
              >{t}</button>
            ))}
          </div>

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search players..."
            style={{
              width: "100%", padding: "9px 14px", borderRadius: 10, marginBottom: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff", fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif",
            }}
          />

          {activeSlot === null && (
            <div style={{
              padding: "20px", borderRadius: 12, marginBottom: 12,
              background: "rgba(239,68,68,0.06)", border: "1px dashed rgba(239,68,68,0.25)",
              textAlign: "center", fontSize: 13, color: "#6B7280",
            }}>
              👆 Tap an empty slot on the pitch to assign a player
            </div>
          )}

          {/* Card grid */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10,
            maxHeight: 520, overflowY: "auto", paddingRight: 4,
            opacity: activeSlot === null ? 0.5 : 1,
            transition: "opacity 0.3s",
            pointerEvents: activeSlot === null ? "none" : "auto",
          }}>
            <AnimatePresence>
              {filteredPool.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.02 }}
                  className="card-flip-in"
                >
                  <PlayerCard
                    player={player}
                    size="sm"
                    onClick={() => handlePickPlayer(player)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
