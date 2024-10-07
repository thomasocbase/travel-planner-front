import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import StarsIcon from '@mui/icons-material/Stars';
import ClassIcon from '@mui/icons-material/Class';
import PlanInternalNav from '../components/PlanInternalNav';
import ConfirmDialog from '../components/ConfirmDialog';
import PublicIcon from '@mui/icons-material/Public';
import ScrollSpy from "react-ui-scrollspy";

function TravelPlan() {
    const theme = useTheme();

    const [editingValue, setEditingValue] = useState();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isOpenStatusDialog, setIsOpenStatusDialog] = useState(false);

    const [plan, setPlan] = useState({
        info: {
            title: "My Travel Plan Title",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
            image: "https://picsum.photos/800/600",
        },
        status: "Private",
        calculatedStats: {
            totalBudget: 0,
            totalDays: 0,
            totalActivities: 0,
            totalDrivingDistance: 0,
            totalHikingDistance: 0,
        },
        socialStats: {
            likes: 5,
            saves: 2,
        }
    });

    function handleEditTitleStart() {
        setIsEditingTitle(true);
        setEditingValue(plan.info.title);
    }

    function handleEditTitleSubmit() {
        setIsEditingTitle(false);
        setPlan({
            ...plan,
            info: {
                ...plan.info,
                title: editingValue
            }
        });
        // TODO: Send new title to backend
    }

    function handleEditStatusStart() {
        setIsOpenStatusDialog(true);
        setEditingValue(plan.status);
    }

    function handleStatusDialogConfirm() {
        setIsOpenStatusDialog(false);
        setPlan({
            ...plan,
            status: editingValue
        });
        // TODO: Send new status to backend

    }

    console.log("travelPlan", plan);
    console.log("EditingValue", editingValue);

    return (
        <Box component="main">

            {/* INFOS SECTION */}
            <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }}>

                <Grid container component="header" id="description-section" columnSpacing={4} rowSpacing={2}>
                    <Grid item size={{ xs: 12, md: 6 }} display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" justifyContent="space-between" flexWrap={"wrap"}>
                            <Box display="flex" gap={1}>
                                {isEditingTitle ? (
                                    <>
                                        <TextField
                                            variant='standard'
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            sx={{ minWidth: "300px" }}
                                        />
                                        <IconButton onClick={handleEditTitleSubmit}>
                                            <DoneIcon sx={{ color: theme.palette.primary.secondary }} />
                                        </IconButton>
                                        <IconButton onClick={() => setIsEditingTitle(false)} >
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h2">{plan.info.title}</Typography>
                                        <IconButton onClick={handleEditTitleStart}>
                                            <EditIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography color='grey'>{plan.status}</Typography>
                                <IconButton onClick={handleEditStatusStart}>
                                    {plan.status === "Private" && <VisibilityOffIcon />}
                                    {plan.status === "Restricted" && <LockPersonIcon />}
                                    {plan.status === "Public" && <PublicIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                        <Typography variant="normal">{plan.info.description}</Typography>
                        <Box p={3} sx={{ backgroundColor: theme.palette.primary.dark, borderRadius: '15px' }}>
                            <Typography variant="h3" color="white">Quick Stats</Typography>
                            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{plan.calculatedStats.totalDays}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>{plan.calculatedStats > 1 ? "days" : "day"}</Typography>
                                </Box>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{plan.calculatedStats.totalActivities}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>{plan.calculatedStats.totalActivities > 1 ? "activities" : "activity"}</Typography>
                                </Box>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{plan.calculatedStats.totalBudget}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>budget</Typography>
                                </Box>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{plan.calculatedStats.totalDrivingDistance}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>driving</Typography>
                                </Box>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                    <Typography fontSize="2rem" color='white'>{plan.calculatedStats.totalHikingDistance}</Typography>
                                    <Typography fontSize="1.2rem" color='white'>hiking</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            p={3}
                            display="flex" gap={3} flexWrap={"wrap"}
                            sx={{ backgroundColor: theme.palette.primary.medium, borderRadius: '15px' }}
                        >
                            <Box display="flex" alignItems="center" gap={1} color="white">
                                <StarsIcon />
                                <Typography color='white'>
                                    {plan.socialStats.likes} {plan.socialStats.likes > 1 ? "likes" : "like"}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1} color="white">
                                <ClassIcon />
                                <Typography color='white'>
                                    Saved by {plan.socialStats.saves} {plan.socialStats.saves > 1 ? "members" : "member"}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box component="figure" sx={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", borderRadius: "15px" }}>
                            <Box component="img" src={plan.info.image} alt="Travel Plan" width="100%" />
                        </Box>
                    </Grid>

                </Grid>

            </Container>

            {/* ANCHOR NAV */}
            <PlanInternalNav />

            <ScrollSpy>

            {/* BUCKET LIST */}
            <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }}>
                <Typography variant="h2">Bucket list</Typography>
                <Box height={500} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '15px' }} />
            </Container>

            {/* BUCKET LIST */}
            <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }}>
                <Typography variant="h2">Bucket list</Typography>
                <Box height={500} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '15px' }} />
            </Container>

            {/* BUCKET LIST */}
            <Container component="section" maxWidth="lg" sx={{ my: 2, px: 2 }}>
                <Typography variant="h2">Bucket list</Typography>
                <Box height={500} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '15px' }} />
            </Container>
            </ScrollSpy>


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

        </Box>
    );
}

export default TravelPlan;