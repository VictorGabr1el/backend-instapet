import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

// export const sequelize = new Sequelize(process.env.HOST);

export const sequelize = new Sequelize(
  "oxpzogsz",
  "oxpzogsz",
  "RMr0YWWYUetdJO6qspKGmezwG5rmNFgA",
  {
    host: "motty.db.elephantsql.com",
    port: 5432,
    dialect: "postgres",
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection successfully.");
} catch (error) {
  console.error("Não foi possivel realizar conexão db: ", error);
}
