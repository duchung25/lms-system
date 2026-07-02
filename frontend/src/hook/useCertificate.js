import { useCallback, useEffect, useState } from "react";
import { certificateService } from "../service/certificate.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useMyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await certificateService.getMyCertificates();
      setCertificates(data);
    } catch (err) {
      setCertificates([]);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
};

export const useGenerateCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCertificate = async (courseId) => {
    setLoading(true);
    setError("");
    try {
      const data = await certificateService.generateCertificate(courseId);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { generateCertificate, loading, error };
};

export const useCertificateDetail = (certificateId) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!certificateId) {
      setCertificate(null);
      return;
    }

    const fetchCertificate = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await certificateService.getCertificateById(certificateId);
        setCertificate(data);
      } catch (err) {
        setCertificate(null);
        setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  return { certificate, loading, error };
};

export const useAllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCertificates = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await certificateService.getAllCertificates(customParams);
      setCertificates(data.list || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 10,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      });
    } catch (err) {
      setCertificates([]);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { certificates, pagination, loading, error, refetch: fetchCertificates };
};

export const useVerifyCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyCertificate = async (code) => {
    setLoading(true);
    setError("");
    try {
      return await certificateService.verifyCertificate(code);
    } catch (err) {
      const message = getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { verifyCertificate, loading, error };
};

export const useRevokeCertificate = () => {
  const [loading, setLoading] = useState(false);

  const revokeCertificate = async (certificateId) => {
    setLoading(true);
    try {
      return await certificateService.revokeCertificate(certificateId);
    } catch (err) {
      throw new Error(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return { revokeCertificate, loading };
};
