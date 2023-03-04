import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(`${process.env.HOST}`);

try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão db: ", error);
}
