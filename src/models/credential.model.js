import { Model } from "objection";
import { thullo } from "../services/db.service.js";

class model extends Model {
  static get tableName() {
    return "credentials";
  }
  static get jsonAttributes() {
    return ["transports"];
  }
}

export const Credential = model.bindKnex(thullo);
