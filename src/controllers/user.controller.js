import * as UserService from "../services/user.service.js";

export async function getMany(req, res) {
  const { q } = req.query;
  const user = req.user;
  const users = await UserService.getMany({ q, excludes: [user.id] });
  res.send(users);
}
