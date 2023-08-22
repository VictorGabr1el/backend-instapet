import express from "express";
import verifytoken from "../middlewares/verifytoken.js";
import * as FollowingControllerJs from "../Controllers/FollowingController.js";

const followersRouter = express.Router();

followersRouter.post("/follow/:followId", verifytoken, (request, response) =>
  FollowingControllerJs.follow(request, response)
);

followersRouter.get("/user/:userId/following", (request, response) =>
  FollowingControllerJs.getAllUserFollowings(request, response)
);

followersRouter.delete(
  "/following/:followId",
  verifytoken,
  (request, response) => FollowingControllerJs.unfollow(request, response)
);

export default followersRouter;
