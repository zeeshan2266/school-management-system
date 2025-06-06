import React, {useEffect, useState} from 'react';
import {
    Box,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import {useDispatch, useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import {fetchStudents} from "../../student/redux/studentActions";
import {FeeCard} from "./FeeCard";

const FeeDueReport = () => {
    const dispatch = useDispatch();

    // Constants
    const [months] = useState([
        "April", "May", "June", "July", "August",
        "September", "October", "November", "December",
        "January", "February", "March"
    ]);

    const searchTypes = [
        {value: 'name', label: 'Student Name'},
        {value: 'admissionNo', label: 'Admission No'},
        {value: 'rollNo', label: 'Roll No'},
        {value: 'classSection', label: 'Class-Section'}
    ];

    // Redux Selectors
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id || '';
    const session = userData?.session || '';
    const students = useSelector((state) => state.students.students || []);
    const classSections = useSelector((state) => state.master.data.classSections || []);

    // Local State
    const [feeReportData, setFeeReportData] = useState([]);
    const [filteredFeeData, setFilteredFeeData] = useState([]);
    const [combinedFeeData, setCombinedFeeData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Data Loading
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchStudents());
        }
    }, [schoolId, session, dispatch]);

    // Fetch fee report when filters change
    useEffect(() => {
        if (selectedMonth || selectedClass || selectedSection) {
            fetchFeeReport();
        }
    }, [selectedMonth, selectedClass, selectedSection, schoolId, session]);

    // Combine paid and unpaid students data
    useEffect(() => {
        if (students.length > 0 && selectedMonth) {
            const allStudentsData = students.map(student => {
                // Check if student has paid fees for selected month
                const paidFeeData = feeReportData.find(fee =>
                    fee.studentId === student.id && fee[selectedMonth] === true
                );

                if (paidFeeData) {
                    return {
                        ...paidFeeData,
                        status: 'Paid',
                        [selectedMonth]: true,
                        studentName: student.studentName
                    };
                }

                // Create unpaid fee data
                return {
                    id: `unpaid-${student.id}`,
                    studentId: student.id,
                    status: 'Unpaid',
                    studentName: student.studentName,
                    rollNo: student.rollNo,
                    className: student.className,
                    section: student.section,
                    fatherName: student.fatherName,
                    motherName: student.motherName,
                    mobileNumber: student.mobileNo,           // Changed from mobileNumber
                    emailAddress: student.email,              // Changed from emailAddress
                    fatherMobileNumber: student.fatherMobile, // Changed from fatherMobileNumber
                    motherMobileNumber: student.motherMobile, // Changed from motherMobileNumber
                    fatherEmailAddress: student.fatherEmailAddress,
                    motherEmailAddress: student.motherEmailAddress,
                    session: session,
                    creationDateTime: new Date().toISOString(),
                    [selectedMonth]: false,
                    allTotalAmount: 0,
                    feeAmounts: {},
                    transportAmount: 0,
                    lateAmount: 0
                };
            });

            setCombinedFeeData(allStudentsData);
            applyFilters(allStudentsData);
        }
    }, [students, feeReportData, selectedMonth, session]);

    // Apply filters to data
    const applyFilters = (data) => {
        if (!data) return;

        let filtered = [...data];

        // Apply student filters
        if (filteredStudents.length > 0) {
            const studentIds = filteredStudents.map(student => student.id);
            filtered = filtered.filter(feeData =>
                studentIds.includes(feeData.studentId)
            );
        }

        // Apply class filter
        if (selectedClass) {
            filtered = filtered.filter(feeData => {
                const student = students.find(s => s.id === feeData.studentId);
                return student?.className === selectedClass;
            });
        }

        // Apply section filter
        if (selectedSection) {
            filtered = filtered.filter(feeData => {
                const student = students.find(s => s.id === feeData.studentId);
                return student?.section === selectedSection;
            });
        }

        setFilteredFeeData(filtered);
    };

    // API Calls
    const fetchFeeReport = async () => {
        if (!selectedMonth) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/fees/fee-deposit/filter', {
                params: {
                    schoolId,
                    session,
                    month: selectedMonth,
                    className: selectedClass || undefined,
                    section: selectedSection || undefined
                }
            });

            setFeeReportData(response.data);
        } catch (error) {
            console.error('Error fetching fee report:', error);
            setError('Failed to fetch fee report data');
        } finally {
            setLoading(false);
        }
    };

    // Event Handlers
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
        setSearchValue('');
        setSelectedClass('');
        setSelectedSection('');
        setFilteredStudents([]);
    };

    const handleSearchValueChange = (event, newValue) => {
        console.log('Search Value Changed:', {newValue, searchType});
        setSearchValue(newValue);

        if (!newValue) {
            console.log('No search value, clearing filtered students');
            setFilteredStudents([]);
            setFilteredFeeData(combinedFeeData); // Reset to all fee data
            return;
        }

        console.log('Current students array:', students);

        const student = students.find(student => {
            const matchCondition = (() => {
                switch (searchType) {
                    case 'name':
                        console.log('Comparing names:', {
                            studentName: student.studentName,
                            searchValue: newValue,
                            isMatch: student.studentName === newValue
                        });
                        return student.studentName === newValue;
                    case 'admissionNo':
                        console.log('Comparing admission numbers:', {
                            admissionNo: student.admissionNo,
                            searchValue: newValue,
                            isMatch: student.admissionNo === newValue
                        });
                        return student.admissionNo === newValue;
                    case 'rollNo':
                        console.log('Comparing roll numbers:', {
                            rollNo: student.rollNo,
                            searchValue: newValue,
                            isMatch: student.rollNo === newValue
                        });
                        return student.rollNo === newValue;
                    default:
                        console.log('No matching search type:', searchType);
                        return false;
                }
            })();
            return matchCondition;
        });

        console.log('Found student:', student);

        // Update filteredStudents
        setFilteredStudents(student ? [student] : []);

        // Update filteredFeeData based on the found student
        if (student) {
            const filteredFees = combinedFeeData.filter(feeData =>
                feeData.studentId === student.id
            );
            setFilteredFeeData(filteredFees);
        } else {
            setFilteredFeeData([]); // Clear fee data if no student found
        }
    };

    const handleClassChange = (event) => {
        const selectedClass = event.target.value;
        setSelectedClass(selectedClass);
        setSelectedSection('');

        const filtered = students.filter(student =>
            student.className === selectedClass
        );
        setFilteredStudents(filtered);
    };

    const handleSectionChange = (event) => {
        const selectedSection = event.target.value;
        setSelectedSection(selectedSection);

        const filtered = students.filter(student =>
            student.className === selectedClass &&
            student.section === selectedSection
        );
        setFilteredStudents(filtered);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSelectedClass('');
        setSelectedSection('');
        setFilteredStudents([]);
        applyFilters(combinedFeeData);
    };

    const handleRemoveStudent = (studentId) => {
        setFilteredStudents(prev => prev.filter(student => student.id !== studentId));
    };

    // Helper Functions
    const getOptions = () => {
        switch (searchType) {
            case 'name':
                return students.map(student => student.studentName).filter(Boolean);
            case 'admissionNo':
                return students.map(student => student.admissionNo).filter(Boolean);
            case 'rollNo':
                return students.map(student => student.rollNo).filter(Boolean);
            default:
                return [];
        }
    };

    const getFilteredSections = () => {
        if (!selectedClass) return [];
        const selectedClassData = classSections.find(cs => cs.name === selectedClass);
        return selectedClassData?.sections || [];
    };

    // Render Functions
    const renderSelectedStudents = () => {
        if (!filteredStudents.length) return null;

        return (
            <Box sx={{mt: 3, mb: 3}}>
                <Typography variant="h6" sx={{mb: 2}}>Selected Students</Typography>
                <Grid container spacing={1}>
                    {filteredStudents.map((student) => (
                        <Grid item key={student.id}>
                            <Chip
                                label={`${student.studentName} (${student.className}-${student.section})`}
                                onDelete={() => handleRemoveStudent(student.id)}
                                sx={{m: 0.5}}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Divider sx={{mt: 2}}/>
            </Box>
        );
    };

    const renderSearchFields = () => {
        if (searchType === 'classSection') {
            return (
                <>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={handleClassChange}
                                label="Select Class"
                            >
                                {classSections.map(cs => (
                                    <MenuItem key={cs.name} value={cs.name}>{cs.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth size="small" disabled={!selectedClass}>
                            <InputLabel>Select Section</InputLabel>
                            <Select
                                value={selectedSection}
                                onChange={handleSectionChange}
                                label="Select Section"
                            >
                                {getFilteredSections().map(cs => (
                                    <MenuItem key={cs.name} value={cs.name}>{cs.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </>
            );
        }

        return (
            <Grid item xs={12} md={4}>
                <Autocomplete
                    fullWidth
                    size="small"
                    options={getOptions()}
                    value={searchValue}
                    onChange={handleSearchValueChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={`Search by ${searchType || 'criteria'}`}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        <SearchIcon color="action"/>
                                        {searchValue && (
                                            <IconButton size="small" onClick={handleClearSearch}>
                                                <ClearIcon/>
                                            </IconButton>
                                        )}
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </Grid>
        );
    };

    const renderFeeDetails = () => {
        if (loading) return <Typography>Loading...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;
        if (!selectedMonth) return <Typography>Please select a month to view fee details</Typography>;
        if (filteredFeeData.length === 0) return <Typography>No fee data found</Typography>;

        return (
            <Box sx={{mt: 3}}>
                {filteredFeeData.map(feeData => {
                    const student = students.find(s => s.id === feeData.studentId);
                    console.log("render feeDetails ", student)
                    return (
                        <FeeCard
                            key={feeData.id}
                            feeData={feeData}
                            student={student}
                            months={months}
                        />
                    );
                })}
            </Box>
        );
    };

    return (
        <Box sx={{p: 3}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Select Month</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            label="Select Month"
                        >
                            {months.map((month) => (
                                <MenuItem key={month} value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Search By</InputLabel>
                        <Select
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            label="Search By"
                        >
                            {searchTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {renderSearchFields()}
            </Grid>
            {renderSelectedStudents()}
            {renderFeeDetails()}
        </Box>
    );
};

export default FeeDueReport;