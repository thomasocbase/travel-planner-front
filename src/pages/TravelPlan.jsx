import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import PlanInternalNav from '../components/plan/PlanInternalNav';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ScrollSpy from 'react-ui-scrollspy';
import ActivityCard from '../components/plan/ActivityCard';
import PlanOverview from '../components/plan/PlanOverview';
import { DndContext } from "@dnd-kit/core";
import DayCard from '../components/plan/DayCard';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { placeholderCardData } from '../components/data/placeholderCards';
import AddDayButton from '../components/plan/AddDayButton';
import { Add } from '@mui/icons-material';

const standalonePlaceholderCardData = {
    title: "Airbnb Trocadéro",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
    image: "https://picsum.photos/id/42/800/600",
    url: "https://www.airbnb.com/rooms/12345678",
    price: 100,
    timeAllocation: 2,
    category: "Accommodation",
    location: "48.858285658772594, 2.3532079879966044",
};

const placeholderDays = [
    {
        title: "This is the title of the day",
        order: 1,
        duration: "8h",
        budget: "50",
    },
    {
        title: "And here is another",
        order: 2,
        duration: "6h",
        budget: "30",
    },
]

function TravelPlan() {
    const theme = useTheme();

    const [editingValue, setEditingValue] = useState();

    const [plan, setPlan] = useState({
        info: {
            title: "My Travel Plan Title",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
            // image: "https://picsum.photos/id/177/800/600",
        },
        status: "Private",
        calculatedStats: {
            totalBudget: 0,
            totalDays: 0,
            totalActivities: 0,
            totalDrivingDistance: 0,
            totalHikingDistance: 0,
        },
        socialStats: {
            likes: 5,
            saves: 2,
        }
    });

    const [isDropped, setIsDropped] = useState(false);

    function handleDragEnd(event) {
        if (event.over && event.over.id === 'droppable') {
            setIsDropped(true);
        }
    }

    function updatePlan(data) {
        setPlan(data);
    }

    function updateDays(data) {
        placeholderDays.push({
            title: data,
            order: placeholderDays.length + 1,
            duration: "8h",
            budget: "50",
        });
    }

    return (
        <Box component="main">

            {/* OVERVIEW SECTION */}
            <Container component="section" maxWidth="lg" sx={{ mb: 6, px: 2 }}>
                <PlanOverview plan={plan} updatePlan={updatePlan} />
            </Container>

            {/* ANCHOR NAV */}
            <PlanInternalNav />

            <ScrollSpy>
                <DndContext onDragEnd={handleDragEnd}>

                    {/* BUCKET LIST */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='bucketlist'>
                        <Box
                            p={3}
                            sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '10px' }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                    <Typography variant="h2" color="black">
                                        Bucket list
                                    </Typography>
                                </Box>
                                <Tooltip title="Add new activity" placement='left' arrow>
                                    <IconButton>
                                        <AddCircleIcon sx={{ color: "black", fontSize: "2rem" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, md: 6 }}>
                                    <ActivityCard data={standalonePlaceholderCardData} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>

                    {/* TRAVEL PLAN */}
                    <Container component="section" maxWidth="lg" sx={{ my: 3, px: 2 }} id='plan'>
                        <Box
                            p={3}
                            sx={{ backgroundColor: theme.palette.primary.dark, borderRadius: '10px' }}
                        >
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, md: 7 }}>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">

                                            <Box display="flex" alignItems="center" gap={1}>
                                                <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                                <Typography variant="h2" color="white">
                                                    Travel Plan
                                                </Typography>
                                            </Box>

                                            <Tooltip title="Collapse all" placement='left' arrow>
                                                <IconButton sx={{ mr: 0.75 }}>
                                                    <UnfoldLessDoubleIcon sx={{ color: "white", fontSize: "2rem" }} />
                                                </IconButton>
                                            </Tooltip>

                                        </Box>

                                        {placeholderDays.map((day, index) => (
                                            <Box key={index}>
                                                <DayCard day={day} index={index}>
                                                    {placeholderCardData.map((card, index) => (
                                                        <ActivityCard data={card} />
                                                    ))}
                                                </DayCard>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item size={{ xs: 12, md: 7 }}>
                                    <AddDayButton updateDays={updateDays} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>

                    {/* ARCHIVES */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='archives'>
                        <Box
                            p={3}
                            sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '10px' }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                    <Typography variant="h2" color="black">
                                        Archives
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, md: 6 }}>
                                    <ActivityCard data={standalonePlaceholderCardData} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>

                </DndContext>
            </ScrollSpy>

        </Box>
    );
}

export default TravelPlan;