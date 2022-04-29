import { selectOne, selectAll, addListeners, option } from "./utils.js";
import { toast } from "./toast.js";
import api from "./api/index.js";

const listItemBtns = selectAll("list-item");
const listCards = selectAll("list-card");
const listContainers = selectAll("list-container");

function onDragEnter(e) {
  const dragging = document.querySelector("[data-dragging=true]");
  const container = e.currentTarget;
  if (dragging.parentElement === container) return;
  markDropArea(container, dragging);
  const replacement = container.querySelector("[draggable=true]");
  unmarkDropArea(dragging.parentElement);
  dragging.parentElement.append(replacement);
  const newPos = replacement.getAttribute("data-pos");
  replacement.setAttribute("data-pos", dragging.getAttribute("data-pos"));
  dragging.setAttribute("data-pos", newPos);
  container.append(dragging);
}

async function onDrop(e) {
  const dragging = document.querySelector("[data-dragging=true]");
  const container = e.currentTarget;
  dragging.classList.remove("opacity-0");
  unmarkDropArea(container);
  const { board_id, pos } = dragging.dataset;
  const id = e.dataTransfer.getData("text/plain");
  listCards.forEach((card) => card.removeAttribute("draggable"));
  const [result, err] = await option(api.list.updateOne(id, { pos, board_id }));
  if (err) {
    toast(err.message, "err");
    return;
  }

  listCards.forEach((card) => card.setAttribute("draggable", true));
}

function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

function onDragStart(e) {
  const draggable = e.target;
  draggable.setAttribute("data-dragging", true);
  e.dataTransfer.setData("text/plain", e.target.dataset.lid);
  setTimeout(() => {
    markDropArea(draggable.parentElement, draggable);
    e.target.classList.add("opacity-0");
  }, 1);
}

function onDragEnd(e) {
  const draggable = e.target;
  draggable.removeAttribute("data-dragging");
  draggable.classList.remove("opacity-0");
  unmarkDropArea(draggable.parentElement);
}

function onListItemClick(e) {
  const parent = e.target.parentElement;
  parent.nextElementSibling.showModal();
}

function markDropArea(container, dragging) {
  const padding = parseInt(window.getComputedStyle(dragging, null).getPropertyValue("padding"), 10);
  container.classList.add("border-2");
  container.style.height = dragging.offsetHeight - padding * 2 + "px";
}

function unmarkDropArea(container) {
  container.classList.remove("border-2");
  container.style.height = "auto";
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
