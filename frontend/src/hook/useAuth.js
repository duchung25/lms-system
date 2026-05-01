import { useState } from 'react';
import { authService } from '../service/auth.service';
import { getErrorMessage } from '../helpers/error.helper.js';
import { useAuth } from '../auth/useAuth';

export const useLogin = () => {
    const [ loading, setLoading ] = useState(false);
    const auth = useAuth();

    const login = async (payLoad) => {
        setLoading(true);
        try{
            const res = await authService.login(payLoad);
            auth.login({
                accessToken: res.token,
                user: res.user,
            });
            return res;
        } catch (err) {
            throw new Error(getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    return { login, loading };
};
export const useRegister = () => {
    const [ loading, setLoading ] = useState(false);
    const register = async (payLoad) => {
        setLoading(true);
        try{
            const res = await authService.register(payLoad);
            return res;
        }catch (err) {
            throw new Error(getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    return { register, loading };
};