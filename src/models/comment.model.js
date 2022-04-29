import { BaseModel } from "./index.js";

export class Comment extends BaseModel {
  static get tableName() {
    return "comments";
  }
  static relationMappings = {
    // user: {
    //   relation: Model.HasOneRelation,
    //   modelClass: User,
    //   join: {
    //     from: "comments.user_id",
    //     to: "users.id",
    //   },
    //   filter: (builder) => builder.select("name", "profile_photo_url"),
    // },
  };
}
