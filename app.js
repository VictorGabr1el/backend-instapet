import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import {
  userRouter,
  postRouter,
  commentRouter,
  followingRouter,
  followersRouter,
} from "./Routes/index.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------ rotas principais ------------//

app.post("/register", userRouter);
app.post("/login", userRouter);
app.get("/logado", userRouter);
app.get("/users", userRouter);
app.get("/user/:userId", userRouter);
app.get("/users/:username", userRouter);
app.get("/random/:userId", userRouter);
app.put("/user", userRouter);
app.delete("/deleteaccount", userRouter);

//  --------------- postagens --------------- //

app.post("/post", postRouter);
app.get("/post", postRouter);
app.get("/:userId/post", postRouter);
app.get("/post/:postId", postRouter);
app.put("/post/:postId", postRouter);
app.delete("/post/:postId", postRouter);

//  --------------- Comentary --------------- //

app.post("/comment", commentRouter);
app.get("/comment/:commentId", commentRouter);
app.delete("/comment/:commentId", commentRouter);
app.get("/comment", commentRouter);

//

app.post("/follow/:followId", followingRouter);
app.get("/user/:userId/following/:followId", followingRouter);
app.get("/user/:userId/following", followingRouter);
app.delete("/following/:followId", followingRouter);

app.get("/user/:userId/followers", followersRouter);

app.listen(
  process.env.SERVER_PORT,
  console.log(`server rodando na porta ${process.env.SERVER_PORT}`)
);
