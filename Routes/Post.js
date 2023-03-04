import express from "express";
import { User, Post, Comment, sequelize } from "../model/index.js";
import verifytoken from "../middlewares/verifytoken.js";
import { Op } from "sequelize";

const postRouter = express.Router();

// -------------------- CREATE ---------------------- //

postRouter.post("/post", verifytoken, async (req, res) => {
  const id = req.id;

  const { img, legend } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Não foi possivel fazer a publicação" });
  }

  if (!img) {
    return res.status(400).json({ message: "poste uma imagem" });
  }

  if (!legend) {
    return res.status(400).json({ message: "digite uma legenda" });
  }

  const post = await Post.create({
    img_post: img,
    legend: legend,
    userId: id,
  });

  try {
    return res
      .status(201)
      .json({ message: "publicação criada", reaload: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel relizar seu cadastro" });
  }
});

// ------------------- ALL POSTS ------------------- //

postRouter.get("/post", async (req, res) => {
  // const posts = await Post.destroy({
  //   where: {
  //     id: {
  //       [Op.gt]: 10,
  //     },
  //   },
  // });
  const posts = await Post.findAll({
    attributes: ["id", "img_post", "legend", "createdAt"],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["id", "avatar", "username"],
      },
      {
        model: Comment,
        where: {},
        attributes: ["id", "content", "createdAt"],
        include: {
          model: User,
          attributes: ["id", "avatar", "username", "createdAt"],
        },
        separate: true,
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  // const post = await sequelize.query(
  //   'SELECT "Posts"."id", "Posts"."img_post", "Posts"."legend", "Posts"."createdAt", "User"."id" AS "User.id", "User"."avatar" AS "User.avatar", "User"."username" AS "User.username" FROM "Posts" AS "Posts" LEFT OUTER JOIN "Users" AS "User" ON "Posts"."userId" = "User"."id" ORDER BY "Posts"."createdAt" DESC;',
  //   'SELECT "Comment"."id", "Comment"."content", "Comment"."createdAt", "Comment"."postId", "User"."id" AS "User.id", "User"."avatar" AS "User.avatar", "User"."username" AS "User.username", "User"."createdAt" AS "User.createdAt" FROM "Comments" AS "Comment" LEFT OUTER JOIN "Users" AS "User" ON "Comment"."userId" = "User"."id" ORDER BY "Comment"."createdAt" DESC LIMIT 1;',
  //   { type: sequelize.QueryTypes.SELECT }
  // );

  // const Id = req.id;

  // if (!Id) {
  //   return res.status(401).json({
  //     message: "acesso negado, token inválido, não retornou id",
  //   });
  // }
  // // trazer quem eu estou seguindo, tentar usar ids dessa busca na busca dos posts
  // const following = await User.findByPk(Id, {
  //   attributes: ["id", "avatar", "username", "name"],
  //   include: [
  //     {
  //       model: Following,
  //       include: [
  //         {
  //           model: User,
  //           attributes: ["id", "avatar", "username"],
  //         },
  //       ],
  //     },
  //   ],
  // });

  // // trazer todos os posts do usuario e de quem ele segui

  // const followingMap = following.Followings.map((user) => user.follow);

  // await followingMap.push(Id);

  // const posts = await Post.findAll({
  //   where: {
  //     userId: followingMap,
  //   },
  // attributes: ["id", "img_post", "legend", "createdAt"],
  // order: [["createdAt", "DESC"]],
  // include: [
  //   {
  //     model: User,
  //     attributes: ["id", "avatar", "username"],
  //   },
  //   {
  //     model: Comment,
  //     attributes: ["id", "content", "createdAt"],
  //     include: {
  //       model: User,
  //       attributes: ["id", "avatar", "username", "createdAt"],
  //     },
  //     separate: true,
  //     order: [["createdAt", "DESC"]],
  //   },
  // ],
  // });

  // const { id, img_post, legend, createdAt, 'User.id', 'User.avatar',
  // 'User.username' } = post;

  // const newModelPosts = {
  //   id: id,
  //   img_post: img_post,
  //   legend: legend,
  //   createdAt: createdAt,
  //   comment: post,
  // };

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

// ------------------- USER POSTS -------------------- //

postRouter.get("/:userId/post", async (req, res) => {
  const userId = req.params.userId;

  const posts = await Post.findAll({
    where: {
      userId: userId,
    },
  });

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

// ------------------- ONE POST -------------------- //

postRouter.get("/post/:postId", async (req, res) => {
  const postId = Number(req.params.postId);

  if (!postId || postId === NaN || postId.lenght < 1) {
    return res.status(400).json({ message: "publicação não encontrada" });
  }

  const posts = await Post.findAll({
    where: {
      id: postId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "avatar", "username"],
      },
      {
        model: Comment,
        attributes: ["id", "content", "createdAt"],
        include: {
          model: User,
          attributes: ["id", "avatar", "username", "createdAt"],
        },
        separate: true,
        order: [["createdAt", "DESC"]],
      },
    ],
    attributes: ["id", "img_post", "legend", "createdAt"],
  });

  if (Boolean(posts === false)) {
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

postRouter.delete("/post/:postId", verifytoken, async (req, res) => {
  const userId = req.id;
  const postId = req.params.postId;

  if (!userId) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }
  if (!postId) {
    return res.status(400).json({ message: "publicação não encontrada" });
  }

  const user = await Post.destroy({
    where: { userId: userId, id: postId },
  });

  if (!user) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }

  try {
    return res
      .status(200)
      .json({ message: "publicação deletada", reaload: "true" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default postRouter;
