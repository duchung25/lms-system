import certificateService from "../services/certificateService.js";
import AppError from "../utils/AppError.js";

const certificateController = {
  async generateCertificate(req, res, next) {
    try {
      const userId = req.user.userId;
      const { courseId } = req.body;

      if (!courseId) {
        throw new AppError("Course ID is required", 400);
      }

      const certificate = await certificateService.generateCertificate(
        userId,
        courseId
      );

      res.status(201).json({
        status: "success",
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyCertificates(req, res, next) {
    try {
      const userId = req.user.userId;
      const certificates = await certificateService.getStudentCertificates(
        userId
      );

      res.status(200).json({
        status: "success",
        data: certificates,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCertificateById(req, res, next) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.getCertificateById(
        id,
        req.user
      );

      res.status(200).json({
        status: "success",
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllCertificates(req, res, next) {
    try {
      const result = await certificateService.getAllCertificates(req.query);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyCertificate(req, res, next) {
    try {
      const { code } = req.params;
      const certificate = await certificateService.verifyCertificate(code);

      res.status(200).json({
        status: "success",
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  },

  async revokeCertificate(req, res, next) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.revokeCertificate(id);

      res.status(200).json({
        status: "success",
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default certificateController;
