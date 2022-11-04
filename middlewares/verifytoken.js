import express from "express";
import Jwt from "jsonwebtoken";

function verifytoken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "acesso negado, token inválido, token provided" });
  }

  const parts = authHeader.split(" ");

  if (!parts) {
    return res.status(401).json({ message: "token não encontrado" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "token mal formated" });
  }

  try {
    const secret = process.env.SECRET;
    Jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "token inválido", error });
      }

      req.id = decoded.params;

      return next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "erro no servidor, tente mais tarde", error });
  }
}

export default verifytoken;
