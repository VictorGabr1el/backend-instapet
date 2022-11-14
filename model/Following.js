import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./User.js";

export const Following = sequelize.define("Following");

User.hasMany(Following, {
  as: "seguidores",
  foreignKey: "following_id",
});

Following.belongsTo(User, {
  constraints: true,
  foreignKey: "userId",
});
