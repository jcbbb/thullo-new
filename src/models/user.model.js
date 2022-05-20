import { Board, Credential, BaseModel } from "./index.js";
import * as argon2 from "argon2";
import { createHash } from "crypto";

export class User extends BaseModel {
  static get tableName() {
    return "users";
  }

  static relationMappings = () => ({
    credentials: {
      relation: BaseModel.HasManyRelation,
      modelClass: Credential,
      join: {
        from: "users.id",
        to: "credentials.user_id",
      },
    },
    boards: {
      relation: BaseModel.ManyToManyRelation,
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
    this.setAvatar();
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
  setAvatar() {
    const hash = createHash("md5").update(this.email).digest("hex");
    this.profile_photo_url = `https://gravatar.com/avatar/${hash}?d=retro`;
    return this.profile_photo_url;
  }
}
