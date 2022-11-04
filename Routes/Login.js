import express, { json } from "express";
import { Comment, Post, sequelize, User } from "../model/index.js";
import { Op, QueryTypes } from "sequelize";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verifytoken from "../middlewares/verifytoken.js";
const loginRouter = express.Router();

//                                                      //
// -------------------- REGISTER ---------------------- //
//                                                      //

loginRouter.post("/register", async (req, res) => {
  console.log(req.data);
  const { name, username, avatar, email, password, confirmPass } = req.body;

  if (!name) {
    return res.status(400).json({ message: "digite seu primeiro nome" });
  }

  if (!username) {
    return res.status(400).json({ message: "digite seu segundo nome" });
  }

  if (!email) {
    return res.status(400).json({ message: "digite seu email" });
  }

  if (!password) {
    return res.status(400).json({ message: "digite uma senha" });
  }

  if (!confirmPass) {
    return res.status(400).json({ message: "confirme sua senha" });
  }

  if (!confirmPass) {
    return res.status(400).json({ message: "as senhas não estão iguais" });
  }

  const verifyEmail = await User.findOne({
    where: { email: email },
  });

  if (Boolean(verifyEmail) === true) {
    return res.status(400).json({ message: "esse email já está em uso" });
  }

  const verifyUsername = await User.findOne({
    where: { username: username },
  });

  if (Boolean(verifyUsername) === true) {
    return res.status(400).json({ message: "esse username já está em uso" });
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const user = User.build({
    name,
    username,
    email,
    password: hash,
    avatar,
  });

  try {
    await user.save();

    user.password = undefined;

    return res
      .status(201)
      .json({ user, token: gerartoken({ params: user.user_id }) });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel relizar seu cadastro" });
  }
});

//

function gerartoken(params = {}) {
  const secret = process.env.SECRET;
  const token = Jwt.sign(params, secret, {
    expiresIn: 86400,
  });
  return token;
}

//                                               //
// ------------------- LOGIN ------------------- //
//                                               //

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (!email) {
    return res.status(400).json({ message: "digite seu email" });
  }

  if (!password) {
    return res.status(400).json({ message: "digite uma senha" });
  }

  const user = await User.findOne({
    where: { email: email },
  });

  if (Boolean(user) === false) {
    return res.status(401).json({ message: "email ou senha incorretos" });
  }

  const checkPass = await bcrypt.compare(String(password), user.password);

  if (!checkPass) {
    return res.status(401).json({ message: "email ou senha incorretos" });
  }
  user.password = undefined;

  try {
    console.log(json(user));
    return res
      .status(200)
      .json({ user, token: gerartoken({ params: user.user_id }) });
  } catch (error) {
    return res.status(501).json(error);
  }
});

//                                                     //
// --------------------- LOGADO ---------------------- //
//                                                     //

loginRouter.get("/logado", verifytoken, async (req, res) => {
  const Id = req.id;

  console.log(Id);
  if (!Id) {
    return res.status(401).json({ message: "acesso negado, token inválido" });
  }

  const user = await sequelize.query(
    `SELECT "user_id", "username", "avatar", "name" FROM "Users" WHERE "user_id" = ${Id}`,
    {
      type: QueryTypes.SELECT,
    }
  );

  try {
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocorreu um erro, tente mais tarde", error });
  }
});

//                                                      //
// ------------------ DELETE ACCOUNT ------------------ //
//                                                      //

loginRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params;

  const user = await User.destroy({ where: { user_id: id.id } });

  if (Boolean(user) === false) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }

  return res.status(200).json({ message: "usuario deletado" });
});

//
// ----------------- FIND USERS ------------------
//

loginRouter.get("/user", async (req, res) => {
  const user = await User.findAll({
    attributes: ["user_id", "username", "avatar"],
  });
  if (!user) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }
  try {
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default loginRouter;
