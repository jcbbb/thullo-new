import * as S3Service from "../services/s3.service.js";
import * as AttachmentService from "../services/attachment.service.js";
import { normalizeBody, formatter } from "../utils/index.js";
import { renderFile } from "eta";
import path from "path";

export async function upload(req, res) {
  try {
    const { attachments, board_id, list_item_id } = normalizeBody(req.body);
    for await (const attachment of S3Service.uploadMultiple(attachments)) {
      const createdAttachment = await AttachmentService.createOne({
        list_item_id,
        board_id,
        attachment,
      });
      const html = await renderFile(
        path.join(process.cwd(), "./src/views/partials/attachment.html"),
        {
          formatter,
          attachment: createdAttachment,
          item: {
            id: list_item_id,
          },
        }
      );
      res.raw.write(html);
    }
    res.send();
  } catch (err) {
    console.log(err);
  }
}

export async function deleteOne(req, res) {
  const id = req.params.attachment_id;
  const attachment = await AttachmentService.getOne(id);
  await S3Service.deleteOne(attachment.s3_key);
  await AttachmentService.deleteOne(id);
  res.send({ id });
}
