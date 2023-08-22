import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import * as CommentControllerJs from "../Controllers/CommentController.js";

const commentRouter = express.Router();

commentRouter.post("/comment", verifytoken, (request, response) =>
  CommentControllerJs.createNewCommentary(request, response)
);

commentRouter.get("/comment/:commentId", (request, response) =>
  CommentControllerJs.getOneCommentaryById(request, response)
);

commentRouter.put("/comment", verifytoken, (request, response) =>
  CommentControllerJs.updateCommentary(request, response)
);

commentRouter.delete("/comment/:commentId", verifytoken, (request, response) =>
  CommentControllerJs.deleteCommentary(request, response)
);

export default commentRouter;
