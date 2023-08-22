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
    defaultValue: "",
  },

  legend: {
    type: DataTypes.STRING(800),
    allowNull: true,
    defaultValue: "",
  },
});

PostModel.belongsTo(UserModel, {
  constraints: true,
  foreignKey: "userId",
  onDelete: "CASCADE",
});

UserModel.hasMany(PostModel, {
  foreignKey: "userId",
});
