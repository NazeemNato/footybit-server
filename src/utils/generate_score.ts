import { BotManager, BotPlayer, TeamManager, TeamPlayer } from "@prisma/client";
import { randomNumber } from "./generate_age";

type Props = {
  botPlayer: BotPlayer[];
  teamPlayer: TeamPlayer[];
};

export const generateScore = async ({ botPlayer, teamPlayer }: Props) => {
  const player = ["bot", "team"];

  const play = player[Math.floor(Math.random() * player.length)];

  if (play === "team") {
    const style = ["defensive", "offensive"];
    const playStyle = style[Math.floor(Math.random() * style.length)];
    if (playStyle === "defensive") {
      const defenders = teamPlayer.filter(
        (player) =>
          player.position === "CB" ||
          player.position === "DM" ||
          player.position === "GK"
      );
      const attackers = botPlayer.filter(
        (player) =>
          player.position === "RW" ||
          player.position === "LW" ||
          player.position === "ST"
      );

      // calculate the skill of defenders
      const defendersSkill = defenders.reduce((acc, curr) => {
        return acc + curr.skill;
      }, 0);
      // calculate the skill of attackers
      const attackersSkill = attackers.reduce((acc, curr) => {
        return acc + curr.skill;
      }, 0);

      const goalType = ["own", "no-goal", "goal"];
      const goal = goalType[Math.floor(Math.random() * goalType.length)];

      if (goal === "own") {
        const ownGoal = Math.floor(Math.random() * defendersSkill);
        if (ownGoal > attackersSkill) {
          return {
            player: randomNumber(0,2),
            bot: 0,
          };
        } else {
          return {
            player: randomNumber(0,3),
            bot: 1,
          };
        }
      } else if (goal === "no-goal") {
        return {
          player: randomNumber(0,2),
          bot: randomNumber(0,3),
        };
      } else {
        const goalScored = Math.floor(Math.random() * defendersSkill);
        if (goalScored > attackersSkill) {
          return {
            player: randomNumber(0,2),
            bot: randomNumber(0,2),
          };
        } else {
          return {
            player: randomNumber(0,2),
            bot: randomNumber(0,2),
          };
        }
      }
    } else {
      const defenders = botPlayer.filter(
        (player) =>
          player.position === "CB" ||
          player.position === "DM" ||
          player.position === "GK"
      );
      const attackers = teamPlayer.filter(
        (player) =>
          player.position === "RW" ||
          player.position === "LW" ||
          player.position === "ST"
      );

      // calculate the skill of defenders
      const defendersSkill = defenders.reduce((acc, curr) => {
        return acc + curr.skill;
      }, 0);
      // calculate the skill of attackers
      const attackersSkill = attackers.reduce((acc, curr) => {
        return acc + curr.skill;
      }, 0);

      const goalType = ["own", "no-goal", "goal"];
      const goal = goalType[Math.floor(Math.random() * goalType.length)];

      if (goal === "own") {
        const ownGoal = Math.floor(Math.random() * attackersSkill);
        if (ownGoal > defendersSkill) {
          return {
            player: randomNumber(1,2),
            bot: randomNumber(0,2),
          };
        } else {
          return {
            player: randomNumber(1,3),
            bot: 1,
          };
        }
      } else if (goal === "no-goal") {
        return {
          player: randomNumber(0,2),
            bot: randomNumber(1,2),
        };
      } else {
        const goalScored = Math.floor(Math.random() * attackersSkill);
        if (goalScored > defendersSkill) {
          return {
            player: 1,
            bot: randomNumber(0,2),
          };
        } else {
          return {
            player: randomNumber(0,2),
            bot: randomNumber(1,2),
          };
        }
      }
    }
  } 
  return {
    player: 0,
    bot: 0,
  };
};
