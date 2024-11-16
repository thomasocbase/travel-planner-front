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
import ky from 'ky';
import { useDebounce } from 'use-debounce';

export default function PlanOverview(props) {
    const theme = useTheme();

    const [editingValue, setEditingValue] = useState();
    const [debouncedEditingValue] = useDebounce(editingValue, 500);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isOpenStatusDialog, setIsOpenStatusDialog] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);

    const { appStatus, setAppStatus } = useContext(StatusContext);

    function handleEditTitleStart() {
        setIsEditingTitle(true);
        setEditingValue(props.plan.title);
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

        updatePlan({ ...props.plan, title: editingValue });
        setError(null);
        setIsEditingTitle(false);
        props.updatePlanState({
            ...props.plan,
            title: editingValue
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
        setEditingValue(props.plan.planVisibilityState);
    }

    function handleEditDescStart() {
        setIsEditingDescription(true);
        setEditingValue(props.plan.description);
    }

    function handleEditDescCancel() {
        setIsEditingDescription(false);
        setEditingValue(null);
    }

    function handleEditDescSubmit() {
        updatePlan({ ...props.plan, description: editingValue });
        setIsEditingDescription(false);
        props.updatePlanState({
            ...props.plan,
            description: editingValue
        });
    }

    async function updatePlan(data) {
        // TODO: TEST ENDPOINT
        try {
            const response = await ky.put('http://localhost:3000/api' + '/plan/' + props.plan._id, {
                json: { ...data }
            }).json();

            setAppStatus({ open: true, severity: 'success', message: 'Plan updated' });
        } catch (error) {
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. ' + error.message });
        }
    }

    function handleStatusDialogConfirm() {
        updatePlan({ ...props.plan, planVisibilityState: editingValue });
        setIsOpenStatusDialog(false);
        props.updatePlanState({
            ...props.plan,
            planVisibilityState: editingValue
        });
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
        setAppStatus({ open: true, severity: "success", message: "Image uploaded" });

        setFileError(null);
        setFile(null);
    }

    return (
        <Grid container component="header" id="description-section" columnSpacing={4} rowSpacing={2}>
            <Grid item size={{ xs: 12, md: 6 }} display="flex" flexDirection="column" gap={3}>
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
                                <Typography variant="h1">{props.plan.title}</Typography>
                                <IconButton onClick={handleEditTitleStart}>
                                    <EditIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {/* STATUS */}
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography color='grey'>{props.plan.planVisibilityState}</Typography>
                        <IconButton onClick={handleEditStatusStart}>

                            {props.plan.visibilityState === "private" && <VisibilityOffIcon />}
                            {props.plan.visibilityState === "unlisted" && <LockPersonIcon />}
                            {props.plan.visibilityState === "public" && <PublicIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {error && <Alert severity="warning">{error}</Alert>}

                {/* DESCRIPTION */}
                {isEditingDescription ? (
                    <>
                        <TextField
                            multiline
                            rows={6}
                            label="Description (max 500 characters)"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                        />
                        <Box display="flex" gap={1}>
                            <IconButton onClick={handleEditDescCancel}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton onClick={handleEditDescSubmit}>
                                <DoneIcon sx={{ color: theme.palette.primary.secondary }} />
                            </IconButton>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" gap={1} alignItems="center">
                        <Typography variant="normal">{props.plan.description}</Typography>
                        <IconButton onClick={handleEditDescStart}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                )}

                {/* QUICK STATS */}
                <Box p={3} sx={{ backgroundColor: theme.palette.primary.dark, borderRadius: '10px' }}>
                    <Typography variant="h3" color="white">Quick Stats</Typography>
                    <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mt={2}>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.stats.totalDays}</Typography>
                            <Typography fontSize="1.2rem" color='white'>{props.stats.totalDays > 1 ? "days" : "day"}</Typography>
                        </Box>
                        <Typography color='white'>●</Typography>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.stats.totalActivities}</Typography>
                            <Typography fontSize="1.2rem" color='white'>{props.stats.totalActivities > 1 ? "activities" : "activity"}</Typography>
                        </Box>
                        <Typography color='white'>●</Typography>
                        <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontSize="2rem" color='white'>{props.stats.totalBudget}</Typography>
                            <Typography fontSize="1.2rem" color='white'>€ budget</Typography>
                        </Box>
                        {props.stats.totalDrivingDistance > 0 && (
                            <>
                                <Typography color='white'>●</Typography>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{props.stats.totalDrivingDistance}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>km driving</Typography>
                                </Box>
                            </>
                        )}
                        {props.stats.totalHikingDistance > 0 && (
                            <>
                                <Typography color='white'>●</Typography>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{props.stats.totalHikingDistance}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>km hiking</Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                {/* SOCIAL STATS */}
                <Box
                    p={1}
                    display="flex" gap={4} flexWrap={"wrap"}
                >
                    <Box display="flex" alignItems="center" gap={1} S>
                        <StarsIcon sx={{ fontSize: "2rem" }} />
                        <Typography >
                            {props.stats.likes} {props.stats.likes > 1 ? "likes" : "like"}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ClassIcon sx={{ fontSize: "2rem" }} />
                        <Typography>
                            Saved by {props.stats.saves} {props.stats.saves > 1 ? "members" : "member"}
                        </Typography>
                    </Box>
                </Box>
            </Grid>

            {/* FEATURED IMAGE */}
            <Grid item size={{ xs: 12, md: 6 }}>
                {props.plan.image ? (
                    <Box component="figure" sx={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", borderRadius: "10px" }}>
                        <Box component="img" src={props.plan.image} alt="Travel Plan" width="100%" />
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
                            sx={{ width: { xs: "80%", sm: "50%" }, backgroundColor: "white" }}
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
                        <FormControlLabel value="67292c7e3e797b9c6565b1b2" control={<Radio />} label="Private" />
                        <Typography variant="notice" sx={{ mb: 2 }} >Only you can see this plan</Typography>
                        <FormControlLabel value="67292c7e3e797b9c6565b1ae" control={<Radio />} label="Unlisted" />
                        <Typography variant="notice" sx={{ mb: 2 }}>This plan is accessible by anyone via direct link</Typography>
                        <FormControlLabel value="67292c7e3e797b9c6565b1ab" control={<Radio />} label="Public" />
                        <Typography variant="notice" sx={{ mb: 2 }}>This plan is listed in the public directory (pending moderation)</Typography>
                    </RadioGroup>
                </FormControl>
            </ConfirmDialog>

        </Grid>
    )
}