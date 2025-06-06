import React, {useState} from 'react';
import {Box, Tab, Tabs} from '@mui/material';
import AttendanceTakeStudent from './AttendanceTakeStudent';
import AttendanceStudent from './AttendanceStudent';

const MainStudentAttendance = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="attendance tabs"
                    centered
                >
                    <Tab label="Take Student Attendance"/>
                    <Tab label="Show Student Attendance"/>
                </Tabs>
            </Box>
            {value === 0 && <AttendanceTakeStudent/>}
            {value === 1 && <AttendanceStudent/>}
        </Box>
    );
};

export default MainStudentAttendance;
