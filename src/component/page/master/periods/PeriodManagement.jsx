import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDispatch, useSelector} from 'react-redux';
import {createPeriod, deletePeriod, fetchPeriods} from './redux/periodActions';
import {selectSchoolDetails} from '../../../../common';

// import {fetchStaff} from "../../staff/redux/staffActions";

function PeriodManagement() {
    const [newPeriod, setNewPeriod] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const dispatch = useDispatch();
    const periods = useSelector((state) => state?.period?.periods || []);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchPeriods(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddPeriod = () => {
        if (!newPeriod.trim()) {
            alert("Period name cannot be blank."); // Feedback for empty period name
            return; // Stop the submission process
        }
        const schoolId = userData?.id;
        const periodData = {
            name: newPeriod,
            schoolId: schoolId,
            session
        };
        dispatch(createPeriod(periodData));
        setNewPeriod('');
    };

    const handleDeletePeriod = (id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this period?");
        if (confirmDelete) {
            dispatch(deletePeriod(id))
                .then(() => {
                    // Show success message after deletion
                    setSnackbarMessage("Period deleted successfully.");
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    // Handle error if deletion fails
                    console.error('Error deleting period:', error);
                    setSnackbarMessage("Failed to delete the period. Please try again.");
                    setSnackbarOpen(true);
                });
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Class Period Management
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInLeft 1s'}}>
                        <Typography variant="h6" gutterBottom>
                            Add New Period
                        </Typography>
                        <TextField
                            label="New Period"
                            value={newPeriod}
                            onChange={(e) => setNewPeriod(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                        />
                        <Button onClick={handleAddPeriod} variant="contained" color="primary" fullWidth>
                            Add Period
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInRight 1s'}}>
                        <Typography variant="h6" gutterBottom>
                            Existing Periods
                        </Typography>
                        <List
                            sx={{
                                maxHeight: 400, // Adjust the height as needed
                                overflowY: 'auto',
                                padding: 0,
                                '&::-webkit-scrollbar': {
                                    width: '0.4em',
                                },
                                '&::-webkit-scrollbar-track': {
                                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderRadius: 8,
                                },
                            }}
                        >
                            {periods.map((period) => (
                                <ListItem
                                    key={period.id}
                                    sx={{
                                        transition: 'transform 0.3s',
                                        '&:hover': {transform: 'scale(1.05)'},
                                    }}
                                >
                                    <ListItemText primary={period.name}/>
                                    <IconButton onClick={() => handleDeletePeriod(period.id)} color="secondary">
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Automatically hide after 3 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}} // Positioning the Snackbar at the top center

            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default PeriodManagement;
