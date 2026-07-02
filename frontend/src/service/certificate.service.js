import { certificateApi } from "../api/certificate.api";

export const certificateService = {
  async getMyCertificates() {
    const res = await certificateApi.getMyCertificates();
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async generateCertificate(courseId) {
    const res = await certificateApi.generateCertificate(courseId);
    return res.data?.data ?? null;
  },

  async getCertificateById(certificateId) {
    const res = await certificateApi.getCertificateById(certificateId);
    return res.data?.data ?? null;
  },

  async getAllCertificates(params) {
    const res = await certificateApi.getAllCertificates(params);
    return res.data?.data ?? { list: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  },

  async verifyCertificate(code) {
    const res = await certificateApi.verifyCertificate(code);
    return res.data?.data ?? null;
  },

  async revokeCertificate(certificateId) {
    const res = await certificateApi.revokeCertificate(certificateId);
    return res.data?.data ?? null;
  },
};
