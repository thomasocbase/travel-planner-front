import React, { useState, useContext, useMemo, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Alert, Autocomplete, Box, Container, FormControl, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import PlanInternalNav from '../components/plan/PlanInternalNav';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ScrollSpy from 'react-ui-scrollspy';
import ActivityCard from '../components/plan/ActivityCard';
import PlanOverview from '../components/plan/PlanOverview';
import DayCard from '../components/plan/DayCard';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { placeholderCardData } from '../components/data/placeholderCards';
import AddDayButton from '../components/plan/AddDayButton';
import ConfirmDialog from '../components/ConfirmDialog';
import CloseIcon from '@mui/icons-material/Close';
import { MuiFileInput } from 'mui-file-input';
import StatusContext from '../components/status/StatusContext';
import PlanMap from '../components/plan/PlanMap';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { arrayMove, rectSwappingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

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

const bucketlistPlaceholderCards = [
    {
        id: 15,
        title: "Lunch at Le Procope",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
        image: "https://picsum.photos/id/30/800/600",
        url: "https://www.leprocope.com/",
        price: 30,
        timeAllocation: 1,
        category: "Meal",
        location: "48.856613, 2.336442",
    },
    {
        id: 16,
        title: "Hike in the Bois de Vincennes",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
        image: "https://picsum.photos/id/70/800/600",
        url: "https://www.boisdevincennes.com/",
        price: 0,
        timeAllocation: 4,
        category: "Hike",
        location: "48.8196, 2.4346",
    },
]

const placeholderDays = [
    {
        id: 1,
        title: "This is the title of the day",
        order: 1,
        duration: "8h",
        budget: "50",
    },
    {
        id: 2,
        title: "And here is another",
        order: 2,
        duration: "6h",
        budget: "30",
    },
]

const categories = ["Hike", "Tour", "Accommodation", "Meal", "Shopping", "Transport", "Note"];


function TravelPlan() {
    const theme = useTheme();

    const [editingValue, setEditingValue] = useState();
    const [isOpenCreationDialog, setIsOpenCreationDialog] = useState(false);
    const [creationError, setCreationError] = useState(null);
    const [collapsedAccordions, setCollapsedAccordions] = useState([]);
    const [days, setDays] = useState(placeholderDays);

    // Map markers (currently placeholder values)
    const [markers, setMarkers] = useState([
        { position: [48.857, 2.348], popup: "Eiffel Tower" },
        { position: [48.859, 2.294], popup: "Arc de Triomphe" },
        { position: [50.531, 2.640], popup: "Béthune" },
    ]);

    // Placeholder plan data
    const [plan, setPlan] = useState({
        info: {
            title: "My Travel Plan Title",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
            image: "https://picsum.photos/id/177/800/600",
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

    const [bucketlistCards, setBucketlistCards] = useState(bucketlistPlaceholderCards);
    const [activeBucketlistCard, setActiveBucketlistCard] = useState(null);

    function updatePlan(data) {
        setPlan(data);
    }

    function updateDays(data) {
        setDays([...days, {
            title: data,
            order: placeholderDays.length + 1,
            duration: "8h",
            budget: "50",
        }]);
    }


    // ACTIVITY CREATION/EDITION FUNCTIONS
    function handleCreationStart() {
        setIsOpenCreationDialog(true);
        setEditingValue({
            title: "",
            category: null,
            location: "",
            time: "",
            price: "",
            url: "",
            description: "",
            image: null,
        });
    }

    function handleCreationCancel() {
        setIsOpenCreationDialog(false);
        setCreationError(null);
        setEditingValue(null);
    }

    function handleCreationDialogConfirm() {
        if (!editingValue.category || editingValue.category === "") {
            setCreationError("Please select a category for the activity");
            return;
        }
        if (!editingValue.title || editingValue.title === "") {
            setCreationError("Please enter a title for the activity");
            return;
        }
        if (editingValue.title.length > 50) {
            setCreationError("Title is too long");
            return;
        }
        if (editingValue.description.length > 200) {
            setCreationError("Description is too long");
            return;
        }
        if (editingValue.duration && isNaN(editingValue.duration)) {
            setCreationError("Duration must be a number, in hours");
            return;
        }
        if (editingValue.price && isNaN(editingValue.price)) {
            setCreationError("Price must be a number");
            return;
        }
        if (editingValue.url && !/^(http|https):\/\/[^ "]+$/.test(editingValue.url)) {
            setCreationError("Invalid URL");
            return;
        }

        setIsOpenCreationDialog(false);
        // Todo: Send new activity data to backend
        setEditingValue(null);
    }

    function handleFileChange(file) {
        setEditingValue({ ...editingValue, image: file });
    }

    function handleEditStart(data) {
        setEditingValue({
            category: standalonePlaceholderCardData.category,
            title: standalonePlaceholderCardData.title,
            description: standalonePlaceholderCardData.description,
            location: standalonePlaceholderCardData.location,
            time: standalonePlaceholderCardData.timeAllocation,
            price: standalonePlaceholderCardData.price,
            url: standalonePlaceholderCardData.url,
            image: standalonePlaceholderCardData.image,
        });
        setIsOpenCreationDialog(true);
    }

    // ACCORDION FUNCTIONS
    function updateAccordions(index) {
        if (collapsedAccordions.includes(index)) {
            setCollapsedAccordions(collapsedAccordions.filter(i => i !== index));
        } else {
            setCollapsedAccordions([...collapsedAccordions, index]);
        }
    }

    function collapseAllAccordions() {
        setCollapsedAccordions([...Array(placeholderDays.length).keys()]);
    }

    function expandAllAccordions() {
        setCollapsedAccordions([]);
    }

    // DRAG AND DROP FUNCTIONS
    function handleDragStart(event) {
        console.log("Drag start");
        console.log("Active:", event.active);

        if (event.active.data.current.type === "activity") {
            setActiveBucketlistCard(event.active.data.current?.day);
            return;
        }
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        console.log("Drag end");
        console.log("Active:", active);
        console.log("Over:", over);

        if (active.id !== over.id) {
            setBucketlistCards((card) => {
                const activeIndex = card.findIndex((c) => c.id === active.id);
                const overIndex = card.findIndex((c) => c.id === over.id);

                return arrayMove(card, activeIndex, overIndex);
            });
        }

        console.log("Bucketlist cards:", bucketlistCards);
        return;
    }


    return (
        <Box component="main" mb={10}>

            {/* OVERVIEW SECTION */}
            <Container component="section" maxWidth="lg" sx={{ mb: 6, px: 2 }}>
                <PlanOverview plan={plan} updatePlan={updatePlan} />
            </Container>

            {/* ANCHOR NAV */}
            <PlanInternalNav />

            <ScrollSpy>
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >

                    {/* MAP */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='map'>
                        <PlanMap markers={markers} />
                    </Container>

                    {/* BUCKET LIST */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='bucketlist'>
                        <Box
                            p={3}
                            sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '10px' }}
                        >
                            {/* HEADER */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                    <Typography variant="h2" color="black">
                                        Bucket list
                                    </Typography>
                                </Box>
                                <Tooltip title="Add new activity" placement='left' arrow>
                                    <IconButton onClick={handleCreationStart}>
                                        <AddCircleIcon sx={{ color: "black", fontSize: "2rem" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* ACTIVITY CARDS */}
                            <SortableContext items={bucketlistCards}>
                                <Grid container spacing={2}>
                                    {bucketlistCards.map((card, index) => (
                                        <Grid item size={{ sm: 12, md: 6 }}>
                                            <ActivityCard key={index} data={card} edit={handleEditStart} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </SortableContext>

                        </Box>
                    </Container>

                    {/* TRAVEL PLAN */}
                    <Container component="section" maxWidth="lg" sx={{ my: 3, px: 2 }} id='plan'>
                        <Box
                            p={3}
                            sx={{ backgroundColor: theme.palette.primary.dark, borderRadius: '10px' }}
                        >
                            <Box display="flex" flexDirection="column" gap={2}>
                                {/* HEADER */}
                                <Box display="flex" justifyContent="space-between" alignItems="center">

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                        <Typography variant="h2" color="white">
                                            Travel Plan
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mr: 0.75 }}>
                                        <Tooltip title="Expand all" placement='top' arrow>
                                            <IconButton onClick={expandAllAccordions} sx={{ pointerEvents: collapsedAccordions.length === 0 ? "none" : "auto" }}>
                                                <UnfoldMoreDoubleIcon sx={{
                                                    color: collapsedAccordions.length === 0 ? theme.palette.primary.medium : "white",
                                                    fontSize: "2rem",
                                                    '&:hover': { color: theme.palette.primary.secondary }
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Collapse all" placement='top' arrow>
                                            <IconButton onClick={collapseAllAccordions} sx={{ pointerEvents: collapsedAccordions.length === placeholderDays.length ? "none" : "auto" }}>
                                                <UnfoldLessDoubleIcon sx={{
                                                    color: collapsedAccordions.length === placeholderDays.length ? theme.palette.primary.medium : "white",
                                                    fontSize: "2rem",
                                                    '&:hover': { color: theme.palette.primary.secondary }
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                </Box>

                                {/* DAYS */}
                                <SortableContext items={days}>
                                    {days.map((day, dayIndex) => (
                                        <Box key={dayIndex}>
                                            <DayCard
                                                day={day}
                                                index={dayIndex}
                                                expanded={!collapsedAccordions.includes(dayIndex)}
                                                onChange={() => updateAccordions(dayIndex)}
                                            >

                                                {placeholderCardData.map((card, cardIndex) => (
                                                    <ActivityCard key={cardIndex} data={card} edit={handleEditStart} />
                                                ))}

                                            </DayCard>
                                        </Box>
                                    ))}
                                </SortableContext>
                            </Box>

                            <Box mt={2}>
                                <AddDayButton updateDays={updateDays} />
                            </Box>
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
                                    <ActivityCard data={standalonePlaceholderCardData} edit={handleEditStart} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>

                    {/* DRAG OVERLAY */}
                    <DragOverlay>
                        {activeBucketlistCard && (
                            <ActivityCard data={activeBucketlistCard} edit={handleEditStart} />
                        )}
                    </DragOverlay>

                </DndContext>
            </ScrollSpy>

            {/* ACTIVITY CREATION DIALOG */}
            <ConfirmDialog
                open={isOpenCreationDialog}
                onClose={handleCreationCancel}
                title="Activity card"
                confirm={handleCreationDialogConfirm}
                cancel={handleCreationCancel}
            >
                <FormControl>
                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        <Autocomplete
                            disablePortal
                            options={categories}
                            value={editingValue?.category || ''}
                            onChange={(e, value) => setEditingValue({ ...editingValue, category: value })}
                            renderInput={(params) => <TextField {...params} label="Category" required />}
                        />
                        <TextField
                            label="Title (max 50 characters)"
                            required
                            value={editingValue?.title || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                        />
                        <TextField
                            multiline
                            rows={4}
                            label="Description (max 200 characters)"
                            value={editingValue?.description || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                        />
                        <TextField
                            label="Location (GPS coord)"
                            value={editingValue?.location || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, location: e.target.value })}
                        />
                        <TextField
                            label="Time allocation (in hours)"
                            value={editingValue?.time || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, time: e.target.value })}
                        />
                        <TextField
                            label="Price"
                            value={editingValue?.price || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, price: e.target.value })}
                        />
                        <TextField
                            label="URL"
                            value={editingValue?.url || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, url: e.target.value })}
                        />
                        <MuiFileInput
                            label="Image"
                            placeholder="Upload an image"
                            value={editingValue?.image || ''}
                            onChange={handleFileChange}
                            inputProps={{ accept: '.png, .jpeg' }}
                            clearIconButtonProps={{
                                title: "Remove",
                                children: <CloseIcon fontSize="small" />
                            }}
                            fullWidth
                        />
                        {creationError &&
                            <Alert severity="warning">{creationError}</Alert>
                        }
                    </Box>
                </FormControl>
            </ConfirmDialog>
        </Box>

    );
}

export default TravelPlan;