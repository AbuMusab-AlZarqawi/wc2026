"use client";

import React, { createContext, useContext, useReducer, useRef, useCallback } from "react";
import { Player, Nation, Formation, FORMATIONS, NATIONS, ALL_PLAYERS } from "@/data/players";

// ─── Types ────────────────────────────────────────────────────
export type Screen =
  | "landing"
  | "setup"
  | "squad"
  | "atmosphere"
  | "opponent"
  | "commentary"
  | "result"
  | "community";

export interface SquadSlot {
  role: string;
  x: number;
  y: number;
  player: Player | null;
}

export interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  draw: boolean;
  penaltyShootout: {
    occurred: boolean;
    homeScore: number;
    awayScore: number;
    winner: string | null;
  };
  winner: string;
  goals: { minute: number; scorer: string; team: string; type: string }[];
  mvp: { name: string; team: string; rating: number; description: string };
  tacticalSummary: string;
  matchMood: string;
}

export interface CommunityEntry {
  address: string;
  name: string;
  nation: Nation;
  formation: string;
  squad: string[];
  wins: number;
  losses: number;
  rating: number;
  txHash?: string;
}

interface GameState {
  screen: Screen;
  userName: string;
  userNation: Nation | null;
  formation: Formation;
  squad: SquadSlot[];
  opponentNation: Nation | null;
  opponentSquad: Player[];
  opponentFormation: Formation;
  matchResult: MatchResult | null;
  isSimulating: boolean;
  community: CommunityEntry[];
  sounds: {
    bgPlaying: boolean;
  };
}

type Action =
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "SET_USER_NAME"; name: string }
  | { type: "SET_USER_NATION"; nation: Nation }
  | { type: "SET_FORMATION"; formation: Formation }
  | { type: "PLACE_PLAYER"; slotIndex: number; player: Player }
  | { type: "REMOVE_PLAYER"; slotIndex: number }
  | { type: "SET_OPPONENT" }
  | { type: "SET_MATCH_RESULT"; result: MatchResult }
  | { type: "SET_SIMULATING"; value: boolean }
  | { type: "ADD_COMMUNITY"; entry: CommunityEntry }
  | { type: "SET_BG_PLAYING"; value: boolean }
  | { type: "RESET_SQUAD" };

function buildSquadSlots(formation: Formation): SquadSlot[] {
  return formation.slots.map((s) => ({ ...s, player: null }));
}

function pickRandomNationExcluding(exclude: string): Nation {
  const pool = NATIONS.filter((n) => n.code !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickOpponentSquad(): Player[] {
  const shuffled = [...ALL_PLAYERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 11);
}

const initialFormation = FORMATIONS[0];
const initialState: GameState = {
  screen: "landing",
  userName: "",
  userNation: null,
  formation: initialFormation,
  squad: buildSquadSlots(initialFormation),
  opponentNation: null,
  opponentSquad: [],
  opponentFormation: FORMATIONS[0],
  matchResult: null,
  isSimulating: false,
  community: [],
  sounds: { bgPlaying: false },
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };
    case "SET_USER_NAME":
      return { ...state, userName: action.name };
    case "SET_USER_NATION":
      return { ...state, userNation: action.nation };
    case "SET_FORMATION": {
      const newSlots = buildSquadSlots(action.formation);
      // Re-place existing players where possible
      state.squad.forEach((slot, i) => {
        if (slot.player && i < newSlots.length) newSlots[i].player = slot.player;
      });
      return { ...state, formation: action.formation, squad: newSlots };
    }
    case "PLACE_PLAYER":
      return {
        ...state,
        squad: state.squad.map((s, i) =>
          i === action.slotIndex ? { ...s, player: action.player } : s
        ),
      };
    case "REMOVE_PLAYER":
      return {
        ...state,
        squad: state.squad.map((s, i) =>
          i === action.slotIndex ? { ...s, player: null } : s
        ),
      };
    case "SET_OPPONENT": {
      const oppFormation = FORMATIONS[Math.floor(Math.random() * FORMATIONS.length)];
      return {
        ...state,
        opponentNation: pickRandomNationExcluding(state.userNation?.code || ""),
        opponentSquad: pickOpponentSquad(),
        opponentFormation: oppFormation,
      };
    }
    case "SET_MATCH_RESULT":
      return { ...state, matchResult: action.result, isSimulating: false };
    case "SET_SIMULATING":
      return { ...state, isSimulating: action.value };
    case "ADD_COMMUNITY":
      return { ...state, community: [action.entry, ...state.community] };
    case "SET_BG_PLAYING":
      return { ...state, sounds: { ...state.sounds, bgPlaying: action.value } };
    case "RESET_SQUAD":
      return { ...state, squad: buildSquadSlots(state.formation), matchResult: null };
    default:
      return state;
  }
}

// ─── Sound Hook ───────────────────────────────────────────────
function useGameSounds() {
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);
  const loseRef = useRef<HTMLAudioElement | null>(null);
  const flipRef = useRef<HTMLAudioElement | null>(null);

  const init = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!bgRef.current) {
      bgRef.current = new Audio("/sounds/bg-music.mp3");
      bgRef.current.loop = true;
      bgRef.current.volume = 0.25;
    }
    if (!winRef.current) { winRef.current = new Audio("/sounds/win.mp3"); winRef.current.volume = 0.8; }
    if (!loseRef.current) { loseRef.current = new Audio("/sounds/lose.mp3"); loseRef.current.volume = 0.8; }
    if (!flipRef.current) { flipRef.current = new Audio("/sounds/card-flip.mp3"); flipRef.current.volume = 0.85; }
  }, []);

  const playBg = useCallback(() => {
    init();
    bgRef.current?.play().catch(() => {});
  }, [init]);

  const stopBg = useCallback(() => {
    if (bgRef.current) { bgRef.current.pause(); bgRef.current.currentTime = 0; }
  }, []);

  const playWin = useCallback(() => {
    init();
    stopBg();
    if (winRef.current) { winRef.current.currentTime = 0; winRef.current.play().catch(() => {}); }
  }, [init, stopBg]);

  const playLose = useCallback(() => {
    init();
    stopBg();
    if (loseRef.current) { loseRef.current.currentTime = 0; loseRef.current.play().catch(() => {}); }
  }, [init, stopBg]);

  const playFlip = useCallback(() => {
    init();
    if (flipRef.current) { flipRef.current.currentTime = 0; flipRef.current.play().catch(() => {}); }
  }, [init]);

  return { playBg, stopBg, playWin, playLose, playFlip };
}

// ─── Context ──────────────────────────────────────────────────
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  sounds: ReturnType<typeof useGameSounds>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sounds = useGameSounds();
  return (
    <GameContext.Provider value={{ state, dispatch, sounds }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
