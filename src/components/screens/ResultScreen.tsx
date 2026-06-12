"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";
import { useAccount, useWriteContract } from "wagmi";
import { parseAbi } from "viem";

const MOOD_COLORS: Record<string, string> = {
  Breathtaking: "#A78BFA",
  Ruthless: "#EF4444",
  Chaotic: "#F59E0B",
  Gritty: "#9CA3AF",
  Dominant: "#34D399",
  Miraculous: "#60A5FA",
  Electrifying: "#FBBF24",
  Tense: "#F97316",
  Dramatic: "#EC4899",
};

const GOAL_COLORS: Record<string, string> = {
  penalty: "#F59E0B",
  "own goal": "#EF4444",
  screamer: "#A78BFA",
  "free kick": "#34D399",
  header: "#60A5FA",
  volley: "#F472B6",
  goal: "#E5E7EB",
};

// Minimal ABI for saving a result on-chain
const RECORD_ABI = parseAbi([
  "function recordResult(string teamName, string opponent, uint8 homeScore, uint8 awayScore, string winner, string formation) external",
]);
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2);
  return (
    <span style={{ color: "#FBBF24", letterSpacing: 2, fontSize: 16 }}>
      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
    </span>
  );
}

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { isConnected } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const result = state.matchResult;
  if (!result) return null;

  const teamName = `${state.userName}'s ${state.userNation?.name || "Team"}`;
  const userWon = result.winner === teamName;
  const moodColor = MOOD_COLORS[result.matchMood] || "#A78BFA";

  const handleSaveOnChain = () => {
    if (!isConnected || saved) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: RECORD_ABI,
      functionName: "recordResult",
      args: [
        teamName,
        result.awayTeam,
        result.homeScore,
        result.awayScore,
        result.winner,
        state.formation.name,
      ],
    });
    setSaved(true);
  };

  const handlePlayAgain = () => {
    dispatch({ type: "RESET_SQUAD" });
    dispatch({ type: "SET_SCREEN", screen: "squad" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080C14", overflowY: "auto",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Match mood banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center", marginBottom: 28,
            padding: "10px 20px", borderRadius: 30,
            background: `${moodColor}18`,
            border: `1px solid ${moodColor}44`,
            display: "inline-block", width: "100%",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: moodColor, letterSpacing: 3, textTransform: "uppercase" }}>
            {result.matchMood} · Full Time
          </span>
        </motion.div>

        {/* Scoreboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 20,
            background: "linear-gradient(145deg, #0e1421, #161e2e)",
            border: `1px solid ${moodColor}33`,
            boxShadow: `0 0 60px ${moodColor}18`,
            padding: "36px 24px", textAlign: "center",
          }}
        >
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${moodColor}, transparent)` }} />

          {/* Win/Loss badge */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{
              display: "inline-block", marginBottom: 20,
              padding: "6px 24px", borderRadius: 30,
              background: userWon
                ? "linear-gradient(90deg, #16A34A, #15803D)"
                : "linear-gradient(90deg, #DC2626, #991B1B)",
              boxShadow: userWon ? "0 0 20px #16A34A66" : "0 0 20px #DC262666",
            }}
          >
            <span className="font-anton" style={{ fontSize: 15, color: "#fff", letterSpacing: 2 }}>
              {userWon ? "🏆 VICTORY" : "💀 DEFEAT"}
            </span>
          </motion.div>

          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>{state.userNation?.flag} {teamName}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="font-anton"
                style={{ fontSize: 72, color: userWon ? "#34D399" : "#fff", lineHeight: 1 }}
              >{result.homeScore}</motion.span>
              <span style={{ fontSize: 28, color: "#374151" }}>—</span>
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="font-anton"
                style={{ fontSize: 72, color: !userWon ? "#EF4444" : "#fff", lineHeight: 1 }}
              >{result.awayScore}</motion.span>
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>🤖 AI Team</div>
            </div>
          </div>

          {/* Penalties */}
          {result.penaltyShootout?.occurred && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{
                display: "inline-block", padding: "8px 20px", borderRadius: 10, marginBottom: 16,
                background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
              }}
            >
              <span style={{ color: "#FBBF24", fontWeight: 700, fontSize: 13 }}>
                🥅 Penalties: {teamName} {result.penaltyShootout.homeScore} – {result.penaltyShootout.awayScore} AI Team
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            borderRadius: 16, marginBottom: 16,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase" }}>
              Goalscorers
            </span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {result.goals.length === 0 && (
              <div style={{ color: "#4B5563", fontSize: 14 }}>No goals — what a boring match.</div>
            )}
            {result.goals.map((g, i) => {
              const isHome = g.team !== "AI Team";
              const color = GOAL_COLORS[g.type] || "#E5E7EB";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isHome ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                    justifyContent: isHome ? "flex-start" : "flex-end",
                    flexDirection: isHome ? "row" : "row-reverse",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: color, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#000", flexShrink: 0,
                  }}>{g.minute}'</div>
                  <div style={{ textAlign: isHome ? "left" : "right" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{g.scorer}</div>
                    <div style={{ color, fontSize: 11, textTransform: "capitalize", fontWeight: 600 }}>{g.type}</div>
                  </div>
                  <span style={{ fontSize: 18 }}>⚽</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* MVP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{
            borderRadius: 16, marginBottom: 16, padding: 20,
            background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(96,165,250,0.08))",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
            Match MVP
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>⭐</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>{result.mvp.name}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{result.mvp.team}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div className="font-anton" style={{ fontSize: 36, color: "#FBBF24" }}>{result.mvp.rating}</div>
              <StarRating rating={result.mvp.rating} />
            </div>
          </div>
          <p style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>
            "{result.mvp.description}"
          </p>
        </motion.div>

        {/* Tactical summary (expandable) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{
            borderRadius: 16, marginBottom: 20, overflow: "hidden",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "100%", padding: "14px 20px", background: "transparent", border: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase" }}>
              Tactical Summary
            </span>
            <span style={{ color: "#6B7280", fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <p style={{ padding: "0 20px 20px", color: "#D1D5DB", fontSize: 14, lineHeight: 1.8 }}>
                  {result.tacticalSummary}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {/* Save on-chain */}
          {isConnected && !isSuccess && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSaveOnChain}
              disabled={isPending || saved}
              style={{
                flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 12,
                background: saved
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(239,68,68,0.12)",
                border: saved
                  ? "1px solid rgba(52,211,153,0.4)"
                  : "1px solid rgba(239,68,68,0.3)",
                color: saved ? "#34D399" : "#EF4444",
                fontSize: 14, fontWeight: 700, cursor: saved ? "default" : "pointer",
              }}
            >
              {isPending ? "⏳ Writing to chain…" : saved ? "✓ Saved on-chain" : "⛓️ Save Result On-Chain"}
            </motion.button>
          )}

          {/* Play again */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handlePlayAgain}
            style={{
              flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 12,
              background: "linear-gradient(90deg, #EF4444, #B91C1C)",
              border: "none", color: "#fff", fontSize: 14,
              fontFamily: "'Anton', sans-serif", letterSpacing: 1, cursor: "pointer",
            }}
          >PLAY AGAIN ⚽</motion.button>

          {/* Community */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "community" })}
            style={{
              flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 12,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9CA3AF", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >👥 Community</motion.button>
        </motion.div>
      </div>
    </div>
  );
}
