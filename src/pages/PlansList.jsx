import React, { useState, useContext } from "react";
import { Box, Button, Container, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Typography, useTheme } from "@mui/material";
import AuthContext from "../components/auth/AuthContext";

function PlansList() {
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    const [plans, setPlans] = useState([
        {
            _id: "672d03bf69f596a99ba87288",
            title: 'Trip to Paris',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/32/200/300",
        },
        {
            _id: 2,
            title: 'Trip to Greece',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/49/200/300",
        },
        {
            _id: 3,
            title: 'Trip to Japan',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/56/200/300",
        },
        {
            _id: 4,
            title: 'Trip to Italy',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/65/200/300",
        },
        {
            _id: 5,
            title: 'Trip to Spain',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/74/200/300",
        },
        {
            _id: 6,
            title: 'Trip to Mexico',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
            image: "https://picsum.photos/id/83/200/300",
        },
    ]);

    const [page, setPage] = useState(1);
    const plansPerPage = 5;

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const paginationCount = Math.ceil(plans.length / plansPerPage);
    const paginatedPlans = plans.slice((page - 1) * plansPerPage, page * plansPerPage);

    if (!user.isLoggedIn) {
        return (
            <Box component="main" sx={{
                minHeight: "90vh",
                mt: 4, px: 2,
                display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2
            }}>
                <Typography variant="h1">Please log in to view your travel plans</Typography>
                <Button variant="blackOverGrey" color="primary" href="/login">Log in</Button>
            </Box>
        );
    }

    return (
        <Box component="main" mb={10} sx={{ minHeight: "90vh" }}>
            <Container component="section" maxWidth="lg" sx={{ mb: 6, px: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant="h1" sx={{ mt: 4 }}>Travel Plans</Typography>
                    <List sx={{ width: '100%' }}>
                        {paginatedPlans.map(plan => (
                            <React.Fragment key={plan._id}>
                                <ListItem alignItems="center" sx={{ justifyContent: "space-between", gap: 4, my: 2 }}>
                                    <Box
                                        component="img"
                                        src={plan.image} alt={plan.title}
                                        sx={{
                                            width: 200, aspectRatio: "16/9",
                                            objectFit: "cover",
                                            borderRadius: "10px"
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                        }}
                                    >
                                        <Typography variant="h2">{plan.title}</Typography>
                                        <Typography variant="normal">{plan.description}</Typography>
                                    </Box>
                                    <Button variant="blackOverGrey" color="primary" href={"/plan/" + plan._id}>View Plan</Button>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                    <Pagination
                        shape="rounded"
                        count={paginationCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ alignSelf: "flex-end" }} />
                </Box>
            </Container>
        </Box>
    );
}

export default PlansList;