import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import {sessionOptions} from "../../../../commonStyle";

const PromotionSchool = () => {
    const [toSessionYear, setToSessionYear] = useState('');
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);

    // Access the schools list from userData (assuming userData.schools contains the list)
    const schools = userData || []; // Fallback to empty array if schools is undefined

    useEffect(() => {
        console.log("Schools: ", schools); // Check the value of schools
    }, [schools]);

    // Handle session year change
    const handleSessionChange = (e) => {
        setToSessionYear(e.target.value);
    };

    // Handle school selection
    const handleSchoolSelect = (schoolId) => {
        setSelectedSchools((prev) =>
            prev.includes(schoolId)
                ? prev.filter((id) => id !== schoolId)
                : [...prev, schoolId]
        );
    };

    // Handle select all schools
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedSchools(schools.map((school) => school.id));
        } else {
            setSelectedSchools([]);
        }
    };

    // Handle update action
    const handleUpdate = async () => {
        if (!toSessionYear) {
            alert('Please select a session year!');
            return;
        }
        if (selectedSchools.length === 0) {
            alert('Please select at least one school!');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                session: toSessionYear,
                schoolIds: selectedSchools,
            };
            await api.post('/api/promoteSchools', payload); // Replace with your API endpoint
            alert('Session updated successfully!');
        } catch (error) {
            console.error('Error updating session:', error);
            alert('Failed to update session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>
                School Promotion
            </Typography>
            <Grid container spacing={2}>
                {/* Left Side */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel>To Session Year</InputLabel>
                        <Select value={toSessionYear} onChange={handleSessionChange}>
                            {sessionOptions.map((year) => (
                                <MenuItem key={year.value} value={year.label}>
                                    {year.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleUpdate}
                        disabled={loading || !toSessionYear || selectedSchools.length === 0}
                    >
                        {loading ? 'Updating...' : 'Update Selected Schools'}
                    </Button>
                </Grid>

                {/* Right Side */}
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            p: 2,
                        }}
                    >
                        <List>
                            <ListItem
                                key={schools.id}
                                dense
                                button
                                onClick={() => handleSchoolSelect(schools.id)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedSchools.includes(schools.id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={schools.name}
                                    secondary={`Address: ${schools.city}  ${schools.district} ${schools.state} ${schools.pincode}`}
                                />
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionSchool;
