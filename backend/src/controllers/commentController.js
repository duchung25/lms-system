import commentService from "../services/commentService.js";
import { getIo } from "../socketManager.js";

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

  async getReplies(req, res, next) {
    try {
      const { courseId, lessonId, commentId } = req.params;
      const replies = await commentService.getReplies(courseId, lessonId, commentId);

      res.status(200).json({
        success: true,
        message: "Replies retrieved successfully",
        data: { replies },
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
        req.body.content,
        req.body.parentCommentId || null
      );

      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: { comment },
      });

      // emit realtime event after successful DB save
      try {
        const io = getIo();
        if (io) {
          io.to(String(lessonId)).emit("comment:created", comment);
        }
      } catch (e) {
        // swallow socket errors to not affect REST response
        console.error("Socket emit error (createComment):", e.message || e);
      }
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

      // emit realtime event after successful DB save
      try {
        const io = getIo();
        if (io) {
          io.to(String(lessonId)).emit("comment:updated", comment);
        }
      } catch (e) {
        console.error("Socket emit error (updateComment):", e.message || e);
      }
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

      // emit realtime event after successful DB delete
      try {
        const io = getIo();
        if (io) {
          io.to(String(lessonId)).emit("comment:deleted", {
            commentId,
            lessonId,
          });
        }
      } catch (e) {
        console.error("Socket emit error (deleteComment):", e.message || e);
      }
    } catch (error) {
      next(error);
    }
  },
};

export default commentController;
