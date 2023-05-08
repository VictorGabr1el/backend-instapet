import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const port = process.env.DB_PORT;

export const sequelize = new Sequelize(database, user, pass, {
  host: host,
  port: port,
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão db: ", error);
}
