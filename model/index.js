import { sequelize } from "./db.js";
import { User } from "./User.js";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";

// (async () => {
//   await sequelize
//     .sync({ force: true })
//     .then(console.log("tabela users criada"))
//     .catch((err) => {
//       return console.log(err);
//     });
// })();

export { sequelize, User, Post, Comment };
