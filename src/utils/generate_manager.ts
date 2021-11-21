import * as faker from "faker";
import { randomNumber } from "./generate_age";
// generate random manager
export const generateManager = () => {
  const formation = "4-3-3";
  const managerName = faker.name.firstName() + " " + faker.name.lastName();
  const country = faker.address.country();
  const birthYear = new Date().getFullYear() - randomNumber(16, 60);
  const skill = 5;
  return {
    formation,
    managerName,
    country,
    birthYear,
    skill,
  };
};
