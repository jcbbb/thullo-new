import { User, Board, BaseModel } from "./index.js";

export class Invitation extends BaseModel {
  static get tableName() {
    return "invitations";
  }

  static relationMappings = () => ({
    board: {
      relation: BaseModel.HasOneRelation,
      modelClass: Board,
      join: {
        from: "invitations.board_id",
        to: "boards.id",
      },
      filter: (query) => query.select("id", "title"),
    },
    invitee: {
      relation: BaseModel.HasOneRelation,
      modelClass: User,
      join: {
        from: "invitations.to",
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name", "email"),
    },
    sender: {
      relation: BaseModel.HasOneRelation,
      modelClass: User,
      join: {
        from: "invitations.from",
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name", "email"),
    },
  });
}
