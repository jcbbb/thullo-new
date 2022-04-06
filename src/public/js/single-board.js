import { selectOne, selectAll } from "./utils.js";

const addBoardMemberBtn = selectOne("invite-member");
const listItemBtns = selectAll("list-item");
const addBoardMemberDialog = selectOne("invitation-dialog");
const closeBoardDialog = selectOne("invitation-dialog-close", addBoardMemberDialog);

closeBoardDialog.addEventListener("click", () => addBoardMemberDialog.close());

addBoardMemberBtn.addEventListener("click", () => addBoardMemberDialog.showModal());

listItemBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parent = e.target.parentElement;
    parent.nextElementSibling.showModal();
  });
});

const lists = selectAll("list-card");

let draggingEl = null;

// Array.from(lists).forEach((list) => {
//   list.addEventListener("dragstart", onDragStart, false);
//   list.addEventListener("dragend", onDragEnd, false);
//   list.parentElement.addEventListener("dragenter", onDragEnter, false);
//   list.parentElement.addEventListener("dragover", onDragOver, false);
//   list.parentElement.addEventListener("dragleave", onDragLeave, false);
//   list.parentElement.addEventListener("drop", onDrop, false);
// });

// function onDragEnd(e) {
//   e.target.classList.remove("hidden");
//   e.target.parentElement.classList.remove("border-2", "border-dashed", "border-brand-500");
//   e.target.parentElement.style.removeProperty("width");
//   e.target.parentElement.style.removeProperty("height");
//   const parentSiblings = getSiblings(e.target.parentElement);
//   parentSiblings.forEach((sibling) =>
//     sibling.firstElementChild.classList.remove("pointer-events-none")
//   );
// }
// const listsContainer = selectOne("lists-container");

// function onDragEnter(e) {
//   e.preventDefault();
//   // console.log(e.target);
//   if (e.target === draggingEl.parentElement) return;
//   listsContainer.insertBefore(e.target.parentElement, draggingEl.parentElement);
// }

// function onDragOver(e) {
//   e.preventDefault();
// }

// function onDragLeave(e) {
//   e.preventDefault();
// }

// function onDrop(e) {
//   console.log("here");
//   e.preventDefault();
//   // const list_id = e.dataTransfer.getData("text/plain");
//   // const draggingEl = document.querySelector(`[data-list_id="${list_id}"]`);
//   // const targetParent = e.target.parentElement;
//   // draggingEl.parentElement.append(e.target);
//   // targetParent.append(draggingEl);
//   // draggingEl.classList.remove("hidden");
// }

// function onDragStart(e) {
//   draggingEl = e.target;
//   e.target.classList.add("rotate-12", "bg-white");
//   e.dataTransfer.setData("text/plain", e.target.dataset.list_id);
//   requestAnimationFrame(() => {
//     e.target.classList.remove("rotate-12", "bg-white");
//     e.target.classList.add("hidden");
//   });
//   e.target.parentElement.style.height = e.target.offsetHeight + "px";
//   e.target.parentElement.style.width = e.target.offsetWidth + "px";
//   e.target.parentElement.classList.add("border-2", "border-dashed", "border-brand-500");
//   const parentSiblings = getSiblings(e.target.parentElement);
//   parentSiblings.forEach((sibling) =>
//     sibling.firstElementChild.classList.add("pointer-events-none")
//   );
// }

// function getSiblings(elem) {
//   let n = elem;
//   let siblings = [];
//   while ((n = n.nextElementSibling)) siblings.push(n);

//   return siblings;
// }

// const xs = [
//   {
//     order: 0,
//     title: "In Progress",
//   },
//   {
//     order: 1,
//     title: "Done",
//   },
//   {
//     order: 2,
//     title: "Paid",
//   },
// ];

// const swap = (xs, first, second) => {
//   let temp = { ...xs[first], order: xs[second].order };
//   xs[first] = { ...xs[second], order: xs[first].order };
//   xs[second] = temp;
//   return xs;
// };
// console.log(swap(xs, 2, 1));
