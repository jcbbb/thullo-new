import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { User } from "./user.model.js";

class model extends Model {
  static get tableName() {
    return "comments";
  }
  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: "comments.user_id",
        to: "users.id",
      },
      filter: (builder) => builder.select("name", "profile_photo_url"),
    },
  };
}

export const Comment = model.bindKnex(thullo);
