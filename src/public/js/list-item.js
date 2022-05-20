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
  createNode,
} from "./utils.js";
import { toast } from "./toast.js";
import api from "./api/index.js";

const attachmentInputs = selectAll("attachment-input");
const attachmentDeleteForms = selectAll("attachment-delete-form");
const commentForms = selectAll("comment-form");
const commentDeleteForms = selectAll("comment-delete-form");
const descriptionInputs = selectAll("description-input");
const commentContents = selectAll("comment-content-input");
const coverUploadInputs = selectAll("cover-upload");
const memberPickerInputs = selectAll("member-picker-input");

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
  const enableForm = disableForm(deleteForm);
  const [result, err] = await option(request(deleteForm.action, { method: "DELETE" }));
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

function createListCardImage(id, src) {
  return createNode("img", {
    class: `rounded-md pointer-events-none h-32 w-full object-cover mb-3 js-${id}-cover-photo`,
    src,
  });
}

function createListItemImage(id, src) {
  return createNode("img", {
    class: `object-cover max-h-60 w-full rounded-lg js-${id}-cover-photo`,
    src,
  });
}

async function onCoverChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const form = selectClosest("cover-form", e.target);
  const formData = new FormData(form);

  formData.append("_action", "attach_item_cover");

  const enableForm = disableForm(form);
  const [result, err] = await option(request(form.action, { body: formData }));

  if (err) {
    toast(err.message, "err");
    enableForm();
    return;
  }

  const itemId = formData.get("id");
  const coverDisplays = selectAll(`${itemId}-cover-photo`);
  const url = URL.createObjectURL(file);

  if (!coverDisplays.length) {
    const itemCard = selectOne(`item-card-${itemId}`);
    const itemDialog = selectOne(`item-dialog-${itemId}`);
    const cardImage = createListCardImage(itemId, url);
    const itemImage = createListItemImage(itemId, url);
    itemDialog.prepend(itemImage);
    itemCard.prepend(cardImage);
  } else {
    coverDisplays.forEach((cover) => (cover.src = url));
  }

  enableForm();
  toast("Cover photo updated successfully", "success");
}

function createSuggestion(user) {
  const suggestion = createNode("label", {
    class:
      "flex justify-between items-center hover:bg-brand-50 p-1 -m-1 text-sm rounded-md cursor-pointer relative",
  });

  const icon =
    htmlToNode(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-500 checkbox-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
</svg>`);

  const div = createNode("div", {
    class: "flex flex-col",
  });

  const name = createNode("span", {
    class: "font-medium",
  });

  name.textContent = user.name;

  const email = createNode("span", { class: "text-gray-500" });

  email.textContent = user.email;

  const input = createNode("input", {
    class: "absolute opacity-0 -z-10 w-0 peer group checkbox-input",
    type: "checkbox",
    name: "members",
    value: user.id,
  });

  div.append(name, email);

  suggestion.append(input, div, icon);

  return suggestion;
}

async function onMemberChange(e) {
  const q = e.target.value;
  const form = e.target.parentElement;
  const data = new FormData(form);
  const users = await request(`/boards/${data.get("board_id")}/members`, {
    query: { q },
  });
  const suggestions = selectOne("member-suggestions", form);
  suggestions.innerHTML = "";
  suggestions.append(...users.map(createSuggestion));
}

addListeners(attachmentDeleteForms, { submit: onAttachmentDelete });
addListeners(commentForms, { submit: onComment });
addListeners(commentDeleteForms, { submit: onCommentDelete });
addListeners(attachmentInputs, { change: onAttachmentChange });
addListeners(descriptionInputs, { input: debounce(onDescriptionChange) });
addListeners(commentContents, { input: debounce(onCommentChange) });
addListeners(coverUploadInputs, { change: onCoverChange });
addListeners(memberPickerInputs, { input: debounce(onMemberChange) });
