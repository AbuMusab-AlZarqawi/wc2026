"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";

const ATMOSPHERE_LINES = [
  "The stadium falls silent…",
  "80,000 fans hold their breath…",
  "Two squads. One battlefield.",
  "The referee raises the whistle…",
];

export default function AtmosphereScreen() {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<"atmosphere" | "reveal">("atmosphere");
  const [lineIndex, setLineIndex] = useState(0);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [revealDone, setRevealDone] = useState(false);

  // Cycle atmosphere lines
  useEffect(() => {
    if (phase !== "atmosphere") return;
    if (lineIndex < ATMOSPHERE_LINES.length - 1) {
      const t = setTimeout(() => setLineIndex(i => i + 1), 1200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("reveal"), 1400);
      return () => clearTimeout(t);
    }
  }, [lineIndex, phase]);

  // Flip opponent cards one by one
  useEffect(() => {
    if (phase !== "reveal") return;
    const total = state.opponentSquad.length;
    if (revealedCards.length >= total) {
      const t = setTimeout(() => setRevealDone(true), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setRevealedCards(prev => [...prev, prev.length]);
    }, 320);
    return () => clearTimeout(t);
  }, [phase, revealedCards, state.opponentSquad.length]);

  const handleContinue = () => {
    dispatch({ type: "SET_SCREEN", screen: "commentary" });
  };

  const oppNation = state.opponentNation;
  const oppFormation = state.opponentFormation;

  return (
    <div style={{
      minHeight: "100vh", background: "#020408",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Stadium lights effect */}
      <div style={{ position: "absolute", top: 0, left: "20%", width: 2, height: "40%",
        background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)", transform: "rotate(-15deg)" }} />
      <div style={{ position: "absolute", top: 0, right: "20%", width: 2, height: "40%",
        background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)", transform: "rotate(15deg)" }} />

      <AnimatePresence mode="wait">
        {phase === "atmosphere" && (
          <motion.div
            key="atm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "0 24px" }}
          >
            <motion.div
              style={{ fontSize: 72, marginBottom: 32 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >🏟️</motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="font-anton"
                style={{ fontSize: "clamp(28px, 5vw, 52px)", color: "#fff", letterSpacing: 1 }}
              >
                {ATMOSPHERE_LINES[lineIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
              {ATMOSPHERE_LINES.map((_, i) => (
                <div key={i} style={{
                  width: i === lineIndex ? 24 : 8, height: 8, borderRadius: 4,
                  background: i <= lineIndex ? "#EF4444" : "rgba(255,255,255,0.15)",
                  transition: "all 0.4s",
                }} />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: "100%", maxWidth: 900, padding: "0 20px", textAlign: "center" }}
          >
            {/* VS header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 32 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36 }}>{state.userNation?.flag}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{state.userName}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{state.formation.name}</div>
                </div>
                <div className="font-anton" style={{ fontSize: 48, color: "#EF4444" }}>VS</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 36 }}>{oppNation?.flag || "🤖"}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>AI Team</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{oppFormation?.name}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#6B7280" }}>Opponent squad revealed</div>
            </motion.div>

            {/* Opponent cards flipping in */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
              marginBottom: 32,
            }}>
              {state.opponentSquad.map((player, i) => (
                <AnimatePresence key={player.id}>
                  {revealedCards.includes(i) && (
                    <motion.div
                      initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
                      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      style={{
                        width: 64, padding: "8px 10px", borderRadius: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={`/avatars/${player.key}.png`}
                        alt={player.name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", marginBottom: 4 }}
                      />
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#E5E7EB", lineHeight: 1.2 }}>
                        {player.name}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 900, color:
                        player.tier === "ultra" ? "#F59E0B"
                        : player.tier === "legendary" ? "#8B5CF6"
                        : "#6366F1"
                      }}>{player.rating}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* Continue button */}
            <AnimatePresence>
              {revealDone && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  style={{
                    padding: "16px 48px", borderRadius: 50,
                    background: "linear-gradient(90deg, #EF4444, #B91C1C)",
                    border: "none", color: "#fff", fontSize: 18,
                    fontFamily: "'Anton', sans-serif", letterSpacing: 2,
                    cursor: "pointer",
                    boxShadow: "0 0 40px rgba(239,68,68,0.5)",
                  }}
                >
                  START THE MATCH ⚽
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
