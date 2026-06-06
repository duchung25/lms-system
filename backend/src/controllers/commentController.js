import commentService from "../services/commentService.js";

const commentController = {
  async getComments(req, res, next) {
    try {
      const { courseId, lessonId } = req.params;
      const comments = await commentService.getComments(courseId, lessonId);

      res.status(200).json({
        success: true,
        message: "Comments retrieved successfully",
        data: { comments },
      });
    } catch (error) {
      next(error);
    }
  },

  async createComment(req, res, next) {
    try {
      const { courseId, lessonId } = req.params;
      const comment = await commentService.createComment(
        courseId,
        lessonId,
        req.user,
        req.body.content
      );

      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { courseId, lessonId, commentId } = req.params;
      const comment = await commentService.updateComment(
        courseId,
        lessonId,
        commentId,
        req.user,
        req.body.content
      );

      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const { courseId, lessonId, commentId } = req.params;
      const result = await commentService.deleteComment(
        courseId,
        lessonId,
        commentId,
        req.user
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;
