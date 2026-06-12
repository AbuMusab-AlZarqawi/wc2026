"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";
import { NATIONS, Nation } from "@/data/players";

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.userName);
  const [selectedNation, setSelectedNation] = useState<Nation | null>(state.userNation);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const filtered = NATIONS.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (!name.trim()) { setError("Enter your name first"); return; }
    if (!selectedNation) { setError("Pick your nation"); return; }
    dispatch({ type: "SET_USER_NAME", name: name.trim() });
    dispatch({ type: "SET_USER_NATION", nation: selectedNation });
    dispatch({ type: "SET_SCREEN", screen: "squad" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080C14",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px", overflowY: "auto",
    }}>
      {/* Back */}
      <div style={{ width: "100%", maxWidth: 720, marginBottom: 24 }}>
        <button
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "landing" })}
          style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >← Back</button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 720 }}
      >
        <h1 className="font-anton" style={{ fontSize: 40, color: "#fff", marginBottom: 6 }}>
          SET UP YOUR <span style={{ color: "#EF4444" }}>PROFILE</span>
        </h1>
        <p style={{ color: "#6B7280", marginBottom: 36, fontSize: 15 }}>Your name and nation will represent you in battle.</p>

        {/* Name input */}
        <div style={{ marginBottom: 36 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#EF4444", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>
            Your Name
          </label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Hemisphere"
            maxLength={20}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 16, fontWeight: 700,
              outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        {/* Nation picker */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#EF4444", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>
            Your Nation
          </label>

          {selectedNation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex", alignItems: "center", gap: 14, marginBottom: 16,
                padding: "14px 18px", borderRadius: 12,
                background: `${selectedNation.color}18`,
                border: `1px solid ${selectedNation.color}55`,
              }}
            >
              <span style={{ fontSize: 32 }}>{selectedNation.flag}</span>
              <div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>{selectedNation.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>Selected nation</div>
              </div>
              <button
                onClick={() => setSelectedNation(null)}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 18 }}
              >✕</button>
            </motion.div>
          )}

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search nations..."
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff", fontSize: 14, marginBottom: 12,
              outline: "none", fontFamily: "'Inter', sans-serif",
            }}
          />

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 8, maxHeight: 340, overflowY: "auto", paddingRight: 4,
          }}>
            {filtered.map(nation => (
              <motion.button
                key={nation.code}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSelectedNation(nation); setSearch(""); setError(""); }}
                style={{
                  padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                  background: selectedNation?.code === nation.code
                    ? `${nation.color}30`
                    : "rgba(255,255,255,0.04)",
                  border: selectedNation?.code === nation.code
                    ? `1px solid ${nation.color}88`
                    : "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", gap: 8,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 22 }}>{nation.flag}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#E5E7EB" }}>{nation.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ color: "#F87171", fontSize: 13, fontWeight: 600, marginBottom: 16 }}
            >{error}</motion.div>
          )}
        </AnimatePresence>

        {/* Continue */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          style={{
            width: "100%", padding: "16px",
            background: "linear-gradient(90deg, #EF4444, #B91C1C)",
            border: "none", borderRadius: 12,
            color: "#fff", fontSize: 16,
            fontFamily: "'Anton', sans-serif", letterSpacing: 2,
            cursor: "pointer",
            boxShadow: "0 0 30px rgba(239,68,68,0.3)",
          }}
        >
          CONTINUE TO SQUAD BUILDER →
        </motion.button>
      </motion.div>
    </div>
  );
}
