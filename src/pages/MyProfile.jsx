import UserProfile from '../components/Profile/UserProfile';
import PageLayout from '../layout/PageLayout';
import { useLocation } from 'react-router-dom';

const MyProfile = () => {
    return (
        <PageLayout>
            <UserProfile />
        </PageLayout>
    );
};

export default MyProfile;
