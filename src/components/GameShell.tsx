"use client";
import { AnimatePresence, motion } from "framer-motion";
import { GameProvider, useGame } from "@/components/GameProvider";
import { Web3Provider } from "@/components/Web3Provider";
import LandingScreen from "@/components/screens/LandingScreen";
import SetupScreen from "@/components/screens/SetupScreen";
import SquadBuilderScreen from "@/components/screens/SquadBuilderScreen";
import AtmosphereScreen from "@/components/screens/AtmosphereScreen";
import CommentaryScreen from "@/components/screens/CommentaryScreen";
import ResultScreen from "@/components/screens/ResultScreen";
import CommunityScreen from "@/components/screens/CommunityScreen";

const SCREEN_TRANSITIONS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: "easeInOut" },
};

function GameRouter() {
  const { state } = useGame();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.screen}
        {...SCREEN_TRANSITIONS}
        style={{ minHeight: "100vh" }}
      >
        {state.screen === "landing" && <LandingScreen />}
        {state.screen === "setup" && <SetupScreen />}
        {state.screen === "squad" && <SquadBuilderScreen />}
        {state.screen === "atmosphere" && <AtmosphereScreen />}
        {state.screen === "opponent" && <AtmosphereScreen />}
        {state.screen === "commentary" && <CommentaryScreen />}
        {state.screen === "result" && <ResultScreen />}
        {state.screen === "community" && <CommunityScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function GameShell() {
  return (
    <Web3Provider>
      <GameProvider>
        <GameRouter />
      </GameProvider>
    </Web3Provider>
  );
}
