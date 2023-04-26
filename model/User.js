import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    // type: DataTypes.STRING(40),
    allowNull: false,
  },

  username: {
    type: DataTypes.STRING,
    // type: DataTypes.STRING(20),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    // type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    // type: DataTypes.STRING(30),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
