import express from "express";
import { Following, Post, User } from "../model/index.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verifytoken from "../middlewares/verifytoken.js";

const userRouter = express.Router();

// -------------------- REGISTER ---------------------- //

userRouter.post("/register", async (req, res) => {
  const { name, username, avatar, email, password, confirmPass } = req.body;

  if (!name) {
    return res.status(400).json({ message: "digite seu nome completo" });
  }

  if (name.lenght > 40) {
    return res
      .status(400)
      .json({ message: "O nome não pode ter mais de 40 caracteres" });
  }

  if (!username) {
    return res.status(400).json({ message: "digite um username" });
  }

  if (username > 20) {
    return res
      .status(400)
      .json({ message: "O username não pode ter mais de 20 caracteres" });
  }

  if (!email) {
    return res.status(400).json({ message: "digite seu email" });
  }
  if (!avatar) {
    return res
      .status(400)
      .json({ message: "adicione uma imagem no seu perfil" });
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

  const salt = await bcrypt.genSalt(11);
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
      .json({ user, token: gerartoken({ params: user.id }) });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel relizar seu cadastro", error });
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

// ------------------- LOGIN ------------------- //

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
    return res
      .status(200)
      .json({ user, token: gerartoken({ params: user.id }) });
  } catch (error) {
    return res.status(501).json(error);
  }
});

// --------------------- LOGADO ---------------------- //

userRouter.get("/logado", verifytoken, async (req, res) => {
  const Id = req.id;

  if (!Id) {
    return res.status(401).json({
      message: "acesso negado, token inválido, não retornou id",
    });
  }

  const user = await User.findByPk(Id, {
    attributes: ["name", "avatar", "username", "id"],
    include: [
      {
        model: Following,
        include: [
          {
            model: User,
            attributes: ["id", "avatar", "username"],
          },
        ],
      },
    ],
  });

  try {
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocorreu um erro, tente mais tarde", error });
  }
});

// ------------------ DELETE ACCOUNT ------------------ //

userRouter.delete("/deleteaccount", verifytoken, async (req, res) => {
  const id = req.id;

  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "digite sua senha" });
  }
  if (!id) {
    res
      .status(400)
      .json({ message: "não foi possivel deletar usuario, id não encontrado" });
  }

  const user = await User.findOne({ where: { id: id, password: password } });

  if (Boolean(user) === false) {
    return res.status(400).json({ message: "você digitou a senha errada" });
  }

  const deleteUser = await User.destroy({
    where: {
      id: id,
      password: password,
    },
  });

  if (!deleteUser) {
    return res
      .status(400)
      .json({ message: "não foi possivel deletar usuario" });
  }

  try {
    return res.status(200).json({ message: "usuario deletado" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// ----------------- FIND USERS ------------------

userRouter.get("/users", async (req, res) => {
  const user = await User.findAll({
    attributes: ["id", "name", "username", "avatar"],
  });

  const randomUsers = await User.sequelize.query(
    'SELECT * FROM "Users" ORDER BY random() LIMIT 5;'
  );
  if (!user) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }
  if (!randomUsers) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }
  console.log(randomUsers);
  try {
    return res.status(200).json({ user, randomUsers });
  } catch (error) {
    return res.status(500).json(error);
  }
});

userRouter.get("/user/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  console.log(userId);

  if (!userId) {
    return res.status(404).json({ message: "id não encontrado" });
  }

  const user = await User.findByPk(userId, {
    include: Post,
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

export default userRouter;
