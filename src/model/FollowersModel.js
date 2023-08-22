import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { UserModel } from "./UserModel.js";

export const FollowersModel = sequelize.define("Followers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

FollowersModel.belongsTo(UserModel, {
  foreignKey: "followersId",
  onDelete: "CASCADE",
});

UserModel.hasMany(FollowersModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
