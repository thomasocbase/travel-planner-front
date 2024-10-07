import React from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, useScrollTrigger, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    const theme = useTheme();

    const pages = [
        { name: 'Explore', link: '/explore' },
        { name: 'My Travels', link: '/plan' }
    ];
    const settings = ['Profile', 'Account', 'Saved plans', 'Logout'];

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

    return (
        <>
            <Container component="header" maxWidth="lg" sx={{
                position: "relative",
                borderRadius: '10px',
                height: '60px'
            }}>
                <Link href="/"
                    sx={{
                        color: "black",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        fontFamily: 'Poppins, Montserrat, sans-serif',
                    }}
                >
                    Travel Planner
                </Link>
                <Box component="nav"
                    sx={{
                        position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)",
                        display: "flex", gap: 2, alignItems: "center"
                    }}
                >
                    <Link href="/login" sx={{ color: '#000000' }}>Login</Link>
                    <Link href="/signup">
                        <Button variant="darkOverYellow">Sign Up</Button>
                    </Link>
                </Box>
            </Container>

            {/* LOGGED IN NAVBAR */}
            <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ position: 'relative' }}>

                        {/* LOGO DESKTOP */}
                        <Typography variant="h3" component="a" href="/"
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                textDecoration: 'none',
                                position: 'absolute',
                            }}
                        >
                            Travel Planner
                        </Typography>

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
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                textDecoration: 'none',
                            }}
                        >
                            Travel Planner
                        </Typography>

                        {/* PAGES NAV DESKTOP */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', ml: 4 }}>
                            {pages.map((page, index) => (
                                <Link key={index} href={page.link} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                    <Button sx={{ color: 'inherit' }}>{page.name}</Button>
                                </Link>
                            ))}
                        </Box>

                        {/* USER SETTINGS */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default Header;