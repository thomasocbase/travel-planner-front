import { Box, Container, IconButton, Link, Paper, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import { useMediaQuery } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InboxIcon from '@mui/icons-material/Inbox';
import MapIcon from '@mui/icons-material/Map';

function PlanInternalNav() {
    const theme = useTheme();

    const navItems = [
        // { name: 'Overview', anchor: 'overview' },
        { name: 'Map', anchor: 'map', icon: <MapIcon /> },
        { name: 'Bucket List', anchor: 'bucketlist', icon: <ListIcon /> },
        { name: 'Plan', anchor: 'plan', icon: <CalendarMonthIcon /> },
        { name: 'Archives', anchor: 'archives', icon: <InboxIcon /> },
    ];

    const [isAtTop, setIsAtTop] = useState(true);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        window.onscroll = function () {
            if (window.scrollY === 0) {
                setIsAtTop(true);
            } else {
                setIsAtTop(false);
            }
        };
    }, []);

    return (
        <Container component="nav" maxWidth='lg'
            sx={{ position: 'sticky', zIndex: 9999, top: 0, my: 4, px: 2 }}
        >
            <Paper elevation={0} className='addShadow' sx={{ backgroundColor: "white", borderRadius: "0 0 10px 10px" }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" px={3}>
                    <Box display={'flex'} gap={2}>
                        {navItems.map((item, index) => (
                            <Box key={index} data-to-scrollspy-id={item.anchor}
                                sx={{
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    height: "50px",
                                    px: 2, py: 3,
                                    borderBottom: "5px solid transparent"
                                }}
                            >
                                <Link
                                    variant="subnav"
                                    key={index}
                                    href={`#${item.anchor}`}
                                    sx={{ color: "grey" }}
                                >
                                    {isSmallScreen && item.icon}
                                    {!isSmallScreen && item.name}
                                </Link>
                            </Box>
                        ))}
                    </Box>

                    {/* BACK TO TOP BUTTON */}
                    {isAtTop ? null :
                        <Box>
                            <IconButton href="#top">
                                <VerticalAlignTopIcon sx={{ color: theme.palette.primary.dark, fontSize: "1.5rem" }} />
                            </IconButton>
                        </Box>
                    }
                </Box>
            </Paper>
        </Container >
    )
}

export default PlanInternalNav;