import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { UserModel } from "./UserModel.js";

export const FollowingModel = sequelize.define("Following", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

FollowingModel.belongsTo(UserModel, {
  foreignKey: "followingId",
  onDelete: "CASCADE",
});

UserModel.hasMany(FollowingModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
