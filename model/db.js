import { Sequelize } from "sequelize";

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

export const sequelize = new Sequelize(
  "instapet",
  "Victor_admin",
  "useradmin1",
  {
    host: "instapet.cd52n0qtge9x.us-east-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
  }
);
try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão bd: ", error);
}
