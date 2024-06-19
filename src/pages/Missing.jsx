import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';

const Missing = () => {
    return (
        <PageLayout className="Missing">
            <h2>Missing</h2>
            <p>Well, that's disappointing</p>
            <p>
                <Link to="/">Visit Our Homepage</Link>
            </p>
        </PageLayout>
    );
};

export default Missing;
