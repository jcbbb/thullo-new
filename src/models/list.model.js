import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { ListItem } from "./list-item.model.js";

class model extends Model {
  static get tableName() {
    return "lists";
  }
  static relationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: ListItem,
      join: {
        from: "lists.id",
        to: "list_items.list_id",
      },
    },
  };
}

export const List = model.bindKnex(thullo);
