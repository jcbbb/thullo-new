import * as CommentService from "../services/comment.service.js";

export const commentOwner = async (user, params) => {
  const comment = await CommentService.getOne(params.comment_id);
  return comment.user.id === user.id;
};
