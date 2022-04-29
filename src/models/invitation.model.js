import { Model } from "objection";
import { User, Board, BaseModel } from "./index.js";

export class Invitation extends BaseModel {
  static get tableName() {
    return "invitations";
  }

  static get relationMappings() {
    return {
      board: {
        relation: Model.HasOneRelation,
        modelClass: Board,
        join: {
          from: "invitations.board_id",
          to: "boards.id",
        },
        filter: (query) => query.select("id", "title"),
      },
      invitee: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "invitations.to",
          to: "users.id",
        },
        filter: (builder) => builder.select("id", "name", "email"),
      },
      sender: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "invitations.from",
          to: "users.id",
        },
        filter: (builder) => builder.select("id", "name", "email"),
      },
    };
  }
}
