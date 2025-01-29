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
        try {
            let response = await fetch(
                `http://localhost:9090/api/user/getUserByLogin/${userLogin}`
            );
            response = await response.json();
            console.log('response: ', response);
            setCurrentUser(response);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
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
            // Logout if token expired
            localStorage.removeItem('token');
            navigate('/');
        } else if (currentUser?.role === 'Admin') {
            navigate('/adminpanel');
        }
    }, [userLogin, decodedToken, currentUser]);

    return (
        <PageLayout>
            Home page
            <br />
            {currentUser?.role} - {currentUser?.name}
        </PageLayout>
    );
};

export default Homepage;