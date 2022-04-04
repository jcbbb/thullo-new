import * as UserService from "../services/user.service.js";

export async function getMany(req, res) {
  const { q } = req.query;
  const users = await UserService.getMany({ q });
}
