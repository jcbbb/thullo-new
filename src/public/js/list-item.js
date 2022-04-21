import {
  selectOne,
  selectAll,
  option,
  htmlToNode,
  selectClosest,
  disableForm,
  addListener,
} from "./utils.js";
import { toast } from "./toast.js";
import api from "./api/index.js";

const attachmentInputs = selectAll("attachment-input");
const attachmentDeleteForms = selectAll("attachment-delete-form");
const commentForms = selectAll("comment-form");
const commentDeleteForms = selectAll("comment-delete-form");

const Decoder = new TextDecoder();

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
  const [result, err] = await option(api.attachment.deleteOne(data.get("attachment_id")));
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

async function onComment(e) {
  e.preventDefault();
  const commentForm = e.target;
  const comment = Object.fromEntries(new FormData(commentForm));
  const [result, err] = await option(api.comment.createOne(comment));
  if (err) {
    toast(err.message, "err");
    return;
  }
  const node = htmlToNode(result);
  const deleteForm = selectOne("comment-delete-form", node);
  const comments = commentForm.nextElementSibling;
  deleteForm.addEventListener("submit", onCommentDelete);
  comments.append(node);
  commentForm.reset();
}

async function onCommentDelete(e) {
  e.preventDefault();
  const deleteForm = e.target;
  const comment = selectClosest("comment-item", deleteForm);
  const data = new FormData(deleteForm);
  const enableForm = disableForm(deleteForm);
  const [result, err] = await option(api.comment.deleteOne(data.get("comment_id")));
  if (err) {
    toast(err.message, "err");
    enableForm();
    return;
  }

  comment.remove();
}

addListener(commentForms, "submit", onComment);
addListener(commentDeleteForms, "submit", onCommentDelete);
addListener(attachmentInputs, "change", onAttachmentChange);
