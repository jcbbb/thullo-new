import { selectOne, selectAll, addListeners } from "./utils.js";

const addBoardMemberBtn = selectOne("invite-member");
const listItemBtns = selectAll("list-item");
const addBoardMemberDialog = selectOne("invitation-dialog");
const closeBoardDialog = selectOne("invitation-dialog-close", addBoardMemberDialog);
const listCards = selectAll("list-card");
const listContainers = selectAll("list-container");

function onDragEnter(e) {}

function onDrop(e) {
  const dragging = document.querySelector("[data-dragging=true]");
  const container = e.currentTarget;
  if (dragging.parentElement === container) return;
  dragging.parentElement.append(container.querySelector("[draggable=true]"));
  container.append(dragging);
}

function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

function onDragStart(e) {
  const element = e.target;
  element.setAttribute("data-dragging", true);
}

function onDragEnd(e) {
  const element = e.target;
  element.removeAttribute("data-dragging");
}

function onListItemClick(e) {
  const parent = e.target.parentElement;
  parent.nextElementSibling.showModal();
}

addListeners(listItemBtns, {
  click: onListItemClick,
});

addListeners(listCards, {
  dragstart: onDragStart,
  dragend: onDragEnd,
});

addListeners(listContainers, {
  dragover: onDragOver,
  dragenter: onDragEnter,
  drop: onDrop,
});

addListeners(closeBoardDialog, { click: () => addBoardMemberDialog.close() });
addListeners(addBoardMemberBtn, { click: () => addBoardMemberDialog.showModal() });
