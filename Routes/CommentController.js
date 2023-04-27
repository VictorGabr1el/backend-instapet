import express from "express";
import { UserModel, CommentModel } from "../model/index.js";
import verifytoken from "../middlewares/verifytoken.js";

const commentRouter = express.Router();

//                                                      //
// --------------------- CREATE ----------------------- //
//                                                      //

commentRouter.post("/comment", verifytoken, async (req, res) => {
  const { content, postId } = req.body;

  const userId = req.id;

  if (!userId) {
    return res.status(400).json({
      message: "Não foi possivel fazer o comentário, usuario não identificado",
    });
  }

  if (!postId) {
    return res.status(400).json({
      message: "Não foi possivel fazer o comentário, postagem não encontrada",
    });
  }

  if (!content) {
    return res.status(400).json({ message: "caixa de comentário está vazia" });
  }

  if (content.length > 100) {
    return res
      .status(400)
      .json({ message: "O comentário não pode ter mais de 100 caracteres" });
  }

  const user = await UserModel.findOne({ where: { id: userId } });

  if (Boolean(user) === false) {
    return res.status(400).json({ message: "usuario não encontrado" });
  }

  const comment = CommentModel.build({
    content: content,
    userId: userId,
    postId: postId,
  });

  await comment.save();

  try {
    return res
      .status(201)
      .json({ message: "comentario criado", reaload: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "não foi possivel fazer comentário", error });
  }
});

// ------------------- ONE COMMENTARY -------------------- //

commentRouter.get("/comment/:commentId", async (req, res) => {
  const id = req.params;
  const commentId = id.commentId;

  if (!commentId) {
    return res.status(400).json({ message: "comentario não encontrada" });
  }

  const findComment = await CommentModel.findByPk(commentId);

  if (!findComment) {
    return res.status(400).json({ message: "postagens não encontradas" });
  }

  try {
    return res.status(200).json(findComment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocorreu um erro, tente mais tarde", error });
  }
});

// ------------------- DELETE COMMENTARY -------------------- //

commentRouter.delete("/comment/:commentId", verifytoken, async (req, res) => {
  const userId = req.id;

  const commentId = Number(req.params.commentId);

  if (!userId) {
    res
      .status(400)
      .json({ message: "não foi possivel deixar de seguir este perfil" });
  }

  if (Boolean(commentId) === false) {
    res.status(400).json({
      message: "não foi possivel excluir comentário",
    });
  }

  CommentModel.destroy({
    where: {
      userId: userId,
      id: commentId,
    },
  })
    .then(() => {
      return res.status(200).json({ message: "comentário deletado" });
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

commentRouter.get("/comment", async (req, res) => {
  const commentarys = await CommentModel.findAll();

  if (!commentarys) {
    return res.status(500).json({ message: "desculpe, tente mais tarde" });
  }

  try {
    return res.status(200).json(commentarys);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "ocorreu um erro, tente mais tarde", error });
  }
});

export default commentRouter;
