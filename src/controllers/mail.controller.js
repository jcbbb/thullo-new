import * as MailService from "../services/mail.service.js";

export async function email(req, res) {
  const { to, template } = req.body;
}
