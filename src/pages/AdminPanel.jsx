import User from '../components/User/User';
import PageLayout from '../layout/PageLayout';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const { token, decodedToken, userLogin } = useIsAuthHook();
    console.log(userLogin);
    return (
        <PageLayout>
            {
                <div>
                    <User />
                </div>
            }
            {/* : <Navigate to="/" />} */}
        </PageLayout>
    );
};

export default AdminPanel;
