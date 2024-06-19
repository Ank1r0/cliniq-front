import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { CurrentUserContext } from '../context/currentUserContext';
import {ReactComponent as CliniQlogo} from "./cliniq.svg"
import { SvgIcon } from '@mui/material';
const pages = [
    { title: 'Register', url: '/Register' },
    { title: 'Admin Panel', url: '/adminpanel' },
    { title: 'Appointments', url: '/appointments' },
    { title: 'Medical Records', url: '/medicalrecords' },
];
const settings = [
    { title: 'My profile', url: '/MyProfile' },
    { title: 'Settings', url: '/Settings' },
    { title: 'Logout', url: '/Login' },
];

function ResponsiveAppBar({ title, color, styles }) {
    const { decodedToken, userLogin } = useIsAuthHook();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const value = useContext(CurrentUserContext);

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onNavigateMobile = (e, url) => {
        if (url) navigate(url);
        else alert('Incorrect');
    };

    return (
        <AppBar position="static" color={color}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <SvgIcon component={CliniQlogo} viewBox="0 0 600 476.6"/>

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href={
                            localStorage?.getItem('token') ? '/' : '/Register'
                        }
                        sx={{
                            mr: 2,
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <h3 href="/">{title || 'LOGO'}</h3>
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: 'flex',
                                md: 'none',
                            },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {
                                    xs: 'block',
                                    md: 'none',
                                },
                            }}
                        >
                            {pages.map((page, idx) => (
                                <MenuItem
                                    key={page.title + idx}
                                    onClick={(e) =>
                                        onNavigateMobile(e, page?.url)
                                    }
                                >
                                    <Typography textAlign="center">
                                        {page?.title}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{
                            display: {
                                xs: 'flex',
                                md: 'none',
                            },
                            mr: 1,
                        }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {
                                xs: 'flex',
                                md: 'none',
                            },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <h3 href="/">{title || 'LOGO'}</h3>
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                        }}
                    >
                        {pages.map((page, idx) => (
                            <div key={page.title + idx}>
                                {page?.title === 'Admin Panel' &&
                                value?.currentUser?.login !== 'admin' ? (
                                    ''
                                ) : (
                                    <Button
                                        // onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: 'white',
                                            display: 'block',
                                        }}
                                    >
                                        <Link
                                            to={
                                                localStorage?.getItem('token')
                                                    ? page?.url
                                                    : '/Register'
                                            }
                                            state={{ some: 'value' }}
                                            className={styles.link}
                                        >
                                            {page?.title}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </Box>

                    {!decodedToken ? (
                        <Button variant="contained" color="success">
                            <Link to="/login" className={styles.link}>
                                Sign in
                            </Link>
                        </Button>
                    ) : (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{
                                        p: 0,
                                    }}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="/static/images/avatar/2.jpg"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{
                                    mt: '45px',
                                }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting, idx) => (
                                    <MenuItem
                                        key={setting.title + idx}
                                        onClick={() => {
                                            if (setting.title === 'Logout')
                                                localStorage.removeItem(
                                                    'token'
                                                );
                                            navigate(setting.url);
                                            handleCloseUserMenu();
                                        }}
                                    >
                                        <Typography textAlign="center">
                                            {setting?.title}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
