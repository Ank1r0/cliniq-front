import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useIsAuthHook = () => {
    const [token, setToken] = useState(false);
    const [decodedToken, setDecodedToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            let decodedToken = jwtDecode(token);
            setDecodedToken(decodedToken);
        }
        setToken(token);
    }, []);

    return {
        token,
        decodedToken,
        userLogin: decodedToken?.sub ? decodedToken.sub : '',
    };
};
