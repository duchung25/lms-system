import NavLink from '../models/NavLink.js';

const navLinkService = {
  async getAllNavLinks() {
    return await NavLink.find().sort({ order: 1 });
  },

  async getNavLinkById(id) {
    const navLink = await NavLink.findById(id);
    if (!navLink) {
      const error = new Error('NavLink không tồn tại');
      error.statusCode = 404;
      throw error;
    }
    return navLink;
  },

  async createNavLink(data) {
    const { title, url, order, isActiveOnly } = data;
    const navLink = new NavLink({ title, url, order, isActiveOnly });
    await navLink.save();
    return navLink;
  },

  async updateNavLink(id, data) {
    const navLink = await NavLink.findByIdAndUpdate(id, data, { new: true });
    if (!navLink) {
      const error = new Error('NavLink không tồn tại');
      error.statusCode = 404;
      throw error;
    }
    return navLink;
  },

  async deleteNavLink(id) {
    const navLink = await NavLink.findByIdAndDelete(id);
    if (!navLink) {
      const error = new Error('NavLink không tồn tại');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Xóa NavLink thành công', deletedId: id };
  }
};

export default navLinkService;
