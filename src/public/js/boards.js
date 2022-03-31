import { selectOne } from "./utils.js";

const addBoardBtn = selectOne("add-board");
const createBoardDialog = selectOne("create-board-dialog");
const closeBoardDialog = selectOne("create-board-dialog-close", createBoardDialog);
const createBoardForm = selectOne("create-board-form", createBoardDialog);

createBoardForm.addEventListener("submit", (e) => {
  fetch("/boards/new", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  console.log(Object.fromEntries(new FormData(e.target)));
  e.target.reset();
});

closeBoardDialog.addEventListener("click", () => createBoardDialog.close());

addBoardBtn.addEventListener("click", () => createBoardDialog.showModal());
