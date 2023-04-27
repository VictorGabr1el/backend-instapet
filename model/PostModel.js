import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { UserModel } from "./UserModel.js";

export const PostModel = sequelize.define("Posts", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  img_post: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  legend: {
    type: DataTypes.STRING(800),
    allowNull: true,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

PostModel.belongsTo(UserModel, {
  constraints: true,
  foreignKey: "userId",
});

UserModel.hasMany(PostModel, {
  foreignKey: "userId",
});
