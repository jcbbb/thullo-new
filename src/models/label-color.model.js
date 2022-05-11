import { BaseModel } from "./index.js";

export class LabelColor extends BaseModel {
  static get tableName() {
    return "label_colors";
  }
}
