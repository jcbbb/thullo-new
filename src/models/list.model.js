import { ListItem, BaseModel } from "./index.js";

export class List extends BaseModel {
  static get tableName() {
    return "lists";
  }

  static relationMappings = () => ({
    items: {
      relation: BaseModel.HasManyRelation,
      modelClass: ListItem,
      join: {
        from: "lists.id",
        to: "list_items.list_id",
      },
    },
  });
}
