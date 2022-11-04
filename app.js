import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { loginRouter, postRouter, commentaryRouter } from "./Routes/index.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------ rotas principais ------------//

app.post("/register", loginRouter);
app.post("/login", loginRouter);
app.get("/logado", loginRouter);
app.get("/user", loginRouter);

//  --------------- postagens --------------- //

app.post("/user/:userId/post", postRouter);
app.get("/post", postRouter);
app.get("/user/:userId/post", postRouter);
app.delete("/user/:userId/post/:postId", postRouter);

//  --------------- Comentary --------------- //

app.post("/user/:userId/post/:postId/comment", commentaryRouter);
app.get("/user/:userId/post/:postId/comment/:commentId", commentaryRouter);
app.get("/comment", commentaryRouter);
app.get("/commente", commentaryRouter);
app.get("/test", commentaryRouter);

// ------------ rotas de teste ------------ //

app.get("/", loginRouter);
app.delete("/delete/:id", loginRouter);

// ------------ socket io ------------ //

app.listen(3010, console.log("server rodando na porta 3010"));
