import { Model } from "objection";
import { thullo } from "../services/db.service.js";

class model extends Model {
  static get tableName() {
    return "auth_providers";
  }
}

export const AuthProvider = model.bindKnex(thullo);
