import { attachment } from "./attachment.js";
import { comment } from "./comment.js";
import { auth } from "./auth.js";

export default (function () {
  return {
    attachment: attachment("/attachments"),
    comment: comment("/comments"),
    auth: auth("/auth"),
  };
})();
