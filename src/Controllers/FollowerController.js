import { UserModel, FollowersModel } from "../model/index.js";

async function getAllUsersFollowers(request, response) {
  const userId = request.params.userId;

  if (!userId) {
    return res.status(403).json({ message: "seu ID não foi encontrado" });
  }
  try {
    const followers = await FollowersModel.findAll({
      where: { userId: userId },
      include: {
        model: UserModel,
        attributes: ["id", "name", "username", "avatar"],
      },
    });

    if (!followers) {
      return response
        .status(204)
        .json({ message: "esse usuario não tem seguidores" });
    }

    return response.status(200).json(followers);
  } catch (error) {
    return response.status(500).json({
      message: "Desculpe ocoreu um erro, tente mais tarder",
      error: error.message,
    });
  }
}

export { getAllUsersFollowers };
