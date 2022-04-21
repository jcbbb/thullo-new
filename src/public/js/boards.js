import { selectOne, addListeners } from "./utils.js";

const addBoardBtn = selectOne("add-board");
const createBoardDialog = selectOne("create-board-dialog");
const closeBoardDialog = selectOne("create-board-dialog-close", createBoardDialog);
const fileUpload = selectOne("file-upload", createBoardDialog);
const imageViewer = selectOne("image-viewer", createBoardDialog);

function onUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    imageViewer.src = url;
    imageViewer.style.display = "block";
  }
}

addListeners(fileUpload, { change: onUpload });
addListeners(closeBoardDialog, { click: () => createBoardDialog.close() });
addListeners(addBoardBtn, { click: () => createBoardDialog.showModal() });
