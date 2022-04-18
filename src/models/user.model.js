import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import { Credential } from "./credential.model.js";
import * as argon2 from "argon2";

class model extends Model {
  static get tableName() {
    return "users";
  }

  static relationMappings = {
    credentials: {
      relation: Model.HasManyRelation,
      modelClass: Credential,
      join: {
        from: "users.id",
        to: "credentials.user_id",
      },
    },
  };

  async $beforeInsert() {
    await this.hashPassword();
  }

  async $beforeUpdate(opts, ...args) {
    await super.$beforeUpdate(opts, ...args);
    if (opts.patch && this.password === undefined) {
      return;
    }
    return await this.hashPassword();
  }

  async verifyPassword(password) {
    return await argon2.verify(this.password, password);
  }

  async hashPassword() {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return hash;
  }
}

export const User = model.bindKnex(thullo);
