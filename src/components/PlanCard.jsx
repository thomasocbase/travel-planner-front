import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Link, Typography, useTheme } from "@mui/material";
import React from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArchiveIcon from '@mui/icons-material/Archive';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import matchCategoryColor from '../helpers/activityColor';


export default function PlanCard(props) {
    const theme = useTheme();
    return (
        <Card sx={{
            backgroundColor: "white",
            borderRadius: '10px',
            borderLeft: `6px solid ${matchCategoryColor(props.data.category)}`,
        }}>
            <CardContent sx={{ display: "flex", gap: 2 }}>
                <CardMedia component="img" src={props.data.image} alt={props.data.title} sx={{ maxWidth: "33%", aspectRatio: 1, borderRadius: "5px" }} />
                <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h3">{props.data.title}</Typography>
                        <DragIndicatorIcon sx={{ color: theme.palette.primary.light }}/>
                    </Box>
                    <Typography variant="normal" color={matchCategoryColor(props.data.category)}>
                        {props.data.category}
                    </Typography>
                    <Typography variant="smaller">
                        {props.data.description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} color={theme.palette.primary.light}>
                        <LinkIcon />
                        <Link href={props.data.url} target="_blank" underline='hover' sx={{ color: 'inherit' }}>View</Link>
                    </Box>
                </Box>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 1.5 }}>
                <Box display={"flex"} gap={2}>
                    <Box display="flex" alignItems={"center"} gap={1}>
                        <AccessTimeIcon />
                        <Typography variant='smaller'>{props.data.timeAllocation}h</Typography>
                    </Box>
                    <Box display="flex" alignItems={"center"} gap={1}>
                        <CreditCardIcon />
                        <Typography variant='smaller'>{props.data.price}€</Typography>
                    </Box>
                </Box>
                <Box display="flex" sx={{ color: "black" }}>
                    <IconButton color='inherit'>
                        <EditIcon />
                    </IconButton>
                    <IconButton color='inherit'>
                        <ArchiveIcon />
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    )
}