import apiClient from "./apiClient";

const navLinkApi = {
    getAll() {
        return apiClient.get("/navlinks");
    },
    getById(id) {
        return apiClient.get(`/navlinks/${id}`);
    },
    create(data) {
        return apiClient.post("/navlinks", data);
    },
    update(id, data) {
        return apiClient.put(`/navlinks/${id}`, data);
    },
    delete(id) {
        return apiClient.delete(`/navlinks/${id}`);
    }
};

export default navLinkApi;
