import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {sessionOptions} from "../../../../commonStyle";
import {addFeeAmount, deleteFeeAmount, fetchFeeAmountDetails, updateFeeAmount} from "./redux/feeAmountSlice";
import {selectSchoolDetails} from "../../../../common";
import {fetchFees} from "../fee-type/redux/actions";

const SetFeeAmount = () => {
    const [formData, setFormData] = useState({
        feeAmounts: {},
        feeTypeMode: {},
        selectedClass: '',
        sessionYear: '',
        isEditing: false,
        currentFeeId: null
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [feeToDelete, setFeeToDelete] = useState(null);

    const dispatch = useDispatch();
    const feeRecords = useSelector(state => state.feeType.fees);
    const feeAmountList = useSelector(state => state.feeAmount.feeAmounts);
    const classSections = useSelector(state => state.master.data.classSections);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [error, setError] = useState('');
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchFeeAmountDetails({schoolId, session}));
            dispatch(fetchFees(schoolId, session));
        }
    }, [schoolId, session, dispatch]);

    const resetForm = () => {
        setFormData({
            feeAmounts: {},
            feeTypeMode: {},
            selectedClass: '',
            sessionYear: '',
            isEditing: false,
            currentFeeId: null
        });
    };

    const handleFeeAmountChange = (event, feeType) => {
        setFormData(prev => ({
            ...prev,
            feeAmounts: {
                ...prev.feeAmounts,
                [feeType]: event.target.value
            }
        }));
    };

    const handleFeeTypeModeChange = (feeType) => {
        setFormData(prev => ({
            ...prev,
            feeTypeMode: {
                ...prev.feeTypeMode,
                [feeType]: !prev.feeTypeMode[feeType]
            }
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const {feeAmounts, feeTypeMode, selectedClass, sessionYear, isEditing, currentFeeId} = formData;

        if (!selectedClass || !sessionYear) {
            setError('Both Class and Session Year are required fields');
            return;
        }

        // Clear any previous errors
        setError('');

        // When editing, only update the specific fee being edited
        if (isEditing) {
            // Find the fee being edited
            const editedFee = feeAmountList.find(f => f.id === currentFeeId);
            if (!editedFee) {
                setError('Could not find the fee to edit');
                return;
            }

            const updatedFee = {
                ...editedFee,
                amount: feeAmounts[editedFee.selectedFee] || editedFee.amount,
                className: selectedClass,
                session: sessionYear,
                feeTypeMode: editedFee.selectedFee === 'transportationFee'
                    ? (feeTypeMode[editedFee.selectedFee] ? 'Dynamic' : 'Static')
                    : editedFee.feeTypeMode
            };

            dispatch(updateFeeAmount(updatedFee))
                .then(() => {
                    resetForm();
                    dispatch(fetchFeeAmountDetails({schoolId, session}));
                })
                .catch(err => {
                    setError('Failed to update fee amount');
                });
        } else {
            // For new fees, process all fees
            const processedFees = feeRecords.map(fee => ({
                ...fee,
                amount: feeAmounts[fee.selectedFee] || fee.amount,
                className: selectedClass,
                session: sessionYear,
                feeTypeMode: fee.selectedFee === 'transportationFee'
                    ? (feeTypeMode[fee.selectedFee] ? 'Dynamic' : 'Static')
                    : fee.feeTypeMode
            }));

            dispatch(addFeeAmount(processedFees))
                .then(() => {
                    resetForm();
                    dispatch(fetchFeeAmountDetails({schoolId, session}));
                })
                .catch(err => {
                    setError('Failed to add fee amounts');
                });
        }
    };


    const handleEdit = (fee) => {
        // Initialize all fee amounts to empty initially
        const initialFeeAmounts = {};
        const initialFeeTypeMode = {};

        // Find all fees for this class and session
        const relatedFees = feeAmountList.filter(
            f => f.className === fee.className && f.session === fee.session
        );

        // Set the amounts and modes for all found fees
        relatedFees.forEach(f => {
            initialFeeAmounts[f.selectedFee] = f.amount;
            initialFeeTypeMode[f.selectedFee] = f.feeTypeMode === 'Dynamic';
        });

        setFormData({
            feeAmounts: initialFeeAmounts,
            feeTypeMode: initialFeeTypeMode,
            selectedClass: fee.className,
            sessionYear: fee.session,
            isEditing: true,
            currentFeeId: fee.id
        });
    };


    const handleDeleteClick = (fee) => {
        setFeeToDelete(fee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (feeToDelete) {
            dispatch(deleteFeeAmount(feeToDelete.id)).then(() => {
                setDeleteDialogOpen(false);
                setFeeToDelete(null);
                resetForm();
            });
        }
    };

    const handleCloseDialog = () => {
        setDeleteDialogOpen(false);
        setFeeToDelete(null);
    };

    return (
        <Box className="w-full max-w-4xl mx-auto p-6">
            <Box sx={{display: 'flex', gap: 4}}>
                <Paper elevation={3} sx={{padding: 4}} className="flex-1">
                    <Typography variant="h5" gutterBottom>
                        {formData.isEditing ? 'Edit Fee Amount' : 'Add Fee Amount'}
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{marginBottom: 2}}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {feeRecords?.map((fee) => (
                            <Box key={fee.type}>
                                <FormControl fullWidth sx={{marginBottom: 3}}>
                                    <TextField
                                        label={`Amount for ${fee.selectedFee}`}
                                        type="number"
                                        value={formData.feeAmounts[fee.selectedFee] || ''}
                                        onChange={(e) => handleFeeAmountChange(e, fee.selectedFee)}
                                        fullWidth
                                    />
                                </FormControl>
                                {fee.selectedFee === 'transportationFee' && (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.feeTypeMode[fee.selectedFee] || false}
                                                onChange={() => handleFeeTypeModeChange(fee.selectedFee)}
                                            />
                                        }
                                        label={formData.feeTypeMode[fee.selectedFee] ? "Dynamic Fee" : "Static Fee"}
                                    />
                                )}
                            </Box>
                        ))}

                        <FormControl fullWidth sx={{marginBottom: 3}}>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={formData.selectedClass}
                                onChange={(e) => setFormData(prev => ({...prev, selectedClass: e.target.value}))}
                            >
                                {classSections?.map((classSection) => (
                                    <MenuItem key={classSection.id} value={classSection.name || ''}>
                                        {classSection.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{marginBottom: 3}}>
                            <InputLabel>Session Year</InputLabel>
                            <Select
                                value={formData.sessionYear}
                                onChange={(e) => setFormData(prev => ({...prev, sessionYear: e.target.value}))}
                            >
                                {sessionOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{display: 'flex', gap: 2}}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {formData.isEditing ? 'Update' : 'Submit'}
                            </Button>
                            {formData.isEditing && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Box>
                    </form>
                </Paper>

                <Paper elevation={3} sx={{padding: 4}} className="flex-1">
                    <Typography variant="h5" gutterBottom>
                        Existing Fee Amounts
                    </Typography>

                    {feeAmountList?.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Fee Type</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Session</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feeAmountList.map((fee) => (
                                    <TableRow key={fee.id}>
                                        <TableCell>{fee.className}</TableCell>
                                        <TableCell>{fee.selectedFee}</TableCell>
                                        <TableCell>{fee.amount}</TableCell>
                                        <TableCell>{fee.session}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleEdit(fee)}
                                                disabled={formData.isEditing}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(fee)}
                                                disabled={formData.isEditing}
                                                color="error"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography>No fee amounts available.</Typography>
                    )}
                </Paper>
            </Box>

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
                        Are you sure you want to delete this fee amount? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SetFeeAmount;