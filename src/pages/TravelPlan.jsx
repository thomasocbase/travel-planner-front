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
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
    const { setAppStatus } = useContext(StatusContext);

    const [editingValue, setEditingValue] = useState();
    const [isOpenCreationDialog, setIsOpenCreationDialog] = useState(false);
    const [creationError, setCreationError] = useState(null);
    const [collapsedAccordions, setCollapsedAccordions] = useState([]);

    const [activities, setActivities] = useState(placeholderCardData);

    const [days, setDays] = useState(placeholderDays);
    const [activeDay, setActiveDay] = useState(null);

    // MAP MARKERS
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const newMarkers =
            activities
                .filter((activity) => !activity.isArchived)
                .filter((activity) => activity.location)
                .map((activity) => {
                    const [lat, lng] = activity.location.split(',').map(coord => parseFloat(coord));
                    return { position: [lat, lng], popup: activity.title };
                });
        setMarkers(newMarkers);
    }, [activities]);

    console.log("Markers:", markers);

    // PLACEHOLDER PLAN DATA
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

    function updatePlan(data) {
        setPlan(data);
    }

    // ACTIVITY CREATION & EDITION FUNCTIONS
    function updateDays(data) {
        setDays([...days, {
            title: data,
            order: placeholderDays.length + 1,
            duration: "8h",
            budget: "50",
        }]);
    }

    function deleteDay(id) {
        setDays(days.filter((day) => day.id !== id));
    }

    function handleArchive(id) {
        const clickedCard = activities.find((card) => card.id === id);
        clickedCard.isArchived ?
            setAppStatus({ open: true, severity: "success", message: "Activity moved to Bucket list" })
            : setAppStatus({ open: true, severity: "success", message: "Activity archived" });

        setActivities(activities.map((card) => {
            if (card.id === id) {
                return { ...card, isArchived: !card.isArchived };
            }
            return card;
        }));
    }

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

    function handleEditStart(id) {
        const clickedCard = activities.find((card) => card.id === id);

        setEditingValue({
            category: clickedCard.category,
            title: clickedCard.title,
            description: clickedCard.description,
            location: clickedCard.location,
            time: clickedCard.timeAllocation,
            price: clickedCard.price,
            url: clickedCard.url,
            image: clickedCard.image,
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

    // DRAG AND DROP 
    const [activeCard, setActiveCard] = useState(null);

    function handleDragStart(event) {
        if (event.active.data.current?.type === "activity") {
            setActiveCard(event.active.data.current?.day);
            return;
        }

        if (event.active.data.current?.type === "day") {
            setActiveDay(event.active.data.current?.day);
            return;
        }
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        console.log("Drag end");
        console.log("Active:", active);
        console.log("Over:", over);

        if ((active.data.current.type === 'activity') && (active.id !== over.id)) {
            setActivities((card) => {
                const activeIndex = card.findIndex((c) => c.id === active.id);
                const overIndex = card.findIndex((c) => c.id === over.id);

                
                // Move in/out of archive
                if (over.data.current.type === "activity" && (card[activeIndex].isArchived != card[overIndex].isArchived)) {
                    card[activeIndex].isArchived = !card[activeIndex].isArchived;
                }
                
                // Move in/out of day
                if (over.data.current.type === "activity" && (card[overIndex].dayId)) {
                    card[activeIndex].dayId = card[overIndex].dayId;
                } else {
                    card[activeIndex].dayId = null;
                }

                // Case where activity is dropped on a day without another activiy over it
                if (over.data.current?.type === "day") {
                    card[activeIndex].dayId = over.id;
                    card[activeIndex].isArchived = false;
                }

                return arrayMove(card, activeIndex, overIndex);
            });

            setActiveCard(null);
        }

        if ((active.data.current.type === 'day') && (active.id !== over.id)) {
            setDays((day) => {
                const activeIndex = day.findIndex((d) => d.id === active.id);
                const overIndex = day.findIndex((d) => d.id === over.id);

                return arrayMove(day, activeIndex, overIndex);
            });

            setActiveDay(null);
        }

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

                    {/* GLOBAL MAP */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='map'>
                        {markers.length > 0 && <PlanMap markers={markers} />}
                        {markers.length === 0 &&
                            <Box
                                display="flex" alignItems="center"
                                p={3}
                                sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '10px' }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                    <Typography variant="h2" color="black">
                                        Map
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1} flexGrow={1}>
                                    <Typography variant="normal" color='grey' textAlign="center">
                                        No data available
                                    </Typography>
                                    <Tooltip
                                        title="Add location data to your activities and you will see them appear on the map"
                                        placement='bottom' arrow
                                    >
                                        <InfoOutlinedIcon sx={{ color: 'grey' }} />
                                    </Tooltip>
                                </Box>
                            </Box>
                        }
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
                            <SortableContext items={activities.filter((card) => !card.isArchived && !card.dayId)}>
                                <Grid container spacing={2}>
                                    {activities
                                        .filter((card) => !card.isArchived && !card.dayId)
                                        .map((card, index) => (
                                            <Grid item key={index} size={{ sm: 12, md: 6 }}>
                                                <ActivityCard
                                                    data={card}
                                                    edit={() => handleEditStart(card.id)}
                                                    archive={() => handleArchive(card.id)}
                                                />
                                            </Grid>
                                        ))
                                    }
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

                                    <Box sx={{ mr: 0.75, display: "flex" }}>
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
                                                activities={activities.filter((card) => card.dayId === day.id)}
                                                deleteDay={() => deleteDay(day.id)}
                                            >
                                                <SortableContext items={activities.filter((card) => !card.isArchived && card.dayId === day.id)}>
                                                    {activities
                                                        .filter((card) => !card.isArchived && card.dayId === day.id)
                                                        .map((card, cardIndex) => (
                                                            <ActivityCard
                                                                key={cardIndex}
                                                                data={card}
                                                                edit={() => handleEditStart(card.id)}
                                                                archive={() => handleArchive(card.id)}
                                                            />
                                                        ))
                                                    }
                                                </SortableContext>

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
                            {/* HEADER */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HorizontalRuleIcon sx={{ color: theme.palette.primary.main, fontSize: "3rem" }} />
                                    <Typography variant="h2" color="black">
                                        Archives
                                    </Typography>
                                </Box>
                            </Box>

                            {/* ACTIVITY CARDS */}
                            <SortableContext items={activities.filter((card) => card.isArchived)}>
                                <Grid container spacing={2}>
                                    {activities
                                        .filter((card) => card.isArchived)
                                        .map((card, index) => (
                                            <Grid item key={index} size={{ sm: 12, md: 6 }}>
                                                <ActivityCard
                                                    data={card}
                                                    edit={() => handleEditStart(card.id)}
                                                    archive={() => handleArchive(card.id)}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </SortableContext>
                        </Box>
                    </Container>

                    {/* DRAG OVERLAY */}
                    <DragOverlay>
                        {activeCard && (
                            <ActivityCard data={activeCard} edit={() => { }} archive={() => { }} />
                        )}

                        {activeDay && (
                            <DayCard day={activeDay} index={0} expanded={false} onChange={() => { }} />
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