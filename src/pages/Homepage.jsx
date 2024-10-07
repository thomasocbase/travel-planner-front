import React from "react";
import { Box, Button, CardMedia, Container, IconButton, Typography } from '@mui/material'
import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import HeaderImage from '../assets/pexels-sanmane-1365425.jpg';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ClassIcon from '@mui/icons-material/Class';
import ExploreIcon from '@mui/icons-material/Explore';

function Homepage() {
    const theme = useTheme();

    const headerSubsections = [
        {
            icon: TravelExploreIcon,
            title: 'Organize',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.'
        },
        {
            icon: ClassIcon,
            title: 'Plan',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.'
        },
        {
            icon: ExploreIcon,
            title: 'Explore',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.'
        },
    ];

    const reassuranceStats = [
        {
            number: '1000+',
            description: 'happy travelers'
        },
        {
            number: '500+',
            description: 'plans created'
        }
    ];

    const testimonials = [
        {
            name: '@KevinFam',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            img: 'https://via.placeholder.com/100'
        },
        {
            name: '@Lory64',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            img: 'https://via.placeholder.com/100'
        },
        {
            name: '@MalcomX',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            img: 'https://via.placeholder.com/100'
        },
    ];

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

    return (
        <>
            {/* HERO HEADER */}
            <Container component="section" maxWidth='lg' sx={{ my: 2, px: 2 }}>
                <Box
                    sx={{
                        backgroundImage: `linear-gradient(to top, rgba(34,34,34,0.5) 0%,rgba(34,34,34,1) 100%), url('${HeaderImage}')`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center center',
                        overflow: 'hidden',
                        backgroundColor: theme.palette.primary.dark,
                        borderRadius: "15px",
                        height: "500px",
                        display: 'flex', alignItems: "center"
                        // py: 10,
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 5, px: 10 }}>
                        <Typography variant='h2' textAlign="center" color="white">Our job? Simplify your travel planning</Typography>
                        <Typography variant="normal" textAlign="center" color={theme.palette.primary.light} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.
                            Sit ipsum orci diam consectetur mattis habitasse odio id magna. Donec ut et semper et aliquam.
                            Leo nisl tellus phasellus faucibus malesuada amet.
                        </Typography>
                        <Button variant='darkOverYellow' href='/signup' sx={{ mt: 2 }}>Get started</Button>
                    </Box>
                </Box>
            </Container >

            {/* HEADER SUBSECTIONS */}
            < Container component="section" maxWidth='lg' sx={{ my: 2, px: 2 }
            }>
                <Grid container spacing={2}>
                    {headerSubsections.map((section, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}
                            display="flex" flexDirection="column" justifyContent="center" gap={2}
                            sx={{
                                backgroundColor: theme.palette.primary.dark,
                                borderRadius: "15px",
                                aspectRatio: 1,
                                p: 5,
                            }}>
                            <Box display="flex" justifyContent="center">
                                <section.icon sx={{ color: "white", fontSize: 50 }} />
                            </Box>
                            <Typography variant='h3' textAlign="center" color="white">{section.title}</Typography>
                            <Typography variant="normal" textAlign="center" color={theme.palette.primary.light}>{section.description}</Typography>
                        </Grid>
                    ))
                    }
                </Grid>
            </ Container>

            {/* REASSURANCE STATS */}
            < Container component="section" maxWidth='lg' sx={{ my: 10, px: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant='h2' textAlign="center">Join our community of happy travelers</Typography>
                    <Grid container mt={2} spacing={4} width="50%" display="flex" justifyContent="center">
                        {reassuranceStats.map((stat, index) => (
                            <Grid key={index} item xs={4}>
                                <Typography textAlign="center" fontFamily="Poppins, sans-serif" fontWeight="400" fontSize="48px">{stat.number}</Typography>
                                <Typography textAlign="center" fontFamily="Poppins, sans-serif" fontSize="28px" lineHeight={1}>{stat.description}</Typography>
                            </Grid>
                        ))
                        }
                    </Grid>
                </Box>
            </Container >

            {/* TESTIMONIALS */}
            < Container component="section" maxWidth='lg' sx={{ my: 6, px: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center" p={5} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: "15px" }}>
                    <Typography variant='h2' textAlign="center">What they think about us...</Typography>
                    <Grid container mt={4} spacing={2}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item key={index} size={{ xs: 12, md: 6, lg: 4 }} display="flex" gap={2}>
                                <Box component="figure" flex="1 0 100px" sx={{ borderRadius: "9999px", m: 0, height: "100px", overflow: "hidden" }}>
                                    <CardMedia component="img" image={testimonial.img} sx={{ height: '100%', width: "100%" }} />
                                </Box>
                                <Box>
                                    <Typography variant='h4' mb={1}>{testimonial.name}</Typography>
                                    <Typography fontSize={15}>{testimonial.review}</Typography>
                                </Box>
                            </Grid>
                        ))
                        }
                    </Grid>

                </Box>
            </Container >
            
            {/* SOCIALS */}
            < Container component="section" maxWidth='lg' sx={{ my: 6, px: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center" p={5}>
                    <Typography variant='h2' textAlign="center">Follow us on social media</Typography>
                    <Box display="flex" justifyContent="center" mt={2} >
                        {socials.map((social, index) => (
                            <IconButton key={index} href={social.link} size="large" sx={{ color: theme.palette.primary.dark, transition: '200ms ease-in-out', '&:hover': { color: theme.palette.primary.secondary, backgroundColor: theme.palette.primary.dark } }}>
                                <social.icon fontSize="large" />
                            </IconButton>
                        ))
                        }
                    </Box>
                </Box>
            </Container >
        </>
    );
}

export default Homepage;