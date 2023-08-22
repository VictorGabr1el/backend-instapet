import Jwt from "jsonwebtoken";

function verifytoken(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response
      .status(401)
      .json({ message: "acesso negado, token inválido, token provided" });
  }

  const parts = authHeader.split(" ");

  if (!parts) {
    return response.status(401).json({ message: "token não encontrado" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ message: "token mal formated" });
  }

  try {
    const secret = process.env.SECRET;
    Jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return response.status(401).json({ message: "token inválido", error });
      }

      request.id = decoded.params;

      return next();
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "erro no servidor, tente mais tarde", error });
  }
}

export default verifytoken;
