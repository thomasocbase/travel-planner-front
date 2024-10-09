import { Box, Container, Link, Typography, useTheme } from '@mui/material';
import React from 'react';

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
            sx={{ position: 'sticky', top: 0, backgroundColor: "white", my: 4, px: 2 }}
        >
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
        </Container >
    )
}

export default PlanInternalNav;