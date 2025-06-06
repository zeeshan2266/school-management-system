import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {roles} from "../../../common";

const StaffForm = ({staff, onSubmit, onCancel}) => {
    const designation = useSelector(state => state.master.data?.designation || []);

    const [formData, setFormData] = useState({
        name: '',
        post: '',
        phone: '',
        email: '',
        role: '',
        staffType: 'Teaching',
        dateOfBirth: 'null',
        cAddress1: '',
        cAddress2: '',
        cCity: '',
        pAddress1: '',
        pAddress2: '',
        pCity: '',
        mobile1: '',
        mobile2: '',
        gender: 'Male',
        qualification: '',
        expertIn: '',
        father: '',
        mother: '',
        married: 'No',
        spouseName: '',
        joiningDate: 'null',
        aadharNo: '',
        monthSalary: '',
        bankAccountNumber: '',
        bankIfsc: '',
        bankAccountName: '',
        photo: null,
        identificationDocuments: null,
        educationalCertificate: null,
        professionalQualifications: null,
        experienceCertificates: null,
        bankAccount: null,
        previousEmployer: null,
        loginId: '',
        password: '',
        userId: '',
        imageRefId: '',
        vehicleId: '',
        routeId: '',
        creationDateTime: null,
        staffId: '',

    });
    const [activeStep, setActiveStep] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [routes, setRoutes] = useState([]);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {vehicles} = useSelector(state => state.vehicles);
    useEffect(() => {
        if (staff) {
            setFormData((prevData) => ({
                ...prevData,
                ...staff,
                // dateOfBirth: staff.dateOfBirth ? dayjs(staff.dateOfBirth) : null,
                // joiningDate: staff.joiningDate ? dayjs(staff.joiningDate) : null,
                staffType: staff.staffType || prevData.staffType,
                creationDateTime: staff.creationDateTime ? dayjs(staff.creationDateTime) : null,
                staffId: staff.staffId, // Add this line


            }));
        }
    }, [staff]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [e.target.name]: e.target.value});
        if (errors[name]) {
            setErrors((prevErrors) => ({...prevErrors, [name]: undefined}));
        }

    };

    const handleFileChange = (e) => {
        const {name, files} = e.target;
        setFormData({...formData, [name]: files[0]});
    };


    const handleDateChange = (name, date) => {
        setFormData({...formData, [name]: date ? dayjs(date) : null});
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleClose = () => {
        setOpen(false);
        if (onCancel) onCancel();
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                return reject(new TypeError('Expected file to be a Blob'));
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    };


    const validateForm = () => {
        const newErrors = {};
        // Example validation rules
        if (!formData.name) newErrors.name = 'Name is required';

        if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid (e.g., abc@gmail.com)';
        if (!formData.mobile1 || formData.mobile1.length !== 10) newErrors.mobile1 = 'Mobile1 must be 10 digits';
        if (formData.mobile2 && !/^\d{10}$/.test(formData.mobile2)) {
            newErrors.mobile2 = 'Mobile2 must be exactly 10 digits';
        }

        if (!formData.monthSalary || isNaN(formData.monthSalary)) newErrors.monthSalary = 'Monthly Salary must be a number';
        // New validation rules
        if (!formData.post) newErrors.post = 'Designation  is required';
        // Date of Birth validation: required, valid, and must be a past date
        if (!formData.dateOfBirth || !dayjs(formData.dateOfBirth).isValid()) {
            newErrors.dateOfBirth = 'Date of Birth is required and must be valid';
        } else if (dayjs(formData.dateOfBirth).isAfter(dayjs())) {
            newErrors.dateOfBirth = 'Date of Birth must be a past date';
        }
        if (!formData.joiningDate || !dayjs(formData.joiningDate).isValid()) {
            newErrors.joiningDate = 'Date of Joining is required';
        }
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.cAddress1) newErrors.cAddress1 = 'Current Address is required';
        if (!formData.cAddress2) newErrors.cAddress2 = 'Current Address Line 2 is required';
        if (!formData.cCity) newErrors.cCity = 'Current City is required';
        if (!formData.pAddress1) newErrors.pAddress1 = 'Permanent Address is required';
        if (!formData.pAddress2) newErrors.pAddress2 = 'Permanent Address Line 2 is required';
        if (!formData.pCity) newErrors.pCity = 'Permanent City is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.expertIn) newErrors.expertIn = 'Expert   In is required';
        if (!formData.father) newErrors.father = 'Father\'s Name is required';
        if (!formData.mother) newErrors.mother = 'Mother\'s Name is required';
        if (formData.married === undefined) newErrors.married = 'Marital Status is required';
        if (!formData.aadharNo || formData.aadharNo.length !== 12) newErrors.aadharNo = 'Aadhar number must be 12 digits';

        // Optionally validate address fields
        if (!formData.cAddress1) newErrors.cAddress1 = 'Current Address is required';
        if (!formData.pAddress1) newErrors.pAddress1 = 'Permanent Address is required';

        // Optionally validate bank account details
        if (!formData.bankAccountNumber) newErrors.bankAccountNumber = 'Bank Account Number is required';
        if (!formData.bankIfsc) newErrors.bankIfsc = 'Bank IFSC Code is required';
        if (!formData.bankAccountName) newErrors.bankAccountName = 'Bank Account Holder Name is required';
        console.log("Validation errors:", newErrors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted 1");
        if (!validateForm()) {

            return;
        }

        formData['vehicleId'] = selectedVehicle;

        console.log("Form submitted 2");
        const data = {...formData};
        const fileFields = [
            'photo',
            'identificationDocuments',
            'educationalCertificate',
            'professionalQualifications',
            'experienceCertificates',
            'bankAccount',
            'previousEmployer'
        ];
        console.log("Form submitted  3");
        for (const field of fileFields) {
            if (formData[field]) {
                if (formData[field] instanceof Blob) {
                    // If the file is a Blob, convert it to Base64
                    data[field] = await fileToBase64(formData[field]);
                } else {
                    // Assume the file is already Base64
                    data[field] = formData[field];
                }
            }
        }
        onSubmit(data);
        console.log("Form submitted 4", data);

        window.alert("Form added successfully!");
        setSuccessMessage("Staff information submitted successfully!");
        console.log("Form submitted 6");
        setFormData({
            name: '',
            post: '',
            phone: '',
            email: '',
            role: '',
            staffType: 'Teaching',
            dateOfBirth: '',
            cAddress1: '',
            cAddress2: '',
            cCity: '',
            pAddress1: '',
            pAddress2: '',
            pCity: '',
            mobile1: '',
            mobile2: '',
            gender: 'Male',
            qualification: '',
            expertIn: '',
            father: '',
            mother: '',
            married: 'No',
            spouseName: '',
            joiningDate: '',
            aadharNo: '',
            monthSalary: '',
            bankAccountNumber: '',
            bankIfsc: '',
            bankAccountName: '',
            photo: null,
            identificationDocuments: null,
            educationalCertificate: null,
            professionalQualifications: null,
            experienceCertificates: null,
            bankAccount: null,
            previousEmployer: null,
            loginId: '',
            password: '',
            userId: '',
            imageRefId: '',
            vehicleId: '',
            routeId: '',
            creationDateTime: null,
            staffId: '',
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };


    const renderFilePreview = (name) => {
        const file = formData[name];

        const existingFile = staff && staff[name];

        // This function will be triggered when the "Remove" button is clicked
        const handleRemoveFile = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: null // Remove the file from the formData state by setting it to null
            }));
        };
        if (!file && existingFile) {
            // If no file is selected but staff has an existing file, display it
            return (
                <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                    <img src={existingFile} alt={name} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>;
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleRemoveFile}
                        sx={{ml: 2}}
                    >
                        Remove
                    </Button></div>
            );
        }
        if (!file) return null;

        if (file instanceof File && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);

            return (
                <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                    <img src={url} alt={name} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>;
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleRemoveFile}
                        sx={{ml: 2}}
                    >
                        Remove
                    </Button>
                </div>
            );
        } else {
            return (
                <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                    <Typography variant="body2" style={{marginRight: 10}}>
                        {file.name}</Typography>;
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleRemoveFile}
                        sx={{ml: 2}}
                    >
                        Remove
                    </Button>
                </div>
            )
        }
    };


    // Handler for vehicle selection
    const handleVehicleChange = (e) => {
        const vehicleId = e.target.value;
        setSelectedVehicle(vehicleId);
        // Fetch routes for the selected vehicle (e.g., from an API or Redux state)
        const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
        const vehicleRoutes = selectedVehicle?.routes || [];
        setRoutes(vehicleRoutes);

        // Clear the route selection if vehicle changes
        setFormData((prevFormData) => ({
            ...prevFormData,
            vehicleId,
            routeId: '' // Clear route selection
        }));
    };
    const handleRouteChange = (e) => {
        const routeId = e.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            routeId // Update routeId in formData
        }));
    };
    const vehiclesArray = Array.isArray(vehicles) ? vehicles : [];

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    return (
        <Container>
            <form onSubmit={handleSubmit}>


                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth sx={{marginTop: 2}}>
                            <InputLabel id="staff-type-label">Staff Type</InputLabel>
                            <Select
                                labelId="staff-type-label"
                                name="staffType"
                                value={formData?.staffType || ''}
                                onChange={handleChange}
                                label="Staff Type"
                            >
                                <MenuItem value="Teaching">Teaching</MenuItem>
                                <MenuItem value="Non-Teaching">Non-Teaching</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid></Grid>
                {/* Personal Details Section */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom
                                    sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 3}}>
                            Personal Details
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleChange}
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth error={!!errors.post}>
                            <InputLabel id="post-label">Designation</InputLabel>
                            <Select
                                labelId="post-label"
                                name="post"
                                value={formData?.post || ''}
                                onChange={handleChange}
                                label="Post"
                                required
                                error={!!errors.post}
                                helperText={errors.post}
                            > {designation.map((designation, index) => (
                                <MenuItem key={index} value={designation?.name || ''}>
                                    {designation.name}
                                </MenuItem>
                            ))}
                            </Select> {errors.post && <FormHelperText>{errors.post}</FormHelperText>}
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} sm={4}>

                        <TextField
                            fullWidth
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            value={formData?.dateOfBirth || ''}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            required
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth}

                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required error={!!errors.qualification}>
                            <InputLabel>Qualification</InputLabel>
                            <Select
                                name="qualification"
                                value={formData?.qualification || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="High School Diploma">High School Diploma</MenuItem>
                                <MenuItem value="Secondary School Certificate">Secondary School Certificate</MenuItem>
                                <MenuItem value="Senior Secondary School Certificate">Senior Secondary School
                                    Certificate</MenuItem>
                                <MenuItem value="Bachelor of Education (B.Ed)">Bachelor of Education (B.Ed)</MenuItem>
                                <MenuItem value="Master of Education (M.Ed)">Master of Education (M.Ed)</MenuItem>
                                <MenuItem value="Diploma in Education (D.Ed)">Diploma in Education (D.Ed)</MenuItem>
                                <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                                <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                                <MenuItem value="PhD in Education">PhD in Education</MenuItem>
                                <MenuItem value="Certified Teaching Certificate">Certified Teaching
                                    Certificate</MenuItem>
                                <MenuItem value="Certified Teaching Certificate">SSC</MenuItem>
                                <MenuItem value="Certified Teaching Certificate">OTHER</MenuItem>
                            </Select>
                            {errors.qualification && (
                                <FormHelperText>{errors.qualification}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                </Grid>

                {/* Contact Details Section */}

                <Typography variant="h6" gutterBottom
                            sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 5, mb: 3}}>
                    Contact Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}

                            required

                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData?.email || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}

                            required

                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth sx={{mb: 2}} error={!!errors.role}>

                            <InputLabel id="role-select-label">Role</InputLabel>

                            <Select
                                labelId="role-select-label"
                                id="role-select"
                                name="role"
                                value={formData?.role || ''}
                                label="Role"
                                onChange={handleChange}

                                required
                                error={!!errors.role}
                                helperText={errors.role}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="C.Address1"
                            name="cAddress1"
                            value={formData?.cAddress1 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.cAddress1}
                            helperText={errors.cAddress1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="C.Address2"
                            name="cAddress2"
                            value={formData?.cAddress2 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.cAddress2}
                            helperText={errors.cAddress2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="C.City"
                            name="cCity"
                            value={formData?.cCity || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.cCity}
                            helperText={errors.cCity}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="P.Address1"
                            name="pAddress1"
                            value={formData?.pAddress1 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.pAddress1}
                            helperText={errors.pAddress1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="P.Address2"
                            name="pAddress2"
                            value={formData?.pAddress2 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.pAddress2}
                            helperText={errors.pAddress2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="P.City"
                            name="pCity"
                            value={formData?.pCity || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.pCity}
                            helperText={errors.pCity}
                        />
                    </Grid>
                </Grid>


                {/* Professional Details Section */}
                <Typography variant="h6" gutterBottom
                            sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 5, mb: 3}}>
                    Professional Details
                </Typography>
                <Grid container spacing={3}>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Mobile1"
                            name="mobile1"
                            value={formData?.mobile1 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.mobile1}
                            helperText={errors.mobile1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Mobile2"
                            name="mobile2"
                            value={formData?.mobile2 || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            error={!!errors.mobile2}
                            helperText={errors.mobile2}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                name="gender"
                                value={formData?.gender || ''}
                                onChange={handleChange}


                            >
                                <FormControlLabel value="Male" control={<Radio/>} label="Male"/>
                                <FormControlLabel value="Female" control={<Radio/>} label="Female"/>
                            </RadioGroup>

                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Expert In"
                            name="expertIn"
                            value={formData?.expertIn || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.expertIn}
                            helperText={errors.expertIn}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Father"
                            name="father"
                            value={formData?.father || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.father}
                            helperText={errors.father}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Mother"
                            name="mother"
                            value={formData?.mother || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.mother}
                            helperText={errors.mother}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <FormLabel>Married</FormLabel>
                            <RadioGroup
                                row
                                name="married"
                                value={formData?.married || ''}
                                onChange={handleChange}
                                required
                                error={!!errors.married}
                                helperText={errors.married}
                            >
                                <FormControlLabel value="Yes" control={<Radio/>} label="Yes"/>
                                <FormControlLabel value="No" control={<Radio/>} label="No"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {formData.married === 'Yes' && (
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Spouse Name"
                                name="spouseName"
                                value={formData?.spouseName || ''}
                                onChange={handleChange}
                                sx={{mb: 2}}
                            />
                        </Grid>
                    )}


                    <Grid item xs={12} sm={4}>

                        <TextField
                            fullWidth
                            name="joiningDate"
                            label="Joining Date"
                            type="date"
                            value={formData?.joiningDate}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            required
                            error={!!errors.joiningDate}
                            helperText={errors.joiningDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth

                            label="Aadhaar No"

                            name="aadharNo"
                            value={formData?.aadharNo || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.aadharNo}
                            helperText={errors.aadharNo}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Monthly Salary"
                            name="monthSalary"
                            value={formData?.monthSalary || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.monthSalary}
                            helperText={errors.monthSalary}
                        />
                    </Grid>
                </Grid>

                {/* Bank Details Section */}
                <Typography variant="h6" gutterBottom
                            sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 5, mb: 3}}>
                    Bank Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Bank Account Number"
                            name="bankAccountNumber"
                            value={formData?.bankAccountNumber || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.bankAccountNumber}
                            helperText={errors.bankAccountNumber}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Bank IFSC"
                            name="bankIfsc"
                            value={formData?.bankIfsc || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.bankIfsc}
                            helperText={errors.bankIfsc}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Bank Account Name"
                            name="bankAccountName"
                            value={formData?.bankAccountName || ''}
                            onChange={handleChange}
                            sx={{mb: 2}}
                            required
                            error={!!errors.bankAccountName}
                            helperText={errors.bankAccountName}
                        />
                    </Grid>
                </Grid>

                {/* Upload Documents Details Section */}
                <Typography variant="h6" gutterBottom
                            sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 5, mb: 3}}>
                    Upload Documents
                </Typography>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                name="photo"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('photo')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Identification Documents
                            <input
                                type="file"
                                hidden
                                name="identificationDocuments"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('identificationDocuments')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Educational Certificate
                            <input
                                type="file"
                                hidden
                                name="educationalCertificate"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('educationalCertificate')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Professional Qualifications
                            <input
                                type="file"
                                hidden
                                name="professionalQualifications"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('professionalQualifications')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Experience Certificates
                            <input
                                type="file"
                                hidden
                                name="experienceCertificates"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('experienceCertificates')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Bank Account
                            <input
                                type="file"
                                hidden
                                name="bankAccount"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('bankAccount')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{mb: 2}}
                        >
                            Upload Previous Employer
                            <input
                                type="file"
                                hidden
                                name="previousEmployer"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {renderFilePreview('previousEmployer')}
                    </Grid>
                </Grid>

                {/* Select Vehicle Section */}
                <Typography variant="h6" gutterBottom
                            sx={{fontWeight: 'bold', textDecoration: 'underline', mt: 5, mb: 3}}>
                    Select Vehicle
                </Typography>
                <Grid container spacing={3}>
                    <Grid container spacing={2}>
                        {/* Conditionally render based on formData.post */}
                        {formData.role === "Driver" ? (
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="vehicle-label">Assign Vehicle</InputLabel>
                                    <Select
                                        labelId="vehicle-label"
                                        name="vehicleId"
                                        label="vehicleId"
                                        value={formData?.vehicleId || ''}
                                        onChange={(e) => {
                                            // handleChange(e);
                                            handleVehicleChange(e);
                                        }}
                                    >
                                        {/* Only show vehicle options */}
                                        {vehiclesArray.map((vehicle) => (
                                            <MenuItem key={vehicle.id} value={vehicle?.id}>
                                                {vehicle.vehicleName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : (
                            <>
                                {/* Show Vehicle select for non-driver posts */}
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="vehicle-label">Vehicle</InputLabel>
                                        <Select
                                            labelId="vehicle-label"
                                            name="vehicleId"
                                            label="vehicleId"
                                            value={formData?.vehicleId || ''}
                                            onChange={(e) => {
                                                handleVehicleChange(e);

                                            }}
                                        >
                                            {vehiclesArray.map((vehicle) => (
                                                <MenuItem key={vehicle.id} value={vehicle?.id}>
                                                    {vehicle.vehicleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Show Route select for non-driver posts */}
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="route-label">Route</InputLabel>
                                        <Select
                                            labelId="route-label"
                                            name="routeId"
                                            label="Route"
                                            value={formData?.routeId || ''}
                                            onChange={handleRouteChange}
                                            disabled={routes.length === 0}

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
                            </>
                        )}
                    </Grid>

                </Grid>

                <div>

                </div>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Finish
                    </Button>


                </DialogActions>

            </form>
            {successMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'lightgreen',
                    padding: '20px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    <Typography variant="h6" style={{margin: 0}}>{successMessage}</Typography>
                </div>
            )}
        </Container>
    );
};

export default StaffForm;
