import { UserModel, FollowingModel, FollowersModel } from "../model/index.js";

async function follow(request, response) {
  const userId = request.id;
  const followId = Number(request.params.followId);

  if (!followId) {
    return response.status(403).json({ message: "followId não encontrado" });
  }

  try {
    const verifyIfFollowing = await FollowingModel.findOne({
      where: {
        userId: userId,
        followingId: followId,
      },
    });

    if (verifyIfFollowing) {
      return res
        .status(403)
        .json({ message: "você já está seguindo este usuário" });
    }

    await FollowingModel.create({
      userId: userId,
      followingId: followId,
    }).then(() => {
      FollowersModel.create({
        followersId: userId,
        userId: followId,
      });
    });

    return response.status(201).json({ message: "começou a seguir " });
  } catch (error) {
    return response.status(500).json({
      message: "não foi possivel fazer comentário",
      error: error.message,
    });
  }
}

async function getAllUserFollowings(request, response) {
  const userId = Number(request.params.userId);

  if (!userId) {
    return response.status(400).json({ message: "userID não encontrado" });
  }

  try {
    const followings = await FollowingModel.findAll({
      where: { userId: userId },
      include: {
        model: UserModel,
        attributes: ["id", "name", "username", "avatar"],
      },
    });

    return response.status(200).json(followings);
  } catch (error) {
    return response
      .status(500)
      .json({
        message: "Desculpe ocoreu um erro, tente mais tarder",
        error: error.message,
      });
  }
}

async function unfollow(request, response) {
  const userId = request.id;
  const followId = Number(request.params.followId);

  if (!followId) {
    response.status(400).json({
      message: "não foi possivel deixar de seguir, perfil não encontrado",
    });
  }

  try {
    const verifyRegister = await FollowingModel.findOne({
      where: {
        userId: userId,
        followingId: followId,
      },
    });

    if (!verifyRegister) {
      return response
        .status(403)
        .json({ message: "você não segue este usuário" });
    }

    await FollowingModel.destroy({
      where: {
        userId: userId,
        followingId: followId,
      },
    });

    await FollowersModel.destroy({
      where: {
        userId: followId,
        followersId: userId,
      },
    });
    return response.status(200).json({ message: "você deixou de seguir" });
  } catch (error) {
    return response.status(500).json({
      message: "Ocorreu algum erro, tente mais tarde",
      error: error.message,
    });
  }
}

export { follow, getAllUserFollowings, unfollow };
