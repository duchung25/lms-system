import apiClient from "./apiClient";

export const certificateApi = {
  generateCertificate: (courseId) => {
    return apiClient.post("/certificates/generate", { courseId });
  },
  getMyCertificates: () => {
    return apiClient.get("/certificates/my-certificates");
  },
  getCertificateById: (certificateId) => {
    return apiClient.get(`/certificates/${certificateId}`);
  },
  getAllCertificates: (params) => {
    return apiClient.get("/certificates/admin/all", { params });
  },
  verifyCertificate: (code) => {
    return apiClient.get(`/certificates/verify/${code}`);
  },
  revokeCertificate: (certificateId) => {
    return apiClient.patch(`/certificates/admin/${certificateId}/revoke`);
  },
};
