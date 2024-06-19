import { Link } from 'react-router-dom';

const AdminAcc = false;
const Nav = () => {
    return (
        <nav className="Nav">
            <ul>
                <li>
                    <Link to="/adminpanel">Admin Panel</Link>
                </li>
                <li>
                    <Link to="/myprofile">My profile</Link>
                </li>
                <li>
                    <Link to="/appointments">Appointments</Link>
                </li>
                <li>
                    <Link to="/medicalrecords">Medical Records</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
