import { Box, Container, Link, useTheme } from '@mui/material';
import React from 'react';


function PlanInternalNav() {
    const theme = useTheme();

    const navItems = [
        { name: 'Overview', anchor: 'overview' },
        { name: 'Bucket List', anchor: 'bucket-list' },
        { name: 'Plan', anchor: 'plan' },
        { name: 'Archives', anchor: 'archives' }
    ];

    return (
        <Container component="nav" maxWidth='lg'
            sx={{ position: 'sticky', top: 0,backgroundColor: "white",  my: 6, px: 2 }}
        >
            <Box display={'flex'} gap={2}>
                {navItems.map((item, index) => (
                    <Link key={index} href={`#${item.anchor}`} id={item.anchor} data-to-scrollspy-id={item.anchor} >
                        {item.name}
                    </Link>
                ))}
            </Box>
        </Container>
    )
}

export default PlanInternalNav;