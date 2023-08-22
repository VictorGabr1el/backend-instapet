import {
  CommentModel,
  LikePostModel,
  PostModel,
  UserModel,
} from "../model/index.js";

async function validateUniqueField(
  fieldAndValue,
  errorMessage,
  errorStatusCode
) {
  const data = await PostModel.findOne({ where: fieldAndValue });

  if (!data) {
    throw { message: errorMessage, statusCode: errorStatusCode };
  }
  return data;
}

function validateInputPost(data) {
  if (data.legend.length > 800)
    throw {
      message: "A legenda da publicação é muito grande",
      statusCode: 400,
    };

  return data;
}

const postSearchTemplate = {
  where: {},
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
};

async function createNewPost(request, response) {
  const id = request.id;
  const data = validateInputPost(request.body); //{img_post, legend}

  try {
    data.userId = id;
    await PostModel.create(data);

    return response
      .status(201)
      .json({ message: "publicação criada", reaload: true });
  } catch (error) {
    return response.status(statusCode || 500).json({
      message: "não foi possivel fazer sua publicação, tente mais tarde",
      error: error.message,
    });
  }
}

async function getAllPosts(request, response) {
  try {
    const posts = await PostModel.findAll(postSearchTemplate);

    if (posts.length === 0) {
      return response
        .status(200)
        .json({ message: "nenhuma postagem não encontradas" });
    }

    return response.status(200).json(posts);
  } catch (error) {
    return response.status(500).json({
      message: "ocrreu um erro, tente mais tarde",
      error: error.message,
    });
  }
}

async function getAllUserPosts(request, response) {
  const userId = request.params.userId;

  try {
    const posts = await PostModel.findAll({ where: { userId: userId } });

    if (!posts) {
      return response
        .status(400)
        .json({ message: "postagens não encontradas" });
    }

    return response.status(200).json(posts);
  } catch (error) {
    return response.status(500).json({
      message: "ocrreu um erro, tente mais tarde",
      error: error.message,
    });
  }
}

async function getOneUserPost(request, response) {
  const postId = Number(request.params.postId);

  if (postId === NaN || postId.lenght < 1) {
    return response
      .status(400)
      .json({ message: "id da publicação não encontrado" });
  }

  try {
    postSearchTemplate.where.id = postId;
    const post = await PostModel.findOne(postSearchTemplate);

    if (!post) {
      return response.status(400).json({ message: "postagem não encontrada" });
    }

    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({
      message: "ocrreu um erro, tente mais tarde",
      error: error.message,
    });
  }
}

async function updatePost(request, response) {
  const postId = Number(request.params.postId);
  const userId = request.id;
  const data = validateInputPost(request.body);

  if (!postId) {
    return response.status(400).json({ message: "publicação não encontrada" });
  }

  try {
    await validateUniqueField(
      { id: postId, userId: userId },
      "você não fez essa publicação"
    );

    const updatedPost = await PostModel.update(data, {
      where: { id: postId, userId: userId },
    });

    if (!updatedPost) {
      return response
        .status(400)
        .json({ message: "não foi possivel atulizar sua publicação" });
    }

    return response
      .status(200)
      .json({ message: "publicação atualizada", reaload: "true" });
  } catch (error) {
    return response.status(500).json({
      message: "Nao foi possivel atualizar sua publicação, tente mais tarde",
      error: error.message,
    });
  }
}

async function deletePost(request, response) {
  const userId = Number(request.id);
  const postId = Number(request.params.postId);

  if (!postId) {
    return response.status(400).json({ message: "publicação não encontrada" });
  }

  try {
    await validateUniqueField(
      { id: postId, userId: userId },
      "você não fez essa publicação"
    );

    const destroyedPost = await PostModel.destroy({
      where: { id: postId, userId: userId },
    });

    if (!destroyedPost || destroyedPost === 0) {
      return response
        .status(400)
        .json({ message: "não não foi possivel deletar sua publicação" });
    }

    return response
      .status(200)
      .json({ message: "publicação deletada", reaload: "true" });
  } catch (error) {
    return response.status(500).json({
      message: "não foi possivel apagar sua publicação, tente mais tarde",
      error: error.message,
    });
  }
}

export {
  createNewPost,
  getAllPosts,
  getAllUserPosts,
  getOneUserPost,
  updatePost,
  deletePost,
};
