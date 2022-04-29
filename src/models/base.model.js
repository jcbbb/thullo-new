import { Model } from "objection";
import { thullo } from "../services/db.service.js";

export class BaseModel extends Model {}

BaseModel.knex(thullo);
