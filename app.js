import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { userRouter, postRouter, commentRouter } from "./Routes/index.js";
// import { followingRouter } from "./Routes/Following.js";

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

//  --------------- postagens --------------- //

app.post("/post", postRouter);
app.get("/post", postRouter);
app.get("/:userId/post", postRouter);
app.get("/post/:postId", postRouter);
app.delete("/post/:postId", postRouter);

//  --------------- Comentary --------------- //

app.post("/comment", commentRouter);
app.get("/comment/:commentId", commentRouter);
app.delete("/comment/:commentId", commentRouter);
app.get("/comment", commentRouter);

//

// app.post("/following/:followId", followingRouter);
// app.get("/following/:followId", followingRouter);
// app.delete("/following/:followId", followingRouter);

app.listen(
  process.env.PORT,
  console.log(`server rodando na porta ${process.env.PORT}`)
);
