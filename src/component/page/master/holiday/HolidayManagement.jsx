import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {api, selectSchoolDetails} from '../../../../common';
import {useSelector} from "react-redux"; // Adjust the import according to your setup

function HolidayManagement() {
    const [holidays, setHolidays] = useState([]);
    const [newHolidayTitle, setNewHolidayTitle] = useState('');
    const [newHolidayStart, setNewHolidayStart] = useState('');
    const [newHolidayEnd, setNewHolidayEnd] = useState('');
    const [newHolidayAllDay, setNewHolidayAllDay] = useState(false);
    const [editingHolidayId, setEditingHolidayId] = useState(null);
    const [editingHolidayTitle, setEditingHolidayTitle] = useState('');
    const [editingHolidayStart, setEditingHolidayStart] = useState('');
    const [editingHolidayEnd, setEditingHolidayEnd] = useState('');
    const [editingHolidayAllDay, setEditingHolidayAllDay] = useState(false);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const today = new Date().toISOString().slice(0, 16);
    useEffect(() => {
        fetchHolidays(schoolId, session);
    }, []);

    const fetchHolidays = (schoolId, session) => {
        api.get('/api/master/holidays', {
            params: {schoolId, session}
        })
            .then(response => setHolidays(response.data))
            .catch(error => console.error('Error fetching holidays:', error));
    };
    const handleAddHoliday = () => {
        // Validate inputs
        if (!newHolidayTitle.trim()) {
            alert("Holiday title cannot be blank."); // Feedback for empty title
            return;
        }
        if (!newHolidayStart) {
            alert("Start date/time cannot be blank."); // Feedback for empty start date
            return;
        }
        if (!newHolidayAllDay && !newHolidayEnd) {
            alert("End date/time cannot be blank for non-all-day holidays."); // Feedback for empty end date
            return;
        }
        const newHoliday = {
            title: newHolidayTitle,
            start: newHolidayStart,
            end: newHolidayAllDay ? null : newHolidayEnd,
            allDay: newHolidayAllDay,
            schoolId: schoolId,
            session: session,
        };

        api.post('/api/master/holidays', newHoliday)
            .then(response => {
                setHolidays([...holidays, response.data]);
                resetHolidayForm();
            })
            .catch(error => console.error('Error adding holiday:', error));
    };

    const handleEditHoliday = (holiday) => {
        setEditingHolidayId(holiday.id);
        setEditingHolidayTitle(holiday.title);
        setEditingHolidayStart(holiday.start);
        setEditingHolidayEnd(holiday.end);
        setEditingHolidayAllDay(holiday.allDay);
    };

    const handleUpdateHoliday = () => {
        // Validate inputs
        if (!editingHolidayTitle.trim()) {
            alert("Holiday title cannot be blank."); // Feedback for empty title
            return;
        }
        if (!editingHolidayStart) {
            alert("Start date/time cannot be blank."); // Feedback for empty start date
            return;
        }
        if (!editingHolidayAllDay && !editingHolidayEnd) {
            alert("End date/time cannot be blank for non-all-day holidays."); // Feedback for empty end date
            return;
        }

        const updatedHoliday = {
            title: editingHolidayTitle,
            start: editingHolidayStart,
            end: editingHolidayAllDay ? null : editingHolidayEnd,
            allDay: editingHolidayAllDay,
            schoolId: schoolId,
            session: session,
        };

        api.put(`/api/master/holidays/${editingHolidayId}`, updatedHoliday)
            .then(response => {
                const updatedHolidays = holidays.map(holiday =>
                    holiday.id === editingHolidayId ? response.data : holiday
                );
                setHolidays(updatedHolidays);
                resetHolidayForm();
            })
            .catch(error => console.error('Error updating holiday:', error));
    };

    const handleDeleteHoliday = (id) => {
        api.delete(`/api/master/holidays/${id}`)
            .then(() => {
                setHolidays(holidays.filter(holiday => holiday.id !== id));
            })
            .catch(error => console.error('Error deleting holiday:', error));
    };

    const resetHolidayForm = () => {
        setEditingHolidayId(null);
        setEditingHolidayTitle('');
        setEditingHolidayStart('');
        setEditingHolidayEnd('');
        setEditingHolidayAllDay(false);
        setNewHolidayTitle('');
        setNewHolidayStart('');
        setNewHolidayEnd('');
        setNewHolidayAllDay(false);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Holiday Management
            </Typography>
            <Grid container spacing={3}>
                {/* Left side for adding or editing holidays */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: 'fadeInLeft 1s'}}>
                        <Typography variant="h6" gutterBottom>
                            {editingHolidayId ? 'Edit Holiday' : 'Add New Holiday'}
                        </Typography>
                        <TextField
                            label="Holiday Title"
                            value={editingHolidayId ? editingHolidayTitle : newHolidayTitle}
                            onChange={(e) =>
                                editingHolidayId
                                    ? setEditingHolidayTitle(e.target.value)
                                    : setNewHolidayTitle(e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                        />
                        <TextField
                            label="Start Date & Time"
                            type="datetime-local"
                            value={editingHolidayId ? editingHolidayStart : newHolidayStart}
                            onChange={(e) =>
                                editingHolidayId
                                    ? setEditingHolidayStart(e.target.value)
                                    : setNewHolidayStart(e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: today // Prevent selecting past dates
                            }}
                        />
                        {!newHolidayAllDay && !editingHolidayAllDay && (
                            <TextField
                                label="End Date & Time"
                                type="datetime-local"
                                value={editingHolidayId ? editingHolidayEnd : newHolidayEnd}
                                onChange={(e) =>
                                    editingHolidayId
                                        ? setEditingHolidayEnd(e.target.value)
                                        : setNewHolidayEnd(e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                sx={{marginBottom: 2}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: editingHolidayStart || newHolidayStart || today // Ensure end date is after start date
                                }}
                            />
                        )}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editingHolidayId ? editingHolidayAllDay : newHolidayAllDay}
                                    onChange={(e) =>
                                        editingHolidayId
                                            ? setEditingHolidayAllDay(e.target.checked)
                                            : setNewHolidayAllDay(e.target.checked)
                                    }
                                />
                            }
                            label="All Day Event"
                        />
                        <Button
                            onClick={editingHolidayId ? handleUpdateHoliday : handleAddHoliday}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            {editingHolidayId ? 'Update Holiday' : 'Add Holiday'}
                        </Button>
                    </Paper>
                </Grid>

                {/* Right side for displaying holidays */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 3,
                            animation: 'fadeInRight 1s',
                            maxHeight: '400px',  // Set the maximum height for the scrollable area
                            overflowY: 'auto'    // Make the content scrollable
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Existing Holidays
                        </Typography>
                        <List>
                            {holidays.map((holiday) => (
                                <ListItem
                                    key={holiday.id}
                                    sx={{
                                        transition: 'transform 0.3s',
                                        '&:hover': {transform: 'scale(1.05)'},
                                    }}
                                >
                                    <ListItemText
                                        primary={holiday.title}
                                        secondary={holiday.allDay
                                            ? 'All Day'
                                            : `${holiday.start} - ${holiday.end}`}
                                    />
                                    <IconButton onClick={() => handleEditHoliday(holiday)} color="primary">
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteHoliday(holiday.id)} color="secondary">
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

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

export default HolidayManagement;
