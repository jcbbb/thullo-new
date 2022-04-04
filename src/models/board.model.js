import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { User } from "./user.model.js";
import { List } from "./list.model.js";

class model extends Model {
  static get tableName() {
    return "boards";
  }
  static relationMappings = {
    lists: {
      relation: Model.HasManyRelation,
      modelClass: List,
      join: {
        from: "boards.id",
        to: "lists.board_id",
      },
    },
    members: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "boards.id",
        through: {
          from: "boards_members.board_id",
          to: "boards_members.user_id",
        },
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name", "verified"),
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "boards.creator_id",
        to: "users.id",
      },
    },
  };
}

export const Board = model.bindKnex(thullo);
