import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  "postgres://socialdb:@*ndbfjd12@socialdb.postgres.database.azure.com:5432/postgres?sslmode=require"
);

try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão db: ", error);
}
