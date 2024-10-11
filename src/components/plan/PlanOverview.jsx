import React, { useState, useEffect, useContext } from 'react';
import Grid from '@mui/material/Grid2';
import { Alert, Box, Button, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography, useTheme } from '@mui/material';
import ConfirmDialog from '../ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import StarsIcon from '@mui/icons-material/Stars';
import ClassIcon from '@mui/icons-material/Class';
import PublicIcon from '@mui/icons-material/Public';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { MuiFileInput } from 'mui-file-input'
import StatusContext from '../status/StatusContext';


export default function PlanOverview(props) {
    const theme = useTheme();

    const [editingValue, setEditingValue] = useState();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isOpenStatusDialog, setIsOpenStatusDialog] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);

    const { appStatus, setAppStatus } = useContext(StatusContext);

    function handleEditTitleStart() {
        setIsEditingTitle(true);
        setEditingValue(props.plan.info.title);
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
        props.updatePlan({
            ...props.plan,
            info: {
                ...props.plan.info,
                title: editingValue
            }
        });
        // TODO: Send new title to backend
    }

    function handleEnterPress(e) {
        if (e.key === "Enter") {
            handleEditTitleSubmit();
        }
    }

    function handleEditStatusStart() {
        setIsOpenStatusDialog(true);
        setEditingValue(props.plan.status);
    }

    function handleStatusDialogConfirm() {
        setIsOpenStatusDialog(false);
        props.updatePlan({
            ...props.plan,
            status: editingValue
        });
        // TODO: Send new status to backend
    }

    const handleFileChange = (newFile) => {
        setFile(newFile)
    }

    const handleImageUpload = () => {
        if (!file) {
            setFileError("Please select a file to upload");
            return;
        }

        // TODO: Upload file to backend
        console.log("File uploaded", file);
        setAppStatus({ open: true, severity: "info", message: "Image uploaded" });
        
        setFileError(null);
        setFile(null);
    }

    return (
        <Grid container component="header" id="description-section" columnSpacing={4} rowSpacing={2}>
            <Grid item size={{ xs: 12, md: 6 }} display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" flexWrap={"wrap"}>
                    <Box display="flex" gap={1}>

                        {/* TITLE */}
                        {isEditingTitle ? (
                            <>
                                <TextField
                                    variant='standard'
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    sx={{ minWidth: "300px" }}
                                    onKeyDown={handleEnterPress}
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
                            </>
                        ) : (
                            <>
                                <Typography variant="h1">{props.plan.info.title}</Typography>
                                <IconButton onClick={handleEditTitleStart}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {/* STATUS */}
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography color='grey'>{props.plan.status}</Typography>
                        <IconButton onClick={handleEditStatusStart}>
                            {props.plan.status === "Private" && <VisibilityOffIcon />}
                            {props.plan.status === "Restricted" && <LockPersonIcon />}
                            {props.plan.status === "Public" && <PublicIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {error && <Alert severity="warning">{error}</Alert>}

                <Typography variant="normal">{props.plan.info.description}</Typography>

                {/* QUICK STATS */}
                <Box p={3} sx={{ backgroundColor: theme.palette.primary.dark, borderRadius: '10px' }}>
                    <Typography variant="h3" color="white">Quick Stats</Typography>
                    <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.plan.calculatedStats.totalDays}</Typography>
                            <Typography fontSize="1.2rem" color='white'>{props.plan.calculatedStats > 1 ? "days" : "day"}</Typography>
                        </Box>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.plan.calculatedStats.totalActivities}</Typography>
                            <Typography fontSize="1.2rem" color='white'>{props.plan.calculatedStats.totalActivities > 1 ? "activities" : "activity"}</Typography>
                        </Box>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.plan.calculatedStats.totalBudget}</Typography>
                            <Typography fontSize="1.2rem" color='white'>budget</Typography>
                        </Box>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.plan.calculatedStats.totalDrivingDistance}</Typography>
                            <Typography fontSize="1.2rem" color='white'>driving</Typography>
                        </Box>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.plan.calculatedStats.totalHikingDistance}</Typography>
                            <Typography fontSize="1.2rem" color='white'>hiking</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* SOCIAL STATS */}
                <Box
                    p={3}
                    display="flex" gap={3} flexWrap={"wrap"}
                    sx={{ backgroundColor: theme.palette.primary.medium, borderRadius: '10px' }}
                >
                    <Box display="flex" alignItems="center" gap={1} color="white">
                        <StarsIcon />
                        <Typography color='white'>
                            {props.plan.socialStats.likes} {props.plan.socialStats.likes > 1 ? "likes" : "like"}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} color="white">
                        <ClassIcon />
                        <Typography color='white'>
                            Saved by {props.plan.socialStats.saves} {props.plan.socialStats.saves > 1 ? "members" : "member"}
                        </Typography>
                    </Box>
                </Box>
            </Grid>

            {/* FEATURED IMAGE */}
            <Grid item size={{ xs: 12, md: 6 }}>
                {props.plan.info.image ? (
                    <Box component="figure" sx={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", borderRadius: "10px" }}>
                        <Box component="img" src={props.plan.info.image} alt="Travel Plan" width="100%" />
                    </Box>
                ) : (
                    <Box sx={{
                        width: "100%", aspectRatio: { xs: "4/2", md: "4/3" },
                        backgroundColor: theme.palette.primary.light,
                        background: "repeating-linear-gradient( -45deg, #fff, #fff 5px, #f7f7f7 5px, #f7f7f7 25px )",
                        borderRadius: "10px",
                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2
                    }}>
                        <MuiFileInput
                            placeholder="Upload an image"
                            value={file}
                            onChange={handleFileChange}
                            inputProps={{ accept: '.png, .jpeg' }}
                            clearIconButtonProps={{
                                title: "Remove",
                                children: <CloseIcon fontSize="small" />
                            }}
                            sx={{ width: { xs: "80%", sm: "50%" } }}
                        />
                        {fileError && <Alert severity="warning">{fileError}</Alert>}
                        {file &&
                            <Button variant="blackOverGrey" startIcon={<FileUploadIcon />} onClick={handleImageUpload}>
                                Upload
                            </Button>
                        }
                    </Box>
                )}
            </Grid>

            {/* STATUS DIALOG */}
            <ConfirmDialog
                open={isOpenStatusDialog}
                onClose={() => setIsOpenStatusDialog(false)}
                title="Change status"
                confirm={handleStatusDialogConfirm}
                cancel={() => setIsOpenStatusDialog(false)}
            >
                <FormControl>
                    <RadioGroup
                        aria-labelledby="radio-buttons-status-label"
                        defaultValue={editingValue}
                        name="radio-buttons-status-group"
                        onChange={(e) => setEditingValue(e.target.value)}
                    >
                        <FormControlLabel value="Private" control={<Radio />} label="Private" />
                        <Typography variant="notice" sx={{ mb: 2 }} >Only you can see this plan</Typography>
                        <FormControlLabel value="Restricted" control={<Radio />} label="Restricted" />
                        <Typography variant="notice" sx={{ mb: 2 }}>Only your friends can see this plan</Typography>
                        <FormControlLabel value="Public" control={<Radio />} label="Public" />
                        <Typography variant="notice" sx={{ mb: 2 }}>Everyone can see this plan (pending moderation)</Typography>
                    </RadioGroup>
                </FormControl>
            </ConfirmDialog>

        </Grid>
    )
}