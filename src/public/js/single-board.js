import { selectOne, selectAll } from "./utils.js";

const addBoardMemberBtn = selectOne("invite-member");
const addBoardMemberDialog = selectOne("invitation-dialog");
const closeBoardDialog = selectOne("invitation-dialog-close", addBoardMemberDialog);

closeBoardDialog.addEventListener("click", () => addBoardMemberDialog.close());

addBoardMemberBtn.addEventListener("click", () => addBoardMemberDialog.showModal());

const lists = selectAll("list-card");

Array.from(lists).forEach((list) => {
  list.addEventListener("dragstart", onDragStart);
  list.addEventListener("dragenter", onDragEnter);
  list.addEventListener("dragover", onDragOver);
  list.addEventListener("dragleave", onDragLeave);
  list.addEventListener("drop", onDrop);
});

function onDragEnter(e) {
  e.preventDefault();
}

function onDragOver(e) {
  e.preventDefault();
}
function onDragLeave(e) {
  e.preventDefault();
}

function onDrop(e) {
  e.preventDefault();
  const list_id = e.dataTransfer.getData("text/plain");
  const draggingEl = document.querySelector(`[data-list_id="${list_id}"]`);
  const targetParent = e.target.parentElement;
  draggingEl.parentElement.append(e.target);
  targetParent.append(draggingEl);
  draggingEl.classList.remove("hidden");
}

function onDragStart(e) {
  e.target.classList.add("rotate-12", "bg-white");
  e.dataTransfer.setData("text/plain", e.target.dataset.list_id);
  requestAnimationFrame(() => {
    e.target.classList.remove("rotate-12", "bg-white");
    e.target.classList.add("hidden");
  });
  e.target.parentElement.style.height = e.target.offsetHeight + "px";
  e.target.parentElement.style.width = e.target.offsetWidth + "px";
  e.target.parentElement.classList.add("border-2", "border-dashed", "border-brand-500");
}
