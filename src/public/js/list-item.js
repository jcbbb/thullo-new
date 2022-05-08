import {
  selectOne,
  selectAll,
  option,
  htmlToNode,
  selectClosest,
  disableForm,
  addListeners,
  debounce,
  request,
} from "./utils.js";
import { toast } from "./toast.js";
import api from "./api/index.js";

const attachmentInputs = selectAll("attachment-input");
const attachmentDeleteForms = selectAll("attachment-delete-form");
const commentForms = selectAll("comment-form");
const commentDeleteForms = selectAll("comment-delete-form");
const descriptionInputs = selectAll("description-input");
const commentContents = selectAll("comment-content-input");

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
    addListeners(deleteForm, { submit: onAttachmentDelete });
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
  const contentInput = selectOne("comment-content-input", node);
  const comments = commentForm.nextElementSibling;
  addListeners(deleteForm, { submit: onCommentDelete });
  addListeners(contentInput, { input: debounce(onCommentChange) });
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

async function onDescriptionChange(e) {
  const form = selectClosest("description-form", e.target);
  await request(form.action, { body: Object.fromEntries(new FormData(form)) });
}

async function onCommentChange(e) {
  const form = selectClosest("comment-content-form", e.target);
  await request(form.action, { body: Object.fromEntries(new FormData(form)) });
}

addListeners(attachmentDeleteForms, { submit: onAttachmentDelete });
addListeners(commentForms, { submit: onComment });
addListeners(commentDeleteForms, { submit: onCommentDelete });
addListeners(attachmentInputs, { change: onAttachmentChange });
addListeners(descriptionInputs, { input: debounce(onDescriptionChange) });
addListeners(commentContents, { input: debounce(onCommentChange) });
