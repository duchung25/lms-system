import navLinkApi from '../api/navLink.api.js';

const navLinkService = {
  async getAll() {
    const response = await navLinkApi.getAll();
    return response.data; 
  },

  async getById(id) {
    const response = await navLinkApi.getById(id);
    return response.data;
  },

  async create(data) {
    const response = await navLinkApi.create(data);
    return response.data;
  },

  async update(id, data) {
    const response = await navLinkApi.update(id, data);
    return response.data;
  },

  async delete(id) {
    const response = await navLinkApi.delete(id);
    return response.data;
  }
};

export default navLinkService;