import { sequelize } from "./db.js";
import { UserModel } from "./UserModel.js";
import { PostModel } from "./PostModel.js";
import { CommentModel } from "./CommentModel.js";
import { FollowingModel } from "./FollowingModel.js";
import { FollowersModel } from "./FollowersModel.js";

// (async () => {
//   await sequelize
//     .sync({ force: true })
//     .then(console.log("tabela users criada"))
//     .catch((err) => {
//       return console.log(err);
//     });
// })();

export {
  sequelize,
  UserModel,
  PostModel,
  CommentModel,
  FollowingModel,
  FollowersModel,
};
