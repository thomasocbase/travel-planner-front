import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import StatusContext from "../status/StatusContext";

export default function RestrictedRoute({ user, children }) {
    const { setAppStatus } = useContext(StatusContext);
    if (!user.isLoggedIn) {
        setAppStatus({ open: true, severity: 'warning', message: 'You must be logged in to access this page' });
        return <Navigate to="/login" />;
    }

    return children;
}