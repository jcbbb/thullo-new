import { selectOne } from "./utils.js";

const addBoardBtn = selectOne("add-board");
const createBoardDialog = selectOne("create-board-dialog");
const closeBoardDialog = selectOne("create-board-dialog-close", createBoardDialog);

const fileUpload = selectOne("file-upload", createBoardDialog);
const imageViewer = selectOne("image-viewer", createBoardDialog);

fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    imageViewer.src = url;
    imageViewer.style.display = "block";
  }
});
closeBoardDialog.addEventListener("click", () => createBoardDialog.close());

addBoardBtn.addEventListener("click", () => createBoardDialog.showModal());
