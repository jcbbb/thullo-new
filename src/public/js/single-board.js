import { selectOne } from "./utils.js";

const addBoardMemberBtn = selectOne("add-board-member");
const addBoardMemberDialog = selectOne("add-board-member-dialog");
const closeBoardDialog = selectOne("add-board-member-dialog-close", addBoardMemberDialog);

closeBoardDialog.addEventListener("click", () => addBoardMemberDialog.close());

addBoardMemberBtn.addEventListener("click", () => addBoardMemberDialog.showModal());
