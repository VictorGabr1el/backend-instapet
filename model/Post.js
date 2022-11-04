import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./User.js";

export const Post = sequelize.define("Posts", {
  post_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  img_post: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  legend: {
    type: DataTypes.STRING,
  },
});

Post.belongsTo(User, {
  constraints: true,
  foreignKey: "userId",
});

User.hasMany(Post, {
  foreignKey: "userId",
});
