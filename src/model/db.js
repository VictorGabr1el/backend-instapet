import { Sequelize } from "sequelize";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_USER,
} from "../envConfig.js";

export const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("Connection DB successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão DB: ", error);
}
