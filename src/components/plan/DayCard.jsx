import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlanMap from './PlanMap';

export default function DayCard(props) {
    const theme = useTheme();

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
                    <Grid item size={{ xs: 12, md: 8 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {props.children}
                        </Box>
                    </Grid>

                    {/* SIDEBAR */}
                    <Grid component="aside" item size={{ xs: 12, md: 4 }} mb={2}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                            <Box>
                                <PlanMap
                                    markers={[
                                        { position: [48.857, 2.348], popup: "Eiffel Tower" },
                                        { position: [48.859, 2.294], popup: "Arc de Triomphe" },
                                    ]}
                                    attribution={false}
                                />
                            </Box>

                            <Box sx={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                                backgroundColor: "white", borderRadius: "10px", p: 2
                            }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <EditIcon />
                                    <Typography variant="normal">Edit day title</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <DeleteIcon sx={{ color: "red" }} />
                                    <Typography variant="normal" color='red'>Delete day</Typography>
                                </Box>
                            </Box>

                        </Box>
                    </Grid>

                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}