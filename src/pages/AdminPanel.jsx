import User from '../components/User/User';
import PageLayout from '../layout/PageLayout';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { Navigate, useNavigate } from 'react-router-dom';


const AdminPanel = () => {
    const { token, decodedToken, userLogin } = useIsAuthHook();
    console.log(userLogin);
    const navigate = useNavigate(); // Get the navigate function

    return (
        <PageLayout>
            {
                <div>
                <button 
                onClick={() => navigate('/adminpanel/users')}
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
                >
                    Go to Users
                </button>
                              
                    <User />
                </div>
            }
            {/* : <Navigate to="/" />} */}
        </PageLayout>
    );
};

export default AdminPanel;
