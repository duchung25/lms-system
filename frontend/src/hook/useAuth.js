import { useState } from 'react';
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