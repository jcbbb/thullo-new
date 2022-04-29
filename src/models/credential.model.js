import { BaseModel } from "./index.js";

export class Credential extends BaseModel {
  static get tableName() {
    return "credentials";
  }
  static get jsonAttributes() {
    return ["transports"];
  }
}
