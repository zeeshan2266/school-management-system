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
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {api, selectSchoolDetails} from '../../../../common';
import {useSelector} from "react-redux"; // Adjust the import according to your setup

function EventManagement() {
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventStart, setNewEventStart] = useState('');
    const [newEventEnd, setNewEventEnd] = useState('');
    const [newEventAllDay, setNewEventAllDay] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingEventTitle, setEditingEventTitle] = useState('');
    const [editingEventStart, setEditingEventStart] = useState('');
    const [editingEventEnd, setEditingEventEnd] = useState('');
    const [editingEventAllDay, setEditingEventAllDay] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        fetchEvents(schoolId, session);
    }, []);

    const fetchEvents = (schoolId, session) => {
        api.get('/api/master/events', {
            params: {schoolId, session}
        })
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error fetching events:', error));
    };
    const isPastDate = (date) => {
        return new Date(date) < new Date();
    };
    const handleAddEvent = () => {
        if (!newEventTitle.trim() || !newEventStart) {
            alert("Event title and start date/time cannot be blank."); // Error feedback
            return;
        }
        if (!newEventAllDay && !newEventEnd) {
            alert("End date/time cannot be blank for non-all-day events."); // Error feedback
            return;
        }
        if (isPastDate(newEventStart) || (!newEventAllDay && isPastDate(newEventEnd))) {
            alert("Start and end dates cannot be in the past.");
            return;
        }
        const newEvent = {
            title: newEventTitle,
            start: newEventStart,
            end: newEventAllDay ? null : newEventEnd,
            allDay: newEventAllDay,
            schoolId: schoolId,
            session: session,
        };

        api.post('/api/master/events', newEvent)
            .then(response => {
                setEvents([...events, response.data]);
                resetEventForm();
            })
            .catch(error => console.error('Error adding event:', error));
    };

    const handleEditEvent = (event) => {
        setEditingEventId(event.id);
        setEditingEventTitle(event.title);
        setEditingEventStart(event.start);
        setEditingEventEnd(event.end);
        setEditingEventAllDay(event.allDay);
    };

    const handleUpdateEvent = () => {
        if (!editingEventTitle.trim() || !editingEventStart) {
            alert("Event title and start date/time cannot be blank."); // Error feedback
            return;
        }
        if (!editingEventAllDay && !editingEventEnd) {
            alert("End date/time cannot be blank for non-all-day events."); // Error feedback
            return;
        }
        if (isPastDate(editingEventStart) || (!editingEventAllDay && isPastDate(editingEventEnd))) {
            alert("Start and end dates cannot be in the past.");
            return;
        }
        const updatedEvent = {
            title: editingEventTitle,
            start: editingEventStart,
            end: editingEventAllDay ? null : editingEventEnd,
            allDay: editingEventAllDay,
            schoolId: schoolId,
            session: session,

        };

        api.put(`/api/master/events/${editingEventId}`, updatedEvent)
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === editingEventId ? response.data : event
                );
                setEvents(updatedEvents);
                resetEventForm();
            })
            .catch(error => console.error('Error updating event:', error));
    };

    const handleDeleteEvent = (id) => {
        setConfirmDeleteId(id);
        setOpenDialog(true);
    };
    //     api.delete(`/api/master/events/${id}`)
    //         .then(() => {
    //             setEvents(events.filter(event => event.id !== id));
    //         })
    //         .catch(error => console.error('Error deleting event:', error));
    // };
    const confirmDelete = () => {
        if (confirmDeleteId) {
            api.delete(`/api/master/events/${confirmDeleteId}`)
                .then(() => {
                    setEvents(events.filter(event => event.id !== confirmDeleteId));
                    setSnackbarMessage('Event deleted successfully!');
                    setOpenSnackbar(true);
                    setOpenDialog(false);
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                    setOpenDialog(false);
                });
        }
    };

    const resetEventForm = () => {
        setEditingEventId(null);
        setEditingEventTitle('');
        setEditingEventStart('');
        setEditingEventEnd('');
        setEditingEventAllDay(false);
        setNewEventTitle('');
        setNewEventStart('');
        setNewEventEnd('');
        setNewEventAllDay(false);
    };
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Event Management
            </Typography>
            <Grid container spacing={3}>
                {/* Left side for adding or editing events */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInLeft 1s'}}>
                        <Typography variant="h6" gutterBottom>
                            {editingEventId ? 'Edit Event' : 'Add New Event'}
                        </Typography>
                        <TextField
                            label="Event Title"
                            value={editingEventId ? editingEventTitle : newEventTitle}
                            onChange={(e) =>
                                editingEventId
                                    ? setEditingEventTitle(e.target.value)
                                    : setNewEventTitle(e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                        />
                        <TextField
                            label="Start Date & Time"
                            type="datetime-local"
                            value={editingEventId ? editingEventStart : newEventStart}
                            onChange={(e) =>
                                editingEventId
                                    ? setEditingEventStart(e.target.value)
                                    : setNewEventStart(e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {!newEventAllDay && !editingEventAllDay && (
                            <TextField
                                label="End Date & Time"
                                type="datetime-local"
                                value={editingEventId ? editingEventEnd : newEventEnd}
                                onChange={(e) =>
                                    editingEventId
                                        ? setEditingEventEnd(e.target.value)
                                        : setNewEventEnd(e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                sx={{marginBottom: 2}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editingEventId ? editingEventAllDay : newEventAllDay}
                                    onChange={(e) =>
                                        editingEventId
                                            ? setEditingEventAllDay(e.target.checked)
                                            : setNewEventAllDay(e.target.checked)
                                    }
                                />
                            }
                            label="All Day Event"
                        />
                        <Button
                            onClick={editingEventId ? handleUpdateEvent : handleAddEvent}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            {editingEventId ? 'Update Event' : 'Add Event'}
                        </Button>
                    </Paper>
                </Grid>

                {/* Right side for displaying events */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}
                           sx={{padding: 3, animation: 'fadeInRight 1s', maxHeight: '60vh', overflow: 'auto'}}>
                        <Typography variant="h6" gutterBottom>
                            Existing Events
                        </Typography>
                        <List>
                            {events.map((event) => (
                                <ListItem
                                    key={event.id}
                                    sx={{
                                        transition: 'transform 0.3s',
                                        '&:hover': {transform: 'scale(1.05)'},
                                    }}
                                >
                                    <ListItemText
                                        primary={event.title}
                                        secondary={event.allDay
                                            ? 'All Day'
                                            : `${event.start} - ${event.end}`}
                                    />
                                    <IconButton onClick={() => handleEditEvent(event)} color="primary">
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteEvent(event.id)} color="secondary">
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            {/* Snackbar for notifications */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}} // Position at the top center

            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
                    Events deleted successfully!

                </Alert>
            </Snackbar>
            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {/* CSS for animations */}
            <style>
                {`
                    @keyframes fadeInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes fadeInRight {
                        from {
                            opacity: 0;
                            transform: translateX(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `}
            </style>
        </Container>
    );
}

export default EventManagement;
