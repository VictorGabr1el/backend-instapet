import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import {
  UserModel,
  FollowingModel,
  FollowersModel,
  PostModel,
} from "../model/index.js";
import { SECRET } from "../envConfig.js";
import userDataValidate from "../utils/userDataValidate.js";

async function validateUniqueField(
  field,
  value,
  errorMessage,
  errorStatusCode
) {
  const data = await UserModel.findOne({ where: { [field]: value } });
  if (field === "email" || field === "username") {
    if (data) {
      throw { message: errorMessage, statusCode: errorStatusCode };
    }
  } else if (!data) {
    throw { message: errorMessage, statusCode: errorStatusCode };
  }
  return data;
}

function generateToken(params = {}) {
  const secret = SECRET;
  const token = Jwt.sign(params, secret, {
    expiresIn: 604800, // 3 days
  });
  return token;
}

const userSearchTemplate = {
  attributes: ["id", "name", "username", "avatar", "biograph", "password"],
  where: {},
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
};

async function registerUser(request, response) {
  try {
    const { name, username, avatar, email, password } = userDataValidate({
      name: request.body.name,
      username: request.body.username,
      avatar: request.body.avatar,
      email: request.body.email,
      password: request.body.password,
      confirmPass: request.body.confirmPass,
    });

    // usar promise all
    await Promise.all([
      validateUniqueField("email", email, "Esse email já está em uso", 400),
      validateUniqueField(
        "username",
        username,
        "Esse Username já está em uso",
        400
      ),
    ]);

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      name,
      avatar,
      username: username,
      email: email,
      password: hashedPassword,
    });

    user.password = undefined;

    return response
      .status(201)
      .json({ user, token: generateToken({ params: user.id }) });
  } catch (error) {
    return response.status(error.statusCode || 500).json({
      message: "Não foi possível realizar o cadastro",
      error: error.message,
    });
  }
}

async function login(request, response) {
  try {
    const { email, password } = userDataValidate({
      email: request.body.email,
      password: request.body.password,
    });

    userSearchTemplate.where.email = email.toLowerCase();
    const user = await UserModel.findOne(userSearchTemplate);

    if (!Boolean(user)) {
      return response
        .status(401)
        .json({ message: "email e/ou senha incorretos" });
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return response
        .status(401)
        .json({ message: "email e/ou senha incorretos" });
    }
    user.password = undefined;

    return response
      .status(200)
      .json({ user, token: generateToken({ params: user.id }) });
  } catch (error) {
    return response.status(error.statusCode || 500).json({
      message: "Não foi possível fazer login",
      error: error.message,
    });
  }
}

async function loggedUser(request, response) {
  const id = request.id;
  try {
    userSearchTemplate.where.id = id;
    const user = await UserModel.findOne(userSearchTemplate);

    if (!Boolean(user)) {
      return response.status(400).json({
        message: "Usuario não encontrado! Tente fazer login novamente",
      });
    }

    return response.status(200).json(user);
  } catch (error) {
    response.status(500).json({
      message: "ocorreu um erro, tente fazer login novamente",
      error: error.message,
    });
  }
}

async function updateUser(request, response) {
  try {
    const id = request.id;
    const data = userDataValidate(request.body); // {name, username, biografia}

    const validateUser = await validateUniqueField(
      "id",
      id,
      "usuario não encontrado!, tente fazer login novamente"
    );

    if (data.username) {
      if (validateUser.username !== data.username) {
        await validateUniqueField(
          "username",
          data.username,
          "username já está em uso"
        );
      }
    }

    const user = await UserModel.update(data, { where: { id: id } });

    if (!user) {
      return response
        .status(400)
        .json({ message: "não foi possivel atualizar seus dados" });
    }

    return response
      .status(200)
      .json({ message: "usuario atualizado com sucesso" });
  } catch (error) {
    response.status(error.statusCode || 500).json({
      message: "não foi possivel atualizar seus dados, tente mais tarde",
      error: error.message,
    });
  }
}

async function deleteUserAccount(request, response) {
  const id = request.id;
  const { password } = userDataValidate({ password: request.body.password });

  try {
    const user = await validateUniqueField(
      "id",
      id,
      "usuario não encontrado, tente fazer login novamente",
      400
    );
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return response
        .status(400)
        .json({ message: "você digitou a senha errada" });
    }

    const deleteUser = await UserModel.destroy({ where: { id: id } });

    if (!deleteUser) {
      return response
        .status(400)
        .json({ message: "não foi possivel deletar usuario" });
    }

    return response
      .status(200)
      .json({ message: "usuario deletado", reload: true });
  } catch (error) {
    return response.status(error.statusCode || 500).json({
      message: "Não foi possivel deletar sua conta, tente mais tarde",
      error: error.message,
    });
  }
}

//  ------------------ FIND ONE USER --------------------- //

async function findOneUserById(request, response) {
  const userId = Number(request.params.userId);

  try {
    if (!userId || userId <= 0) {
      return response.status(400).json({ message: "id não encontrado" });
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
      return response.status(400).json({ message: "Usuário não encontrado" });
    }
    return response.status(200).json(user);
  } catch (error) {
    return response.status(error.statusCode || 500).json({
      message: "Não foi possivel fazer a busca pelo usuário, tente mais tarde",
      error: error.message,
    });
  }
}

// ----------------- FIND ALL USERS ------------------ //

async function findAllUsers(request, response) {
  try {
    const user = await UserModel.findAll({
      attributes: ["id", "name", "username", "avatar", "email"],
    });

    if (!user) {
      return response.status(400).json({ message: "Usuarios não encontrados" });
    }

    return response.status(200).json(user);
  } catch (error) {
    return response.status(500).json({
      message:
        "Não foi possivel fazer a busca por todos os usuários, tente mais tarde",
      error: error.message,
    });
  }
}

// ----------------- FIND ALL USERS BY NAME OR USERNAME ------------------ //

async function findAllUsersByNameOrUsername(request, response) {
  try {
    const username = userDataValidate({ username: request.params.username });

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
      return response.status(400).json({ message: "Usuarios não encontrados" });
    }

    return response.status(200).json(users);
  } catch (error) {
    return response.status(error.statusCode || 500).json({
      message: `Não foi possivel encontrar esse usuário, tente mais tarde`,
      error: error.message,
    });
  }
}

// ----------------- FIND RANDOM USERS ------------------- //

async function findRandomUsers(request, response) {
  const userId = Number(request.params.userId);

  try {
    if (!userId) {
      return response.status(400).json({ message: "id não encontrado" });
    }

    const findFollowings = await FollowingModel.findAll({
      attributes: ["userId", "followingId"],
      where: { userId: userId },
    });

    if (!findFollowings) {
      return response
        .status(400)
        .json({ message: " followings não encontrado" });
    }

    const getFollowingsIds = await new Promise((resolve) =>
      resolve(findFollowings.map((u) => Number(u.followingId)))
    );

    getFollowingsIds.push(userId);

    const randomUsers = await UserModel.findAll({
      where: {
        id: {
          [Op.notIn]: getFollowingsIds,
        },
      },
      limit: 7,
    });

    if (!randomUsers) {
      return response.status(400).json({ message: "Usuarios não encontrados" });
    }

    return response.status(200).json(randomUsers);
  } catch (error) {
    return response.status(500).json({
      message:
        "Não foi possivel buscar por sugestões para você, tente mais tarde",
      error: error.message,
    });
  }
}

export {
  registerUser,
  login,
  loggedUser,
  updateUser,
  deleteUserAccount,
  findOneUserById,
  findAllUsers,
  findAllUsersByNameOrUsername,
  findRandomUsers,
};
