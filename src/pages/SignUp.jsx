import React, { useState, useContext } from "react";
import { Alert, Box, Button, FormControl, InputAdornment, Link, TextField, Typography, useTheme } from "@mui/material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import ky from "ky";
import StatusContext from "../components/status/StatusContext";
import { Navigate, useNavigate } from "react-router-dom";

function SignUp() {
    const theme = useTheme();
    const { setAppStatus } = useContext(StatusContext);
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
    });

    const [error, setError] = useState('');

    function validateData() {
        let isValid = true;

        if (!userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email)) {
            setError('Invalid email address');
            isValid = false;
            return isValid;
        }

        if (!userInfo.username || userInfo.username.length < 3) {
            setError('Username must be at least 3 characters long');
            isValid = false;
            return isValid;
        }

        if (!userInfo.password || userInfo.password.length < 6) {
            setError('Password must be at least 6 characters long');
            isValid = false;
            return isValid;
        }

        if (userInfo.password !== userInfo.passwordConfirm) {
            setError('Passwords do not match');
            isValid = false;
            return isValid;
        }

        return isValid;
    }

    async function handleRegister() {
        validateData();

        if (validateData()) {
            try {
                const response = await ky.post('http://localhost:3000/api' + '/auth/register', {
                    json: {
                        email: userInfo.email,
                        username: userInfo.username,
                        password: userInfo.password
                    }
                }).json();
            
                setAppStatus({ open: true, severity: "success", message: response.message });
                setError('');
                navigate('/login');

            } catch (error) {
                console.log(error);
                setAppStatus({ open: true, severity: "error", message: error.message });
            }
        }
    }

    console.log(import.meta.env.VITE_API_URI)

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
                    <Typography component="h1" variant="h3" textAlign="center" mb={3} color="white">Sign Up</Typography>
                    <FormControl fullWidth>
                        <TextField
                            id="register-email"
                            name="signup-email"
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
                            id="register-username"
                            name="signup-username"
                            type="text"
                            label="Username"
                            value={userInfo.username}
                            required
                            margin="normal"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon sx={{ color: "white", mr: 1 }} />
                                        </InputAdornment>
                                    ),
                                    sx: { color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.medium } },
                                },
                            }}
                            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                            sx={{ color: "white", "& .MuiFormLabel-root": { color: "white" } }}
                        />
                        <TextField
                            id="register-password"
                            name="signup-password"
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
                        <TextField
                            id="register-password-confirm"
                            name="signup-password-confirm"
                            type="password"
                            label="Confirm Password"
                            value={userInfo.passwordConfirm}
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
                            onChange={(e) => setUserInfo({ ...userInfo, passwordConfirm: e.target.value })}
                            sx={{ color: "white", "& .MuiFormLabel-root": { color: "white" } }}
                        />
                    </FormControl>

                    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                    <Button variant="darkOverYellow" sx={{ mt: 2 }} onClick={handleRegister}>Submit</Button>

                    <Box mt={4}>
                        <Typography variant="notice" textAlign="center" mt={2} color="white">
                            Already have an account? &nbsp;
                            <Link href="/login" underline="hover" sx={{ color: theme.palette.primary.secondary, fontSize: "0.9rem" }}>Log in</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default SignUp;