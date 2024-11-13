import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, useScrollTrigger, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from '../../assets/logo';
import ky from 'ky';
import AuthContext from '../auth/AuthContext';
import StatusContext from '../status/StatusContext';

function Header() {
    const theme = useTheme();
    const { user, setUser } = useContext(AuthContext);
    const { setAppStatus } = useContext(StatusContext);

    const pages = [
        { name: 'Explore', link: '/explore' },
        { name: 'My Travels', link: '/plans-list' }
    ];
    const settings = [
        { label: 'Profile', link: '/profile' },
        { label: 'Account', link: '/account' },
        { label: 'Saved plans', link: '/saved' },
    ];

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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

    async function handleLogout() {
        try {
            const response = await ky.post('http://localhost:3000/api' + '/auth/logout', {
                credentials: 'include'
            });

            console.log(response);
            setUser({ username: "", isLoggedIn: false });
            setAppStatus({ open: true, severity: 'success', message: 'Logged out successfully' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }
        

    if (!user.isLoggedIn) {
        return (
            <>
                <Container component="header" maxWidth="lg" sx={{
                    position: "relative",
                    borderRadius: '10px',
                    height: '60px',
                    mb: 2,
                }}>
                    <Box component="a" href="/"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: { xs: "100px", md: "50%" },
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <LogoIcon />
                    </Box>
                    <Box component="nav"
                        sx={{
                            position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)",
                            display: "flex", gap: 2, alignItems: "center"
                        }}
                    >
                        <Link href="/login" sx={{ color: '#000000' }}>Login</Link>
                        <Link href="/signup">
                            <Button variant="darkOverYellow2">Sign Up</Button>
                        </Link>
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', mb: 2 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ position: 'relative' }}>

                    {/* LOGO DESKTOP */}
                    <Box component="a" href="/"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            textDecoration: 'none',
                            position: 'absolute',
                        }}
                    >
                        <LogoIcon />
                    </Box>

                    {/* PAGES NAV MOBILE */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page, index) => (
                                <MenuItem key={index} onClick={handleCloseNavMenu}>
                                    <Link href={page.link} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                        {page.name}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* LOGO MOBILE */}
                    <Box
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            textDecoration: 'none',
                        }}
                    >
                        <LogoIcon />
                    </Box>

                    {/* PAGES NAV DESKTOP */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', ml: 4 }}>
                        {pages.map((page, index) => (
                            <Link key={index} href={page.link} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <Button sx={{ color: 'inherit', fontSize: "1.2rem" }}>{page.name}</Button>
                            </Link>
                        ))}
                    </Box>

                    {/* USER SETTINGS */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Typography variant='normal' mr={1}>{user && user.username}</Typography>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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
                            {settings.map((setting, index) => (
                                <MenuItem key={index} onClick={handleCloseUserMenu}>
                                    <Link href={setting.link} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                        {setting.label}
                                    </Link>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <Link href="/admin" sx={{ color: 'inherit', textDecoration: 'none' }}>
                                    Admin
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ '&:hover': { color: theme.palette.primary.secondary } }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;