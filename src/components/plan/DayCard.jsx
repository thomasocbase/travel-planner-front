import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function DayCard(props) {
    const theme = useTheme();

    return (
        <Accordion
            key={props.index}
            defaultExpanded
            disableGutters
            sx={{ backgroundColor: "transparent", borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)" }}
        >
            <AccordionSummary id={`panel${props.index}-header`}
                expandIcon={<ExpandMoreIcon sx={{ color: "black", fontSize: "2rem" }} />}
                aria-controls={`panel${props.index}-content`}
                sx={{ backgroundColor: "#ACACAC", borderRadius: "10px 10px 0 0" }}
            >
                <Typography variant="h4">{props.day.order} - {props.day.title}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2, backgroundColor: theme.palette.primary.light, borderRadius: "0 0 10px 10px" }}>
                {props.children}
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", margin: "0 auto" }}>
                    <Typography variant="h6">Daily recap</Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <AccessTimeIcon />
                        <Typography variant="body2">{props.day.duration}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <CreditCardIcon />
                        <Typography variant="body2">{props.day.budget}</Typography>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}