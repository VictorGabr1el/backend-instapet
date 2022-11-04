import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Post } from "./Post.js";
import { User } from "./User.js";

export const Comment = sequelize.define("Comment", {
  comment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Post.hasMany(Comment, {
  foreignKey: "postId",
});

Comment.belongsTo(User, {
  constraints: true,
  foreignKey: "commentUserId",
});
