import { useState, useEffect } from 'react';
import PageLayout from '../layout/PageLayout';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { useNavigate } from 'react-router-dom';

export const Homepage = () => {
    const { userLogin, decodedToken } = useIsAuthHook();
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        if (!userLogin) {
            return;
        }
        let response = await fetch(
            `http://localhost:9090/api/user/getUserByLogin/${userLogin}`
        );
        response = await response.json();
        console.log('response: ', response);
        setCurrentUser(response);
    };

    useEffect(() => {
        if (userLogin?.length) fetchCurrentUser();
    }, [userLogin]);

    useEffect(() => {
        if (!userLogin) return;

        if (
            decodedToken?.exp &&
            decodedToken.exp * 1000 < new Date().getTime()
        ) {
            // множимо на 1000, тому що перевірка в секундах, а не в мілісекундах
            localStorage.removeItem('token');
            navigate('/');
        }
        if (userLogin?.length && fetchCurrentUser) {
            fetchCurrentUser();
        }
    }, [userLogin]);

    return (
        <PageLayout>
            Home page
            <br />
            {currentUser?.role} - {currentUser?.name}
        </PageLayout>
    );
};

export default Homepage;
