"use client";
import { Player } from "@/data/players";
import UltraCard from "./UltraCard";
import LegendaryCard from "./LegendaryCard";
import EpicCard from "./EpicCard";

interface PlayerCardProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
}

export default function PlayerCard({ player, ...props }: PlayerCardProps) {
  if (player.tier === "ultra") return <UltraCard player={player} {...props} />;
  if (player.tier === "legendary") return <LegendaryCard player={player} {...props} />;
  return <EpicCard player={player} {...props} />;
}
