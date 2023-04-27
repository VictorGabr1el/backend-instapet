import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },

  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },

  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  biograph: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
});
