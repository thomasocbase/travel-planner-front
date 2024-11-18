import React, { useState, useEffect } from "react";
import { Box, Button, Container, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import ky from "ky";

export default function AdminUsers() {
    const theme = useTheme();

    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await ky.get(import.meta.env.VITE_API_URI + '/admin/users', {
                credentials: 'include'
            }).json();

            console.log(response);
            setRows(response);
        } catch (error) {
            console.error('Something went wrong. ' + error.message);
        }
    }

    return (
        <>
            <Typography variant='h1' align="center">Admin Users</Typography>

            <Container maxWidth='lg' sx={{ minHeight: "80vh" }}>
                <TableContainer>
                    <Table aria-label="Users table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">Role</TableCell>
                                <TableCell align="right">Username</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.email}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row._id}</TableCell>
                                    <TableCell align="right">{row.role}</TableCell>
                                    <TableCell align="right">{row.username}</TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }} >
                                            <Button variant="blackOverGrey">Edit</Button>
                                            <Button variant="contained" sx={{
                                                color: "white",
                                                border: "2px solid #CC1414",
                                                backgroundColor: "#CC1414",
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    color: 'black',
                                                    border: "2px solid #CC1414",
                                                },
                                            }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}