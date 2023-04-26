import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./User.js";

export const Followers = sequelize.define("Followers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

Followers.belongsTo(User, {
  foreignKey: "followersId",
});

User.hasMany(Followers, {
  foreignKey: "userId",
});
