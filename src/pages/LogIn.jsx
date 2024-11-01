import React, { useState, useContext } from "react";
import { Alert, Box, Button, FormControl, InputAdornment, Link, TextField, Typography, useTheme } from "@mui/material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import ky from "ky";
import { useNavigate } from "react-router-dom";
import StatusContext from "../components/status/StatusContext";

function Login() {
    const theme = useTheme();
    const { setAppStatus } = useContext(StatusContext);
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    function validateData() {
        let isValid = true;

        if (!userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email)) {
            setError('Please enter a valid email');
            isValid = false;
            return isValid;
        }

        if (!userInfo.password) {
            setError('Please enter a password');
            isValid = false;
            return isValid;
        }

        return isValid;
    }

    async function handleLogin() {
        validateData();

        if (validateData()) {
            try {
                const response = await ky.post('http://localhost:3000/api' + '/auth/login', {
                    json: {
                        email: userInfo.email,
                        password: userInfo.password
                    }
                }).json();

                localStorage.setItem('token', response.token);
                setAppStatus({ open: true, severity: 'success', message: 'Logged in successfully' });
                navigate('/');

            } catch (error) {
            console.error(error);
            setAppStatus({ open: true, severity: 'error', message: 'Something went wrong. Are you sure this is the correct password?' });
        }
    }
}

return (
    <>
        <Box
            minHeight="90svh"
            display="flex" justifyContent="center" alignItems="center"
        >
            <Box
                display="flex" flexDirection="column" alignItems="center"
                backgroundColor={theme.palette.primary.dark}
                borderRadius="15px"
                p={5}
                width="350px"
            >
                <Typography component="h1" variant="h3" textAlign="center" mb={3} color="white">Login</Typography>
                <FormControl fullWidth>
                    <TextField
                        id="login-email"
                        name="signin-email"
                        type="email"
                        label="Email"
                        value={userInfo.email}
                        required
                        margin="normal"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon sx={{ color: "white", mr: 1 }} />
                                    </InputAdornment>
                                ),
                                sx: { color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.medium } },
                            },
                        }}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        sx={{ color: "white", "& .MuiFormLabel-root": { color: "white" } }}
                    />
                    <TextField
                        id="login-password"
                        name="signin-password"
                        type="password"
                        label="Password"
                        value={userInfo.password}
                        required
                        margin="normal"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PasswordIcon sx={{ color: "white", mr: 1 }} />
                                    </InputAdornment>
                                ),
                                sx: { color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.medium } },
                            },
                        }}
                        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                        sx={{ color: "white", "& .MuiFormLabel-root": { color: "white" } }}
                    />
                </FormControl>

                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                <Button variant="darkOverYellow" sx={{ mt: 2 }} onClick={handleLogin}>Submit</Button>

                <Box mt={4}>
                    <Typography variant="notice" textAlign="center" mt={2} color="white">
                        Don't have an account yet? &nbsp;
                        <Link href="/login" underline="hover" sx={{ color: theme.palette.primary.secondary, fontSize: "0.9rem" }}>Log in</Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    </>
);
}

export default Login;