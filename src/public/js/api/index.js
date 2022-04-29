import { attachment } from "./attachment.js";
import { comment } from "./comment.js";
import { auth } from "./auth.js";
import { listItem } from "./list-item.js";
import { list } from "./list.js";
import { user } from "./user.js";
import { invitation } from "./invitation.js";

export default (function () {
  return {
    attachment: attachment("/attachments"),
    comment: comment("/comments"),
    auth: auth("/auth"),
    listItem: listItem("/list-items"),
    list: list("/lists"),
    user: user("/users"),
    invitation: invitation("/invitations"),
  };
})();
