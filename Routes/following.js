import express from "express";
import { Comment, Post, User, Following } from "../model/index.js";

const followingRouter = express.Router();

//                                                      //
// --------------------- CREATE ----------------------- //
//                                                      //

followingRouter.post("/user/:userId/following/:following", async (req, res) => {
  const id = req.params;

  const userId = id.userId;
  const followId = id.following;

  const follow = await Following.create({
    userId: userId,
    following_id: followId,
  });

  try {
    return res.status(201).json({ message: "começou a seguir", follow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel fazer comentário", error });
  }
});

followingRouter.get("/following", async (req, res) => {
  console.log("ola");
  //   const post = await Following.findAll();
  const post = await Following.findAll({
    attributes: ["userId", "following_id", "id"],
    include: [
      {
        model: User,
        attributes: ["user_id", "avatar", "username"],
        include: [
          {
            model: Post,
            include: [
              {
                model: Comment,
                attributes: ["comment_id", "content", "createdAt"],
                include: [
                  {
                    model: User,
                    attributes: ["user_id", "avatar", "username", "createdAt"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["user_id", "avatar", "username"],
        include: [
          {
            model: Post,
            include: [
              {
                model: Comment,
                attributes: ["comment_id", "content", "createdAt"],
                include: [
                  {
                    model: User,
                    attributes: ["user_id", "avatar", "username", "createdAt"],
                  },
                ],
                separate: true,
                order: [["createdAt", "DESC"]],
              },
            ],
            attributes: ["post_id", "img_post", "legend", "createdAt"],
            order: [["createdAt", "DESC"]],
          },
        ],
      },
    ],
  });

  if (!post) {
    return res.status(400).json({ message: "posts não encontrados" });
  }
  try {
    return res.status(201).json({ message: "seus posts", post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel fazer comentário", error });
  }
});

followingRouter.get("/k", (req, res) => {
  return "olá";
});

export default followingRouter;
