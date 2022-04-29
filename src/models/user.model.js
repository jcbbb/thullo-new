import { Model } from "objection";
import { Board, Credential, BaseModel } from "./index.js";
import * as argon2 from "argon2";

export class User extends BaseModel {
  static get tableName() {
    return "users";
  }

  static relationMappings = () => ({
    credentials: {
      relation: Model.HasManyRelation,
      modelClass: Credential,
      join: {
        from: "users.id",
        to: "credentials.user_id",
      },
    },
    boards: {
      relation: Model.ManyToManyRelation,
      modelClass: Board,
      join: {
        from: "users.id",
        through: {
          from: "boards_members.user_id",
          to: "boards_members.board_id",
        },
        to: "boards.id",
      },
    },
  });

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
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

// export const User = model.bindKnex(thullo);
