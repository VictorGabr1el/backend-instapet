import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { PostModel } from "./PostModel.js";
import { UserModel } from "./UserModel.js";

export const CommentModel = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  content: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

PostModel.hasMany(CommentModel, {
  foreignKey: "postId",
});

CommentModel.belongsTo(UserModel, {
  constraints: true,
  foreignKey: "userId",
});
