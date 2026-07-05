import { useEffect, useState } from 'react';
import { authService } from '../service/auth.service';
import { getErrorMessage } from '../helpers/error.helper.js';
import { useAuth } from '../auth/useAuth';

export const useLogin = () => {
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState("");
    const auth = useAuth();

    const login = async (payLoad) => {
        setLoading(true);
        setError("");
        try{
            const res = await authService.login(payLoad);
            auth.login({
                accessToken: res.token,
                user: res.user,
            });
            return res;
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    return { login, loading, error };
};
export const useRegister = () => {
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState("");
    const register = async (payLoad) => {
        setLoading(true);
        setError("");
        try{
            const res = await authService.register(payLoad);
            return res;
        }catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    return { register, loading, error };
};
export const useGetProfile = () => {
    const [ loading, setLoading ] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchProfile =  async () => {
            setLoading(true);
            setError("");
            try{
                const data = await authService.getProfile();
                setProfile(data);
            }catch (err) {                
                const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    return { profile, loading, error };
};
export const useEditProfile = () => {
    const [ loading, setLoading ] = useState(false);
    const editProfile = async (data) => {
        setLoading(true);
        try {
            return await authService.editProfile(data);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    return { editProfile, loading };
};
export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const getProfile = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await authService.getProfile();
            return res;
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    const editProfile = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await authService.editProfile(data);
            return res;
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    return { getProfile, editProfile, loading, error };
};

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const changePassword = async (payload) => {
        setLoading(true);
        try {
            return await authService.changePassword(payload);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };
    return { changePassword, loading };
};