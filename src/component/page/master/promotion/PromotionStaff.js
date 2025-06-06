import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios'; // Import axios for API calls
import {selectSchoolDetails} from '../../../../common';
import {sessionOptions} from '../../../../commonStyle';

const PromotionStaff = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    const [toSessionYear, setToSessionYear] = useState('');
    const [selectedStaff, setSelectedStaff] = useState([]);
    const staff = useSelector((state) => state.master.data?.staff || []);

    // Handle staff selection
    const handleStaffSelect = (staffId) => {
        setSelectedStaff((prev) =>
            prev.includes(staffId)
                ? prev.filter((id) => id !== staffId)
                : [...prev, staffId]
        );
    };

    // Handle select all staff
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedStaff(staff.map((member) => member.id));
        } else {
            setSelectedStaff([]);
        }
    };

    // Handle promotion action
    const handlePromote = async () => {
        if (!toSessionYear) {
            alert('Please select a session year to promote!');
            return;
        }
        if (selectedStaff.length === 0) {
            alert('Please select at least one staff to promote!');
            return;
        }

        const payload = {
            session: toSessionYear,
            staffIds: selectedStaff,
            schoolId: schoolId
        };

        try {
            // Example API call using axios
            const response = await axios.post('/api/promoteStaff', payload);
            console.log('Promotion Success:', response.data);
            alert('Staff promoted successfully!');
        } catch (error) {
            console.error('Promotion Failed:', error);
            alert('An error occurred while promoting staff. Please try again.');
        }
    };

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>
                Staff Promotion
            </Typography>
            <Grid container spacing={2}>
                {/* Left Side */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel>To Session Year</InputLabel>
                        <Select
                            value={toSessionYear}
                            onChange={(e) => setToSessionYear(e.target.value)}
                        >
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
                        onClick={handlePromote}
                    >
                        Promote Selected Staff
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
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                            <Checkbox
                                checked={selectedStaff.length === staff.length && staff.length > 0}
                                indeterminate={
                                    selectedStaff.length > 0 &&
                                    selectedStaff.length < staff.length
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            <Typography>Select All</Typography>
                        </Box>
                        <Divider sx={{mb: 2}}/>
                        <List>
                            {staff.map((member) => (
                                <ListItem
                                    key={member.id}
                                    dense
                                    button
                                    onClick={() => handleStaffSelect(member.id)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedStaff.includes(member.id)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={member.name} secondary={member.role}/>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionStaff;
