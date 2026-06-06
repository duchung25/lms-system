import ratingService from "../services/ratingService.js";

const ratingController = {
  async upsertRating(req, res, next) {
    try {
      const { courseId } = req.params;
      const { rating } = req.body;
      const result = await ratingService.upsertRating(
        courseId,
        req.user.userId,
        rating
      );

      res.status(200).json({
        success: true,
        message: "Rating saved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ratingController;
