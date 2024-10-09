import { useTheme } from '@mui/material';

export default function matchCategoryColor(category) {
    const theme = useTheme();
    switch (category) {
        case "Accommodation":
            return theme.palette.activities.accommodation;
        case "Meal":
            return theme.palette.activities.meal;
        case "Hike":
            return theme.palette.activities.hike;
        case "Tour":
            return theme.palette.activities.tour;
        case "Note":
            return theme.palette.activities.note;
        case "Shopping":
            return theme.palette.activities.shopping;
        case "Relaxation":
            return theme.palette.activities.relaxation;
        default:
            return theme.palette.activities.other;
    }
} 