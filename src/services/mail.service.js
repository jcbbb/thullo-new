const sendgrid = { send: async function () {} };
import * as eta from "eta";
import path from "path";

export async function from(templatePath, vars) {
  const html = await eta.renderFileAsync(path.join(process.cwd(), templatePath), vars, {
    cache: true,
  });

  return async function send({ to, subject, from }) {
    await sendgrid.send({ to, subject, from, html });
  };
}
