import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import {
  createNewCommentary,
  deleteCommentary,
  getOneCommentaryById,
  updateCommentary,
} from "../Controllers/CommentController.js";

const commentRouter = express.Router();

commentRouter.post("/comment", verifytoken, (request, response) =>
  createNewCommentary(request, response)
);

commentRouter.get("/comment/:commentId", (request, response) =>
  getOneCommentaryById(request, response)
);

commentRouter.put("/comment", verifytoken, (request, response) =>
  updateCommentary(request, response)
);

commentRouter.delete("/comment/:commentId", verifytoken, (request, response) =>
  deleteCommentary(request, response)
);

export default commentRouter;
