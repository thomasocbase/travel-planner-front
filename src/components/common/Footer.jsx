import React from "react";
import { Box, Container, IconButton, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

function Footer() {
    const theme = useTheme();

    const socials = [
        {
            icon: InstagramIcon,
            link: 'https://www.instagram.com'
        },
        {
            icon: FacebookIcon,
            link: 'https://www.facebook.com'
        },
        {
            icon: XIcon,
            link: 'https://www.x.com'
        }
    ];

    const footerLinks = [
        {
            title: 'Navigation',
            links: [
                { label: 'Link 1', url: '#' },
                { label: 'Link 2', url: '#' },
                { label: 'Link 3', url: '#' },
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About us', url: '#' },
                { label: 'Careers', url: '#' },
                { label: 'Press', url: '#' },
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Terms of service', url: '#' },
                { label: 'Privacy Policy', url: '#' },
                { label: 'Contact us', url: '#' },
            ]
        },
    ];

    return (
        <Container component="footer" maxWidth="false" sx={{ backgroundColor: "black", minHeight: "100px", pt: 5, pb: 2, mt: 4 }}>
            <Container>
                <Grid container columnSpacing={10} rowSpacing={5} justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h2" color="white">LOGO</Typography>
                    </Grid>
                    {footerLinks.map((section, index) => (
                        <Grid item key={index} display="flex" flexDirection="column">
                            <Typography variant="h4" sx={{ color: theme.palette.primary.medium, mb: 1 }}>
                                {section.title}
                            </Typography>
                            {section.links.map((link, index) => (
                                <Link key={index} href={link.url} sx={{ color: "white" }}>{link.label}</Link>
                            ))}
                        </Grid>
                    ))}
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mt={4}>
                    <Typography textAlign="center" color={theme.palette.primary.dark}>
                        &copy; 2024 Travel Planner. All rights reserved.
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography color={theme.palette.primary.dark}>Follow us on:</Typography>
                        <Box display="flex" justifyContent="center">
                            {socials.map((social, index) => (
                                <IconButton key={index} href={social.link} size="small" sx={{ color: theme.palette.primary.dark, transition: '200ms ease-in-out', '&:hover': { color: theme.palette.primary.secondary, backgroundColor: theme.palette.primary.dark } }}>
                                    <social.icon fontSize="small" />
                                </IconButton>
                            ))
                            }
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Container>
    );
}

export default Footer