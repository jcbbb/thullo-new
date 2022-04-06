import { Model } from "objection";
import { thullo } from "../services/db.service.js";

class model extends Model {
  static get tableName() {
    return "attachments";
  }
}

export const Attachment = model.bindKnex(thullo);
