import { Sequelize } from "sequelize";
import * as pg from "pg";

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

export const sequelize = new Sequelize(name, user, pass, {
  host: host,
  port: port,
  dialect: pg,
});
try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão bd: ", error);
}
