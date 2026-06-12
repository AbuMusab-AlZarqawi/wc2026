"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, CommunityEntry } from "@/components/GameProvider";
import { useAccount } from "wagmi";

// Seeded mock community entries for demo
const MOCK_ENTRIES: CommunityEntry[] = [
  { address: "0xabc1", name: "Kash_IRL", nation: { code: "BR", name: "Brazil", flag: "🇧🇷", color: "#009C3B" },
    formation: "4-3-3", squad: ["Kash","Val","Tanjiro","Oluwasegun","Rizan","Tutufly","Josh","Softiee","Kena","Eren-Daddy","Heat"],
    wins: 8, losses: 2, rating: 91 },
  { address: "0xdef2", name: "G9D_Legend", nation: { code: "FR", name: "France", flag: "🇫🇷", color: "#002395" },
    formation: "4-4-2", squad: ["G9D","Tamara","Maharshi","Frisco","Jez","SaintEx","Kai","Lightol","Eric","Browny","Oxygen"],
    wins: 11, losses: 1, rating: 94 },
  { address: "0xghi3", name: "El-Khalil", nation: { code: "MA", name: "Morocco", flag: "🇲🇦", color: "#C1272D" },
    formation: "5-3-2", squad: ["El-Khalil","Tutufly","Stefan","Dunken","Hinata","Bien","Crankyy","Riyade","Flakkyy","James","Momo"],
    wins: 5, losses: 5, rating: 82 },
  { address: "0xjkl4", name: "Hemisphere", nation: { code: "NG", name: "Nigeria", flag: "🇳🇬", color: "#008751" },
    formation: "4-2-4", squad: ["Hemisphere","Mira","Mmorgs","Qazi","Ehilia","Sarthak","Hyshow","Mantissa","Zegna","Grandad","Unbothered"],
    wins: 7, losses: 3, rating: 86 },
];

function EntryCard({ entry, onChallenge }: { entry: CommunityEntry; onChallenge: () => void }) {
  const winRate = entry.wins + entry.losses > 0
    ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, borderColor: "rgba(239,68,68,0.35)" }}
      style={{
        borderRadius: 16, padding: "20px", marginBottom: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        {/* Flag + name */}
        <div style={{ fontSize: 32 }}>{entry.nation.flag}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{entry.name}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{entry.nation.name} · {entry.formation}</div>
        </div>
        {/* Rating */}
        <div style={{ textAlign: "right" }}>
          <div className="font-anton" style={{ fontSize: 28, color: "#F59E0B" }}>{entry.rating}</div>
          <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>RATING</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#34D399" }}>{entry.wins}</div>
          <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>W</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#EF4444" }}>{entry.losses}</div>
          <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>L</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Win rate</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: winRate >= 50 ? "#34D399" : "#EF4444" }}>{winRate}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${winRate}%`,
              background: winRate >= 50 ? "#34D399" : "#EF4444",
              transition: "width 1s ease-out",
            }} />
          </div>
        </div>
      </div>

      {/* Squad preview */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
        {entry.squad.slice(0, 11).map((name, i) => (
          <span key={i} style={{
            padding: "2px 8px", borderRadius: 6,
            background: "rgba(255,255,255,0.06)", fontSize: 11, color: "#9CA3AF", fontWeight: 600,
          }}>{name}</span>
        ))}
      </div>

      {/* Challenge button */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onChallenge}
        style={{
          width: "100%", padding: "10px", borderRadius: 10,
          background: "linear-gradient(90deg, #EF4444, #B91C1C)",
          border: "none", color: "#fff", fontSize: 14,
          fontFamily: "'Anton', sans-serif", letterSpacing: 1, cursor: "pointer",
        }}
      >⚔️ CHALLENGE</motion.button>
    </motion.div>
  );
}

export default function CommunityScreen() {
  const { state, dispatch } = useGame();
  const { isConnected } = useAccount();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "wins" | "winrate">("rating");

  const allEntries = [...MOCK_ENTRIES, ...state.community];

  const sorted = [...allEntries]
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.nation.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "wins") return b.wins - a.wins;
      const aWR = a.wins / (a.wins + a.losses || 1);
      const bWR = b.wins / (b.wins + b.losses || 1);
      return bWR - aWR;
    });

  const handleChallenge = (entry: CommunityEntry) => {
    if (!state.squad.some(s => s.player)) {
      dispatch({ type: "SET_SCREEN", screen: "squad" });
      return;
    }
    // Set opponent to the community entry's squad
    dispatch({ type: "SET_SCREEN", screen: "atmosphere" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", color: "#fff", padding: "32px 16px", overflowY: "auto" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <button
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "landing" })}
            style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >← Back</button>
          <h1 className="font-anton" style={{ fontSize: 32, margin: 0 }}>
            COMMUNITY <span style={{ color: "#EF4444" }}>BATTLES</span>
          </h1>
          <div style={{ width: 60 }} />
        </div>

        {/* Stats banner */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap",
        }}>
          {[
            { label: "Squads Saved", value: allEntries.length },
            { label: "Total Battles", value: allEntries.reduce((s, e) => s + e.wins + e.losses, 0) },
            { label: "Top Rating", value: Math.max(...allEntries.map(e => e.rating)) },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, minWidth: 120, padding: "16px", borderRadius: 12, textAlign: "center",
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            }}>
              <div className="font-anton" style={{ fontSize: 28, color: "#EF4444" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or nation…"
            style={{
              flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff", fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif",
            }}
          />
          {(["rating", "wins", "winrate"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                background: sort === s ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                color: sort === s ? "#EF4444" : "#6B7280",
                fontSize: 12, fontWeight: 700, textTransform: "capitalize",
              }}
            >{s}</button>
          ))}
        </div>

        {/* Entries */}
        <AnimatePresence>
          {sorted.map((entry, i) => (
            <motion.div key={entry.address + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <EntryCard entry={entry} onChallenge={() => handleChallenge(entry)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div style={{ textAlign: "center", color: "#4B5563", padding: "60px 0", fontSize: 15 }}>
            No squads found. Be the first to save yours.
          </div>
        )}
      </div>
    </div>
  );
}
