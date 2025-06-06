import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Fade,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Snackbar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material'; // Icons for Edit and Delete
import {useSelector} from 'react-redux';
import {api, selectSchoolDetails} from '../../../../common';

const leaveStatusOptions = ['Pending', 'Approved', 'Rejected'];
const leaveDurationOptions = ['Full Day', 'Half Day'];
const halfDayOptions = ['First Half', 'Second Half'];

const LeaveApplicationForm = ({applyLeave, editingLeave, handleEditSubmit}) => {
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    const [employeeName, setEmployeeName] = useState(editingLeave?.name || '');
    const [leaveType, setLeaveType] = useState(editingLeave?.leaveType || '');
    const [leaveDuration, setLeaveDuration] = useState(editingLeave?.leaveDuration || 'Full Day');
    const [halfDayType, setHalfDayType] = useState(editingLeave?.halfDayType || '');
    const [fromDate, setFromDate] = useState(editingLeave?.fromDate || '');
    const [toDate, setToDate] = useState(editingLeave?.toDate || '');
    const [reason, setReason] = useState(editingLeave?.reason || '');
    const [loading, setLoading] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false); // New state for Snackbar visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(toDate) < new Date(fromDate)) {
            alert("The 'To Date' cannot be earlier than the 'From Date'. Please select a valid date range.");
            return;
        }
        const newLeave = {
            loginId: userData.id,
            name: userData?.name,
            leaveType,
            leaveDuration,
            halfDayType: leaveDuration === 'Half Day' ? halfDayType : null,
            fromDate,
            toDate,
            reason,
            status: 'Pending',
            role: userData.role,
            schoolId: schoolId, session
        };

        setLoading(true);
        try {
            if (editingLeave) {
                await handleEditSubmit(newLeave);
            } else {
                const response = await api.post('/api/attendance/leaves', newLeave);
                applyLeave(response.data);
            }

            setShowSuccess(true);

        } catch (error) {
            console.error('Error applying leave:', error);
        } finally {
            setLoading(false);
            setEmployeeName('');
            setLeaveType('');
            setLeaveDuration('Full Day');
            setHalfDayType('');
            setFromDate('');
            setToDate('');
            setReason('');
        }
    };
    const handleCloseSnackbar = () => {
        setShowSuccess(false);
    };
    return (
        <Fade in timeout={500}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: '1000px'}}>
                    <Grid container spacing={2}>
                        {/* Leave Type */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Leave Type"
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                                select
                                required
                                sx={{mb: 2}}
                            >
                                <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                                <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                                <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Leave Duration */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Leave Duration"
                                value={leaveDuration}
                                onChange={(e) => setLeaveDuration(e.target.value)}
                                select
                                required
                                sx={{mb: 2}}
                            >
                                {leaveDurationOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Half Day Type */}
                        {leaveDuration === 'Half Day' && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Half Day Type"
                                    value={halfDayType}
                                    onChange={(e) => setHalfDayType(e.target.value)}
                                    select
                                    required
                                    sx={{mb: 2}}
                                >
                                    {halfDayOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        {/* From Date */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="From Date"
                                type="date"
                                InputLabelProps={{shrink: true}}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                required
                                sx={{mb: 2}}
                            />
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="To Date"
                                type="date"
                                InputLabelProps={{shrink: true}}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                required
                                sx={{mb: 2}}
                            />
                        </Grid>

                        {/* Reason */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                multiline
                                rows={3}
                                sx={{mb: 2}}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                                {loading ?
                                    <CircularProgress size={24}/> : editingLeave ? 'Update Leave' : 'Submit Leave'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Snackbar for Success */}
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        sx={{width: '100%'}}
                    >
                        Leave applied successfully!
                    </Alert>
                </Snackbar>

            </Box>
        </Fade>
    );
};

const LeaveTable = ({leaves, updateLeaveStatus, deleteLeave, editLeave, userRole}) => {
    return (
        <Fade in timeout={500}>
            <TableContainer component={Paper} sx={{mt: 2}}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#f5f5f5'}}>
                            <TableCell>Name</TableCell>
                            <TableCell>Leave Type</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>

                            <TableCell>Edit/Delete</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaves.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.name}</TableCell>
                                <TableCell>{leave.leaveType}</TableCell>
                                <TableCell>
                                    {leave.leaveDuration}
                                    {leave.leaveDuration === 'Half Day' && ` (${leave.halfDayType})`}
                                </TableCell>
                                <TableCell>{leave.fromDate}</TableCell>
                                <TableCell>{leave.toDate}</TableCell>
                                <TableCell>{leave.reason}</TableCell>
                                <TableCell>
                                    {(userRole === 'admin' || userRole === 'super admin') ? (
                                        <TextField
                                            select
                                            value={leave.status}
                                            onChange={(e) => updateLeaveStatus(leave.id, e.target.value)}
                                            variant="outlined"
                                            size="small"
                                        >
                                            {leaveStatusOptions.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    ) : (
                                        <TextField
                                            value={leave.status}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            disabled
                                        />
                                    )}
                                </TableCell>
                                {/* Edit/Delete Actions */}
                                <TableCell>
                                    <IconButton onClick={() => editLeave(leave)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteLeave(leave.id)} color='error'>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fade>
    );
};

const LeaveManagement = () => {
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [editingLeave, setEditingLeave] = useState(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                let response;
                if (userData?.role === 'admin' || userData?.role === 'super admin') {
                    response = await api.get(`/api/attendance/leaves/admin/${schoolId}/${session}`);
                } else {
                    response = await api.get(`/api/attendance/leaves/user/${userData.id}/${schoolId}/${session}`);
                }

                setLeaves(response.data);
            } catch (error) {
                console.error('Error fetching leaves:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, [userData, schoolId]);

    const applyLeave = (newLeave) => {
        setLeaves([...leaves, newLeave]);
    };

    const updateLeaveStatus = async (id, newStatus) => {
        try {
            await api.put(`/api/attendance/leaves/${id}`, {status: newStatus});
            setLeaves(leaves.map((leave) => (leave.id === id ? {...leave, status: newStatus} : leave)));
        } catch (error) {
            console.error('Error updating leave status:', error);
        }
    };

    const deleteLeave = async (id) => {
        try {
            await api.delete(`/api/attendance/leaves/${id}`);
            setLeaves(leaves.filter((leave) => leave.id !== id));
        } catch (error) {
            console.error('Error deleting leave:', error);
        }
    };

    const editLeave = (leave) => {
        setEditingLeave(leave);
        setTabIndex(0); // Switch to the form tab
    };

    const handleEditSubmit = async (updatedLeave) => {
        if (!editingLeave || !editingLeave.id) {
            console.error('No leave selected for editing');
            return;
        }
        try {
            await api.put(`/api/attendance/leaves/full/${editingLeave.id}`, updatedLeave);
            // setLeaves(leaves.map((leave) => (leave.id === editingLeave.id ? updatedLeave : leave)));
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) =>
                    leave.id === editingLeave.id ? {...leave, ...updatedLeave} : leave
                )
            );
            console.log('Updated Leave Payload:', updatedLeave);

            setEditingLeave(null); // Clear editing mode
            setTabIndex(1);

        } catch (error) {
            console.error('Error updating leave:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        if (newValue === 0) setEditingLeave(null); // Clear edit form when switching tabs
    };

    console.log('Editing Leave:', editingLeave);


    return (
        <Box sx={{width: '100%', padding: '20px'}}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label={editingLeave ? 'Edit Leave' : 'Apply for Leave'}/>
                <Tab label="Leave Applications"/>
            </Tabs>
            <Box sx={{marginTop: '20px', animation: 'fadeIn 0.5s'}}>
                {tabIndex === 0 && (
                    <LeaveApplicationForm
                        applyLeave={applyLeave}
                        editingLeave={editingLeave}
                        handleEditSubmit={handleEditSubmit}
                    />
                )}
                {tabIndex === 1 && (
                    <>
                        <Typography variant="h6" align="center">Leave Applications</Typography>
                        {loading ? (
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <LeaveTable
                                leaves={leaves}
                                updateLeaveStatus={updateLeaveStatus}
                                deleteLeave={deleteLeave}
                                editLeave={editLeave}
                                userRole={userData?.role}
                            />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default LeaveManagement;
