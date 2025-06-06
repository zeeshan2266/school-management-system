import React, {useEffect, useState} from 'react';
import {Container, Grid, IconButton, MenuItem, Paper, TextField, Tooltip} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAttendance} from '../redux/attendanceActions';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import AttendanceViewStaff from "./AttendanceViewStaff";
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from "date-fns";
import {selectSchoolDetails} from "../../../../common";

function AttendanceStaff() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const attendanceList = useSelector(state => state.attendance.attendanceList);
    console.log("attendanceList",attendanceList)
    const staffList = useSelector(state => state.staff.staffList);
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const handleEmployeeChange = (event) => {
        setSelectedEmployee(event.target.value);
    };

    const generateDatesWithDays = (selectedDate) => {
        const startDate = startOfMonth(selectedDate);
        const endDate = endOfMonth(startDate);
        return eachDayOfInterval({start: startDate, end: endDate}).map(date => ({
            day: format(date, 'd'),
            dayName: format(date, 'EEE'),
        }));
    };

    const groupAttendanceByEmployee = (attendanceList) => {
        return attendanceList.reduce((groupedData, attendance) => {
            const {staffId, name, date, status} = attendance;
            if (!groupedData[staffId]) {
                groupedData[staffId] = {name, attendance: {}};
            }
            groupedData[staffId].attendance[date] = status;
            return groupedData;
        }, {});
    };

    const handleDownload = () => {
        const dateToUse = selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date();
        const datesList = generateDatesWithDays(dateToUse);
        const filteredData = selectedEmployee
            ? attendanceList.filter(attendance => attendance.staffId === selectedEmployee)
            : attendanceList;
console.log("filteredData",filteredData)
        const groupedData = groupAttendanceByEmployee(filteredData);
        const sheetData = Object.entries(groupedData).map(([staffId, employeeData]) => {
            const row = {Name: employeeData.name};
            datesList.forEach(date => {
                const formattedDate = format(new Date(dateToUse.getFullYear(), dateToUse.getMonth(), date.day), 'yyyy-MM-dd');
                row[date.day] = employeeData.attendance[formattedDate] || '';
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData, {header: ['Name', ...datesList.map(date => date.day)]});
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'attendance_report.xlsx');
    };

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchAttendance(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Grid container spacing={3} alignItems="center" sx={{marginTop: '5px'}}>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            select
                            label="Employee"
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}
                            fullWidth
                        >
                            {staffList.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} container justifyContent="flex-end" alignItems="center">
                        <DatePicker
                            views={['year', 'month']}
                            label="Month & Year"
                            minDate={dayjs('2024-01-01')}
                            maxDate={dayjs('2100-12-31')}
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                        <Tooltip title="Download Excel" placement="top">
                            <IconButton onClick={handleDownload} sx={{marginLeft: 2}}>
                                <DownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Paper elevation={3} sx={{marginTop: 2}}>
                    <AttendanceViewStaff selectedDate={selectedDate} selectedEmployee={selectedEmployee}/>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}

export default AttendanceStaff;
