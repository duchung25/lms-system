import navLinkService from '../services/navLinkService.js';

const navLinkController = {
  async getAllNavLinks(req, res, next) {
    try {
      const navLinks = await navLinkService.getAllNavLinks();
      res.status(200).json({
        success: true,
        message: navLinks.length > 0 ? 'Lấy danh sách NavLink thành công' : 'Không có NavLink nào',
        data: navLinks
      });
    } catch (error) {
      next(error);
    }
  },

  async getNavLinkById(req, res, next) {
    try {
      const { id } = req.params;
      const navLink = await navLinkService.getNavLinkById(id);
      res.status(200).json({
        success: true,
        message: 'Lấy NavLink thành công',
        data: navLink
      });
    } catch (error) {
      next(error);
    }
  },

  async createNavLink(req, res, next) {
    try {
      const navLink = await navLinkService.createNavLink(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo NavLink thành công',
        data: navLink
      });
    } catch (error) {
      next(error);
    }
  },

  async updateNavLink(req, res, next) {
    try {
      const { id } = req.params;
      const navLink = await navLinkService.updateNavLink(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cập nhật NavLink thành công',
        data: navLink
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteNavLink(req, res, next) {
    try {
      const { id } = req.params;
      const result = await navLinkService.deleteNavLink(id);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { deletedId: result.deletedId }
      });
    } catch (error) {
      next(error);
    }
  }
};

export default navLinkController;
