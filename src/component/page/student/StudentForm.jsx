import React, {useEffect, useState} from 'react';

import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import stateDistrictData from './stateDistrictData.json';
import {useSelector} from "react-redux";

const steps = [
    'Personal Details',
    'Academic Details',
    'Guardian Details',
    'Other Details'
];

const StudentForm = ({open, handleClose, handleSave, studentData}) => {
    const initialState = {
        studentName: '', className: '', section: '', classTeacher: '', dob: '', gender: '', category: '', mobileNo: '',
        fatherMobile: '', motherMobile: '', email: '', fatherEmailAddress: '', motherEmailAddress: '',
        bloodGroup: '', aadharNumber: '', role: 'Student', studentPhoto: null,
        admissionNo: '', srNo: '', pen: '', uniqueIdType: '', uniqueId: '',
        stream: '', feeCategory: '', rollNo: '', status: '', newOld: '',
        house: '', fatherName: '', motherName: '', localGuardianName: '',
        guardianAddress: '', guardianMobileNo: '', relationWithStudent: '',
        fatherOccupation: '', religion: '', casteName: '', fatherPhoto: null,
        motherPhoto: null, address: '', state: '', district: '', pinCode: '',
        periodOfResidence: '', withdrawalFileNumber: '', scholarRegisterNumber: '',
        lastSchoolName: '', accountHolderName: '', branchName: '', accountNumber: '',
        ifscCode: '', securityAmount: '', routeForTransport: '', lastDueAmount: '',
        otherInformation: '', vehicleId: '', routeId: ''
    };

    const [student, setStudent] = useState(initialState);
    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [districtOptions, setDistrictOptions] = useState([]);
    const {vehicles} = useSelector(state => state.vehicles);
    const [routes, setRoutes] = useState([]);
    const classSections = useSelector(state => state.master.data.classSections);
    useEffect(() => {
        if (studentData) {
            setStudent(studentData);
        }
    }, [studentData]);

    useEffect(() => {
        if (studentData) {
            setStudent(studentData);
        } else {
            // Reset form fields when adding a new student
            setStudent(initialState);
            setErrors({}); // Clear any existing errors
        }
        // Cleanup function
        return () => {
            setStudent(initialState);
            setErrors({});
        };
    }, [open, studentData]);

    useEffect(() => {
        if (studentData) {
            setStudent(studentData);
        } else {
            // Reset form fields when adding a new student
            setStudent({
                studentName: '',
                className: '',
                section: '',
                classTeacher: '',
                dob: '',
                gender: '',
                category: '',
                mobileNo: '',
                fatherMobile: '',
                motherMobile: '',
                email: '',
                fatherEmailAddress: '',
                motherEmailAddress: '',
                bloodGroup: '',
                aadharNumber: '',
                role: 'Student',
                studentPhoto: null,
                admissionNo: '',
                srNo: '',
                pen: '',
                uniqueIdType: '',
                uniqueId: '',
                stream: '',
                feeCategory: '',
                rollNo: '',
                status: '',
                newOld: '',
                house: '',
                fatherName: '',
                motherName: '',
                localGuardianName: '',
                guardianAddress: '',
                guardianMobileNo: '',
                relationWithStudent: '',
                fatherOccupation: '',
                religion: '',
                casteName: '',
                fatherPhoto: null,
                motherPhoto: null,
                address: '',
                state: '',
                district: '',
                pinCode: '',
                periodOfResidence: '',
                withdrawalFileNumber: '',
                scholarRegisterNumber: '',
                lastSchoolName: '',
                accountHolderName: '',
                branchName: '',
                accountNumber: '',
                ifscCode: '',
                securityAmount: '',
                routeForTransport: '',
                lastDueAmount: '',
                otherInformation: '',
                vehicleId: '',
                routeId: ''
            });
        }
    }, [studentData]);
    const errorStyle = {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'error.main',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'error.main',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'error.main',
        },
        '& .MuiSelect-select': {
            color: 'error.main',
        },
        '& .MuiInputLabel-root': {
            color: 'error.main',
        },
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'studentName':
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : "Student name should contain only letters, numbers, and spaces";
            case 'className':
                return value ? '' : "Class name is required";
            case 'section':
                return value ? '' : "section name is required";

            case 'gender':
                return value ? '' : "Gender is required";
            case 'mobileNo':
                return /^\d{10}$/.test(value) ? '' : "Mobile number should be 10 digits";
            case 'email':
                // Regex to validate email format and specific domain endings
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|gov|co|org|net|edu)$/.test(value) ? '' : "Please enter a valid email address.";
            case "fatherEmailAddress":
                return value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : value
                        ? "Father's email is invalid."
                        : ""; // No error if blank
            case "motherEmailAddress":
                return value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : value
                        ? "Mother's email is invalid."
                        : ""; // No error if blank
            case 'dob':
                const dobDate = new Date(value);
                const today = new Date();
                return dobDate < today ? '' : "Date of birth should be a past date";
            case 'admissionNo':
                return value ? '' : "Admission number is required";
            case 'rollNo':
                return value ? '' : "Roll number is required";
            case 'fatherName':
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : "Father's name should contain only letters and spaces";

            case 'guardianMobileNo':
                return /^\d{10}$/.test(value) ? '' : "Guardian mobile number should be 10 digits";
            case "fatherMobile":
                return value.trim() && /^[0-9]{10}$/.test(value)
                    ? ""
                    : value
                        ? "Father's mobile should be a 10-digit number."
                        : ""; // No error if blank
            case "motherMobile":
                return value.trim() && /^[0-9]{10}$/.test(value)
                    ? ""
                    : value
                        ? "Mother's mobile should be a 10-digit number."
                        : ""; // No error if blank
            case 'address':
                return value.trim() ? '' : "Address is required";
            case 'pinCode':
                return /^\d{6}$/.test(value) ? '' : "Pin code should be 6 digits";
            case 'category':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "Category should contain only letters and spaces" : '');
            case 'classTeacher':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "classTeacher should contain only letters and spaces" : '');
            case 'bloodGroup':
                // Check if blood group is optional; validate only if a value is provided
                const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
                return value === '' || validBloodGroups.includes(value) ? '' : "Please select a valid blood group";

            case 'aadharNumber':
                // Validate only if there is input; no error if left blank
                return value === '' || /^\d{12}$/.test(value) ? '' : "Aadhar number should be 12 digits";
            case 'state':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "state should contain only letters and spaces" : '');
            case 'district':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "Invalid district" : '');
            case 'motherName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "motherName should contain only letters and spaces" : '');
            case 'localGuardianName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "localGuardianName should contain only letters and spaces" : '');
            case 'guardianAddress':
                // Error if input has less than 4 characters; no error if left blank
                return value === '' || value.trim().length >= 4
                    ? ''
                    : "guardianAddress must be at least 4 characters long.";
            case 'relationWithStudent':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "relationWithStudent like uncle,brother,etc" : '');
            case 'fatherOccupation':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "fatherOccupation should contain only letters and spaces" : '');
            case 'religion':
                // Validate only if there is input; no error if left blank
                const validReligions = ["Hindu", "Islam", "Christian", "Buddhist", "Sikh", "Other"];
                return value === '' || validReligions.includes(value) ? '' : "Religion must be one of the predefined values.";

            case 'casteName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "casteName should contain only letters and spaces" : '');
            case 'fatherOccupation':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "fatherOccupation should contain only letters and spaces" : '');
            case 'periodOfResidence':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "periodOfResidence should contain only letters and spaces" : '');
            case 'withdrawalFileNumber':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "withdrawalFileNumber should contain only letters, numbers and spaces" : '');
            case 'scholarRegisterNumber':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "scholarRegisterNumber should contain only letters, numbers and spaces" : '');
            case 'lastSchoolName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "lastSchoolName should contain only letters , numbers and spaces" : '');
            case 'accountHolderName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "accountHolderName should contain only letters , numbers and spaces" : '');
            case 'branchName':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "branchName should contain only letters , numbers and spaces" : '');
            case 'accountNumber':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "accountNumber should contain only letters , numbers and spaces" : '');
            case 'ifscCode':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z0-9\s]+$/.test(value) ? '' : (value ? "ifscCode should contain only letters , numbers and spaces" : '');
            case 'securityAmount':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[0-9]+$/.test(value) ? '' : (value ? "securityAmount should contain only numbers" : '');
            case 'routeForTransport':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "routeForTransport should contain only letters and spaces" : '');
            case 'lastDueAmount':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[0-9]+$/.test(value) ? '' : (value ? "lastDueAmount should contain only numbers" : '');
            case 'otherInformation':
                // Only validate if category has input; no error if left blank
                return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "otherInformation should contain only letters and spaces" : '');
            // case 'vehicleId':
            //     // Only validate if category has input; no error if left blank
            //     return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "vehicleId should contain only letters and spaces" : '');
            // case 'routeId':
            //     // Only validate if category has input; no error if left blank
            //     return value.trim() && /^[a-zA-Z\s]+$/.test(value) ? '' : (value ? "routeId should contain only letters and spaces" : '');

            default:
                return '';
        }
    };

    const validateForm = () => {
        let tempErrors = {};

        Object.keys(student).forEach(key => {
            const error = validateField(key, student[key]);
            if (error) {
                tempErrors[key] = error;
            }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = async (e, isRoute = false) => {
        const {name, value, files} = e.target;

        if (files) {
            const file = files[0];
            const base64 = await convertToBase64(file);
            setStudent({
                ...student,
                [name]: base64
            });
        } else {
            if (name === 'state') {
                setDistrictOptions(stateDistrictData.districts[value] || []);
                setStudent({
                    ...student,
                    [name]: value,
                    district: ''  // Reset district when state changes
                });
            } else if (name === 'vehicleId') {
                const selectedVehicle = vehicles.find(v => v.id === value);
                const vehicleRoutes = selectedVehicle ? selectedVehicle.routes : [];
                setRoutes(vehicleRoutes);
                setStudent({
                    ...student,
                    [name]: value,
                    routeId: ''  // Reset route when vehicle changes
                });
            } else if (isRoute && name === 'routeId') {
                const selectedRoute = routes.find(r => r.id === value);
                setStudent({
                    ...student,
                    [name]: selectedRoute ? selectedRoute.id : ''
                });
            } else {
                setStudent({
                    ...student,
                    [name]: value
                });
            }
            // Validate the changed field
            const fieldError = validateField(name, value);
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: fieldError
            }));
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            handleSave(student);

            setStudent(initialState);
            // Clear errors
            setErrors({});

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
                handleClose(); // Close the dialog after submission
            }, 3000);
            setSuccessMessage("Student information submitted successfully!");
        } else {
            // Show error message
            alert("Please correct the errors in the form.");
        }
    };
    const handleRemoveImage = (name) => {
        setStudent((prevState) => ({
            ...prevState,
            [name]: null
        }));
    };
    const renderImageUpload = (label, name) => (
        <Grid item xs={6} key={name}>
            <input
                accept="image/*"
                style={{display: 'none'}}
                id={`upload-${name}`}
                type="file"
                name={name}
                onChange={handleChange}
            />
            <label htmlFor={`upload-${name}`}>
                <Button variant="contained" color="primary" component="span">
                    Upload {label}
                </Button>
            </label>
            {student[name] && (
                <>
                    <Avatar
                        src={`data:image/jpeg;base64,${student[name]}`}
                        alt={label}
                        sx={{width: 56, height: 56, mt: 2}}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveImage(name)}
                        sx={{mt: 2, ml: 2}}
                    >
                        Remove
                    </Button>
                </>
            )}
        </Grid>
    );
    const StyledSubtitle = ({text}) => {
        return (
            <Typography
                variant="subtitle1"
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginTop: '30px',
                    fontWeight: 'bold' // Make the text bold
                }}
            >
                {text}
                <span
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px', // Thickness of the underline
                        backgroundColor: '#1976d2', // Color of the underline
                    }}
                />
            </Typography>
        );
    };
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Student Form</DialogTitle>
            <DialogContent>
                {/* <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper> */}
                <form noValidate autoComplete="off">
                    {/* Personal Details Section */}
                    <StyledSubtitle text="Personal Details"/>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="studentName"
                                label="Student Name"
                                fullWidth
                                value={student?.studentName || ''}
                                onChange={handleChange}
                                required
                                error={!!errors.studentName}
                                helperText={errors.studentName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="className-label"
                                            error={!!errors.className}
                                            sx={errors.className ? errorStyle : {}}
                                >
                                    Class Name</InputLabel>
                                <Select
                                    labelId="className-label"
                                    id="className"
                                    name="className"
                                    value={student?.className || ''}
                                    onChange={handleChange}
                                    label="Class Name"
                                    required
                                    error={!!errors.className}
                                    sx={errors.className ? errorStyle : {}}


                                >
                                    {classSections && classSections.length > 0 ? (
                                        classSections.map((classSection) => (
                                            <MenuItem key={classSection.id} value={classSection?.name || ''}>
                                                {classSection.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="" disabled>
                                            No Classes Available
                                        </MenuItem>
                                    )}
                                </Select>
                                {errors.className && <FormHelperText error>{errors.className}</FormHelperText>}

                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={errors.section ? errorStyle : {}}>Select Section</InputLabel>
                                <Select
                                    label="Select Section"
                                    name="section"
                                    value={student?.section || ''}
                                    onChange={handleChange}
                                    disabled={!student.className}
                                    sx={errors.section ? errorStyle : {}}
                                >
                                    {classSections?.find(cs => cs.name === student.className)?.sections?.length > 0 ? (
                                        classSections
                                            .find(cs => cs.name === student.className)
                                            .sections.map((section) => (
                                            <MenuItem key={section.id} value={section?.name || ''}>
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
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="classTeacher"
                                label="Class Teacher"
                                fullWidth
                                value={student?.classTeacher || ''}
                                onChange={handleChange}
                                error={!!errors.classTeacher}
                                helperText={errors.classTeacher}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="dob"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                value={student?.dob || ''}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                                required
                                error={!!errors.dob}
                                helperText={errors.dob}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense" required error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    label="Gender"
                                    value={student?.gender || ''}
                                    onChange={handleChange}
                                    helperText={errors.gender}

                                ><MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.gender && <p style={{color: 'red', fontSize: '0.75rem'}}>{errors.gender}</p>}
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense" error={!!errors.category}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    name="category"
                                    value={student?.category || ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="General">General</MenuItem>
                                    <MenuItem value="OBC">OBC</MenuItem>
                                    <MenuItem value="SC">SC</MenuItem>
                                    <MenuItem value="ST">ST</MenuItem>
                                    <MenuItem value="EWS">EWS</MenuItem>
                                    <MenuItem value="Differently Abled">Differently Abled</MenuItem>
                                    <MenuItem value="Orphan">Orphan</MenuItem>
                                    <MenuItem value="Sports Quota">Sports Quota</MenuItem>
                                    <MenuItem value="Minority">Minority</MenuItem>
                                </Select>
                                {errors.category && (
                                    <FormHelperText>{errors.category}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="mobileNo"
                                label="Mobile No"
                                fullWidth
                                value={student?.mobileNo || ''}
                                onChange={handleChange}
                                required
                                error={!!errors.mobileNo}
                                helperText={errors.mobileNo}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email Address"
                                fullWidth
                                value={student?.email || ''}
                                onChange={handleChange}
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense" error={!!errors.bloodGroup}>
                                <InputLabel>Blood Group</InputLabel>
                                <Select
                                    name="bloodGroup"
                                    value={student?.bloodGroup || ''}
                                    onChange={handleChange}
                                    label="Blood Group"
                                >
                                    <MenuItem value="A+">A+</MenuItem>
                                    <MenuItem value="A-">A-</MenuItem>
                                    <MenuItem value="B+">B+</MenuItem>
                                    <MenuItem value="B-">B-</MenuItem>
                                    <MenuItem value="AB+">AB+</MenuItem>
                                    <MenuItem value="AB-">AB-</MenuItem>
                                    <MenuItem value="O+">O+</MenuItem>
                                    <MenuItem value="O-">O-</MenuItem>
                                </Select>
                                <FormHelperText>{errors.bloodGroup}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="aadharNumber"
                                label="Aadhaar Number"
                                fullWidth
                                value={student?.aadharNumber || ''}
                                onChange={handleChange}
                                error={!!errors.aadharNumber}
                                helperText={errors.aadharNumber}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="role"
                                label="Designation"
                                fullWidth
                                value={student?.role || ''}
                                onChange={handleChange}
                                error={!!errors.role}
                                helperText={errors.role}
                            />
                        </Grid>
                        {renderImageUpload("Student Photo", "studentPhoto")}
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>State</InputLabel>
                                <Select
                                    label="state"
                                    name="state"
                                    value={student?.state || ''}
                                    onChange={handleChange}

                                >
                                    {stateDistrictData.states.map(state => (
                                        <MenuItem key={state} value={state}>
                                            {state}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>District</InputLabel>
                                <Select
                                    label="district"
                                    name="district"
                                    value={student?.district || ''}
                                    onChange={handleChange}
                                    error={!!errors.district}
                                    helperText={errors.district}
                                >
                                    {districtOptions.map(district => (
                                        <MenuItem key={district} value={district}>
                                            {district}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <StyledSubtitle text="Academic Details"/>
                            <Divider style={{marginBottom: '16px'}}/>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="admissionNo"
                                    label="Admission No"
                                    fullWidth
                                    value={student?.admissionNo || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.admissionNo}
                                    helperText={errors.admissionNo}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="srNo"
                                    label="SR No"
                                    fullWidth
                                    value={student?.srNo || ''}
                                    onChange={handleChange}
                                    error={!!errors.srNo}
                                    helperText={errors.srNo}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="pen"
                                    label="PEN"
                                    fullWidth
                                    value={student?.pen || ''}
                                    onChange={handleChange}
                                    error={!!errors.pen}
                                    helperText={errors.pen}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="uniqueIdType"
                                    label="Unique ID Type"
                                    fullWidth
                                    value={student?.uniqueIdType || ''}
                                    onChange={handleChange}
                                    error={!!errors.uniqueIdType}
                                    helperText={errors.uniqueIdType}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="uniqueId"
                                    label="Unique ID"
                                    fullWidth
                                    value={student?.uniqueId || ''}
                                    onChange={handleChange}
                                    error={!!errors.uniqueId}
                                    helperText={errors.uniqueId}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="stream"
                                    label="Stream"
                                    fullWidth
                                    value={student?.stream || ''}
                                    onChange={handleChange}
                                    error={!!errors.stream}
                                    helperText={errors.stream}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="feeCategory"
                                    label="Fee Category"
                                    fullWidth
                                    value={student?.feeCategory || ''}
                                    onChange={handleChange}
                                    error={!!errors.feeCategory}
                                    helperText={errors.feeCategory}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="rollNo"
                                    label="Roll No"
                                    fullWidth
                                    value={student?.rollNo || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.rollNo}
                                    helperText={errors.rollNo}
                                />
                            </Grid></Grid>


                        <Grid item xs={12}>
                            <StyledSubtitle text="Guardian Details"/>
                            <Divider style={{marginBottom: '16px'}}/>
                        </Grid>
                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="fatherName"
                                    label="Father's Name"
                                    fullWidth
                                    value={student?.fatherName || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.fatherName}
                                    helperText={errors.fatherName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="fatherMobile"
                                    label="Father's Mobile"
                                    fullWidth
                                    value={student?.fatherMobile || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.fatherMobile}
                                    helperText={errors.fatherMobile}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="fatherEmailAddress"
                                    label="Father's Email"
                                    fullWidth
                                    value={student?.fatherEmailAddress || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.fatherEmailAddress}
                                    helperText={errors.fatherEmailAddress}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="motherName"
                                    label="Mother's Name"
                                    fullWidth
                                    value={student?.motherName || ''}
                                    onChange={handleChange}
                                    error={!!errors.motherName}
                                    helperText={errors.motherName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="motherMobile"
                                    label="Mother's Mobile"
                                    fullWidth
                                    value={student?.motherMobile || ''}
                                    onChange={handleChange}
                                    error={!!errors.motherMobile}
                                    helperText={errors.motherMobile}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="motherEmailAddress"
                                    label="Mother's Email"
                                    fullWidth
                                    value={student?.motherEmailAddress || ''}
                                    onChange={handleChange}
                                    error={!!errors.motherEmailAddress}
                                    helperText={errors.motherEmailAddress}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="localGuardianName"
                                    label="Local Guardian Name"
                                    fullWidth
                                    value={student?.localGuardianName || ''}
                                    onChange={handleChange}
                                    error={!!errors.localGuardianName}
                                    helperText={errors.localGuardianName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="guardianAddress"
                                    label="Guardian Address"
                                    fullWidth
                                    value={student?.guardianAddress || ''}
                                    onChange={handleChange}
                                    error={!!errors.guardianAddress}
                                    helperText={errors.guardianAddress}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="guardianMobileNo"
                                    label="Guardian Mobile No"
                                    fullWidth
                                    value={student?.guardianMobileNo || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.guardianMobileNo}
                                    helperText={errors.guardianMobileNo}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="relationWithStudent"
                                    label="Relation with Student"
                                    fullWidth
                                    value={student?.relationWithStudent || ''}
                                    onChange={handleChange}
                                    error={!!errors.relationWithStudent}
                                    helperText={errors.relationWithStudent}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="fatherOccupation"
                                    label="Father's Occupation"
                                    fullWidth
                                    value={student?.fatherOccupation || ''}
                                    onChange={handleChange}
                                    error={!!errors.fatherOccupation}
                                    helperText={errors.fatherOccupation}
                                />
                            </Grid>
                            {renderImageUpload("Father's Photo", "fatherPhoto")}
                            {renderImageUpload("Mother's Photo", "motherPhoto")}
                        </Grid>

                        <Grid item xs={12}>
                            <StyledSubtitle text="Other Details"/>
                            <Divider style={{marginBottom: '16px'}}/>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    value={student?.address || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="dense" error={!!errors.religion}>
                                    <InputLabel id="religion-label">Religion</InputLabel>
                                    <Select
                                        labelId="religion-label"
                                        name="religion"
                                        value={student?.religion || ''}
                                        onChange={handleChange}
                                        displayEmpty // Allow for an empty selection
                                    >

                                        <MenuItem value="Hindu">Hindu</MenuItem>
                                        <MenuItem value="Islam">Islam</MenuItem>
                                        <MenuItem value="Christian">Christian</MenuItem>
                                        <MenuItem value="Buddhist">Buddhist</MenuItem>
                                        <MenuItem value="Sikh">Sikh</MenuItem>
                                        <MenuItem value="Sikh">Other</MenuItem>
                                    </Select>
                                    {errors.religion && <FormHelperText>{errors.religion}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="casteName"
                                    label="Caste Name"
                                    fullWidth
                                    value={student?.casteName || ''}
                                    onChange={handleChange}
                                    error={!!errors.casteName}
                                    helperText={errors.casteName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="pinCode"
                                    label="Pin Code"
                                    fullWidth
                                    value={student?.pinCode || ''}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.pinCode}
                                    helperText={errors.pinCode}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="periodOfResidence"
                                    label="Period of Residence"
                                    fullWidth
                                    value={student?.periodOfResidence || ''}
                                    onChange={handleChange}
                                    error={!!errors.periodOfResidence}
                                    helperText={errors.periodOfResidence}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="withdrawalFileNumber"
                                    label="Withdrawal File Number"
                                    fullWidth
                                    value={student?.withdrawalFileNumber || ''}
                                    onChange={handleChange}
                                    error={!!errors.withdrawalFileNumber}
                                    helperText={errors.withdrawalFileNumber}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="scholarRegisterNumber"
                                    label="Scholar Register Number"
                                    fullWidth
                                    value={student?.scholarRegisterNumber || ''}
                                    onChange={handleChange}
                                    error={!!errors.scholarRegisterNumber}
                                    helperText={errors.scholarRegisterNumber}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="lastSchoolName"
                                    label="Last School Name"
                                    fullWidth
                                    value={student?.lastSchoolName || ''}
                                    onChange={handleChange}
                                    error={!!errors.lastSchoolName}
                                    helperText={errors.lastSchoolName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="accountHolderName"
                                    label="Account Holder Name"
                                    fullWidth
                                    value={student?.accountHolderName || ''}
                                    onChange={handleChange}
                                    error={!!errors.accountHolderName}
                                    helperText={errors.accountHolderName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="branchName"
                                    label="Branch Name"
                                    fullWidth
                                    value={student?.branchName || ''}
                                    onChange={handleChange}
                                    error={!!errors.branchName}
                                    helperText={errors.branchName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="accountNumber"
                                    label="Account Number"
                                    fullWidth
                                    value={student?.accountNumber || ''}
                                    onChange={handleChange}
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="ifscCode"
                                    label="IFSC Code"
                                    fullWidth
                                    value={student?.ifscCode || ''}
                                    onChange={handleChange}
                                    error={!!errors.ifscCode}
                                    helperText={errors.ifscCode}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="securityAmount"
                                    label="Security Amount"
                                    fullWidth
                                    value={student?.securityAmount || ''}
                                    onChange={handleChange}
                                    error={!!errors.securityAmount}
                                    helperText={errors.securityAmount}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="routeForTransport"
                                    label="Route for Transport"
                                    fullWidth
                                    value={student?.routeForTransport || ''}
                                    onChange={handleChange}
                                    error={!!errors.routeForTransport}
                                    helperText={errors.routeForTransport}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="lastDueAmount"
                                    label="Last Due Amount"
                                    fullWidth
                                    value={student?.lastDueAmount || ''}
                                    onChange={handleChange}
                                    error={!!errors.lastDueAmount}
                                    helperText={errors.lastDueAmount}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="otherInformation"
                                    label="Other Information"
                                    fullWidth
                                    value={student?.otherInformation || ''}
                                    onChange={handleChange}
                                    error={!!errors.otherInformation}
                                    helperText={errors.otherInformation}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="select-vehicle">Vehicle</InputLabel>
                                    <Select
                                        labelId='select-vehicle'
                                        label='Vehicle'
                                        name="vehicleId"
                                        value={student?.vehicleId || ''}
                                        onChange={handleChange}
                                    >
                                        {vehicles.map(vehicle => (
                                            <MenuItem key={vehicle.id} value={vehicle?.id || ''}>
                                                {vehicle.vehicleName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="select-route">Route</InputLabel>
                                    <Select

                                        label="Route"
                                        name="routeName"
                                        value={student?.routeName || ''}

                                        onChange={(e) => handleChange(e, true)}
                                        error={!!errors.routeId}
                                        helperText={errors.routeId}
                                    >
                                        {routes.length > 0 ? (
                                            routes.map(route => (
                                                <MenuItem key={route.id} value={route?.id || ''}>
                                                    {route.routeName}
                                                </MenuItem>
                                            ))) : (
                                            <MenuItem disabled>No routes available</MenuItem>
                                        )
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                {/* <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Back
                </Button> */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Finish
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentForm;
