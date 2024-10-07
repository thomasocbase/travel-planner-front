import React, { useState } from "react";
import { Alert, Box, Button, FormControl, InputAdornment, Link, TextField, Typography, useTheme } from "@mui/material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';

function SignUp() {
    const theme = useTheme();

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

    function handleRegister() {
        console.log(userInfo);
        validateData();
    }

    return (
        <>
            <Box
                minHeight="90vh"
                display="flex" justifyContent="center" alignItems="center"
                backgroundColor="white"
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
                                            <AlternateEmailIcon sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
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
                                            <BadgeIcon sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
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
                                            <PasswordIcon sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
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
                                            <PasswordIcon sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={(e) => setUserInfo({ ...userInfo, passwordConfirm: e.target.value })}
                        />
                    </FormControl>

                    {/* FEEDBACK MESSAGE */}
                    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                    <Button variant="standard" sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>

                    <Box display="flex" alignItems="baseline" gap={1}>
                        <Typography fontSize="0.8rem" textAlign="center" mt={2} color="white">Already have an account?</Typography>
                        <Link href="/login" color={theme.palette.primary.medium} fontSize="0.8rem">Log in</Link>
                    </Box>

                </Box>
            </Box>
        </>
    );
}

export default SignUp;