import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import styles from './index.module.css';

const PageLayout = (props) => {
    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();

    // Update showHeader state based on the current route
    useEffect(() => {
        // Check if the current route is the Register page
        setShowHeader(location.pathname !== '/locked');
    }, [location]);

    const children = props.children;
    return (
        <div className={styles.container}>
            {showHeader && <Header title="CliniQ" />}
            <main className={styles.main}>{children}</main>
            <footer></footer>
            <Footer />
        </div>
    );
};

export default PageLayout;
