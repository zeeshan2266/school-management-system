// FeeType.jsx
import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useDispatch, useSelector} from "react-redux";
import {selectSchoolDetails} from "../../../../common";
import {sessionOptions} from "../../../../commonStyle";
import {addFee, deleteFee, fetchFees, SET_ERROR, updateFee} from "./redux/actions";
import {motion} from 'framer-motion';

export const fees = {
    tuitionFee: "Fee charged for academic instruction",
    admissionFee: "One-time fee for new admissions",
    examFee: "Fee for conducting exams",
    libraryFee: "Fee for access to library facilities",
    laboratoryFee: "Fee for using laboratory resources",
    sportsFee: "Fee for sports and physical education",
    transportationFee: "Fee for transport services",
    uniformFee: "Fee for school uniforms",
    activityFee: "Fee for extracurricular activities",
    buildingDevelopmentFee: "Fee for infrastructure development",
    hostelFee: "Fee for hostel accommodation",
    cautionDeposit: "Refundable security deposit",
    lateFee: "Penalty for late payment of fees",
    miscellaneousFee: "Other additional charges"
};

const FeeType = () => {
    const [selectedFee, setSelectedFee] = useState('');
    const [mode, setMode] = useState('');
    const [id, setId] = useState('');
    const [months, setMonths] = useState({
        January: false,
        February: false,
        March: false,
        April: false,
        May: false,
        June: false,
        July: false,
        August: false,
        September: false,
        October: false,
        November: false,
        December: false
    });
    const [sessionYear, setSessionYear] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const {fees: feeRecords, error, loading} = useSelector((state) => state.feeType);

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchFees(schoolId, session));
        }
    }, [schoolId, session, dispatch]);

    const handleFeeChange = (event) => setSelectedFee(event.target.value);
    const handleModeChange = (event) => setMode(event.target.value);
    const handleMonthChange = (event) => {
        const monthName = event.target.value;
        setMonths(prevMonths => ({
            ...prevMonths,
            [monthName]: !prevMonths[monthName]
        }));
    };

    const resetForm = () => {
        setSelectedFee('');
        setMode('');
        setId('');
        setMonths({
            January: false,
            February: false,
            March: false,
            April: false,
            May: false,
            June: false,
            July: false,
            August: false,
            September: false,
            October: false,
            November: false,
            December: false
        });
        setSessionYear('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
// Check required fields
        if (!selectedFee || !mode || !sessionYear) {
            dispatch({
                type: SET_ERROR,
                payload: 'Please fill in all required fields'
            });
            return;
        }

        // Check if at least one month is selected
        const hasSelectedMonth = Object.values(months).some(value => value === true);
        if (!hasSelectedMonth) {
            dispatch({
                type: SET_ERROR,
                payload: 'Please select at least one month'
            });
            return;
        }

        const formData = {
            id,
            selectedFee,
            mode,
            months,
            schoolId,
            session: sessionYear
        };

        let success;
        if (!id) {
            success = await dispatch(addFee(formData));
        } else {
            success = await dispatch(updateFee(id, formData));
        }

        if (success) {
            resetForm();
            await dispatch(fetchFees(schoolId, session));
        }
    };
    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (recordToDelete) {
            const success = await dispatch(deleteFee(recordToDelete.id));
            setDeleteDialogOpen(false);
            setRecordToDelete(null);
            await dispatch(fetchFees(schoolId, session));
        }
    };

    const handleCloseDialog = () => {
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
    };

    const handleEdit = (recordToEdit) => {
        setSelectedFee(recordToEdit.selectedFee);
        setMode(recordToEdit.mode);
        setSessionYear(recordToEdit.session);
        setMonths(recordToEdit.months);
        setId(recordToEdit.id);
    };

    return (
        <Box className="w-full max-w-4xl mx-auto p-6">
            <Typography variant="h4" align="center" gutterBottom>
                Fee Type Creation
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 4,
                justifyContent: 'space-between',
                flexDirection: {xs: 'column', md: 'row'}
            }}>
                {/* Fee Form */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                    className="flex-1"
                    sx={{flex: 1}}
                >
                    <Paper elevation={3} sx={{padding: 4}}>
                        <Typography variant="h5" gutterBottom>
                            {id ? 'Edit Fee Type' : 'Add Fee Type'}
                        </Typography>
                        {error && (
                            <Alert severity="error" sx={{mb: 3}}>
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormControl fullWidth required>
                                <InputLabel>Select Fee Type</InputLabel>
                                <Select
                                    value={selectedFee}
                                    onChange={handleFeeChange}
                                    label="Select Fee Type"
                                >
                                    <MenuItem value="">
                                        <em>Select a fee</em>
                                    </MenuItem>
                                    {Object.keys(fees).map((key) => (
                                        <MenuItem key={key} value={key}>{key}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedFee && (
                                <div className="space-y-6">
                                    <FormControl variant="outlined" fullWidth required>
                                        <InputLabel>Session Year</InputLabel>
                                        <Select
                                            value={sessionYear}
                                            onChange={(e) => setSessionYear(e.target.value)}
                                            label="Session Year"
                                        >
                                            {sessionOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth required>
                                        <InputLabel>Mode</InputLabel>
                                        <Select
                                            value={mode}
                                            onChange={handleModeChange}
                                            label="Mode"
                                        >
                                            <MenuItem value="">
                                                <em>Select mode</em>
                                            </MenuItem>
                                            <MenuItem value="once">Once</MenuItem>
                                            <MenuItem value="yearly">Yearly</MenuItem>
                                            <MenuItem value="monthly">Monthly</MenuItem>
                                            <MenuItem value="quarterly">Quarterly</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <div>
                                        <Typography variant="h6" gutterBottom>
                                            Select Months:
                                        </Typography>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {Object.keys(months).map((month) => (
                                                <FormControlLabel
                                                    key={month}
                                                    control={
                                                        <Checkbox
                                                            value={month}
                                                            onChange={handleMonthChange}
                                                            checked={months[month]}
                                                        />
                                                    }
                                                    label={month}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <Box sx={{display: 'flex', gap: 2}}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24}/> : (id ? 'Update' : 'Submit')}
                                        </Button>
                                        {id && (
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                color="secondary"
                                                fullWidth
                                                onClick={resetForm}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </Box>
                                </div>
                            )}
                        </form>
                    </Paper>
                </motion.div>

                {/* Fee Records */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                    className="flex-1"
                    sx={{flex: 1}}
                >
                    <Paper elevation={3} sx={{padding: 4}}>
                        <Typography variant="h5" gutterBottom>
                            Fee Records
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <>
                                {error && (
                                    <Alert severity="error" sx={{mb: 3}}>
                                        {error}
                                    </Alert>
                                )}

                                <List>
                                    {Array.isArray(feeRecords) && feeRecords.length > 0 ? (
                                        feeRecords.map((record, index) => (
                                            <ListItem
                                                key={index}
                                                className="flex justify-between items-center"
                                                sx={{
                                                    borderBottom: '1px solid #eee',
                                                    '&:last-child': {borderBottom: 'none'}
                                                }}
                                            >
                                                <ListItemText
                                                    primary={`${record.selectedFee} - ${record.session}`}
                                                    secondary={`${record.mode} | ${Object.keys(record.months)
                                                        .filter(month => record.months[month])
                                                        .join(', ')}`}
                                                />
                                                <div className="flex">
                                                    <IconButton
                                                        onClick={() => handleEdit(record)}
                                                        color="primary"
                                                        disabled={loading}
                                                    >
                                                        <EditIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(record)}
                                                        color="error"
                                                        disabled={loading}
                                                    >
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </div>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body1" align="center" sx={{py: 3}}>
                                            No fee records available.
                                        </Typography>
                                    )}
                                </List>
                            </>
                        )}
                    </Paper>
                </motion.div>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this fee record? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        autoFocus
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FeeType;