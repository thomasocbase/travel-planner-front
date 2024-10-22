import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlanMap from './PlanMap';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function DayCard(props) {
    const theme = useTheme();

    const [markers, setMarkers] = useState([
        // Placeholder values
        { position: [48.857, 2.348], popup: "Eiffel Tower" },
        { position: [48.859, 2.294], popup: "Arc de Triomphe" },
    ]);

    const [editingValue, setEditingValue] = useState();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [error, setError] = useState(null);

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

        setError(null);
        setIsEditingTitle(false);

        // TODO: Send new title to backend
    }

    function handleEnterPress(e) {
        if (e.key === "Enter") {
            handleEditTitleSubmit();
        }
    }

    return (
        <Accordion
            key={props.index}
            defaultExpanded
            disableGutters
            sx={{ backgroundColor: "transparent", borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)" }}
            expanded={props.expanded}
            onChange={props.onChange}
        >
            <AccordionSummary id={`panel${props.index}-header`}
                expandIcon={<ExpandMoreIcon sx={{ color: "black", fontSize: "2rem" }} />}
                aria-controls={`panel${props.index}-content`}
                sx={{ backgroundColor: "#d9b834", borderRadius: "10px 10px 0 0" }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, width: "95%" }}>

                    <Box display="flex" alignItems="center" gap={1}>
                        <DragIndicatorIcon />
                        <Typography variant="h4" flexShrink={0}>{props.day.order} -</Typography>
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
                    <Grid item size={{ sm: 12, md: 4 }} component="aside" mb={2}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                            <PlanMap
                                markers={markers}
                                attribution={false}
                            />

                            <Box sx={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                                backgroundColor: "white", borderRadius: "10px", p: 2
                            }}>
                                {isEditingTitle ? (
                                    <>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <TextField
                                                variant='standard'
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                sx={{ minWidth: "200px" }}
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
                                    <Button sx={{ display: "flex", gap: 1 }} onClick={handleEditTitleStart}>
                                        <EditIcon />
                                        <Typography variant="normal">Edit day title</Typography>
                                    </Button>
                                )}
                                <Divider sx={{ width: "100%" }} />
                                <Button sx={{ display: "flex", gap: 1 }}>
                                    <DeleteIcon sx={{ color: "red" }} />
                                    <Typography variant="normal" color='red'>Delete day</Typography>
                                </Button>
                            </Box>

                        </Box>
                    </Grid>

                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}