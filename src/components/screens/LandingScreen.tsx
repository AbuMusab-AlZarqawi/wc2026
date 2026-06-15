"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/components/GameProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

const PARTICLES = ["⚽","🏆","⭐","🎯","🔥","💫","🌟","⚡","🦁","🎪"];

function FloatingParticle({ emoji, delay, x }: { emoji: string; delay: number; x: number }) {
  return (
    <motion.div
      initial={{ y: "110vh", x, opacity: 0, rotate: 0 }}
      animate={{ y: "-10vh", opacity: [0, 1, 1, 0], rotate: 360 }}
      transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, repeatDelay: Math.random() * 6 }}
      style={{ position: "absolute", bottom: 0, fontSize: 20 + Math.random() * 24, pointerEvents: "none", zIndex: 1 }}
    >
      {emoji}
    </motion.div>
  );
}

const FEATURES = [
  { icon: "🃏", title: "52 Unique Cards", desc: "Discord community members as playable cards across Ultra, Legendary and Epic tiers." },
  { icon: "🌍", title: "48 Nations", desc: "Pick your country from all WC2026 participants. Fly your flag into battle." },
  { icon: "🧠", title: "AI Match Engine", desc: "Groq simulates every match with goals, minutes, drama and an MVP rating." },
  { icon: "⛓️", title: "On-Chain Records", desc: "Save your results to Ritual Testnet. Your W/L record lives forever on-chain." },
  { icon: "🏟️", title: "6 Formations", desc: "4-3-3, 4-4-2, 3-5-2, 5-3-2, 4-2-4, 3-4-3 — every tactical flavour covered." },
  { icon: "👥", title: "Community Battles", desc: "Challenge other players' saved squads. Real people, real tactics, AI referee." },
];

const STEPS = [
  { n: "01", title: "Connect & Name Up", desc: "Link your wallet. Enter your name. This is your identity in the game." },
  { n: "02", title: "Pick Your Nation", desc: "Choose one of 48 World Cup nations. Your flag, your colours, your badge." },
  { n: "03", title: "Build Your Squad", desc: "Select 11 players from 52 cards. Any player, any position. Fill every slot." },
  { n: "04", title: "Lock Your Formation", desc: "Choose your tactical setup. 4-3-3 for flair. 5-3-2 for the fortress." },
  { n: "05", title: "Battle & Immortalise", desc: "AI simulates the match. Win or lose — write it to the blockchain forever." },
];

export default function LandingScreen() {
  const { dispatch, sounds } = useGame();
  const { isConnected } = useAccount();
  const [particles] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: PARTICLES[i % PARTICLES.length],
      delay: i * 0.7,
      x: (i / 14) * (typeof window !== "undefined" ? window.innerWidth : 400),
    }))
  );

  const handleStart = () => {
    sounds.playBg();
    dispatch({ type: "SET_SCREEN", screen: "setup" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", overflowX: "hidden", position: "relative" }}>

      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {particles.map(p => <FloatingParticle key={p.id} {...p} />)}
      </div>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,12,20,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(239,68,68,0.2)",
        padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.PNG" alt="Logo" style={{ height: 32, width: 32, objectFit: "contain" }} />
          <span className="font-anton" style={{ fontSize: 18, color: "#fff", letterSpacing: 1 }}>
            WC<span style={{ color: "#EF4444" }}>2026</span> FANTASY
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "community" })}
            style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >Community</button>
          <ConnectButton />
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "120px 24px 80px", zIndex: 2,
      }}>
        {/* Field background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('/field.png')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.4,
          filter: "saturate(1.4)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(8,12,20,0.3) 0%, rgba(8,12,20,0.85) 100%)",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 2, maxWidth: 760 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-block", marginBottom: 20,
              background: "linear-gradient(90deg, #EF4444, #F59E0B)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: 13, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase",
            }}
          >
            ⚽ WorldCup 2026 · Ritual Testnet · AI Powered
          </motion.div>

          <h1 className="font-anton" style={{
            fontSize: "clamp(48px, 9vw, 96px)",
            lineHeight: 1, color: "#fff", marginBottom: 16,
            textShadow: "0 0 60px rgba(239,68,68,0.4)",
          }}>
            BUILD YOUR<br />
            <span style={{
              background: "linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #EF4444 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}>LEGEND</span>
          </h1>

          <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
            Pick your squad. Choose your formation. Let AI simulate the match.
            Immortalise your results on-chain.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {isConnected ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                style={{
                  padding: "16px 48px", borderRadius: 50,
                  background: "linear-gradient(90deg, #EF4444, #B91C1C)",
                  border: "none", color: "#fff", fontSize: 18,
                  fontFamily: "'Anton', sans-serif", letterSpacing: 2,
                  cursor: "pointer", boxShadow: "0 0 30px rgba(239,68,68,0.5)",
                }}
              >
                KICK OFF ⚽
              </motion.button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <ConnectButton />
                <span style={{ color: "#6B7280", fontSize: 13 }}>Connect wallet to start</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
        >
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #EF4444, transparent)", margin: "0 auto" }} />
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-anton"
          style={{ fontSize: "clamp(32px, 5vw, 52px)", textAlign: "center", marginBottom: 48, color: "#fff" }}
        >
          WHAT YOU <span style={{ color: "#EF4444" }}>GET</span>
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, borderColor: "rgba(239,68,68,0.4)" }}
              style={{
                padding: "28px 24px", borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.3s",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: "80px 24px", position: "relative", zIndex: 2,
        background: "linear-gradient(to bottom, transparent, rgba(239,68,68,0.04), transparent)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-anton"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", textAlign: "center", marginBottom: 56, color: "#fff" }}
          >
            HOW IT <span style={{ color: "#EF4444" }}>WORKS</span>
          </motion.h2>

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
              style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}
            >
              <div style={{
                flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg, #EF4444, #B91C1C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Anton', sans-serif", fontSize: 16, color: "#fff",
                boxShadow: "0 0 20px rgba(239,68,68,0.4)",
              }}>{s.n}</div>
              <div style={{ paddingTop: 6 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 600, margin: "0 auto", padding: "60px 40px", borderRadius: 24,
            background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(185,28,28,0.08))",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 60px rgba(239,68,68,0.1)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <h2 className="font-anton" style={{ fontSize: 40, color: "#fff", marginBottom: 12 }}>
            YOUR LEGACY<br /><span style={{ color: "#EF4444" }}>AWAITS</span>
          </h2>
          <p style={{ color: "#9CA3AF", marginBottom: 32, fontSize: 15 }}>
            One squad. One shot. Will your team become legend?
          </p>
          {isConnected ? (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              style={{
                padding: "14px 40px", borderRadius: 50,
                background: "linear-gradient(90deg, #EF4444, #B91C1C)",
                border: "none", color: "#fff", fontSize: 16,
                fontFamily: "'Anton', sans-serif", letterSpacing: 2, cursor: "pointer",
              }}
            >LET'S GO ⚽</motion.button>
          ) : <ConnectButton />}
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px", textAlign: "center", color: "#374151", fontSize: 13, zIndex: 2, position: "relative",
      }}>
        WC2026 Fantasy · Built on Ritual Chain Testnet · AI by Groq
      </footer>
    </div>
  );
}
