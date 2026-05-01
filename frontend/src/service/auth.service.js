import { authApi } from '../api/auth.api.js'

export const authService = {
  login: async (payLoad) => {
        const res = await authApi.login(payLoad);
        return res.data?.data || null;
  },
   register: async (payLoad) => {
        const res = await authApi.register(payLoad);
        return res.data?.data || null;
    },
    getProfile: async () => {
        const res = await authApi.getProfile();
        return res.data?.data || null;
    },
    changePassword: async (payLoad) => {
        const res = await authApi.changePassword(payLoad);
        return res.data?.data || null;
    }
};