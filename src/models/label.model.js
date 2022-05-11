import { BaseModel, LabelColor } from "./index.js";

export class Label extends BaseModel {
  static get tableName() {
    return "labels";
  }

  static relationMappings = () => ({
    color: {
      relation: BaseModel.HasOneRelation,
      modelClass: LabelColor,
      join: {
        from: "labels.label_color_id",
        to: "label_colors.id",
      },
    },
  });
}
