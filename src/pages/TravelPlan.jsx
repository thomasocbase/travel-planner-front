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
import AuthContext from '../components/auth/AuthContext';
import ky from 'ky';
import { useParams } from 'react-router-dom';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useDebounce } from 'use-debounce';

const userId = "67250f1fa0b9612c6157079a";

function TravelPlan() {
    const theme = useTheme();
    const { setAppStatus } = useContext(StatusContext);
    const { user } = useContext(AuthContext);
    const { planId } = useParams();

    const [editingValue, setEditingValue] = useState();
    const [debouncedEditingValue] = useDebounce(editingValue, 500);

    const [isOpenCreationDialog, setIsOpenCreationDialog] = useState(false);
    const [creationError, setCreationError] = useState(null);
    const [collapsedAccordions, setCollapsedAccordions] = useState([]);

    // PLAN FETCH
    const [plan, setPlan] = useState({});
    const [isPlanLoading, setIsPlanLoading] = useState(true);

    useEffect(() => {
        fetchPlan();
    }, []);

    async function fetchPlan() {
        try {
            const response = await ky.get('http://localhost:3000' + '/api/plan/' + planId, {
                credentials: 'include'
            }).json();

            setPlan(response);
            setIsPlanLoading(false);
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    function updatePlanState(data) {
        setPlan(data);
    }

    // ACTIVITIES FETCH
    const [activities, setActivities] = useState([]);

    async function fetchActivities() {
        try {
            const response = await ky.get('http://localhost:3000/api' + '/plan/' + planId + "/activities", {
                credentials: 'include'
            }).json();

            setActivities(response);
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: "Couldn't retrieve activities: " + error.message });
        }
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    // DAYS FETCH
    const [days, setDays] = useState([]);

    async function fetchDays() {
        try {
            const response = await ky.get('http://localhost:3000/api' + '/plan/' + planId + "/days", {
                credentials: 'include'
            }).json();

            setDays(response);
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: "Couldn't retrieve days: " + error.message });
        }
    }

    useEffect(() => {
        fetchDays();
    }, []);

    // CATEGORIES FETCH
    const [categories, setCategories] = useState([]);

    async function fetchCategories() {
        try {
            const response = await ky.get('http://localhost:3000/api' + '/activityType', {
                credentials: 'include'
            }).json();

            setCategories(response);
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: "Couldn't retrieve categories: " + error.message });
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // STATS CALCULATION
    const [stats, setStats] = useState({
        totalBudget: 0,
        totalDays: 0,
        totalActivities: 0,
        totalDrivingDistance: 0,
        totalHikingDistance: 0,
        likes: 5,
        saves: 2,
    });

    useEffect(() => {
        const totalBudget = activities.reduce((acc, activity) => acc + parseFloat(activity.price), 0);
        const totalDays = days.length;
        const totalActivities = activities.length;
        setStats({ ...stats, totalBudget, totalDays, totalActivities });
    }, [activities, days]);

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

    // DAY CRUD FUNCTIONS
    async function addDay(data) {
        try {
            const response = await ky.post('http://localhost:3000/api' + '/day', {
                json: {
                    planId: planId,
                    userId: userId,
                    title: data,
                    order: days.length + 1,
                    duration: "8h",
                    budget: "50",
                },
                credentials: 'include'
            }).json();

            setDays([...days, response.day]);
            setAppStatus({ open: true, severity: 'success', message: 'Day added' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    async function updateTitle(id, newTitle) {
        try {
            const response = await ky.put("http://localhost:3000/api" + "/day/title/" + id, {
                json: { title: newTitle },
                credentials: "include"
            }).json();

            setDays(days.map((day) => {
                if (day._id === id) {
                    return { ...day, title: newTitle };
                }
                return day;
            }));
            setAppStatus({ open: true, severity: "success", message: "Day title updated" });
        } catch (error) {
            setAppStatus({ open: true, severity: "error", message: "An error occurred" + error });
        }
    }

    async function deleteDay(id) {
        try {
            const response = await ky.delete('http://localhost:3000/api' + '/day/' + id, {
                credentials: 'include'
            }).json();
            setAppStatus({ open: true, severity: 'success', message: 'Day deleted' });
            setDays(days.filter((day) => day._id !== id));
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    // ACTIVITY CRUD FUNCTIONS
    async function updateActivity(id, data) {
        try {
            const response = await ky.put('http://localhost:3000/api' + '/activity/' + id, {
                json: { ...data },
                credentials: 'include'
            }).json();

            fetchActivities();
            setAppStatus({ open: true, severity: 'success', message: 'Activity updated' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: "Couldn't update: " + error.message });
        }
    }

    function handleArchive(id) {
        const activity = activities.find((card) => card._id === id);
        activity.isArchived = !activity.isArchived;

        if (activity.isArchived) {
            activity.order = activities.filter((card) => card.isArchived).length;
            activity.dayId = null;
        } else {
            activity.order = activities.filter((card) => !card.isArchived && !card.dayId).length;
        }

        updateActivity(id, { ...activity });
    }

    const [actionType, setActionType] = useState('create');

    function handleCreationStart() {
        setActionType('create');
        setIsOpenCreationDialog(true);
        setEditingValue({
            title: "",
            description: "",
            activityType: { name: "" },
            timeAllocation: "",
            price: "",
            url: "",
            location: "",
            image: null,
            isArchived: false,
            order: activities.filter((card) => !card.isArchived && !card.dayId).length + 1,
            planId: planId,
        });
    }

    function handleCreationCancel() {
        setIsOpenCreationDialog(false);
        setCreationError(null);
        setEditingValue(null);
    }

    async function addActivity(data) {
        try {
            const response = await ky.post('http://localhost:3000/api' + '/activity', {
                json: { ...data },
                credentials: 'include'
            }).json();

            fetchActivities();
            setAppStatus({ open: true, severity: 'success', message: 'Activity added' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    function handleCreationDialogConfirm() {
        if (!editingValue.activityType || editingValue.activityType === "") {
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
        if (editingValue.description.length > 500) {
            setCreationError("Description is too long");
            return;
        }
        if (editingValue.timeAllocation && isNaN(editingValue.timeAllocation)) {
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

        switch (actionType) {
            case 'create':
                addActivity(editingValue);
                break;
            case 'edit':
                updateActivity(editingValue._id, editingValue);
                break;
            default:
                addActivity(editingValue);
        }

        setIsOpenCreationDialog(false);
        setEditingValue(null);
        setCreationError(null);
    }

    function handleFileChange(file) {
        setEditingValue({ ...editingValue, image: file });
    }

    function handleEditStart(id) {
        const clickedCard = activities.find((card) => card._id === id);

        setActionType('edit');
        setEditingValue({ ...clickedCard });
        setIsOpenCreationDialog(true);
    }

    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    async function handleDelete(id) {
        try {
            const response = await ky.delete('http://localhost:3000/api' + '/activity/' + id, {
                credentials: 'include'
            }).json();
            setAppStatus({ open: true, severity: 'success', message: 'Activity deleted' });
            setActivities(activities.filter((card) => card._id !== id));
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: "Couldn't delete activity: " + error.message });
        }
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
        setCollapsedAccordions([...Array(days.length).keys()]);
    }

    function expandAllAccordions() {
        setCollapsedAccordions([]);
    }

    // DRAG AND DROP 
    const [activeDay, setActiveDay] = useState(null);
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

    async function updateOrder(id, newOrder) {
        try {
            const response = await ky.put('http://localhost:3000/api' + '/day/order/' + id, {
                json: { order: newOrder },
                credentials: 'include'
            }).json();
            setAppStatus({ open: true, severity: 'success', message: 'Order updated' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    console.log("Activities:", activities);

    function handleDragEnd(event) {
        const { active, over } = event;

        console.log("Drag end");
        console.log("Active:", active);
        console.log("Over:", over);

        // If there is no over, or the active card is dropped on itself, abort
        if (!over || active.id === over.id) {
            return;
        }

        // IF THE ACTIVE CARD IS AN ACTIVITY
        if (active.data.current.type === 'activity') {

            setActivities((card) => {
                const activeIndex = card.findIndex((c) => c._id === active.id);
                const overIndex = card.findIndex((c) => c._id === over.id);

                // Activity is dropped on a day without another activity over it
                if (over.data.current?.type === "day") {
                    card[activeIndex].dayId = over.id;
                    card[activeIndex].isArchived = false;
                    card[activeIndex].order = card.filter((c) => c.dayId === over._id).length;

                    updateActivity(active.id, card[activeIndex]);

                    return card;
                }

                // Move inside same container
                if (
                    (card[activeIndex].dayId === card[overIndex].dayId) ||
                    (card[activeIndex].isArchived && card[overIndex].isArchived) ||
                    (!card[activeIndex].dayId && !card[overIndex].dayId)
                ) {
                    [card[activeIndex].order, card[overIndex].order] = [card[overIndex].order, card[activeIndex].order];

                    updateActivity(active.id, card[activeIndex]);
                    updateActivity(over.id, card[overIndex]);

                    return card;
                }

                // Move in/out of archive
                if (card[activeIndex].isArchived != card[overIndex].isArchived) {
                    card[activeIndex].isArchived = !card[activeIndex].isArchived;

                    // Move into archive
                    if (card[activeIndex].isArchived) {
                        card[activeIndex].order = card.filter((c) => c.isArchived).length + 1;
                        card[activeIndex].dayId = null;

                        // Move out of archive, into day
                    } else if (!card[activeIndex].isArchived && card[overIndex].dayId) {
                        card[activeIndex].dayId = card[overIndex].dayId;
                        card[activeIndex].order = card[overIndex].order;
                        card[overIndex].order = card[overIndex].order + 1;

                        // Move out of archive, into bucket list
                    } else {
                        card[activeIndex].order = card.filter((c) => !c.isArchived && !c.dayId).length;
                    }

                    updateActivity(active.id, card[activeIndex]);
                    updateActivity(over.id, card[overIndex]);

                    return card;
                }

                // Move into/inside day
                if (card[overIndex].dayId) {
                    card[activeIndex].dayId = card[overIndex].dayId;
                    card[activeIndex].isArchived = false;
                    card[activeIndex].order = card[overIndex].order;
                    card[overIndex].order = card[overIndex].order + 1;

                    updateActivity(active.id, card[activeIndex]);
                    updateActivity(over.id, card[overIndex]);

                    return card;
                }

                // Move out of day
                if (!card[overIndex].dayId) {
                    card[activeIndex].dayId = null;
                    card[activeIndex].isArchived = false;
                    card[activeIndex].order = card.filter((c) => !c.isArchived && !c.dayId).length;

                    updateActivity(active.id, card[activeIndex]);

                    return card;
                }
                        

                return card;
            });

            setActiveCard(null);
        }

        // IF THE ACTIVE CARD IS A DAY
        if (active.data.current.type === 'day') {
            if (over.data.current.type === "activity") {
                return;
            }

            setDays((day) => {
                const activeDay = day.find((d) => d._id === active.id);
                const overDay = day.find((d) => d._id === over.id);

                [activeDay.order, overDay.order] = [overDay.order, activeDay.order];

                updateOrder(active.id, activeDay.order);
                updateOrder(over.id, overDay.order);

                return day.map((d) => {
                    if (d.id === active.id) {
                        return overDay;
                    }
                    if (d.id === over.id) {
                        return activeDay;
                    }
                    return d;
                });
            });

            setActiveDay(null);
        }

        return;
    }


    // FORBIDDEN ACCESS IF NOT LOGGED IN
    if (!user.isLoggedIn) {
        return (
            <Box
                minHeight="90svh"
                display="flex" justifyContent="center" alignItems="center"
            >
                <Typography variant="h2" color="black">Please log in to view this page</Typography>
            </Box>
        );
    }

    // LOADING PAGE WHILE FETCHING DATA
    if (isPlanLoading) {
        return (
            <Box
                minHeight="90svh"
                display="flex" justifyContent="center" alignItems="center"
            >
                <HourglassEmptyIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }} />
                <Typography variant="h2" color="black">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box component="main" mb={10}>

            {/* OVERVIEW SECTION */}
            <Container component="section" maxWidth="lg" sx={{ mb: 6, px: 2 }}>
                <PlanOverview plan={plan} updatePlanState={updatePlanState} stats={stats} />
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
                                {activities.length === 0 &&
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                        <Typography variant="normal" color="grey" textAlign="center">
                                            No activities yet
                                        </Typography>
                                    </Box>
                                }
                                <Tooltip title="Add new activity" placement='left' arrow>
                                    <IconButton onClick={handleCreationStart}>
                                        <AddCircleIcon sx={{ color: "black", fontSize: "2rem" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* ACTIVITY CARDS */}
                            <SortableContext items={activities
                                .filter((card) => !card.isArchived && !card.dayId)
                                .map((item) => item._id)
                            }>
                                <Grid container spacing={2}>
                                    {activities
                                        .filter((card) => !card.isArchived && !card.dayId)
                                        .sort((a, b) => a.order - b.order)
                                        .map((card, index) => (
                                            <Grid item key={index} size={{ sm: 12, md: 6 }}>
                                                <ActivityCard
                                                    data={card}
                                                    edit={() => handleEditStart(card._id)}
                                                    archive={() => handleArchive(card._id)}
                                                    delete={() => {
                                                        setIsOpenDeleteDialog(true);
                                                        setDeleteId(card._id);
                                                    }}
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
                                            <IconButton onClick={collapseAllAccordions} sx={{ pointerEvents: collapsedAccordions.length === days.length ? "none" : "auto" }}>
                                                <UnfoldLessDoubleIcon sx={{
                                                    color: collapsedAccordions.length === days.length ? theme.palette.primary.medium : "white",
                                                    fontSize: "2rem",
                                                    '&:hover': { color: theme.palette.primary.secondary }
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                </Box>

                                {/* DAYS */}
                                <SortableContext items={days.map((item) => item._id)}>
                                    {days
                                        .sort((a, b) => a.order - b.order)
                                        .map((day, dayIndex) => (
                                            <Box key={dayIndex}>
                                                <DayCard
                                                    day={day}
                                                    index={dayIndex}
                                                    expanded={!collapsedAccordions.includes(dayIndex)}
                                                    onChange={() => updateAccordions(dayIndex)}
                                                    activities={activities
                                                        .filter((card) => card.dayId === day._id)
                                                        .sort((a, b) => a.order - b.order)}
                                                    updateTitle={updateTitle}
                                                    deleteDay={() => deleteDay(day._id)}
                                                >
                                                    <SortableContext items={activities
                                                        .filter((card) => !card.isArchived && card.dayId === day._id)
                                                        .map((item) => item._id)
                                                    }>
                                                        {activities
                                                            .filter((card) => !card.isArchived && card.dayId === day._id)
                                                            .sort((a, b) => a.order - b.order)
                                                            .map((card, cardIndex) => (
                                                                <ActivityCard
                                                                    key={cardIndex}
                                                                    data={card}
                                                                    edit={() => handleEditStart(card._id)}
                                                                    archive={() => handleArchive(card._id)}
                                                                    delete={() => {
                                                                        setIsOpenDeleteDialog(true);
                                                                        setDeleteId(card._id);
                                                                    }}
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
                                <AddDayButton addDay={addDay} />
                            </Box>
                        </Box>
                    </Container>

                    {/* ARCHIVES */}
                    <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }} id='archives'>
                        <Box
                            p={3} minHeight={300}
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
                            <SortableContext items={activities
                                .filter((card) => card.isArchived)
                                .map((item) => item._id)
                            }>
                                <Grid container spacing={2}>
                                    {activities
                                        .filter((card) => card.isArchived)
                                        .sort((a, b) => a.order - b.order)
                                        .map((card, index) => (
                                            <Grid item key={index} size={{ sm: 12, md: 6 }}>
                                                <ActivityCard
                                                    data={card}
                                                    edit={() => handleEditStart(card._id)}
                                                    archive={() => handleArchive(card._id)}
                                                    delete={() => {
                                                        setIsOpenDeleteDialog(true);
                                                        setDeleteId(card._id);
                                                    }}
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
                            <ActivityCard
                                data={activeCard}
                                edit={() => { }}
                                archive={() => { }}
                                delete={() => { }}
                            />
                        )}

                        {activeDay && (
                            <DayCard
                                day={activeDay}
                                index={0}
                                expanded={false}
                                onChange={() => { }}
                                activities={activities}
                                updateTitle={() => { }}
                                deleteDay={() => { }}
                            />
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
                        {creationError &&
                            <Alert severity="warning">{creationError}</Alert>
                        }
                        <Autocomplete
                            disablePortal
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            value={editingValue?.activityType || ''}
                            onChange={(e, value) => setEditingValue({ ...editingValue, activityType: value })}
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
                            rows={6}
                            label="Description (max 500 characters)"
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
                            value={editingValue?.timeAllocation || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, timeAllocation: e.target.value })}
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
                        <TextField
                            label="Image"
                            value={editingValue?.image || ''}
                            onChange={(e) => setEditingValue({ ...editingValue, image: e.target.value })}
                        />
                        {/* <MuiFileInput
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
                        /> */}
                    </Box>
                </FormControl>
            </ConfirmDialog>

            {/* DELETE ACTIVITY DIALOG */}
            <ConfirmDialog
                open={isOpenDeleteDialog}
                onClose={() => setIsOpenDeleteDialog(false)}
                title="Delete activity"
                confirm={() => {
                    handleDelete(deleteId);
                    setIsOpenDeleteDialog(false);
                }}
                cancel={() => setIsOpenDeleteDialog(false)}
            >
                <Typography variant="body1">Are you sure you want to delete this activity?</Typography>
            </ConfirmDialog>
        </Box>

    );
}

export default TravelPlan;