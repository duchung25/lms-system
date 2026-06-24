import { useState, useCallback } from 'react';
import navLinkService from '../service/navLink.service.js';

const useNavLink = () => {
  const [navLinks, setNavLinks] = useState([]);
  const [currentNavLink, setCurrentNavLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllNavLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await navLinkService.getAll();
      if (result.success) {
        setNavLinks(result.data);
      } else {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi tải danh sách NavLink';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNavLinkById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await navLinkService.getById(id);
      if (result.success) {
        setCurrentNavLink(result.data);
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNavLink = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await navLinkService.create(data);
      if (result.success) {
        setNavLinks((prev) => [...prev, result.data]);
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNavLink = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await navLinkService.update(id, data);
      if (result.success) {
        setNavLinks((prev) =>
          prev.map((item) => (item.id === id || item._id === id ? result.data : item))
        );
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNavLink = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await navLinkService.delete(id);
      if (result.success) {
        const deletedId = result.data.deletedId;
        setNavLinks((prev) => prev.filter((item) => item.id !== deletedId && item._id !== deletedId));
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    navLinks,
    currentNavLink,
    loading,
    error,
    fetchAllNavLinks,
    fetchNavLinkById,
    createNavLink,
    updateNavLink,
    deleteNavLink,
  };
};

export default useNavLink;