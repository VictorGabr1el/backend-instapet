import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres", "useradmin1", {
  host: "35.247.246.79",
  port: 5432,
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão db: ", error);
}
