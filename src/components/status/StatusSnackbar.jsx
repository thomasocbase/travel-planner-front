import React, { useContext } from 'react';

import StatusContext from './StatusContext';
import { Alert, Snackbar } from '@mui/material';

export default function StatusSnackbar() {
    const { appStatus, setAppStatus } = useContext(StatusContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAppStatus({
            ...appStatus, 
            open: false
        });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={appStatus.open}
            autoHideDuration={5000}
            message="Note archived"
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={appStatus.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {appStatus.message}
            </Alert>
        </Snackbar>
    )
}