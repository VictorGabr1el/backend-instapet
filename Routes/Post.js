import express from "express";
import { sequelize, User, Post, Comment } from "../model/index.js";
import { Op, QueryTypes } from "sequelize";

const postRouter = express.Router();

//                                                      //
// -------------------- CREATE ---------------------- //
//                                                      //

postRouter.post("/user/:userId/post", async (req, res) => {
  const { img, legend } = req.body;
  const id = req.params;

  if (!img) {
    return res.status(400).json({ message: "poste uma imagem" });
  }

  if (!legend) {
    return res.status(400).json({ message: "digite uma legenda" });
  }

  if (!id) {
    return res
      .status(400)
      .json({ message: "Não foi possivel fazer a postagem" });
  }

  const user = await User.findOne({ where: { user_id: id.userId } });

  if (Boolean(user) === false) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }

  const post = await Post.create({
    img_post: img,
    legend: legend,
    userId: id.userId,
  });

  try {
    return res.status(201).json({ message: "postagem criada", reaload: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel relizar seu cadastro" });
  }
});

//                                                   //
// ------------------- ALL POSTS ------------------- //
//                                                   //

postRouter.get("/post", async (req, res) => {
  const post = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ["user_id", "avatar", "username"],
      },
      {
        model: Comment,
        attributes: ["comment_id", "content", "createdAt"],
        include: {
          model: User,
          attributes: ["user_id", "avatar", "username", "createdAt"],
        },
        separate: true,
        order: [["createdAt", "DESC"]],
      },
    ],
    attributes: ["post_id", "img_post", "legend", "createdAt"],
    order: [["createdAt", "DESC"]],
  });

  if (!post) {
    return res.status(400).json({ message: "postagens não encontradas" });
  }

  try {
    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocrreu um erro, tente mais tarde", error });
  }
});

//                                                     //
// ------------------- USER POSTS -------------------- //
//                                                     //

postRouter.get("/user/:userId/post", async (req, res) => {
  const id = req.params;
  const userId = id.userId;
  const posts = await User.findByPk(userId, { include: Post });

  if (!posts) {
    return res.status(400).json({ message: "postagens não encontradas" });
  }

  try {
    return res.status(200).json(posts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocrreu um erro, tente mais tarde", error });
  }
});

//                                                      //
// -------------------- DELETE POST ------------------- //
//                                                      //

postRouter.delete("/user/:userId/post/:postId", async (req, res) => {
  const id = req.params;

  const userId = id.userId;
  const postId = id.postId;

  if (!userId) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }
  if (!postId) {
    return res.status(400).json({ message: "postagem não encontrada" });
  }

  const user = await Post.destroy({
    where: { userId: userId, post_id: postId },
  });

  console.log(Boolean(user));

  if (!user) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }

  try {
    return res.status(200).json({ message: "postagem deletada" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default postRouter;
