import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { User } from "./user.model.js";
import { Board } from "./board.model.js";

class model extends Model {
  static get tableName() {
    return "invitations";
  }
  static relationMappings = {
    board: {
      relation: Model.HasOneRelation,
      modelClass: Board,
      join: {
        from: "invitations.board_id",
        to: "boards.id",
      },
    },
    user: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: "invitations.user_id",
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name"),
    },
  };
}

export const Invitation = model.bindKnex(thullo);
