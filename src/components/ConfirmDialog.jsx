import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

function ConfirmDialog(props) {
    const theme = useTheme();

    return (
        <Dialog open={props.open} onClose={props.onClose} scroll="paper" maxWidth="xs" fullWidth>
            <DialogTitle sx={{ backgroundColor: theme.palette.primary.dark }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" color='white'>{props.title}</Typography>
                    <IconButton onClick={props.cancel}>
                        <CloseIcon fontSize="medium" sx={{ color: "grey" }} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    {props.children}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.cancel} variant='greyOverTransparent'>Cancel</Button>
                <Button onClick={props.confirm} variant='darkOverYellow'>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;