import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import { UserModel, FollowingModel, FollowersModel } from "../model/index.js";

const followingRouter = express.Router();

//                                                      //
// --------------------- CREATE ----------------------- //
//                                                      //
followingRouter.post("/follow/:followId", verifytoken, async (req, res) => {
  const userId = req.id;
  const followId = req.params.followId;

  if (!userId) {
    return res.status(403).json({ message: "seu ID não foi encontrado" });
  }

  if (!followId) {
    return res.status(403).json({ message: "followId não encontrado" });
  }

  const follow = await FollowingModel.create({
    userId: userId,
    followingId: followId,
  }).then(() => {
    FollowersModel.create({
      followersId: userId,
      userId: followId,
    });
  });

  try {
    return res.status(201).json({ message: "começou a seguir", follow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel fazer comentário", error });
  }
});

//                                                      //
// --------------------- GET ONE ---------------------- //
//                                                      //

followingRouter.get("/user/:userId/following/:followId", async (req, res) => {
  const userId = req.params.userId;
  const followId = req.params.followId;

  const following = await FollowingModel.findOne({
    where: {
      followingId: followId,
      userId: userId,
    },
    include: { model: UserModel, attributes: ["name", "email", "username"] },
  });

  try {
    return res.status(201).json(following);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Desculpe ocoreu um erro, tente mais tarder", error });
  }
});

//                                                      //
// --------------------- GET ALL ---------------------- //
//                                                      //

followingRouter.get("/user/:userId/following", async (req, res) => {
  const userId = req.params.userId;

  const following = await FollowingModel.findAll({
    where: { userId: userId },
    include: {
      model: UserModel,
      attributes: ["id", "name", "email", "username", "avatar"],
    },
  });

  try {
    return res.status(200).json(following);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Desculpe ocoreu um erro, tente mais tarder", error });
  }
});

//                                                      //
// --------------------- DELETE FOLLOWING ---------------------- //
//                                                      //

followingRouter.delete(
  "/following/:followId",
  verifytoken,
  async (req, res) => {
    const userId = req.id;
    const followId = req.params.followId;

    if (!userId) {
      res
        .status(400)
        .json({ message: "não foi possivel deixar de seguir este perfil" });
    }

    if (Boolean(followId) === false) {
      res.status(400).json({
        message: "não foi possivel deixar de seguir, perfil não encontrado",
      });
    }

    const verifyRegister = await FollowingModel.findOne({
      where: {
        userId: userId,
        followingId: followId,
      },
    });

    if (!verifyRegister) {
      return res.status(403).json({ message: "você não segue este usuário" });
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
    })
      .then(() => {
        return res.status(200).json({ message: "pronto" });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
);

export default followingRouter;
