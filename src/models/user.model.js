import { Model } from "objection";
import { thullo } from "../services/db.service.js";
import * as argon2 from "argon2";

class model extends Model {
  static get tableName() {
    return "users";
  }

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
