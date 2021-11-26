import { BotPlayer, TeamPlayer } from "@prisma/client";
import { randomNumber } from "./generate_age";

type Props = {
  botPlayer: BotPlayer[];
  teamPlayer: TeamPlayer[];
};

export const generateScore = async ({ botPlayer, teamPlayer }: Props) => {
  const style = ["attacking", "defending", "balanced"];
  const team = style[Math.floor(Math.random() * style.length)];
  const bot = style[Math.floor(Math.random() * style.length)];

  const teamDenfender = teamPlayer.filter(
    (player) =>
      player.position === "CB" ||
      player.position === "LB" ||
      player.position === "RB" ||
      player.position === "DM" ||
      player.position === "GK"
  );

  const teamAttacker = teamPlayer.filter(
    (player) =>
      player.position === "CM" ||
      player.position === "AM" ||
      player.position === "ST" ||
      player.position === "RW" ||
      player.position === "LW"
  );

  const botDenfender = botPlayer.filter(
    (player) =>
      player.position === "CB" ||
      player.position === "LB" ||
      player.position === "RB" ||
      player.position === "DM" ||
      player.position === "GK"
  );

  const botAttacker = botPlayer.filter(
    (player) =>
      player.position === "CM" ||
      player.position === "AM" ||
      player.position === "ST" ||
      player.position === "RW" ||
      player.position === "LW"
  );

  const teamDenfenderSkill = teamDenfender.reduce(
    (acc, player) => acc + player.skill,
    0
  );

  const teamAttackerSkill = teamAttacker.reduce(
    (acc, player) => acc + player.skill,
    0
  );

  const botDenfenderSkill = botDenfender.reduce(
    (acc, player) => acc + player.skill,
    0
  );

  const botAttackerSkill = botAttacker.reduce(
    (acc, player) => acc + player.skill,
    0
  );

  if (team === "balanced" && bot === "balanced") {
    if (teamAttackerSkill > botDenfenderSkill) {
      return {
        team: randomNumber(1, 3),
        bot: randomNumber(0, 1),
      };
    } else {
      return {
        team: randomNumber(1, 3),
        bot: randomNumber(1, 3),
      };
    }
  } else if (team === "attacking" && bot === "attacking") {
    if (teamAttackerSkill > botDenfenderSkill) {
      return {
        team: randomNumber(1, 3),
        bot: 0,
      };
    } else if (teamAttackerSkill < botDenfenderSkill) {
      return {
        team: 0,
        bot: randomNumber(0, 1),
      };
    } else if (teamAttackerSkill === botDenfenderSkill) {
      return {
        team: randomNumber(0, 1),
        bot: randomNumber(0, 1),
      };
    } else {
      return {
        team: randomNumber(0,1),
        bot: randomNumber(0, 1),
      };
    }
  } else if (team === "defending" && bot === "defending") {
    if (teamDenfenderSkill > botAttackerSkill) {
      return {
        team: randomNumber(1, 4),
        bot: 0,
      };
    } else if (teamDenfenderSkill < botAttackerSkill) {
      return {
        team: 0,
        bot: randomNumber(1, 4),
      };
    } else if (teamDenfenderSkill === botAttackerSkill) {
      return {
        team: 0,
        bot: 0,
      };
    } else {
      return {
        team: 0,
        bot: 0,
      };
    }
  } else if (team === "attacking" && bot === "defending") {
    if (teamAttackerSkill > botDenfenderSkill) {
      return {
        team: randomNumber(1, 3),
        bot: 0,
      };
    } else if (teamAttackerSkill < botDenfenderSkill) {
      return {
        team: 0,
        bot: 1,
      };
    } else if (teamAttackerSkill === botDenfenderSkill) {
      return {
        team: 0,
        bot: 0,
      };
    } else {
      return {
        team:0,
        bot: 0
      };
    }
  } else if (team === "defending" && bot === "attacking") {
    if (teamDenfenderSkill > botAttackerSkill) {
      return {
        team: randomNumber(0, 2),
        bot: 0
      };
    } else if (teamDenfenderSkill < botAttackerSkill) {
      return {
        bot: 0,
        team: randomNumber(1, 3),
      };
    } else if (teamDenfenderSkill === botAttackerSkill) {
      return {
        team: randomNumber(0, randomNumber(1, 3)),
        bot: randomNumber(0, randomNumber(1, 3)),
      };
    } else {
      return {
        team: randomNumber(1, 3),
        bot: randomNumber(1, 3),
      };
    }
  } else {
    return {
      team: randomNumber(1, 3),
      bot: randomNumber(1, 3),
    };
  }
};

export const sortPlayersByPosition = (players: any[]) => {
  const position = [
    "GK",
    "RB",
    "CB",
    "LB",
    "DM",
    "CM",
    "RW",
    "ST",
    "LW",
  ];
  const sortedPlayers = position.map((position) => {
    return players.filter((player) => player.position === position);
  });
  const playersSorted = sortedPlayers.reduce((acc, val) => acc.concat(val), []);
  return playersSorted;
};
