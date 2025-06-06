import React, {useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {addEnquiry} from "./redux/enquiryActions.js";
import MasterJson from "../../masterfile/MasterJson.json";
import {selectSchoolDetails} from "../../../common";

const AddEnquiryForm = ({
                            open,
                            handleClose,
                            refreshData,
                            mode,
                            initialValues,
                            onSubmit,
                        }) => {
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    // State to manage form data
    const initialState = {
        studentName: '', className: '',
    };
    const classSections = useSelector(state => state.master.data.classSections);
    const [student, setStudent] = useState(initialState);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dob, setDob] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [enquiryStatusValue, setEnquiryStatusValue] = useState("");
    const [remark, setRemark] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("female");
    const [motherName, setMotherName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [motherOccupation, setMotherOccupation] = useState("");
    const [fatherOccupation, setFatherOccupation] = useState("");
    const [motherMobile, setMotherMobile] = useState("");
    const [fatherMobile, setFatherMobile] = useState("");
    const [motherIncome, setMotherIncome] = useState("");
    const [fatherIncome, setFatherIncome] = useState("");

    // School fields
    const [schoolName, setSchoolName] = useState(""); // State for school name
    const [schoolAddress, setSchoolAddress] = useState(""); // State for school address
    const [nationality, setNationality] = useState("INDIAN"); // State for nationality
    const [lastSchoolAffiliation, setLastSchoolAffiliation] = useState("");

    // Address fields
    const [pincode, setPinCode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({
        student: "",
        firstName: "",
        phoneNumber: "",
        email: "",
        motherName: "",
        fatherName: "",
        pincode: "",
        city: "",
        fatherMobile: "",
        lastSchoolAffiliation: "", // Add this line
        studentClass: "", // Add this line
        enquiryStatus: "", // Add this line
    });
    const validateForm = () => {
        let tempErrors = {};
        tempErrors.firstName = firstName ? "" : "First name is required";
        tempErrors.studentClass = studentClass ? "" : "class name is required";
        tempErrors.phoneNumber = /^\d{10}$/.test(phoneNumber)
            ? ""
            : "Invalid phone number";
        tempErrors.email = /\S+@\S+\.\S+/.test(email)
            ? ""
            : "Invalid email address";
        tempErrors.motherName = motherName ? "" : "Mother's name is required";
        tempErrors.fatherName = fatherName ? "" : "Father's name is required";
        tempErrors.pincode = /^\d{6}$/.test(pincode) ? "" : "Invalid pincode";
        tempErrors.city = city ? "" : "City is required";
        tempErrors.fatherMobile = /^\d{10}$/.test(fatherMobile)
            ? ""
            : "Invalid father's mobile number"; // Add this line
        tempErrors.lastSchoolAffiliation = lastSchoolAffiliation
            ? ""
            : "Last school affiliation is required"; // Add this line
        tempErrors.studentClass = studentClass ? "" : "Class is required"; // Add this line
        tempErrors.enquiryStatus = enquiryStatusValue
            ? ""
            : "Enquiry status is required"; // Add this line

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };
    const updateError = (field, value) => {
        setErrors((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            const enquiryData = {
                student,
                firstName,
                schoolId: schoolId,
                session: session,
                lastName,
                phoneNumber,
                dob,
                studentClass,
                enquiryStatus: enquiryStatusValue,
                remark,
                email,
                gender,
                nationality,
                name: schoolName,
                address: schoolAddress,
                pincode,
                city,
                state,
                country,
                motherName,
                motherOccupation,
                motherMobile, // Include mother's mobile
                motherIncome,
                fatherName,
                fatherOccupation,
                fatherMobile, // Include father's mobile
                fatherIncome,
            };
            try {
                setSuccessMessage("Enquiry added successfully!");
                dispatch(addEnquiry(enquiryData));
                handleClose();
                refreshData();

                // Reset form values to empty or initial values
                setStudent({studentName: "", className: ""});
                setFirstName("");
                setLastName("");
                setPhoneNumber("");
                setDob("");
                setStudentClass("");
                setEnquiryStatusValue("");
                setRemark("");
                setEmail("");
                setGender("female");
                setNationality("INDIAN");
                setSchoolName("");
                setSchoolAddress("");
                setPinCode("");
                setCity("");
                setState("");
                setCountry("");
                setMotherName("");
                setFatherName("");
                setMotherOccupation("");
                setFatherOccupation("");
                setMotherMobile("");
                setFatherMobile("");
                setMotherIncome("");
                setFatherIncome("");
            } catch (error) {
                console.error("Error submitting enquiry:", error);
                setSuccessMessage(""); // Clear any previous success message
            }
        }
    };

    const qualifications = ["High School", "Bachelor's", "Master's", "PhD"];
    const resetForm = () => {
        setStudent({studentName: "", className: ""});
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setDob("");
        setStudentClass("");
        setEnquiryStatusValue("");
        setRemark("");
        setEmail("");
        setGender("female");
        setNationality("INDIAN");
        setSchoolName("");
        setSchoolAddress("");
        setPinCode("");
        setCity("");
        setState("");
        setCountry("");
        setMotherName("");
        setFatherName("");
        setMotherOccupation("");
        setFatherOccupation("");
        setMotherMobile("");
        setFatherMobile("");
        setMotherIncome("");
        setFatherIncome("");
        setErrors({}); // Clear validation errors
    };
    const handleCloseDialog = () => {
        resetForm(); // Reset form before closing
        handleClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Add New Enquiry</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <h3>Admission Class</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" error={Boolean(errors.studentClass)}>
                                <InputLabel id="className-label">Class Name</InputLabel>
                                <Select
                                    labelId="className-label"
                                    id="className"
                                    name="className"
                                    value={student.className || ""}
                                    onChange={(e) => {
                                        setStudent((prevState) => ({
                                            ...prevState,
                                            className: e.target.value,
                                        }));
                                        updateError("studentClass", e.target.value ? "" : "Class is required");
                                    }}
                                    label="Class Name"
                                    required
                                    error={Boolean(errors.studentClass)}
                                    helperText={errors.studentClass}
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
                                {/* Display validation error message */}
                                {/* Validation Message */}
                                {errors.studentClass && (
                                    <p style={{color: "red", fontSize: "12px", marginTop: "4px"}}>
                                        {errors.studentClass}
                                    </p>
                                )}

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select</InputLabel>
                                <Select label="Referred By">{/* Options */}</Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Personal Details */}
                    <Box mt={3} mb={2}>
                        <Grid item xs={12}>
                            <h3>Personal Details:</h3>
                        </Grid>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        updateError(
                                            "firstName",
                                            e.target.value ? "" : "First name is required"
                                        );
                                    }}
                                    error={Boolean(errors.firstName)}
                                    helperText={errors.firstName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    margin="dense"
                                    label="Phone Number"
                                    fullWidth
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        updateError(
                                            "phoneNumber",
                                            /^\d{10}$/.test(e.target.value)
                                                ? ""
                                                : "Invalid phone number"
                                        );
                                    }}
                                    required
                                    error={Boolean(errors.phoneNumber)}
                                    helperText={errors.phoneNumber}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-label="gender"
                                        name="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                    >
                                        <FormControlLabel
                                            value="male"
                                            control={<Radio/>}
                                            label="Male"
                                        />
                                        <FormControlLabel
                                            value="female"
                                            control={<Radio/>}
                                            label="Female"
                                        />
                                        <FormControlLabel
                                            value="other"
                                            control={<Radio/>}
                                            label="Other"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Email Address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        updateError(
                                            "email",
                                            /\S+@\S+\.\S+/.test(e.target.value)
                                                ? ""
                                                : "Invalid email address"
                                        );
                                    }}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    margin="dense"
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Parents Details */}
                    <Box mt={4} mb={2}>
                        <Grid item xs={12}>
                            <h3>Parents Details:</h3>
                        </Grid>
                        <TableContainer component={Paper} style={{marginTop: "20px"}}>
                            <Table aria-label="parents details table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: "bold"}}>
                                            Details
                                        </TableCell>
                                        <TableCell
                                            style={{fontWeight: "bold", backgroundColor: "#f0f4c3"}}
                                        >
                                            Mother
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f4c3",
                                            }}
                                        >
                                            Father/Guardian
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Mother's Name"
                                                value={motherName}
                                                onChange={(e) => {
                                                    setMotherName(e.target.value);
                                                    updateError(
                                                        "motherName",
                                                        e.target.value ? "" : "Mother name is required"
                                                    );
                                                }}
                                                error={Boolean(errors.motherName)}
                                                helperText={errors.motherName}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Father/Guardian's Name"
                                                value={fatherName}
                                                onChange={(e) => {
                                                    setFatherName(e.target.value);
                                                    updateError(
                                                        "fatherName",
                                                        e.target.value ? "" : "Father name is required"
                                                    );
                                                }}
                                                error={Boolean(errors.fatherName)}
                                                helperText={errors.fatherName}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Occupation</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Mother's Occupation"
                                                value={motherOccupation}
                                                onChange={(e) => setMotherOccupation(e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Father/Guardian's Occupation"
                                                value={fatherOccupation}
                                                onChange={(e) => setFatherOccupation(e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Mobile No.</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Mother's Mobile No."
                                                value={motherMobile}
                                                onChange={(e) => setMotherMobile(e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Father/Guardian's Mobile No."
                                                value={fatherMobile}
                                                onChange={(e) => {
                                                    setFatherMobile(e.target.value);
                                                    updateError(
                                                        "fatherMobile",
                                                        /^\d{10}$/.test(e.target.value)
                                                            ? ""
                                                            : "Invalid father's mobile number"
                                                    );
                                                }}
                                                error={Boolean(errors.fatherMobile)}
                                                helperText={errors.fatherMobile}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Annual Income</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Mother's Annual Income"
                                                value={motherIncome}
                                                onChange={(e) => setMotherIncome(e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="Father/Guardian's Annual Income"
                                                value={fatherIncome}
                                                onChange={(e) => setFatherIncome(e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box sx={{p: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{mb: 3}}>
                                <h3>Religion & Category:</h3>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="nationality-label">Nationality</InputLabel>
                                    <Select
                                        labelId="nationality-label"
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value)}
                                        label="Nationality"
                                    >
                                        <MenuItem value="INDIAN">INDIAN</MenuItem>
                                        <MenuItem value="OTHER">OTHER</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Religion"/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Category"/>
                            </Grid>

                            {/* Aadhar No */}
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Aadhaar No."/>
                            </Grid>

                            <Grid item xs={12} sx={{mt: 4}}>
                                <h3>Last School Details</h3>
                            </Grid>

                            {/* Last School Details */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name & Address of School"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={schoolAddress}
                                    onChange={(e) => setSchoolAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label="Class"
                                    select
                                    fullWidth
                                    value={studentClass}
                                    onChange={(e) => {
                                        setStudentClass(e.target.value);
                                        updateError(
                                            "studentClass",
                                            e.target.value ? "" : "Class is required"
                                        );
                                    }}
                                    required
                                    error={Boolean(errors.studentClass)}
                                    helperText={errors.studentClass}
                                >
                                    {MasterJson.SchoolClasses.map((status) => (
                                        <MenuItem key={status.name} value={status.name}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label="Last School Affiliated to"
                                    select
                                    fullWidth
                                    required
                                    value={lastSchoolAffiliation}
                                    onChange={(e) => {
                                        setLastSchoolAffiliation(e.target.value);
                                        updateError(
                                            "lastSchoolAffiliation",
                                            e.target.value
                                                ? ""
                                                : "Last school affiliation is required"
                                        );
                                    }}
                                    error={Boolean(errors.lastSchoolAffiliation)}
                                    helperText={errors.lastSchoolAffiliation}
                                >
                                    <MenuItem value="CBSE">CBSE</MenuItem>
                                    <MenuItem value="ICSE">ICSE</MenuItem>
                                    <MenuItem value="State Board">State Board</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Address Fields */}
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Pincode"
                                    value={pincode}
                                    onChange={(e) => {
                                        setPinCode(e.target.value);
                                        updateError(
                                            "pincode",
                                            e.target.value ? "" : "6 Digit pin code is required"
                                        );
                                    }}
                                    error={Boolean(errors.pincode)}
                                    helperText={errors.pincode}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </Grid>

                            {/* Status & Remarks */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label="Enquiry Status"
                                    select
                                    fullWidth
                                    value={enquiryStatusValue}
                                    onChange={(e) => {
                                        setEnquiryStatusValue(e.target.value);
                                        updateError(
                                            "enquiryStatus",
                                            e.target.value ? "" : "Enquiry status is required"
                                        );
                                    }}
                                    required
                                    error={Boolean(errors.enquiryStatus)}
                                    helperText={errors.enquiryStatus}
                                >
                                    {MasterJson.enquiry.map((status) => (
                                        <MenuItem key={status.name} value={status.name}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Remarks"
                                    fullWidth
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{padding: "16px"}}>
                <Button
                    onClick={handleCloseDialog}
                    variant="outlined"
                    sx={{
                        color: "grey.700",
                        borderColor: "grey.400",
                        textTransform: "none",
                        fontWeight: "bold",
                        paddingX: 3,
                        "&:hover": {
                            backgroundColor: "grey.100",
                            borderColor: "grey.500",
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: "primary.main",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: "bold",
                        paddingX: 3,
                        boxShadow: 2,
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddEnquiryForm;
