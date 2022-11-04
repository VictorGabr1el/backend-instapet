import express from "express";
import { Comment, sequelize, Post, User } from "../model/index.js";
import { QueryTypes } from "sequelize";

const commentaryRouter = express.Router();

//                                                      //
// --------------------- CREATE ----------------------- //
//                                                      //

commentaryRouter.post(
  "/user/:userId/post/:postId/comment",
  async (req, res) => {
    const { content } = req.body;
    const id = req.params;

    const userId = id.userId;
    const postId = id.postId;

    if (!content) {
      return res
        .status(400)
        .json({ message: "caixa de comentário está vazia" });
    }

    if (!userId) {
      return res.status(400).json({
        message:
          "Não foi possivel fazer o comentário, usuario não identificado",
      });
    }
    if (!postId) {
      return res.status(400).json({
        message: "Não foi possivel fazer o comentário, postagem não encontrada",
      });
    }

    const user = await User.findOne({ where: { user_id: userId } });

    if (Boolean(user) === false) {
      return res.status(400).json({ message: "usuario não encontrado" });
    }

    const comment = Comment.build({
      content: content,
      commentUserId: userId,
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
  }
);

// ------------------- ONE COMMENTARY -------------------- //                                                     //

commentaryRouter.get(
  "/user/:userId/post/:postId/comment/:commentId",
  async (req, res) => {
    const id = req.params;

    const userId = id.userId;
    const postId = id.postId;
    const commentId = id.commentId;

    if (!userId) {
      return res.status(400).json({ message: "usuario não encontrado" });
    }
    if (!postId) {
      return res.status(400).json({ message: "postagem não encontrada" });
    }
    if (!commentId) {
      return res.status(400).json({ message: "comentario não encontrada" });
    }

    const findComment = await Comment.findByPk(commentId);
    //   include: {
    //     model: User,
    //     attributes: ["user_id", "avatar", "username", "createdAt"],
    //   },
    // });

    if (!findComment) {
      return res.status(400).json({ message: "postagens não encontradas" });
    }

    try {
      return res.status(200).json(post);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "ocorreu um erro, tente mais tarde", error });
    }
  }
);

export default commentaryRouter;

// realizar busca no banco de dados apos fazer nova postagem, comentario, alteração de foto do perfil
//
// utilizar socket io na criação do chat
//
//
//
//
