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
    TextField,
    Typography
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import {addAttendance, fetchAttendance} from "../redux/attendanceActions";
import {selectSchoolDetails} from "../../../../common";

const AttendanceTakeStaff = () => {
    const [date, setDate] = useState(dayjs());
    const [attendance, setAttendance] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessages, setDialogMessages] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');

    const dispatch = useDispatch();
    const staffList = useSelector(state => state.staff.staffList);
    const attendanceList = useSelector(state => state.attendance.attendanceList);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        dispatch(fetchAttendance(schoolId, session));
    }, [date, dispatch]);

    useEffect(() => {
        setAttendance(
            staffList.map(staff => {
                const existingRecord = attendanceList.find(record => record.staffId === staff.id && record.date === date.format('YYYY-MM-DD'));
                return existingRecord || {
                    staffId: staff.id,
                    status: 'Present',
                    comment: '',
                    schoolId: userData?.schoolId,
                    type: 'STAFF',
                    name: staff.name,
                    date: date.format('YYYY-MM-DD'),
                    session
                };
            })
        );
    }, [staffList, attendanceList, date, userData]);

    const handleAttendanceChange = (staffId, field, value) => {
        setAttendance(prev => prev.map(record =>
            record.staffId === staffId ? {...record, [field]: value} : record
        ));
    };

    const handleMakeAll = (status) => {
        setAttendance(prev => prev.map(record => ({
            ...record,
            status,
            comment: (status === 'Present' || status === 'Absent' || status === 'Holiday') ? '' : record.comment
        })));
    };

    const handleSubmit = () => {
        if (!attendance || attendance.length === 0) {
            setDialogMessages(["No attendance data to save."]);
            setOpenDialog(true);
            return;
        }
        const errors = [];

        attendance.forEach(record => {
            if ((record.status === 'Late' || record.status === 'Half Day' || record.status === 'Leave') && !record.comment) {
                const staffName = staffList.find(staff => staff.id === record.staffId).name;
                errors.push(`Comment is required for ${staffName} when status is ${record.status}.`);
            }
        });

        if (errors.length > 0) {
            setDialogMessages(errors);
            setOpenDialog(true);
            return;
        }

        const attendanceData = attendance.map(record => ({
            ...record,
            date: date.format('YYYY-MM-DD'),
            id: record.id,
            staffId: record.staffId,
            date: date.format('YYYY-MM-DD'),
            status: record.status,
            comment: record.comment,
            schoolId: userData?.schoolId,
            type: 'STAFF',
            name: record.name,
            session
        }));

        dispatch(addAttendance(attendanceData));
        setDialogMessages(["Successfully Saved Attendance"]);
        setOpenDialog(true);
    };
    const filteredAttendance = selectedStaff
        ? attendance.filter(record => record.staffId === selectedStaff)
        : attendance;
        console.log("filteredAttendance",filteredAttendance)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Grid container spacing={2} sx={{marginTop: '5px'}}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4} md={3}>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Grid>

                            <FormControl fullWidth sx={{width: '300px', marginTop: "15px"}} container spacing={6}>
                                <InputLabel id="Select Staff-label">Select Staff</InputLabel>
                                <Select

                                    labelId="Select Staff-label"
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(e.target.value)}
                                >
                                    {staffList.map((staff) => (
                                        <MenuItem key={staff.id} value={staff.id}>
                                            {staff.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Grid item xs={12} sm={4} md={6} container justifyContent="center">
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
                                        color="info"
                                        onClick={() => handleMakeAll('Holiday')}
                                    >
                                        Make All Holiday
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} container justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    style={{marginTop: '20px'}}
                                >
                                    Save Attendance
                                </Button>
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
                                            <TableCell align="center">Teacher</TableCell>
                                            <TableCell align="center">Attendance</TableCell>
                                            <TableCell align="center">Comment</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredAttendance.map((record, index) => (
                                            <TableRow key={record.staffId}>
                                                <TableCell align="center">{index + 1}</TableCell>
                                                <TableCell
                                                    align="center">{staffList.find(staff => staff.id === record.staffId)?.name}</TableCell>
                                                <TableCell align="center">
                                                    <RadioGroup
                                                        row
                                                        value={record.status}
                                                        onChange={(e) => handleAttendanceChange(record.staffId, 'status', e.target.value)}
                                                    >
                                                        <FormControlLabel value="Present"
                                                                          control={<Radio size="small"/>}
                                                                          label="Present"/>
                                                        <FormControlLabel value="Absent" control={<Radio size="small"/>}
                                                                          label="Absent"/>
                                                        <FormControlLabel value="Late" control={<Radio size="small"/>}
                                                                          label="Late"/>
                                                        <FormControlLabel value="Half Day"
                                                                          control={<Radio size="small"/>}
                                                                          label="Half Day"/>
                                                        <FormControlLabel value="Leave" control={<Radio size="small"/>}
                                                                          label="Leave"/>
                                                        <FormControlLabel value="Holiday"
                                                                          control={<Radio size="small"/>}
                                                                          label="Holiday"/>
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={record.comment}
                                                        disabled={record.status === 'Present' || record.status === 'Absent' || record.status === 'Holiday'}
                                                        onChange={(e) => handleAttendanceChange(record.staffId, 'comment', e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Fade>
                    </Grid>
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Alert</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessages.map((msg, index) => (
                                <Typography key={index}>{msg}</Typography>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">OK</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
};

export default AttendanceTakeStaff;
