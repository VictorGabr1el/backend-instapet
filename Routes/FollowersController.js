import express from "express";
import { UserModel, FollowersModel } from "../model/index.js";

const followersRouter = express.Router();

followersRouter.get("/user/:userId/followers", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(403).json({ message: "seu ID não foi encontrado" });
  }

  const followers = await FollowersModel.findAll({
    where: { userId: userId },
    include: {
      model: UserModel,
      attributes: ["id", "name", "email", "username", "avatar"],
    },
  });

  try {
    return res.status(200).json(followers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Desculpe ocoreu um erro, tente mais tarder", error });
  }
});

export default followersRouter;
