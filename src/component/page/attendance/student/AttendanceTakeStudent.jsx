import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {api, selectSchoolDetails} from "../../../../common";
import {useSelector} from "react-redux";

const AttendanceTakeStudent = () => {
    const [date, setDate] = useState(dayjs());
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessages, setDialogMessages] = useState([]);
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector(state => state.master?.data?.classSections);
    const [dialogTitle, setDialogTitle] = useState("");
    const student = useSelector(state => state.master?.data?.student);
    const attendanceList = useSelector(state => state.attendance.attendanceList);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [formValues, setFormValues] = useState({
        section: '',
        className: '',
    });


    // Set initial students
    useEffect(() => {
        if (formValues.className && formValues.section) {
            fetchStudents(formValues.className, formValues.section);
        }
    }, [formValues.className, formValues.section]);

    // useEffect(() => {
    //     if (student) setStudents(student);
    // }, [student]);

    useEffect(() => {
        if (students) {
            setAttendance(
                students.map(student => {
                    const existingRecord = attendanceList.find(record => {
                        const studentIdAsString = record.studentId ? String(record.studentId) : '';
                        const studentIdFromListAsString = student.id ? String(student.id) : '';

                        // Compare studentId and date
                        const isSameStudent = studentIdAsString === studentIdFromListAsString;
                        const isSameDate = record.date === date.format('YYYY-MM-DD');  // Assuming date is a moment object

                        return isSameStudent && isSameDate;
                    });

                    console.log("existingRecord", existingRecord);

                    // Return existing record if found, or create a new default record
                    return existingRecord || {
                        studentId: student.id,
                        status: 'Present',
                        comment: '',
                        schoolId: userData?.schoolId,
                        session,
                        type: 'STUDENT',
                        name: student.studentName,
                        className: student.className,
                        section: student.section,
                        date: date.format('YYYY-MM-DD') // Add the date to the new record as well
                    };
                })
            );
        }

        console.log("Attendance", attendance);
    }, [students, attendanceList, userData]);

    const handleAttendanceChange = (studentId, field, value) => {
        setAttendance(prev => prev.map(record =>
            record.studentId === studentId ? {...record, [field]: value} : record
        ));
    };

    const handleMakeAll = (status) => {
        setAttendance(prev => prev.map(record => ({
            ...record,
            status,
            comment: status === 'Present' || status === 'Absent' ? '' : record.comment
        })));
    };

    const handleSubmit = () => {
        // Check if attendance data is empty
        if (!attendance || attendance.length === 0) {
            setDialogMessages(["No attendance data to save."]);
            setOpenDialog(true);
            return;
        }
        const errors = [];
        const API_ENDPOINT = '/api/attendance';
        attendance.forEach(record => {
            if ((record.status === 'Late' || record.status === 'Half Day') && !record.comment) {
                const studentName = students.find(student => student.id === record.studentId).studentName;
                errors.push(`Comment is required for ${studentName} when status is ${record.status}.`);
            }
        });

        if (errors.length > 0) {

            setDialogMessages(errors);
            setOpenDialog(true);
            return;
        }
        console.log("Date", date);
        const attendanceData = attendance.map(record => ({
            id: record.id,
            studentId: record.studentId,
            date: date.format('YYYY-MM-DD'),
            status: record.status,
            comment: record.comment,
            schoolId: userData?.schoolId,
            type: 'STUDENT',
            name: record.name,
            className: record.className,
            section: record.section,
            session,
        }));
// Submit attendance
        api.post(API_ENDPOINT, attendanceData)
            .then(response => {
                // Show success dialog
                setDialogMessages(['Attendance saved successfully!']);
                setOpenDialog(true);
            })
            .catch(error => {

                setDialogMessages(["Failed to save attendance. Please try again."]);
                setOpenDialog(true);
                console.error("There was an error saving the attendance!", error);
            });
    };
    const fetchAttendance = async (selectedDate) => {
        try {
            const response = await api.get('/api/attendance', {
                params: {
                    date: selectedDate.format('YYYY-MM-DD'),
                    schoolId,
                    session,
                },
            });
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };
    // useEffect(() => {
    //     if (students.length > 0) {
    //         fetchAttendance(date);
    //     }
    // }, [date, students]);
    const handleChange = async (e) => {
        const {name, value} = e.target;
        setFormValues(prev => ({...prev, [name]: value}));


        // Update the form values
        const updatedFormValues = {
            ...formValues,
            [name]: value,
        };

        setFormValues(updatedFormValues);

        // Fetch students when class or section changes
        if (name === 'className') {
            await fetchStudents(updatedFormValues.className);
        } else if (name === 'section') {
            await fetchStudents(updatedFormValues.className, updatedFormValues.section);
        }
    };

    // const fetchStudentsWithSection = async (className, section) => {
    //     try {
    //         const response = await api.get('/api/students/class/section/school', {
    //             params: {
    //                 className: className || formValues.className,
    //                 section: section || formValues.section,
    //                 schoolId: schoolId,
    //             },
    //         });
    //         setStudents(response.data);
    //     } catch (error) {
    //         console.error('Error fetching students:', error);
    //     }
    // };

    const fetchStudents = async (className, section) => {
        try {
            const response = await api.get('/api/students/class/section/school', {
                params: {
                    className,
                    section,
                    schoolId,
                },
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Grid container spacing={2} sx={{marginTop: '5px'}}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} md={2}>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Class</InputLabel>
                                    <Select
                                        label="Select Class"
                                        name="className"
                                        value={formValues?.className || ''}
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
                                        value={formValues?.section || ''}
                                        onChange={handleChange}
                                        disabled={!formValues.className}
                                    >
                                        {classSections?.find(cs => cs.name === formValues.className)?.sections?.length > 0 ? (
                                            classSections
                                                .find(cs => cs.name === formValues?.className || '')
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
                            <Grid item xs={12} sm={6} md={6} container justifyContent="center">
                                <Box display="flex" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleMakeAll('Present')}
                                    >
                                        Make All Present
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleMakeAll('Absent')}
                                    >
                                        Make All Absent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        Save Attendance
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{maxHeight: '80vh', overflow: 'auto', padding: 1}}>
                        <Fade in={true} timeout={600}>
                            <TableContainer component={Paper} elevation={3} style={{padding: '20px', width: '100%'}}>
                                <Table sx={{minWidth: 650}} aria-label="attendance table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">SrNo</TableCell>
                                            <TableCell align="center">Name</TableCell>
                                            <TableCell align="center">Roll</TableCell>
                                            <TableCell align="center">Attendance</TableCell>
                                            <TableCell align="center">Comment</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendance.map((record, index) => (
                                            <TableRow key={record.studentId}>
                                                <TableCell align="center">{index + 1}</TableCell>
                                                <TableCell align="center">
                                                    {/* {String(students.find(student => String(student?.id || '') === String(record?.studentId || ''))?.studentName || '')} */}
                                                    {students.find(student => student.id === record.studentId)?.studentName}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* {String(students.find(student => String(student?.id || '') === String(record?.studentId || ''))?.rollNo || '')} */}
                                                    {students.find(student => student.id === record.studentId)?.rollNo}

                                                </TableCell>

                                                <TableCell align="center">
                                                    <RadioGroup
                                                        row
                                                        value={record.status}
                                                        onChange={(e) => handleAttendanceChange(record.studentId, 'status', e.target.value)}
                                                    >
                                                        <FormControlLabel value="Present"
                                                                          control={<Radio size="small"/>}
                                                                          label="Present"/>
                                                        <FormControlLabel value="Absent"
                                                                          control={<Radio size="small"/>}
                                                                          label="Absent"/>
                                                        <FormControlLabel value="Late"
                                                                          control={<Radio size="small"/>}
                                                                          label="Late"/>
                                                        <FormControlLabel value="Half Day"
                                                                          control={<Radio size="small"/>}
                                                                          label="Half Day"/>
                                                        <FormControlLabel value="Leave"
                                                                          control={<Radio size="small"/>}
                                                                          label="Leave"/>
                                                        <FormControlLabel value="Holiday"
                                                                          control={<Radio size="small"/>}
                                                                          label="Holiday"/>
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        disabled={record.status === 'Present' || record.status === 'Absent'}
                                                        value={record.comment}
                                                        onChange={(e) => handleAttendanceChange(record.studentId, 'comment', e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Fade>
                    </Grid>
                </Grid>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Missing Comments</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessages.map((message, index) => (
                                <div key={index}>{message}</div>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
};

export default AttendanceTakeStudent;
