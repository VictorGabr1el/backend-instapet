import { UserModel, CommentModel } from "../model/index.js";

async function validateUniqueField(fieldAndValue, model, errorMessage) {
  const data = await model.findOne({ where: fieldAndValue });

  if (!data) {
    throw { message: errorMessage, statusCode: 400 };
  }
  return data;
}

function commentDataValidate(data) {
  if (data.content) {
    if (!data.content) {
      throw { message: "caixa de comentário está vazia", statusCode: 400 };
    }

    if (data.content.length > 100) {
      throw {
        message: "O comentário não pode ter mais de 100 caracteres",
        statusCode: 400,
      };
    }
  }

  if (data.postId) {
    data.postId = Number(data.postId);
    if (!data.postId) {
      throw {
        message:
          "Não foi possivel fazer o comentário, id da postagem não encontrada",
        statusCode: 400,
      };
    }
  }

  if (data.commentId) {
    data.commentId = Number(data.commentId);
    if (!data.commentId) {
      throw { message: "id do comentário não encontrado", statusCode: 400 };
    }
  }

  return data;
}

async function createNewCommentary(request, response) {
  const userId = request.id;

  try {
    const data = commentDataValidate({
      content: request.body.content,
      postId: request.body.postId,
    });
    data.userId = userId;

    await validateUniqueField(
      { id: userId },
      UserModel,
      "usuario não encontrado"
    );

    await CommentModel.create(data);

    return response
      .status(201)
      .json({ message: "comentario criado", reaload: true });
  } catch (error) {
    response.status(statusCode || 500).json({
      message: "não foi possivel fazer comentário",
      error: error.message,
    });
  }
}

async function getOneCommentaryById(request, response) {
  try {
    const commentId = commentDataValidate({
      commentId: request.params.commentId,
    });

    const comment = await validateUniqueField(
      { id: commentId },
      CommentModel,
      "comentário não encontrado"
    );

    return response.status(200).json(comment);
  } catch (error) {
    response.status(statusCode || 500).json({
      message: "ocorreu um erro, tente mais tarde",
      error: error.message,
    });
  }
}

async function updateCommentary(request, response) {
  const userId = request.id;
  try {
    const { commentId, content } = commentDataValidate({
      commentId: request.body.commentId,
      content: request.body.content,
    });

    await validateUniqueField(
      { id: commentId, userId: userId },
      CommentModel,
      "comentário não encontrado"
    );

    await CommentModel.update(
      { content: content },
      { where: { id: commentId, userId: userId } }
    );

    return response
      .status(200)
      .json({ message: "comentário atualizado com sucesso" });
  } catch (error) {
    return response.status(statusCode || 500).json({
      message: "desculpe ocorreu algum erro, tente mais tarde.",
      error: error.message,
    });
  }
}

async function deleteCommentary(request, response) {
  const userId = request.id;
  try {
    const commentId = commentDataValidate({
      commentId: request.params.commentId,
    });

    await validateUniqueField(
      { id: commentId, userId: userId },
      CommentModel,
      "você não fez esse comentário"
    );

    CommentModel.destroy({
      where: {
        userId: userId,
        id: commentId,
      },
    });

    return response.status(200).json({ message: "comentário deletado" });
  } catch (error) {
    return response.status(statusCode || 500).json({
      message: " ocorreu algum erro, tente mais tarde",
      error: error.message,
    });
  }
}

export {
  createNewCommentary,
  getOneCommentaryById,
  updateCommentary,
  deleteCommentary,
};
