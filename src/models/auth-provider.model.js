import { BaseModel } from "./index.js";

export class AuthProvider extends BaseModel {
  static get tableName() {
    return "auth_providers";
  }
}
