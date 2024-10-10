import { Accordion, AccordionDetails, AccordionSummary, Typography, useTheme } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DayCard(props) {
    const theme = useTheme();

    return (
        <Accordion
            key={props.index}
            defaultExpanded
            disableGutters
            sx={{ backgroundColor: theme.palette.primary.light }}
        >
            <AccordionSummary id={`panel${props.index}-header`}
                expandIcon={<ExpandMoreIcon sx={{ color: "black", fontSize: "2rem" }} />}
                aria-controls={`panel${props.index}-content`}
                sx={{ backgroundColor: theme.palette.primary.light }}
            >
                <Typography variant="h4">Day {props.day.order} - {props.day.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                {props.children}
            </AccordionDetails>
        </Accordion>
    )
}