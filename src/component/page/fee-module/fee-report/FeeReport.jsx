import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import DownloadIcon from "@mui/icons-material/Download";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import {fetchStudents} from "../../student/redux/studentActions";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
};

const modalHeaderStyle = {
    p: 2,
    bgcolor: 'primary.main',
    color: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const FeeReport = () => {
    const dispatch = useDispatch();
    const [months] = useState([
        "April", "May", "June", "July", "August",
        "September", "October", "November", "December",
        "January", "February", "March"
    ]);

    // States
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feeData, setFeeData] = useState([]);
    const [filteredFeeData, setFilteredFeeData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchValues, setSearchValues] = useState({
        admissionNo: '',
        rollNo: '',
        studentName: ''
    });
    const [formValues, setFormValues] = useState({
        month: '',
        className: '',
        section: ''
    });
    const [summaryData, setSummaryData] = useState({
        totalStudents: 0,
        paidStudents: 0,
        dueStudents: 0,
        totalCollected: 0,
        totalDue: 0
    });

    // Selectors
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id || '';
    const session = userData?.session || '';
    const students = useSelector((state) => state.students.students || []);
    const classSections = useSelector((state) => state.master.data.classSections);

    // Initial data fetch
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchStudents());
        }
    }, [schoolId, session, dispatch]);

    // Data filtering
    const filterData = (data, searchCriteria) => {
        if (!Array.isArray(data)) return [];

        return data.filter(student => {
            const admissionNoMatch = student.admissionNo?.toLowerCase().includes(searchCriteria.admissionNo.toLowerCase()) ?? true;
            const rollNoMatch = student.rollNo?.toLowerCase().includes(searchCriteria.rollNo.toLowerCase()) ?? true;
            const nameMatch = student.studentName?.toLowerCase().includes(searchCriteria.studentName.toLowerCase()) ?? true;
            return admissionNoMatch && rollNoMatch && nameMatch;
        });
    };

    // Update filtered data when search values or fee data changes
    useEffect(() => {
        const filtered = filterData(feeData, searchValues);
        setFilteredFeeData(filtered);
        calculateSummary(filtered);
    }, [searchValues, feeData]);

    // Merge fee data with student details
    const mergeFeeDataWithStudents = (feeData, students) => {
        if (!Array.isArray(feeData) || !Array.isArray(students)) {
            console.warn('Invalid data format received:', {feeData, students});
            return [];
        }

        const studentMap = new Map(students.map(student => [student.id, student]));

        return feeData.map(feeEntry => {
            if (!feeEntry?.studentId) {
                console.warn('Invalid fee entry:', feeEntry);
                return null;
            }

            const student = studentMap.get(feeEntry.studentId);
            if (student) {
                return {
                    ...feeEntry,
                    studentName: student.name,
                    admissionNo: student.admissionNo,
                    rollNo: student.rollNo,
                    class: student.class,
                    section: student.section
                };
            }
            return null;
        }).filter(Boolean);
    };

    // Fetch fee report data
    const fetchFeeReport = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!schoolId || !session) {
                throw new Error('Missing required parameters: schoolId or session');
            }

            const response = await api.get('/api/fees/fee-deposit/filter', {
                params: {
                    schoolId,
                    session,
                    month: formValues.month || undefined,
                    className: formValues.className || undefined,
                    section: formValues.section || undefined
                }
            });

            if (!response?.data) {
                throw new Error('Invalid response from server');
            }

            console.log('API Response:', response.data);

            const mergedData = mergeFeeDataWithStudents(response.data, students);
            console.log('Merged Data:', mergedData);

            setFeeData(mergedData);
            setFilteredFeeData(mergedData);
            calculateSummary(mergedData);

        } catch (error) {
            console.error('Error fetching fee report:', error);
            setError(error.message || 'Failed to fetch fee report');
            setFeeData([]);
            setFilteredFeeData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        if (schoolId && session && students.length > 0 &&
            (formValues.month || formValues.className || formValues.section)) {
            fetchFeeReport();
        }
    }, [formValues.month, formValues.className, formValues.section, students, schoolId, session]);

    // Calculate summary data
    const calculateSummary = (data = feeData) => {
        const summary = data.reduce((acc, student) => {
            acc.totalStudents++;
            if (student.status === 'Paid') {
                acc.paidStudents++;
                acc.totalCollected += parseFloat(student.allTotalAmount || 0);
            } else {
                acc.dueStudents++;
                acc.totalDue += parseFloat(student.allTotalAmount || 0);
            }
            return acc;
        }, {
            totalStudents: 0,
            paidStudents: 0,
            dueStudents: 0,
            totalCollected: 0,
            totalDue: 0
        });
        setSummaryData(summary);
    };

    // Modal handlers
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedStudent(null);
    };

    // Form handlers
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value,
            // Reset section if class changes
            ...(name === 'className' ? {section: ''} : {})
        }));
    };

    const handleSearchChange = (e) => {
        const {name, value} = e.target;
        setSearchValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // UI Components
    const getStatusChip = (status) => {
        const statusConfig = {
            Paid: {color: 'success', label: 'Paid'},
            Due: {color: 'error', label: 'Due'},
            null: {color: 'warning', label: 'Pending'},
            '': {color: 'warning', label: 'Pending'}
        };

        const {color, label} = statusConfig[status] || statusConfig[''];
        return <Chip size="small" color={color} label={label}/>;
    };

    const PaidDetailsModal = ({student}) => (
        <Box sx={modalStyle}>
            <Box sx={modalHeaderStyle}>
                <Typography variant="h6">Payment Details</Typography>
                <IconButton size="small" onClick={handleCloseModal} sx={{color: 'white'}}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box sx={{p: 3}}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Student Name
                        </Typography>
                        <Typography variant="body1">
                            {student.studentName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Admission No
                        </Typography>
                        <Typography variant="body1">
                            {student.admissionNo}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Stack direction="row" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Fee Amount
                            </Typography>
                            <Typography variant="body1">
                                ₹{student.totalAmount}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Transport Fee
                            </Typography>
                            <Typography variant="body1">
                                ₹{student.transportAmount}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Late Fee
                            </Typography>
                            <Typography variant="body1">
                                ₹{student.lateAmount}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{bgcolor: 'primary.light', p: 2, borderRadius: 1}}>
                        <Typography variant="subtitle1" color="white">
                            Total Amount Paid: ₹{student.allTotalAmount}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon/>}
                        onClick={() => {
                            alert('Downloading receipt...');
                            handleCloseModal();
                        }}
                        fullWidth
                    >
                        Download Receipt
                    </Button>
                </Stack>
            </Box>
        </Box>
    );

    const DuePaymentModal = ({student}) => (
        <Box sx={modalStyle}>
            <Box sx={modalHeaderStyle}>
                <Typography variant="h6">Fee Due Notice</Typography>
                <IconButton size="small" onClick={handleCloseModal} sx={{color: 'white'}}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box sx={{p: 3}}>
                <Stack spacing={3}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <WarningIcon color="error" sx={{fontSize: 40}}/>
                        <Typography variant="h6" color="error">
                            Fee Payment Due
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Student Details
                        </Typography>
                        <Typography variant="body1">
                            {student.studentName} (Admission No: {student.admissionNo})
                        </Typography>
                    </Box>
                    <Box sx={{bgcolor: 'error.light', p: 2, borderRadius: 1}}>
                        <Typography variant="subtitle1" color="white">
                            Outstanding Amount: ₹{student.allTotalAmount}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Please clear the outstanding fee amount at your earliest convenience
                        to avoid any late payment charges.
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<MessageIcon/>}
                        onClick={() => {
                            alert('Reminder sent to parent');
                            handleCloseModal();
                        }}
                        fullWidth
                    >
                        Send Reminder
                    </Button>
                </Stack>
            </Box>
        </Box>
    );

    const ModalContent = () => {
        if (!selectedStudent) {
            return (
                <Box sx={modalStyle}>
                    <Typography sx={{p: 3}}>Loading...</Typography>
                </Box>
            );
        }

        return selectedStudent.status === 'Paid' ? (
            <PaidDetailsModal student={selectedStudent}/>
        ) : (
            <DuePaymentModal student={selectedStudent}/>
        );
    };

    // Search Section
    const renderSearchSection = () => (
        <Box sx={{mb: 3}}>
            <Stack direction="row" spacing={2}>
                <TextField
                    name="admissionNo"
                    label="Admission No"
                    value={searchValues.admissionNo}
                    onChange={handleSearchChange}
                    size="small"
                />
                <TextField
                    name="rollNo"
                    label="Roll No"
                    value={searchValues.rollNo}
                    onChange={handleSearchChange}
                    size="small"
                />
                <TextField
                    name="studentName"
                    label="Student Name"
                    value={searchValues.studentName}
                    onChange={handleSearchChange}
                    size="small"
                />
            </Stack>
        </Box>
    );

    // Summary Cards
    const renderSummaryCards = () => (
        <Box sx={{mb: 3}}>
            <Stack direction="row" spacing={2}>
                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography color="text.secondary">Total Students</Typography>
                        <Typography variant="h6">{summaryData.totalStudents}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography color="text.secondary">Total Collected</Typography>
                        <Typography variant="h6">₹{summaryData.totalCollected}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography color="text.secondary">Total Due</Typography>
                        <Typography variant="h6">₹{summaryData.totalDue}</Typography>
                    </CardContent>


                </Card>
            </Stack>
        </Box>
    );

    // Fee Table
    const renderFeeTable = () => {
        if (error) {
            return (
                <Paper sx={{p: 3, textAlign: 'center', color: 'error.main'}}>
                    <Typography>{error}</Typography>
                </Paper>
            );
        }

        if (!filteredFeeData.length) {
            return (
                <Paper sx={{p: 3, textAlign: 'center'}}>
                    <Typography>
                        {formValues.month || formValues.className || formValues.section
                            ? 'No data found for the selected filters'
                            : 'Select class and section to view fee report'}
                    </Typography>
                </Paper>
            );
        }

        return (
            <TableContainer component={Paper} sx={{boxShadow: 2}}>
                <Table>
                    <TableHead>
                        <TableRow sx={{bgcolor: 'grey.100'}}>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Admission No</TableCell>
                            <TableCell>Roll No</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Month</TableCell>
                            <TableCell align="right">Fee Amount</TableCell>
                            <TableCell align="right">Transport Amount</TableCell>
                            <TableCell align="right">Late Amount</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFeeData.map((student) => (
                            <TableRow key={student.id} hover>
                                <TableCell>{student.studentName}</TableCell>
                                <TableCell>{student.admissionNo}</TableCell>
                                <TableCell>{student.rollNo}</TableCell>
                                <TableCell>{student.class || formValues.className}</TableCell>
                                <TableCell>{student.section || formValues.section}</TableCell>
                                <TableCell>{student.month || formValues.month}</TableCell>
                                <TableCell align="right">₹{student.totalAmount}</TableCell>
                                <TableCell align="right">₹{student.transportAmount}</TableCell>
                                <TableCell align="right">₹{student.lateAmount}</TableCell>
                                <TableCell align="right">₹{student.allTotalAmount}</TableCell>
                                <TableCell align="center">
                                    {getStatusChip(student.status)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleOpenModal(student)}
                                        color={student.status === 'Paid' ? 'primary' : 'error'}
                                    >
                                        {student.status === 'Paid' ? <DownloadIcon/> : <MessageIcon/>}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // Main render
    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" sx={{mb: 3}}>Fee Report</Typography>

            {/* Debug information during development */}
            {process.env.NODE_ENV === 'development' && (
                <Paper sx={{p: 2, mb: 2, bgcolor: 'grey.100'}}>
                    <Typography variant="caption">
                        Debug Info: School ID: {schoolId}, Session: {session},
                        Students: {students.length}, Fee Data: {feeData.length}
                    </Typography>
                </Paper>
            )}

            {/* Filters */}
            <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3}}>
                <FormControl fullWidth>
                    <InputLabel>Select Month</InputLabel>
                    <Select
                        name="month"
                        value={formValues.month}
                        onChange={handleChange}
                        label="Select Month"
                    >
                        {months.map((month) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                        name="className"
                        value={formValues.className}
                        onChange={handleChange}
                        label="Select Class"
                    >
                        {classSections && classSections.length > 0 ? (
                            classSections.map((classSection) => (
                                <MenuItem
                                    key={classSection.id}
                                    value={classSection.name}
                                >
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

                <FormControl fullWidth>
                    <InputLabel>Choose Section</InputLabel>
                    <Select
                        name="section"
                        value={formValues.section}
                        onChange={handleChange}
                        disabled={!formValues.className}
                        label="Select Section"
                    >
                        {classSections?.find(
                            (cs) => cs.name === formValues.className
                        )?.sections?.length > 0 ? (
                            classSections
                                .find((cs) => cs.name === formValues.className)
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
            </Box>

            {/* Search Section */}
            {renderSearchSection()}

            {/* Summary Cards */}
            {feeData.length > 0 && renderSummaryCards()}

            {/* Fee Table */}
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <CircularProgress/>
                </Box>
            ) : (
                renderFeeTable()
            )}

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalContent/>
            </Modal>
        </Box>
    );
};

export default FeeReport;