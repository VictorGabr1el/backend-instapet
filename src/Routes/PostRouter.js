import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import * as PostControllerJs from "../Controllers/PostController.js";

const postRouter = express.Router();

postRouter.post("/post", verifytoken, (request, response) =>
  PostControllerJs.createNewPost(request, response)
);

postRouter.get("/post", (request, response) =>
  PostControllerJs.getAllPosts(request, response)
);

postRouter.get("/:userId/post", (request, response) =>
  PostControllerJs.getAllUserPosts(request, response)
);
postRouter.get("/post/:postId", (request, response) =>
  PostControllerJs.getOneUserPost(request, response)
);
postRouter.put("/post/:postId", verifytoken, (request, response) =>
  PostControllerJs.updatePost(request, response)
);
postRouter.delete("/post/:postId", verifytoken, (request, response) =>
  PostControllerJs.deletePost(request, response)
);

export default postRouter;
