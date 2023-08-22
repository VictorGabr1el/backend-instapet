import express from "express";
import * as userControllerJs from "../Controllers/UserController.js";
import verifytoken from "../middlewares/verifytoken.js";

const userRouter = express.Router();

userRouter.post("/register", (request, response) =>
  userControllerJs.registerUser(request, response)
);
userRouter.post("/login", (request, response) =>
  userControllerJs.login(request, response)
);

userRouter.get("/logged", verifytoken, (request, response) =>
  userControllerJs.loggedUser(request, response)
);
userRouter.put("/updateuser", verifytoken, (request, response) =>
  userControllerJs.updateUser(request, response)
);
userRouter.delete("/deleteaccount", verifytoken, (request, response) =>
  userControllerJs.deleteUserAccount(request, response)
);
userRouter.get("/user/:userId", (request, response) =>
  userControllerJs.findOneUserById(request, response)
);
userRouter.get("/users", (request, response) =>
  userControllerJs.findAllUsers(request, response)
);

userRouter.get("/users/:username", (request, response) =>
  userControllerJs.findAllUsersByNameOrUsername(request, response)
);
userRouter.get("/random/:userId", (request, response) =>
  userControllerJs.findRandomUsers(request, response)
);

export default userRouter;
