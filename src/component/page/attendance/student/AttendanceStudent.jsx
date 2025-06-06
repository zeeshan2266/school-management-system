import React, {useEffect, useState} from 'react';
import {
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip
} from '@mui/material';
import AttendanceViewStudent from './AttendanceViewStudent';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from 'date-fns';
import * as XLSX from 'xlsx';
import {fetchAttendance} from '../redux/attendanceActions';
import {selectSchoolDetails} from "../../../../common";

function AttendanceStudent() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [formValues, setFormValues] = useState({
        section: '',
        className: '',
        schoolId: schoolId, // Add these fields
        session: session,
    });

    const dispatch = useDispatch();
    const attendanceList = useSelector(state => state.attendance.attendanceList);
    const classSections = useSelector(state => state.master?.data?.classSections);

    useEffect(() => {
        if (formValues.schoolId && formValues.session) {
            dispatch(fetchAttendance(schoolId, session));
        }
    }, [dispatch]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleDownload = () => {
        const dateToUse = selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date();
        const datesList = generateDatesWithDays(dateToUse);
        const filteredData = filterAttendanceByClassSection(attendanceList, formValues.className, formValues.section);

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

    const filterAttendanceByClassSection = (attendanceList, className, section) => {
        return attendanceList.filter(attendance =>
            attendance.className === className && attendance.section === section
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Grid container spacing={3} alignItems="center" sx={{marginTop: '5px'}}>
                    <Grid item xs={12} sm={3} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                label="Select Class"
                                name="className"
                                value={formValues.className}
                                onChange={handleChange}
                            >
                                {classSections && classSections.length > 0 ? (
                                    classSections.map((classSection) => (
                                        <MenuItem key={classSection.id} value={classSection.name}>
                                            {classSection.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Classes Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Select Section</InputLabel>
                            <Select
                                label="Select Section"
                                name="section"
                                value={formValues.section}
                                onChange={handleChange}
                                disabled={!formValues.className}
                            >
                                {classSections?.find(cs => cs.name === formValues.className)?.sections?.length > 0 ? (
                                    classSections
                                        .find(cs => cs.name === formValues.className)
                                        .sections.map((section) => (
                                        <MenuItem key={section.id} value={section.name}>
                                            {section.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Sections Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
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
                <Paper elevation={3} style={{marginTop: 20}}>
                    <AttendanceViewStudent
                        selectedDate={selectedDate}
                        selectedEmployee={selectedEmployee}
                        className={formValues.className}
                        section={formValues.section}
                    />
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}

export default AttendanceStudent;
