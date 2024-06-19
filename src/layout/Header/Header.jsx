import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import styles from './Header.module.css';

const Header = ({ title }) => {
    return <ResponsiveAppBar color="success" title={title} styles={styles} />;
};

export default Header;
