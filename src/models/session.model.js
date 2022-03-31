import { Model } from "objection";
import { thullo } from "../services/db.service.js";

class model extends Model {
  static get tableName() {
    return "sessions";
  }
}

export const Session = model.bindKnex(thullo);
