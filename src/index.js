import express from "express";
import cors from "cors";
import { SERVER_PORT } from "./envConfig.js";

import {
  userRouter,
  postRouter,
  commentRouter,
  followingRouter,
  followerRouter,
} from "./Routes/index.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(followingRouter);
app.use(followerRouter);

app.listen(SERVER_PORT, console.log(`server rodando na porta ${SERVER_PORT}`));
