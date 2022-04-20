import { selectOne, selectAll, option, createNode, selectClosest, disableForm } from "./utils.js";
import { deleteOne } from "./api/attachment.js";
import { toast } from "./toast.js";

const attachmentInputs = selectAll("attachment-input");
const attachmentDeleteForms = selectAll("attachment-delete-form");

const Decoder = new TextDecoder();

function htmlToNode(html) {
  const template = createNode("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

attachmentInputs?.forEach((input) => {
  input.addEventListener("change", onAttachmentChange);
});

async function onAttachmentChange(e) {
  const attachmentForm = selectClosest("attachment-form", e.target);
  const attachments = attachmentForm.nextElementSibling;
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
    const node = htmlToNode(html);
    const deleteForm = selectOne("attachment-delete-form", node);
    deleteForm.addEventListener("submit", onAttachmentDelete);
    attachments.append(node);
  }
}

async function onAttachmentDelete(e) {
  e.preventDefault();
  const attachment = selectClosest("attachment-item", e.target);
  const data = new FormData(e.target);
  const enableForm = disableForm(e.target);
  const [result, err] = await option(deleteOne(data.get("attachment_id")));
  if (err) {
    toast(err.message, "err");
    enableForm();
    return;
  }

  attachment.remove();
}

attachmentDeleteForms?.forEach((form) => {
  form.addEventListener("submit", onAttachmentDelete);
});
