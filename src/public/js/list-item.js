import { selectOne, selectAll, option, createNode, selectClosest } from "./utils.js";
import { deleteOne } from "./api/attachment.js";
import { toast } from "./toast.js";

const attachmentInput = selectOne("attachment-input");
const attachmentDeleteForms = selectAll("attachment-delete-form");
const attachments = selectOne("attachment-list");

const Decoder = new TextDecoder();

function htmlToNodes(html) {
  const template = createNode("template");
  template.innerHTML = html.trim();
  return template.content.childNodes;
}

attachmentInput.addEventListener("change", async (e) => {
  const attachmentForm = e.target.closest(".js-attachment-form");
  const response = await fetch("/attachments", {
    method: "post",
    body: new FormData(attachmentForm),
    credentials: "include",
  });

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const html = Decoder.decode(value);
    const nodes = htmlToNodes(html);
    nodes.forEach((node) => {
      const deleteForm = selectOne("attachment-delete-form", node);
      deleteForm.addEventListener("submit", onAttachmentDelete);
    });
    attachments.append(...nodes);
  }
});

async function onAttachmentDelete(e) {
  e.preventDefault();
  const attachment = selectClosest("attachment-item", e.target);
  const fieldset = selectOne("attachment-fieldset", e.target);
  const data = new FormData(e.target);
  fieldset.setAttribute("disabled", true);
  const [result, err] = await option(deleteOne(data.get("attachment_id")));
  if (err) {
    fieldset.removeAttribute("disabled");
    toast(err.message, "err");
    return;
  }

  attachment.remove();
}

attachmentDeleteForms?.forEach((form) => {
  form.addEventListener("submit", onAttachmentDelete);
});
