import * as MailService from "../services/mail.service.js";
import { normalizeBody } from "../utils/index.js";

export async function email(req, res) {
  const { to, template } = normalizeBody(req.body);
}
