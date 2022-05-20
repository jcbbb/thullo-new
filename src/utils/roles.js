import * as CommentService from "../services/comment.service.js";

export const commentOwner = async (user, params) => {
  if (!params.comment_id) return true;
  const comment = await CommentService.getOne(params.comment_id);
  return comment.user.id === user.id;
};
