import { BotPlayer, TeamPlayer } from "@prisma/client";
import { randomNumber } from "./generate_age";

type Props = {
  botPlayer: BotPlayer[];
  teamPlayer: TeamPlayer[];
  playerChemistry: number;
  botChecmistry: number;
  style: string;
  min: number;
  bot: number;
  team: number;
};

const _generateScore = (
  style: string,
  playerChemistry: number,
  botChecmistry: number,
  teamAttackerSkill: number,
  teamDenfenderSkill: number,
  botAttackerSkill: number,
  botDenfenderSkill: number
) => {
  if (style === "attack") {
    if (playerChemistry > botChecmistry) {
      if (teamAttackerSkill > botDenfenderSkill) {
        return {
          botScore: 0,
          teamScore: 1,
        };
      } else if (teamAttackerSkill < botDenfenderSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: 0,
        };
      } else if (teamAttackerSkill === botDenfenderSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: randomNumber(0, 1),
        };
      }
    } else {
      if (teamAttackerSkill > botDenfenderSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: 1,
        };
      } else if (teamAttackerSkill < botDenfenderSkill) {
        return {
          botScore: 0,
          teamScore: 1,
        };
      } else if (teamAttackerSkill === botDenfenderSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: randomNumber(0, 1),
        };
      }
    }
  } else if (style === "defence") {
    if (playerChemistry > botChecmistry) {
      if (teamDenfenderSkill > botAttackerSkill) {
        return {
          botScore: 0,
          teamScore: 0,
        };
      } else if (teamDenfenderSkill < botAttackerSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: 0,
        };
      } else if (teamDenfenderSkill === botAttackerSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: randomNumber(0, 1),
        };
      }
    } else {
      if (teamDenfenderSkill > botAttackerSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: 1,
        };
      } else if (teamDenfenderSkill < botAttackerSkill) {
        return {
          botScore: 0,
          teamScore: 1,
        };
      } else if (teamDenfenderSkill === botAttackerSkill) {
        return {
          botScore: randomNumber(0, 1),
          teamScore: randomNumber(0, 1),
        };
      }
    }
  }
  return {
    botScore: randomNumber(0, 1),
    teamScore: randomNumber(0, 1),
  };
};
export const generateScore = async ({
  botPlayer,
  teamPlayer,
  playerChemistry,
  botChecmistry,
  style,
  min,
  bot,
  team,
}: Props) => {
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

  const teamDenfenderSkill =
    teamDenfender.reduce((acc, player) => acc + player.skill, 0) /
    teamDenfender.length;

  const teamAttackerSkill =
    teamAttacker.reduce((acc, player) => acc + player.skill, 0) /
    teamAttacker.length;

  const botDenfenderSkill =
    botDenfender.reduce((acc, player) => acc + player.skill, 0) /
    botDenfender.length;

  const botAttackerSkill =
    botAttacker.reduce((acc, player) => acc + player.skill, 0) /
    botAttacker.length;

  if (min === 10) {
    const { botScore, teamScore } = _generateScore(
      style,
      playerChemistry,
      botChecmistry,
      teamAttackerSkill,
      teamDenfenderSkill,
      botAttackerSkill,
      botDenfenderSkill
    );
    return {
      botScore,
      teamScore,
    };
  } else if (min === 35) {
    if (bot > team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry - 1,
        botChecmistry + 1,
        teamAttackerSkill - 1,
        teamDenfenderSkill - 1,
        botAttackerSkill + 1,
        botDenfenderSkill + 1
      );
      return {
        botScore,
        teamScore,
      };
    } else if (bot < team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry + 1,
        botChecmistry - 1,
        teamAttackerSkill + 1,
        teamDenfenderSkill + 1,
        botAttackerSkill - 1,
        botDenfenderSkill - 1
      );
      return {
        botScore,
        teamScore,
      };
    } else {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry,
        botChecmistry,
        teamAttackerSkill,
        teamDenfenderSkill,
        botAttackerSkill,
        botDenfenderSkill
      );
      return {
        botScore,
        teamScore,
      };
    }
  } else if (min === 70) {
    if (bot > team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry - 2,
        botChecmistry + 1,
        teamAttackerSkill - 2,
        teamDenfenderSkill - 2,
        botAttackerSkill + 2,
        botDenfenderSkill + 2
      );
      return {
        botScore,
        teamScore,
      };
    } else if (bot < team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry + 2,
        botChecmistry - 2,
        teamAttackerSkill + 2,
        teamDenfenderSkill + 2,
        botAttackerSkill - 2,
        botDenfenderSkill - 2
      );
      return {
        botScore,
        teamScore,
      };
    } else {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry,
        botChecmistry,
        teamAttackerSkill,
        teamDenfenderSkill,
        botAttackerSkill,
        botDenfenderSkill
      );
      return {
        botScore,
        teamScore,
      };
    }
  } else if (min === 85) {
    if (bot > team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry - 4,
        botChecmistry + 4,
        teamAttackerSkill - 4,
        teamDenfenderSkill - 4,
        botAttackerSkill + 4,
        botDenfenderSkill + 4
      );
      return {
        botScore,
        teamScore,
      };
    } else if (bot < team) {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry + 4,
        botChecmistry - 4,
        teamAttackerSkill + 4,
        teamDenfenderSkill + 4,
        botAttackerSkill - 4,
        botDenfenderSkill - 4
      );
      return {
        botScore,
        teamScore,
      };
    } else {
      const { botScore, teamScore } = _generateScore(
        style,
        playerChemistry,
        botChecmistry,
        teamAttackerSkill,
        teamDenfenderSkill,
        botAttackerSkill,
        botDenfenderSkill
      );
      return {
        botScore,
        teamScore,
      };
    }
  } else {
    return {
      botScore: randomNumber(0, 1),
      teamScore: randomNumber(0, 1),
    };
  }
};

export const sortPlayersByPosition = (players: any[]) => {
  const position = ["GK", "RB", "CB", "LB", "DM", "CM", "RW", "ST", "LW"];
  const sortedPlayers = position.map((position) => {
    return players.filter((player) => player.position === position);
  });
  const playersSorted = sortedPlayers.reduce((acc, val) => acc.concat(val), []);
  return playersSorted;
};
