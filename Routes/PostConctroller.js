import express from "express";
import { UserModel, PostModel, CommentModel } from "../model/index.js";
import verifytoken from "../middlewares/verifytoken.js";

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

  if (legend.length > 800) {
    return res
      .status(400)
      .json({ messge: "A legenda da publicação é muito grande" });
  }

  const post = await PostModel.create({
    img_post: img !== "" ? img : "",
    legend: legend !== "" ? legend : "",
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
  const posts = await PostModel.findAll({
    attributes: ["id", "img_post", "legend", "createdAt"],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: UserModel,
        attributes: ["id", "avatar", "username"],
      },
      {
        model: CommentModel,
        attributes: ["id", "content", "createdAt"],
        include: {
          model: UserModel,
          attributes: ["id", "avatar", "username"],
        },
        separate: true,
        order: [["createdAt", "DESC"]],
      },
    ],
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

// ------------------- USER POSTS -------------------- //

postRouter.get("/:userId/post", async (req, res) => {
  const userId = req.params.userId;

  const posts = await PostModel.findAll({
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

  const post = await PostModel.findOne({
    where: {
      id: postId,
    },
    include: [
      {
        model: UserModel,
        attributes: ["id", "avatar", "username"],
      },
      {
        model: CommentModel,
        attributes: ["id", "content", "createdAt"],
        include: {
          model: UserModel,
          attributes: ["id", "avatar", "username"],
        },
        separate: true,
        order: [["createdAt", "DESC"]],
      },
    ],
    attributes: ["id", "img_post", "legend", "createdAt"],
  });

  if (!post || post === [] || post === null || post.lenght < 1) {
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

//                                                      //
// -------------------- PUT POST ------------------- //
//                                                      //

postRouter.put("/post/:postId", verifytoken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.id;

  const { img, legend } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }
  if (!postId) {
    return res.status(400).json({ message: "publicação não encontrada" });
  }

  if (legend.length > 800) {
    return res
      .status(400)
      .json({ messge: "A legenda da publicação é muito grande" });
  }

  const verify = await PostModel.findOne({
    where: { id: postId, userId: userId },
  });

  if (!verify) {
    return res.status(400).json({ message: "você não fez essa publicação" });
  }

  const post = await PostModel.update(
    {
      img_post: img.length > 0 ? img : "",
      legend: legend.length > 0 ? legend : "",
    },
    {
      where: { userId: userId, id: postId },
    }
  );

  if (!post) {
    return res
      .status(400)
      .json({ message: "não foi possivel atulizar sua publicação" });
  }

  try {
    return res
      .status(201)
      .json({ message: "publicação atualizada", reaload: "true" });
  } catch (error) {
    return res.status(500).json(error);
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

  const verify = await PostModel.findOne({
    where: { id: postId, userId: userId },
  });

  if (!verify) {
    return res.status(400).json({ message: "você não fez essa publicação" });
  }

  const user = await PostModel.destroy({
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
