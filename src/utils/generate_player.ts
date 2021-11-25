import * as faker from "faker";
import { randomNumber } from "./generate_age";

// generate player
export const generatePlayer = (
  position: string,
  index: number,
  power: number = 5
) => {
  const playerName = faker.name.firstName() + " " + faker.name.lastName();
  const country = faker.address.country();
  const birthYear = new Date().getFullYear() - randomNumber(16, 40);
  const skill = index === 8 ? 7 : power;
  return {
    name: playerName,
    country,
    birthYear,
    position,
    skill,
  };
};
// generate players
export const generatePlayers = (teamId: string) => {
  // for staging release only 4-4-2
  // formation
  const positions = [
    "GK",
    "RB",
    "CB",
    "CB",
    "LB",
    "DM",
    "CM",
    "CM",
    "RW",
    "LW",
    "ST",
  ].sort(() => Math.random() - 0.5);

  const players = [];

  for (let i = 0; i < positions.length; i++) {
    players.push({ ...generatePlayer(positions[i], i), teamId });
  }

  return players;
};

export const generateBotPlayers = (botId: string) => {
  // for staging release only 4-4-2
  // formation
  const positions = [
    "GK",
    "RB",
    "CB",
    "CB",
    "LB",
    "DM",
    "CM",
    "CM",
    "RW",
    "LW",
    "ST",
  ].sort(() => Math.random() - 0.5);

  const players = [];

  for (let i = 0; i < positions.length; i++) {
    players.push({ ...generatePlayer(positions[i], i, 7), botId });
  }

  return players;
};
