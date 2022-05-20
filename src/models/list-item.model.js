import { User, Attachment, Comment, BaseModel, Label, Board } from "./index.js";

export class ListItem extends BaseModel {
  static get tableName() {
    return "list_items";
  }

  static get virtualAttributes() {
    return ["attachments_count", "members_count", "comments_count"];
  }

  attachments_count() {
    return this.attachments?.length || 0;
  }

  members_count() {
    return this.members?.length || 0;
  }

  comments_count() {
    return this.comments?.length || 0;
  }

  static relationMappings = () => ({
    board: {
      relation: BaseModel.HasOneRelation,
      modelClass: Board,
      join: {
        from: "list_items.board_id",
        to: "boards.id",
      },
    },
    labels: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: Label,
      join: {
        from: "list_items.id",
        through: {
          from: "list_items_labels.list_item_id",
          to: "list_items_labels.label_id",
        },
        to: "labels.id",
      },
    },
    members: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "list_items.id",
        through: {
          from: "list_items_members.list_item_id",
          to: "list_items_members.user_id",
        },
        to: "users.id",
      },
      filter: (builder) => builder.select("id", "name", "verified", "profile_photo_url"),
    },
    attachments: {
      relation: BaseModel.HasManyRelation,
      modelClass: Attachment,
      join: {
        from: "list_items.id",
        to: "attachments.list_item_id",
      },
    },
    comments: {
      relation: BaseModel.HasManyRelation,
      modelClass: Comment,
      join: {
        from: "list_items.id",
        to: "comments.list_item_id",
      },
    },
  });
}
