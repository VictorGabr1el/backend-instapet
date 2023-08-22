export default function userDataValidate(data) {
  for (const [key, value] of Object.entries(data)) {
    if (key === "name") {
      if (!value || value.length < 3) {
        throw { message: "Digite seu nome completo", statusCode: 400 };
      }
      if (value.length > 40) {
        throw {
          message: "O nome não pode ter mais de 40 caracteres",
          statusCode: 400,
        };
      }
      continue;
    }

    if (key === "username") {
      if (!value) {
        throw { message: "Crie um username", statusCode: 400 };
      }

      const lowerCasedUsername = String(value)
        .toLocaleLowerCase()
        .replace(" ", "");

      if (lowerCasedUsername.length < 3) {
        throw {
          message: "Seu username deve ter menos de três caracteres",
          statusCode: 400,
        };
      }
      if (lowerCasedUsername.length > 20) {
        throw {
          message: "O usename não pode ter mais de 20 caracteres",
          statusCode: 400,
        };
      }

      data.username = lowerCasedUsername;
      continue;
    }

    if (key === "email") {
      if (!value) {
        throw { message: "Digite seu email", statusCode: 400 };
      }
      const regex = /^[\S][A-Za-z0-9\.]+@[A-Za-z]+\.[A-Za-z]{2,3}/g;

      if (regex.test(value) === false) {
        throw { message: "Digite um email inválido", statusCode: 400 };
      }
      data.email = String(value).toLocaleLowerCase();
      continue;
    }

    if (key === "avatar") {
      if (!value) {
        throw { message: "Adicione uma imagem no seu perfil", statusCode: 400 };
      }
      continue;
    }

    if (key === "password") {
      if (!value) {
        throw { message: "Digite sua senha", statusCode: 400 };
      }
      continue;
    }

    if (key === "confirmPass") {
      if (!value) {
        throw { message: "Digite novamente sua senha", statusCode: 400 };
      }
      if (data.password !== value) {
        throw { message: "As senhas não estão iguais", statusCode: 400 };
      }
      continue;
    }

    if (key === "biograph") {
      if (value.length > 200) {
        throw {
          message: "A biografia pode ter no maximo 200 caracteres",
          statusCode: 400,
        };
      }
    }
  }

  return data;
}
