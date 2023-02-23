import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import { User, Following } from "../model/index.js";

const followingRouter = express.Router();

//                                                      //
// --------------------- CREATE ----------------------- //
//                                                      //

followingRouter.post("/following/:followId", verifytoken, async (req, res) => {
  const userId = req.id;
  const followId = req.params.followId;

  const follow = await Following.create({
    userId: userId,
    follow: followId,
  });

  try {
    return res.status(201).json({ message: "começou a seguir", follow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel fazer comentário", error });
  }
});

followingRouter.get("/following/:followId", async (req, res) => {
  const followId = req.params.followId;

  const followers = await Following.findAll({
    where: {
      follow: followId,
    },
  });

  const followersId = followers.map((users) => users.userId);

  const followersResult = await User.findAll({
    where: {
      id: followersId,
    },
  });

  try {
    return res.status(201).json(followersResult);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Desculpe ocoreu um erro, tente mais tarder", error });
  }
});

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

    Following.destroy({
      where: {
        userId: userId,
        follow: followId,
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
