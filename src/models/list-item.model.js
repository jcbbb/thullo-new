import { User, Attachment, Comment, BaseModel } from "./index.js";

export class ListItem extends BaseModel {
  static get tableName() {
    return "list_items";
  }

  static relationMappings = () => ({
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
      filter: (builder) => builder.select("id", "name", "verified"),
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
