import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./User.js";

export const Following = sequelize.define("Following", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

Following.belongsTo(User, {
  foreignKey: "follow",
});

User.hasMany(Following, {
  foreignKey: "userId",
});
