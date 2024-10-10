import { Box, Container, IconButton, Link, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

function PlanInternalNav() {
    const theme = useTheme();

    const navItems = [
        // { name: 'Overview', anchor: 'overview' },
        { name: 'Bucket List', anchor: 'bucketlist' },
        { name: 'Plan', anchor: 'plan' },
        { name: 'Archives', anchor: 'archives' }
    ];

    return (
        <Container component="nav" maxWidth='lg'
            sx={{ position: 'sticky', zIndex: 9999, top: 0, my: 4, px: 2 }}
        >
            <Paper elevation={3} sx={{ backgroundColor: "white" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" px={3}>
                    <Box display={'flex'} gap={2}>
                        {navItems.map((item, index) => (
                            <Box key={index} data-to-scrollspy-id={item.anchor}
                                sx={{
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    height: "50px",
                                    px: 2, py: 3,
                                    borderTop: "5px solid transparent"
                                }}
                            >
                                <Link
                                    variant="subnav"
                                    key={index}
                                    href={`#${item.anchor}`}
                                >
                                    {item.name}
                                </Link>
                            </Box>
                        ))}
                    </Box>
                    <Box>
                        <IconButton href="#top">
                            <VerticalAlignTopIcon sx={{ color: theme.palette.primary.dark, fontSize: "1.5rem" }} />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Container >
    )
}

export default PlanInternalNav;