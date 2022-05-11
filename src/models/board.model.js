import { User, List, BaseModel, Invitation, Label } from "./index.js";

export class Board extends BaseModel {
  static get tableName() {
    return "boards";
  }

  static relationMappings = () => ({
    labels: {
      relation: BaseModel.HasManyRelation,
      modelClass: Label,
      join: {
        from: "boards.id",
        to: "labels.board_id",
      },
    },
    lists: {
      relation: BaseModel.HasManyRelation,
      modelClass: List,
      join: {
        from: "boards.id",
        to: "lists.board_id",
      },
      filter: (builder) => builder.orderBy("pos"),
    },

    members: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "boards.id",
        through: {
          from: "boards_members.board_id",
          to: "boards_members.user_id",
        },
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name", "verified", "profile_photo_url"),
    },

    creator: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "boards.creator_id",
        to: "users.id",
      },
    },

    invitations: {
      relation: BaseModel.HasManyRelation,
      modelClass: Invitation,
      join: {
        from: "boards.id",
        to: "invitations.board_id",
      },
      filter: (builder) => builder.where({ status: "PENDING" }),
    },
  });
}
