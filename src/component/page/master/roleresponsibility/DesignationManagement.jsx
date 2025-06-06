import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDispatch, useSelector} from 'react-redux';
import {createRole, deleteRole, fetchRoles} from "./redux/roleActions";
import {selectSchoolDetails} from "../../../../common";

function DesignationManagement() {
    const [newRole, setNewRole] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null); // ID of the role to delete

    const [roleType, setRoleType] = useState('Teaching'); // Default to Teaching
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const roles = useSelector((state) => state.roles.roles);

    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchRoles(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddRole = () => {
        if (!newRole.trim()) {
            setError('Designation cannot be blank.');
            return;
        }
        const isDuplicate = roles.some(
            (role) => role.name.toLowerCase().trim() === newRole.toLowerCase().trim()
        );
        if (isDuplicate) {
            setError('This designation already exists.');
            return;
        }
        const capitalizeWords = (str) =>
            str
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

        // Example Usage:
        setNewRole(capitalizeWords(newRole.trim()));
        const schoolId = userData?.id;
        const roleData = {
            name: newRole.trim(),
            type: roleType, // Include role type
            schoolId,
            session,
        };
        dispatch(createRole(roleData));
        setNewRole('');
        setRoleType('Teaching'); // Reset to default
        setError(''); // Clear error
    };

    const handleDeleteRole = (id) => {
        dispatch(deleteRole(id));
    };
    const handleOpenDialog = (id) => {
        setRoleToDelete(id);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setRoleToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (roleToDelete) {
            dispatch(deleteRole(roleToDelete))
                .then(() => {
                    setSnackbarMessage("Designation deleted successfully.");
                    setSnackbarOpen(true);
                    handleCloseDialog(); // Close dialog after deletion
                })
                .catch((error) => {
                    console.error('Error deleting designation:', error);
                    setSnackbarMessage("Failed to delete the designation. Please try again.");
                    setSnackbarOpen(true);
                    handleCloseDialog(); // Close dialog even on error
                });
        }
    };
    const handleNewRoleChange = (e) => {
        setNewRole(e.target.value);
        if (error) {
            setError(''); // Clear error when user starts typing
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Designation Management
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInLeft 1s'}}>
                        <FormControl fullWidth variant="outlined" sx={{marginBottom: 2}}>
                            <InputLabel>Role Type</InputLabel>
                            <Select
                                value={roleType}
                                onChange={(e) => setRoleType(e.target.value)}
                                label="Role Type"
                            >
                                <MenuItem value="Teaching">Teaching</MenuItem>
                                <MenuItem value="Non-Teaching">Non-Teaching</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="h6" gutterBottom sx={{marginTop: 3}}>
                            Add New Designation
                        </Typography>

                        <TextField
                            label="New Role"
                            value={newRole}
                            onChange={handleNewRoleChange}
                            fullWidth
                            variant="outlined"
                            error={!!error}
                            helperText={error}
                            sx={{marginBottom: 2}}
                        />
                        <Button onClick={handleAddRole} variant="contained" color="primary" fullWidth>
                            Add Designation
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInRight 1s'}}>
                        <Typography variant="h6" gutterBottom>
                            Existing Designation
                        </Typography>
                        <List>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <ListItem key={role.id}>
                                        <ListItemText primary={role.name}/>
                                        <IconButton onClick={() => handleOpenDialog(role.id)} color="secondary">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No designations available.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            {/* Confirmation Dialog for Deletion */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Designation?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this designation?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Automatically hide after 3 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default DesignationManagement;
