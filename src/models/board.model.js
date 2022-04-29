import { Model } from "objection";
import { User, List, BaseModel, Invitation } from "./index.js";

export class Board extends BaseModel {
  static get tableName() {
    return "boards";
  }

  static relationMappings = () => ({
    lists: {
      relation: Model.HasManyRelation,
      modelClass: List,
      join: {
        from: "boards.id",
        to: "lists.board_id",
      },
      filter: (builder) => builder.orderBy("pos"),
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
      filter: (builder) => builder.select("id", "name", "verified", "profile_photo_url").limit(3),
    },

    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "boards.creator_id",
        to: "users.id",
      },
    },

    invitations: {
      relation: Model.HasManyRelation,
      modelClass: Invitation,
      join: {
        from: "boards.id",
        to: "invitations.board_id",
      },
      filter: (builder) => builder.where({ status: "PENDING" }),
    },
  });
}
