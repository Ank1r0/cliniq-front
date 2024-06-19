import styles from './Footer.module.css';

const Footer = () => {
    const today = new Date();
    return (
        <footer className={styles.footer}>
            <p>Copyright &copy; {today.getFullYear()}</p>
            <img src="/pjwstkLogo.png" alt="PJWSTK Logo" className="logo" />
        </footer>
    );
};

export default Footer;
