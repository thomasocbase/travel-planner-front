import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#F2C304',
            secondary: '#E5E51A',
            dark: '#222222',
            medium: "#707070",
            light: '#D9D9D9',
            action: {
                active: '#F2C304',
                hover: '#E5E51A',
            }
        },
        activities: {
            accommodation: '#0470B4',
            hiking: '#F2C304',
            tour: '#222222',
            shopping: '#D9D9D9',
            meal: '#E5E51A',
            sports: '#222222',
            culture: '#707070',
            relaxation: '#D9D9D9',
            other: "grey"
        },
    },
    typography: {
        h1: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '2.2rem',
            fontWeight: 700,
            textTransform: 'uppercase',
        },
        h2: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
        },
        h5: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '1.2rem',
            fontWeight: 700,
        },
        h6: {
            fontFamily: 'Poppins, Montserrat, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#000',
                },
            },
            variants: [
                {
                    props: {
                        variant: 'normal'
                    },
                    style: {
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 400,
                    }
                },
                {
                    props: {
                        variant: 'smaller'
                    },
                    style: {
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                    }
                },
                {
                    props: {
                        variant: 'notice'
                    },
                    style: {
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '0.9rem',
                        color: '#707070',
                    }
                }
            ]
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Poppins, Montserrat, sans-serif',
                    textTransform: 'uppercase',
                },
            },
            variants: [
                {
                    props: {
                        variant: 'darkOverYellow'
                    },
                    style: {
                        backgroundColor: '#E5E51A',
                        border: '2px solid #E5E51A',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            border: '2px solid #E5E51A',
                            color: '#E5E51A',
                        },
                    }
                },
                {
                    props: {
                        variant: 'yellowOverDark'
                    },
                    style: {
                        color: '#222222',
                        '&:hover': {
                            backgroundColor: '#222222',
                            color: '#E5E51A',
                        },
                    }
                },
                {
                    props: {
                        variant: 'blackOverGrey'
                    },
                    style: {
                        color: '#222222',
                        backgroundColor: '#D9D9D9',
                        border: "none",
                        '&:hover': {
                            backgroundColor: '#222222',
                            color: 'white',
                            border: "none",
                        },
                    }
                },
                {
                    props: {
                        variant: 'greyOverTransparent'
                    },
                    style: {
                        color: '#222222',
                        backgroundColor: 'transparent',
                        border: "2px solid white",
                        '&:hover': {
                            backgroundColor: '#D9D9D9',
                            color: '#222222',
                            border: "2px solid #D9D9D9",
                        },
                    }
                },
            ]
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    fontFamily: 'Open Sans, sans-serif',
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#E5E51A',
                    },
                },
            },
            variants: [
                {
                    props: {
                        variant: 'subnav'
                    },
                    style: {
                        fontFamily: 'Poppins, Montserrat, sans-serif',
                        fontSize: '1.2rem',
                        textDecoration: 'none',
                        '&:hover': {
                            color: '#E5E51A',
                        },
                    }
                },
            ]
        },
    }
});

export default theme;