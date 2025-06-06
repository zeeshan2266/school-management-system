import React, {useState} from 'react';
import {Box, Tab, Tabs} from '@mui/material';
import AttendanceTakeStaff from "./AttendanceTakeStaff";
import AttendanceStaff from "./AttendanceStaff";

const MainStaffAttendance = () => {
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
                    <Tab label="Take Staff Attendance"/>
                    <Tab label="Show Staff Attendance"/>
                </Tabs>
            </Box>
            {value === 0 && <AttendanceTakeStaff/>}
            {value === 1 && <AttendanceStaff/>}
        </Box>
    );
};

export default MainStaffAttendance;
