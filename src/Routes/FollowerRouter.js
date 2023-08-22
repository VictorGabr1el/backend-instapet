import express from "express";
import { getAllUsersFollowers } from "../Controllers/FollowerController.js";

const followerRouter = express.Router();

followerRouter.get("/user/:userId/followers", (request, response) =>
  getAllUsersFollowers(request, response)
);

export default followerRouter;
