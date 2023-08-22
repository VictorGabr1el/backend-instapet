import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import {
  follow,
  getAllUserFollowings,
  unfollow,
} from "../Controllers/FollowingController.js";

const followersRouter = express.Router();

followersRouter.post("/follow/:followId", verifytoken, (request, response) =>
  follow(request, response)
);

followersRouter.get("/user/:userId/following", (request, response) =>
  getAllUserFollowings(request, response)
);

followersRouter.delete(
  "/following/:followId",
  verifytoken,
  (request, response) => unfollow(request, response)
);

export default followersRouter;
