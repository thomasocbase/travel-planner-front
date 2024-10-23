import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState, useContext } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlanMap from './PlanMap';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmDialog from '../ConfirmDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StatusContext from '../status/StatusContext';

export default function DayCard(props) {
    const theme = useTheme();
    const { setAppStatus } = useContext(StatusContext);

    // DnD
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.day.id,
        data: {
            type: 'day',
            day: { ...props.day },
        },
        animateLayoutChanges: () => false
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // MAP MARKERS
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const newMarkers = props.activities.map(activity => {
            const [lat, lng] = activity.location.split(',').map(coord => parseFloat(coord));
            return { position: [lat, lng], popup: activity.title };
        });
        setMarkers(newMarkers);
    }, [props.day]);

    // EDIT TITLE
    const [editingValue, setEditingValue] = useState();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [error, setError] = useState(null);

    const [isOpenSupprDialog, setIsOpenSupprDialog] = useState(false);

    function handleEditTitleStart() {
        setIsEditingTitle(true);
        setEditingValue(props.day.title);
    }

    function handleEditTitleSubmit() {
        if (!editingValue || editingValue.length === 0) {
            setError("Title cannot be empty");
            return;
        }
        if (editingValue.length > 50) {
            setError("Title cannot exceed 50 characters");
            return;
        }

        // Todo: Send new title to backend

        setAppStatus({ open: true, severity: "success", message: "Day title updated" });
        setError(null);
        setIsEditingTitle(false);

    }

    function handleEnterPress(e) {
        if (e.key === "Enter") {
            handleEditTitleSubmit();
        }
    }

    // DELETE DAY
    function handleDeleteDay() {
        // Todo: Send delete request to backend

        setIsOpenSupprDialog(false);
        setAppStatus({ open: true, severity: "success", message: "Day deleted" });
    }

    return (
        <>
            <Accordion
                ref={setNodeRef}
                key={props.index}
                defaultExpanded
                disableGutters
                expanded={props.expanded}
                onChange={props.onChange}
                sx={{
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                    filter: isDragging ? 'opacity(20%)' : 'none',
                    ...style
                }}
            >
                <AccordionSummary id={`panel${props.index}-header`}
                    expandIcon={<ExpandMoreIcon sx={{ color: "black", fontSize: "2rem" }} />}
                    aria-controls={`panel${props.index}-content`}
                    sx={{ backgroundColor: "#d9b834", borderRadius: "10px 10px 0 0" }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, width: "95%" }}>

                        <Box display="flex" alignItems="center" gap={1}>
                            <DragIndicatorIcon {...attributes} {...listeners} />
                            <Typography variant="h4" flexShrink={0}>{props.index + 1} -</Typography>
                            <Typography variant="h4">{props.day.title}</Typography>
                        </Box>

                        <Box display="flex" gap={2}>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <AccessTimeIcon />
                                <Typography variant="body2">{props.day.duration}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <CreditCardIcon />
                                <Typography variant="body2">{props.day.budget}€</Typography>
                            </Box>
                        </Box>

                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2, backgroundColor: theme.palette.primary.light, borderRadius: "0 0 10px 10px" }}>

                    <Grid container spacing={2}>

                        {/* ACTIVITY CARDS */}
                        <Grid item size={{ sm: 12, md: 8 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {props.children}
                            </Box>
                        </Grid>

                        {/* SIDEBAR */}
                        <Grid item size={{ xs: 12, sm: 12, md: 4 }} component="aside" mb={2}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                                {markers.length > 0 &&
                                    <PlanMap
                                        markers={markers}
                                        attribution={false}
                                    />
                                }

                                <Box sx={{
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                                    backgroundColor: "white", borderRadius: "10px", p: 2
                                }}>
                                    {isEditingTitle ? (
                                        <>
                                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                                <TextField
                                                    variant='standard'
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    sx={{ mr: 1 }}
                                                    onKeyDown={handleEnterPress}
                                                    fullWidth
                                                />
                                                <IconButton onClick={handleEditTitleSubmit}>
                                                    <DoneIcon sx={{ color: theme.palette.primary.secondary }} />
                                                </IconButton>
                                                <IconButton onClick={() => {
                                                    setError(null);
                                                    setIsEditingTitle(false)
                                                }} >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                            {error && <Alert severity="warning">{error}</Alert>}
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleEditTitleStart}
                                            sx={{
                                                display: "flex", gap: 1,
                                                color: "black",
                                                transition: "none",
                                                "&:hover": { textDecoration: "underline" }
                                            }}
                                        >
                                            <EditIcon sx={{ color: "black" }} />
                                            Edit day title
                                        </Button>
                                    )}
                                    <Divider flexItem />
                                    <Button
                                        onClick={() => setIsOpenSupprDialog(true)}
                                        sx={{
                                            display: "flex", gap: 1,
                                            color: "red",
                                            transition: "none",
                                            "&:hover": { textDecoration: "underline" }
                                        }}
                                    >
                                        <DeleteIcon sx={{ color: "red" }} />
                                        Delete day
                                    </Button>
                                </Box>

                            </Box>
                        </Grid>

                    </Grid>
                </AccordionDetails>
            </Accordion>

            <ConfirmDialog
                open={isOpenSupprDialog}
                onClose={() => setIsOpenSupprDialog(false)}
                title="Delete day"
                confirm={handleDeleteDay}
                cancel={() => setIsOpenSupprDialog(false)}
            >
                <Typography variant="normal">Are you sure you want to delete this day?</Typography>
                <Alert severity="warning">This action cannot be undone.</Alert>
            </ConfirmDialog>
        </>
    )
}