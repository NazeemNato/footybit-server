import * as faker from "faker";
import { randomNumber } from "./generate_age";
// generate random manager
export const generateManager = (power: number = 5) => {
  const formation = "4-3-3";
  const managerName = faker.name.firstName() + " " + faker.name.lastName();
  const country = faker.address.country();
  const birthYear = new Date().getFullYear() - randomNumber(16, 60);
  const skill = power;
  return {
    formation,
    managerName,
    country,
    birthYear,
    skill,
  };
};
