import { selectOne, addListeners, debounce, createNode, htmlToNode, option } from "./utils.js";
import api from "./api/index.js";
import { toast } from "./toast.js";

const inviteMemberBtn = selectOne("invite-member");
const inviteDialog = selectOne("invitation-dialog");
const closeInviteDialog = selectOne("invitation-dialog-close", inviteDialog);
const suggestions = selectOne("invitation-suggestions", inviteDialog);
const invitationForm = selectOne("invitation-form", inviteDialog);

const inviteInput = selectOne("invitation-input", inviteDialog);

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
    name: "invites",
    value: user.email,
  });

  div.append(name, email);

  suggestion.append(input, div, icon);

  return suggestion;
}

async function onInput(e) {
  const q = e.target.value;
  const users = await api.user.getMany({ q });
  suggestions.innerHTML = "";
  suggestions.append(...users.map(createSuggestion));
}

async function onSubmit(e) {
  e.preventDefault();
  const [result, err] = await option(
    api.invitation.create(Object.fromEntries(new FormData(e.target)))
  );

  if (err) {
    toast(err.message, "err");
    return;
  }

  e.target.reset();
  inviteDialog.close();
  toast("Successfully sent invitations", "success");
}

addListeners(inviteInput, {
  input: debounce(onInput),
});

addListeners(inviteMemberBtn, { click: () => inviteDialog.showModal() });
addListeners(closeInviteDialog, { click: () => inviteDialog.close() });
addListeners(invitationForm, {
  submit: onSubmit,
});
