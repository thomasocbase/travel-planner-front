import React, { useState, useContext } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import StatusContext from '../status/StatusContext';

export default function AddDayButton(props) {
    const theme = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [addValue, setAddValue] = useState("");
    const [error, setError] = useState(null);
    const { setAppStatus } = useContext(StatusContext);

    function handleEnterPress(e) {
        if (e.key === "Enter") {
            handleAddDay();
        }
    }

    function handleAddDay() {
        if (!addValue || addValue === "") {
            setError("Please enter a title for the day");
            return;
        }

        if (addValue.length > 50) {
            setError("Title is too long");
            return;
        }

        // Add the day
        props.addDay(addValue);
        setIsAdding(false);
        setAddValue("");
        setError(null);
    }

    return (
        <>
            {!isAdding &&
                <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                    <IconButton onClick={(e) => { e.stopPropagation, setIsAdding(true) }} sx={{
                        position: "relative",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "50%", left: "-50px",
                            transform: "translate(-50%, -50%)",
                            height: "3px", width: "100px",
                            backgroundColor: theme.palette.primary.medium,
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: "50%", right: "-50px",
                            transform: "translate(50%, -50%)",
                            height: "3px", width: "100px",
                            backgroundColor: theme.palette.primary.medium,
                        }
                    }}>
                        <Tooltip title="Add a new day" arrow>
                            <AddCircleOutlineIcon id="add-day-button" sx={{
                                color: "white",
                                fontSize: "2rem",
                                '&:hover': { color: theme.palette.primary.secondary }
                            }} />
                        </Tooltip>
                    </IconButton>
                </Box>
            }

            {isAdding &&
                <Box sx={{
                    display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 2,
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: "10px",
                    px: 3,
                }}>
                    <Typography variant="h4">Add a new day</Typography>
                    <Box my={2} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            variant='standard'
                            value={addValue}
                            onChange={(e) => setAddValue(e.target.value)}
                            sx={{ minWidth: "250px", mb: 2, mr: 2 }}
                            onKeyDown={handleEnterPress}
                        />
                        <IconButton onClick={handleAddDay}>
                            <DoneIcon sx={{ color: theme.palette.primary.secondary }} />
                        </IconButton>
                        <IconButton onClick={() => {
                            setError(null);
                            setIsAdding(false)
                        }} >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            }
        </>
    )
}