"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";
import { MatchResult } from "@/components/GameProvider";

const COMMENTARY_TEASERS = [
  "Whistle blown. Match underway…",
  "Both teams pressing high…",
  "The crowd is electric…",
  "Chances being created…",
  "Drama building…",
  "AI computing final result…",
];

export default function CommentaryScreen() {
  const { state, dispatch, sounds } = useGame();
  const [teaserIndex, setTeaserIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Cycle teasers while fetching
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setTeaserIndex(i => (i + 1) % COMMENTARY_TEASERS.length);
    }, 1100);
    return () => clearInterval(t);
  }, [done]);

  // Trigger Groq simulation
  useEffect(() => {
    const players = state.squad.map(s => s.player?.name || "Unknown");
    const teamName = `${state.userName}'s ${state.userNation?.name || "Team"}`;

    dispatch({ type: "SET_SIMULATING", value: true });

    fetch("/api/simulate-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamName,
        players,
        formation: state.formation.name,
      }),
    })
      .then(r => r.json())
      .then((result: MatchResult) => {
        dispatch({ type: "SET_MATCH_RESULT", result });
        setDone(true);
        // Play win/lose sound
        const userWon = result.winner === teamName;
        if (userWon) sounds.playWin();
        else sounds.playLose();
        // Navigate to result after brief pause
        setTimeout(() => dispatch({ type: "SET_SCREEN", screen: "result" }), 1200);
      })
      .catch(err => {
        console.error(err);
        setError("Match simulation failed. Check your Groq API key.");
        dispatch({ type: "SET_SIMULATING", value: false });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#020408",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "40px 24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Animated background lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          style={{
            position: "absolute", left: 0, right: 0,
            height: 1, background: "rgba(239,68,68,0.15)",
            top: `${10 + i * 15}%`,
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
        />
      ))}

      {/* Pulsing ball */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
        transition={{ scale: { duration: 1.2, repeat: Infinity }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
        style={{ fontSize: 72, marginBottom: 40, position: "relative", zIndex: 2 }}
      >⚽</motion.div>

      {/* Live score animation */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 32, position: "relative", zIndex: 2,
      }}>
        <div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>{state.userNation?.flag} {state.userName}</div>
          <motion.div
            animate={{ color: ["#fff", "#EF4444", "#fff"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-anton"
            style={{ fontSize: 52 }}
          >?</motion.div>
        </div>
        <div className="font-anton" style={{ fontSize: 36, color: "#374151" }}>—</div>
        <div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>🤖 AI Team</div>
          <motion.div
            animate={{ color: ["#fff", "#6B7280", "#fff"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="font-anton"
            style={{ fontSize: 52 }}
          >?</motion.div>
        </div>
      </div>

      {/* Teaser text */}
      <div style={{ position: "relative", zIndex: 2, height: 40 }}>
        {!error ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={teaserIndex}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ fontSize: 18, color: "#9CA3AF", fontStyle: "italic", margin: 0 }}
            >
              {COMMENTARY_TEASERS[teaserIndex]}
            </motion.p>
          </AnimatePresence>
        ) : (
          <div style={{ color: "#F87171", fontSize: 15, fontWeight: 600 }}>{error}</div>
        )}
      </div>

      {error && (
        <button
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "squad" })}
          style={{
            marginTop: 24, padding: "12px 32px", borderRadius: 24,
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
            color: "#F87171", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >← Back to Squad</button>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginTop: 24, fontSize: 16, color: "#34D399", fontWeight: 700, position: "relative", zIndex: 2 }}
        >
          ✓ Match complete — loading result…
        </motion.div>
      )}
    </div>
  );
}
