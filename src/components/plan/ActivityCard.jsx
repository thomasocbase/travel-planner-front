import { Box, Card, CardActions, CardContent, CardMedia, Chip, Icon, IconButton, Link, Skeleton, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArchiveIcon from '@mui/icons-material/Archive';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TourIcon from '@mui/icons-material/Tour';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ExploreIcon from '@mui/icons-material/Explore';
import matchCategoryColor from '../../helpers/activityColor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ActivityCard(props) {
    const theme = useTheme();

    // DRAG AND DROP
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.data._id,
        data: {
            type: 'activity',
            day: { ...props.data },
        },
        animateLayoutChanges: () => false,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // EXPAND CARD
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // MATCH CATEGORY ICON
    function matchCategoryIcon(category) {
        const fontSize = "1.2rem";
        switch (category) {
            case "Accommodation":
                return <HotelIcon sx={{ fontSize: fontSize }} />;
            case "Meal":
                return <RestaurantIcon sx={{ fontSize: fontSize }} />;
            case "Hike":
                return <NordicWalkingIcon sx={{ fontSize: fontSize }} />;
            case "Tour":
                return <TourIcon />;
            case "Note":
                return <StickyNote2Icon sx={{ fontSize: fontSize }} />;
            case "Shopping":
                return <LocalMallIcon sx={{ fontSize: fontSize }} />;
            case "Relaxation":
                return <SelfImprovementIcon sx={{ fontSize: fontSize }} />;
            default:
                return <ExploreIcon sx={{ fontSize: fontSize }} />;
        }
    }

    return (
        <Card
            ref={setNodeRef}
            elevation={1}
            sx={{
                backgroundColor: "white",
                borderRadius: '10px',
                borderLeft: `6px solid ${matchCategoryColor(props.data.activityType.name)}`,
                filter: `${isDragging ? 'opacity(20%)' : ''} ${props.data.isArchived ? 'grayscale(1)' : ''}`,
                ...style
            }}
        >
            <CardContent sx={{ display: "flex", gap: 2, flexDirection: { xs: "column-reverse", sm: "row" } }}>

                {/* IMAGE */}
                <CardMedia
                    component="img"
                    src={props.data.image} alt={props.data.title}
                    sx={{
                        maxWidth: { xs: "100%", sm: "33%" },
                        aspectRatio: { xs: "4 / 3", sm: "1" },
                        borderRadius: "5px",

                    }}
                />

                <Box display="flex" flexDirection="column" gap={1} width="100%">

                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Chip icon={matchCategoryIcon(props.data.activityType.name)} label={props.data.activityType.name}
                            sx={{
                                alignSelf: "start",
                                fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", fontWeight: 600,
                                px: 1,
                                color: matchCategoryColor(props.data.activityType.name)
                            }}
                        />
                        <DragIndicatorIcon
                            sx={{ color: theme.palette.primary.medium, cursor: "grab" }}
                            {...attributes} {...listeners}
                        />
                    </Box>

                    <Typography variant="h5" mt={2} sx={{ wordWrap: "break-word" }}>{props.data.title}</Typography>

                    <Typography component="p" variant="smaller" sx={{ wordWrap: "break-word" }} width="100%">
                        {props.data.description.length > 150 ? (props.data.description.slice(0, 150) + "...") : props.data.description}
                    </Typography>

                    {props.data.url && (
                        <Box display="flex" alignItems="center" gap={1} color={theme.palette.primary.light}>
                        <LinkIcon />
                        <Link href={props.data.url} target="_blank" underline='hover' sx={{ color: 'inherit' }}>
                            {props.data.url.length > 25 ? (props.data.url.slice(0, 25) + "...") : props.data.url}
                        </Link>
                    </Box>
                    )}
                </Box>

            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 1.5 }}>

                {/* STATS */}
                <Box display={"flex"} gap={2} flexWrap="wrap">
                    <Box display="flex" alignItems={"center"} gap={1}>
                        <AccessTimeIcon />
                        <Typography variant='smaller'>{props.data.timeAllocation}h</Typography>
                    </Box>
                    <Box display="flex" alignItems={"center"} gap={1}>
                        <CreditCardIcon />
                        <Typography variant='smaller'>{props.data.price}€</Typography>
                    </Box>
                </Box>

                {/* EXPAND BUTTON */}
                <IconButton onClick={() => setExpanded(!expanded)}>
                    <Tooltip title={expanded ? "Hide full description" : "Show full description"} arrow>
                        <ExpandMoreIcon sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "200ms ease-in-out" }} />
                    </Tooltip>
                </IconButton>

                {/* ACTIONS */}
                <Box display="flex" sx={{ color: "black" }}>
                    <IconButton color='inherit' onClick={props.edit}>
                        <Tooltip title="Edit activity" arrow>
                            <EditIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton color='inherit' onClick={props.archive}>
                        <Tooltip title={props.data.isArchived ? "Unarchive activity" : "Archive activity"} arrow>
                            {props.data.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                        </Tooltip>
                    </IconButton>
                    {props.data.isArchived && (
                        <IconButton color='inherit' onClick={props.delete}>
                            <Tooltip title="Delete activity" arrow>
                                <DeleteIcon />
                            </Tooltip>
                        </IconButton>
                    )}
                </Box>

            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="normal">
                        {props.data.description}
                    </Typography>
                </CardContent>
            </Collapse>

        </Card>
    )
}