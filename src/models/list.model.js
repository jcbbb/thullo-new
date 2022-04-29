import { Model } from "objection";
import { ListItem, BaseModel } from "./index.js";

export class List extends BaseModel {
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
