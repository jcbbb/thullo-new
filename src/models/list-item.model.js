import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { User } from "./user.model.js";

class model extends Model {
  static get tableName() {
    return "list_items";
  }
  static relationMappings = {
    members: {
      relation: Model.ManyToManyRelation,
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
  };
}

export const ListItem = model.bindKnex(thullo);
