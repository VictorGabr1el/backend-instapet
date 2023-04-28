import express from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verifytoken from "../middlewares/verifytoken.js";
import {
  UserModel,
  PostModel,
  FollowingModel,
  FollowersModel,
} from "../model/index.js";
import { Op } from "sequelize";

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

  if (username.length > 20) {
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

  if (confirmPass !== password) {
    return res.status(400).json({ message: "as senhas não estão iguais" });
  }

  const verifyEmail = await UserModel.findOne({
    where: { email: email },
  });

  if (Boolean(verifyEmail) === true) {
    return res.status(400).json({ message: "esse email já está em uso" });
  }

  const verifyUsername = await UserModel.findOne({
    where: { username: username },
  });

  if (Boolean(verifyUsername) === true) {
    return res.status(400).json({ message: "esse username já está em uso" });
  }

  const salt = await bcrypt.genSalt(11);
  const hash = await bcrypt.hash(password, salt);

  const user = await UserModel.create({
    name,
    username,
    email,
    password: hash,
    avatar,
  });

  try {
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

function gerartoken(params = {}) {
  const secret = process.env.SECRET;
  const token = Jwt.sign(params, secret, {
    expiresIn: 604800, // 3 days
  });
  return token;
}

// ------------------- LOGIN ------------------- //

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(password, email);

  if (!email) {
    return res.status(400).json({ message: "digite seu email" });
  }

  if (!password) {
    return res.status(400).json({ message: "digite uma senha" });
  }

  const user = await UserModel.findOne({
    attributes: ["id", "name", "username", "avatar", "biograph", "password"],
    where: { email: email },
    include: [
      {
        model: FollowingModel,
        attributes: ["id", "followingId"],
      },
      {
        model: FollowersModel,
        attributes: ["id", "followersId"],
      },
    ],
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

  const user = await UserModel.findByPk(Id, {
    attributes: ["id", "name", "username", "avatar", "biograph"],
    include: [
      {
        model: FollowingModel,
        attributes: ["id", "followingId"],
      },
      {
        model: FollowersModel,
        attributes: ["id", "followersId"],
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

  console.log(typeof password);

  if (!password) {
    res.status(400).json({ message: "digite sua senha" });
  }
  if (!id) {
    res
      .status(400)
      .json({ message: "não foi possivel deletar usuario, id não encontrado" });
  }

  const user = await UserModel.findOne({ where: { id: id } });

  if (!user) {
    return res.status(400).json({
      message: "não foi possivel deletar sua conta, usuario não encontrado",
    });
  }

  const checkPass = await bcrypt.compare(password, user.password);

  if (!checkPass) {
    return res.status(401).json({ message: "email ou senha incorretos" });
  }

  if (Boolean(user) === false) {
    return res.status(400).json({ message: "você digitou a senha errada" });
  }

  const deleteUser = await UserModel.destroy({
    where: {
      id: id,
    },
  });

  if (!deleteUser) {
    return res
      .status(400)
      .json({ message: "não foi possivel deletar usuario" });
  }

  try {
    return res.status(200).json({ message: "usuario deletado", reload: true });
  } catch (error) {
    return res.status(500).json(error);
  }
});

//  ------------------ FIND ONE USER --------------------- //

userRouter.get("/user/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    return res.status(404).json({ message: "id não encontrado" });
  }

  const user = await UserModel.findByPk(userId, {
    attributes: ["id", "name", "username", "avatar", "biograph"],
    include: [
      {
        separate: true,
        model: PostModel,
        attributes: ["id", "img_post"],
        order: [["createdAt", "DESC"]],
      },
      { model: FollowingModel, attributes: ["id", "followingId", "userId"] },
      { model: FollowersModel, attributes: ["id", "followersId", "userId"] },
    ],
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

// ----------------- FIND ALL USERS ------------------ //

userRouter.get("/users", async (req, res) => {
  const user = await UserModel.findAll({
    attributes: ["id", "name", "username", "avatar"],
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

// ----------------- FIND ALL USERS !!CONDITIONALLY!! ------------------ //

userRouter.get("/users/:username", async (req, res) => {
  const username = req.params.username.toLocaleLowerCase();

  if (!username) {
    return res
      .status(404)
      .json({ message: "parametro username não encontrado" });
  }

  const users = await UserModel.findAll({
    attributes: ["id", "name", "username", "avatar"],
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${username}%`,
          },
        },
        {
          username: {
            [Op.like]: `%${username}%`,
          },
        },
      ],
    },
  });

  if (!users) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }

  try {
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// ----------------- FIND RANDOM USERS ------------------- //

userRouter.get("/random/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    return res.status(404).json({ message: "id não encontrado" });
  }

  const userFollowing = await FollowingModel.findAll({
    attributes: ["userId", "followingId"],
    where: { userId: userId },
  });

  if (!userFollowing) {
    return res.status(404).json({ message: " user!!! não encontrado" });
  }

  const FollowingsIDs = await new Promise((resolve) =>
    resolve(userFollowing.map((u) => Number(u.followingId)))
  );

  FollowingsIDs.push(userId);

  const randomUsers = await UserModel.findAll({
    where: {
      id: {
        [Op.notIn]: FollowingsIDs,
      },
    },
    limit: 7,
  });

  if (!randomUsers) {
    return res.status(404).json({ message: "Usuarios não encontrados" });
  }

  try {
    return res.status(200).json(randomUsers);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// ----------------- UPDATE USER ------------------- //

userRouter.put("/user", verifytoken, async (req, res) => {
  const id = req.id;
  const { username, name, avatar, biograph } = req.body;

  console.log(req.body);

  if (!id) {
    res
      .status(400)
      .json({ message: "não foi possivel deletar usuario, id não encontrado" });
  }

  if (name.length > 40) {
    return res
      .status(400)
      .json({ message: "O nome não pode ter mais de 40 caracteres" });
  }

  if (username.length > 20) {
    return res
      .status(400)
      .json({ message: "O username não pode ter mais de 20 caracteres" });
  }

  if (biograph.length > 200) {
    return res
      .status(400)
      .json({ message: "A biografia não pode ter mais de 200 caracteres" });
  }

  const findUser = await UserModel.findOne({ where: { id: id } });

  console.log(findUser.username);

  if (!findUser) {
    res.status(403).json({ message: "usuario não encontrado!" });
  }
  if (username !== "" && findUser.username !== username) {
    const verifyUsername = await UserModel.findOne({
      where: { username: username },
    });

    if (verifyUsername) {
      return res.status(400).json({ message: "username já está em uso" });
    }
  }
  const data = {
    username: username !== "" ? username : "",
    name: name !== "" ? name : "",
    biograph: biograph ? biograph : "",
    avatar: avatar !== "" ? avatar : "",
  };

  try {
    const user = await UserModel.update({ ...data }, { where: { id: id } });

    if (!user) {
      console.log(user);
      return res
        .status(400)
        .json({ message: "não foi possivel atualizar seus dados" });
    } else {
      return res
        .status(200)
        .json({ message: "usuario atualizado com sucesso" });
    }
  } catch (error) {
    res.status(500).json({
      message: "não foi possivel atualizar seus dados, tente mais tarde",
    });
  }
});

export default userRouter;
