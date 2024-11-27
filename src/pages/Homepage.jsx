import React, { useContext } from "react";
import { Box, Button, CardMedia, Container, IconButton, Typography } from '@mui/material'
import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import HeaderImage from '../assets/images/pexels-sanmane-1365425.jpg';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ClassIcon from '@mui/icons-material/Class';
import ExploreIcon from '@mui/icons-material/Explore';
import SubImageOrganize from '../assets/images/pexels-brunogobofoto-3854816.jpg';
import SubImagePlan from '../assets/images/pexels-leeloothefirst-5386754.jpg';
import SubImageExplore from '../assets/images/pexels-mike-468229-1181809.jpg';
import AuthContext from "../components/auth/AuthContext";
import AnimatedSection from "../components/common/AnimatedSection";

function Homepage() {
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    const headerSubsections = [
        {
            icon: TravelExploreIcon,
            title: 'Organize',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.',
            image: SubImageOrganize
        },
        {
            icon: ClassIcon,
            title: 'Plan',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.',
            image: SubImagePlan
        },
        {
            icon: ExploreIcon,
            title: 'Explore',
            description: 'Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.',
            image: SubImageExplore
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
            img: 'https://i.pravatar.cc/150?img=3'
        },
        {
            name: '@Lory64',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            img: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: '@MalcomX',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            img: 'https://i.pravatar.cc/150?img=7'
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
            <Container component="section" maxWidth='lg' sx={{ mb: 2, px: 2 }}>
                <Box
                    sx={{
                        backgroundImage: `linear-gradient(to top, rgba(242,195,4,0.3) 0%,rgba(34,34,34,0.9) 100%), url('${HeaderImage}')`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
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
                        <Typography variant='h1' textAlign="center" color="white">Our job? Simplify your travel planning</Typography>

                        <Typography variant="normal" textAlign="center" color={theme.palette.primary.light} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Lorem ipsum dolor sit amet consectetur. Auctor urna vitae sed sed convallis mauris imperdiet.
                            Sit ipsum orci diam consectetur mattis habitasse odio id magna. Donec ut et semper et aliquam.
                            Leo nisl tellus phasellus faucibus malesuada amet.
                        </Typography>

                        {!user.isLoggedIn &&
                            <Button variant='darkOverYellow' href='/signup' sx={{ mt: 2 }}>Get started</Button>
                        }
                    </Box>
                </Box>
            </Container >

            {/* HEADER SUBSECTIONS */}
            <Container component="section" maxWidth='lg' sx={{ my: 2, px: 2 }}>
                <Grid container spacing={2}>
                    {headerSubsections.map((section, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}
                            display="flex" flexDirection="column" justifyContent="center" gap={2}
                            sx={{
                                backgroundColor: theme.palette.primary.dark,
                                backgroundImage: `linear-gradient(to top, rgba(242,195,4,0.3) 0%,rgba(34,34,34,0.9) 100%), url('${section.image}')`,
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
            <AnimatedSection>
                < Container component="section" maxWidth='lg' sx={{ my: 10, px: 2 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant='h2' textAlign="center">Join our community of happy travelers</Typography>
                        <Grid container mt={2} spacing={4} width="50%" display="flex" justifyContent="center">
                            {reassuranceStats.map((stat, index) => (
                                <Grid key={index} xs={4}>
                                    <Typography textAlign="center" fontFamily="Poppins, sans-serif" fontWeight="400" fontSize="48px">{stat.number}</Typography>
                                    <Typography textAlign="center" fontFamily="Poppins, sans-serif" fontSize="28px" lineHeight={1}>{stat.description}</Typography>
                                </Grid>
                            ))
                            }
                        </Grid>
                    </Box>
                </Container>
            </AnimatedSection>

            {/* TESTIMONIALS */}
            <AnimatedSection>
                <Container component="section" maxWidth='lg' sx={{ my: 6, px: 2 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" p={5} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: "15px" }}>
                        <Typography variant='h2' textAlign="center">What they think about us...</Typography>
                        <Grid container mt={4} spacing={2}>
                            {testimonials.map((testimonial, index) => (
                                <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }} display="flex" gap={2}>
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
            </AnimatedSection>

            {/* SOCIALS */}
            <AnimatedSection>
                < Container component="section" maxWidth='lg' sx={{ mt: 2, mb: 10, px: 2 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" p={5}>
                        <Typography variant='h2' textAlign="center">Follow us on social media</Typography>
                        <Box display="flex" justifyContent="center" gap={1} mt={2} >
                            {socials.map((social, index) => (
                                <IconButton key={index} href={social.link} size="large" sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.primary.dark, transition: '200ms ease-in-out', '&:hover': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.dark } }}>
                                    <social.icon fontSize="large" />
                                </IconButton>
                            ))
                            }
                        </Box>
                    </Box>
                </Container >
            </AnimatedSection>
        </>
    );
}

export default Homepage;