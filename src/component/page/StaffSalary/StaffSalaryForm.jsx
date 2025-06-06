import React, {useEffect, useState} from "react";
import {
    Alert,
    Avatar,
    Button,
    Container,
    DialogActions,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {useSelector} from "react-redux";

// Utility function to convert numbers to words
function numberToWords(num) {
    if (num === 0) return "Zero";

    const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const units = ["", "Thousand", "Lakh", "Crore"];

    function convertChunk(number) {
        let words = "";
        if (number > 99) {
            words += a[Math.floor(number / 100)] + " Hundred ";
            number %= 100;
        }
        if (number > 19) {
            words += b[Math.floor(number / 10)] + " " + a[number % 10];
        } else {
            words += a[number];
        }
        return words.trim();
    }

    let words = "";
    let unitIndex = 0;

    // Process number in chunks according to the Indian numbering system (3, 2, 2, ...)
    while (num > 0) {
        let chunk;
        if (unitIndex === 0) {
            // Process last three digits (hundreds, tens, units)
            chunk = num % 1000;
            num = Math.floor(num / 1000);
        } else {
            // Process next two digits (thousand, lakh, crore)
            chunk = num % 100;
            num = Math.floor(num / 100);
        }

        if (chunk !== 0) {
            words =
                convertChunk(chunk) +
                (units[unitIndex] ? " " + units[unitIndex] : "") +
                " " +
                words;
        }
        unitIndex++;
    }

    return words.trim();
}

function StaffSalaryForm({salary, onCancel, onSubmit}) {
    const [formData, setFormData] = useState({
        name: "",

        month: "",
        deductions: "",
        netSalary: "",
        basicSalary: "",
        totalSubmission: "",
        paymentMode: "",
        transactionId: "",
        comment: "",

        amountInWords: "",
        // monthlySalary: "",
        bankAccountNumber: "",
        bankIfsc: "",
        bankAccountName: "",

        paymentScreenshot: null,
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const staffName = useSelector((state) => state.staff.name);

    useEffect(() => {
        if (salary) {
            setFormData({
                ...salary,
                creationDateTime: salary.creationDateTime
                    ? dayjs(salary.creationDateTime)
                    : null,
            });
        }
    }, [salary]);

    // useEffect(() => {
    //   // Calculate net salary based on basic salary and deductions
    //   const basicSalary = parseFloat(formData.basicSalary) || 0;
    //   const deductions = parseFloat(formData.deductions) || 0;
    //   const calculatedNetSalary = basicSalary - deductions;

    //   // Update the netSalary and amountInWords fields
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     netSalary: calculatedNetSalary,
    //     amountInWords: numberToWords(calculatedNetSalary)
    //   }));
    // }, [formData.basicSalary, formData.deductions]);

    useEffect(() => {
        // Calculate net salary based on basic salary and deductions
        const basicSalary = parseFloat(formData.basicSalary) || 0;
        const deductions = parseFloat(formData.deductions) || 0;
        const calculatedNetSalary = basicSalary - deductions;

        // Update the netSalary and amountInWords fields
        setFormData((prevData) => ({
            ...prevData,
            netSalary: calculatedNetSalary,
            amountInWords: numberToWords(calculatedNetSalary),
        }));
    }, [formData.basicSalary, formData.deductions]);

    // Handle payment mode change
    const handlePaymentModeChange = (e) => {
        const paymentMode = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            paymentMode,
        }));
    };

    const handleChange = async (e) => {
        const {name, value, files} = e.target;

        if (files) {
            const file = files[0];
            const base64 = await convertToBase64(file);
            setFormData({
                ...formData,
                [name]: base64,
            });
        } else {
            //   setFormData({
            //     ...formData,
            //     [name]: value
            // });
            setFormData((prev) => ({...prev, [name]: value}));
        }
        // Validate the changed field
        const fieldError = validateForm(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldError,
        }));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.month) newErrors.month = "Month is required";
        if (!formData.year) newErrors.year = "Year is required";
        if (!formData.basicSalary || isNaN(formData.basicSalary))
            newErrors.basicSalary = "Basic Salary must be a number";
        if (!formData.netSalary || isNaN(formData.netSalary))
            newErrors.netSalary = "Net Salary must be a number";
        if (!formData.bankAccountNumber)
            newErrors.bankAccountNumber = "Bank Account Number is required";
        if (!formData.bankIfsc) newErrors.bankIfsc = "Bank IFSC Code is required";
        if (!formData.bankAccountName)
            newErrors.bankAccountName = "Bank Account Holder Name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        console.log("handleSubmit called");
        e.preventDefault();
        console.log("After preventDefault");
        if (!validateForm()) return;
        // console.log("Form submitted with data:", formData);
        console.log("Form data:", formData);
        // const data = { ...formData };
        onSubmit(formData);
        setSuccessMessage("Staff salary information submitted successfully!");

        setFormData({
            name: "",

            month: "",
            deductions: "",
            netSalary: "",
            basicSalary: "",
            totalSubmission: "",
            paymentMode: "",
            transactionId: "",
            comment: "",
            department: "",
            amountInWords: "",
            // monthlySalary: "",
            bankAccountNumber: "",
            bankIfsc: "",
            bankAccountName: "",

            paymentScreenshot: null,
        });

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };
    const renderImageUpload = (label, name) => (
        <Grid item xs={6} key={name}>
            <input
                accept="image/*"
                style={{display: "none"}}
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
            {formData[name] && (
                <Avatar
                    src={`data:image/jpeg;base64,${formData[name]}`}
                    alt={label}
                    sx={{width: 56, height: 56, mt: 2}}
                />
            )}
        </Grid>
    );
    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Staff Salary Form
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel
                                id="Staff Name"
                                // error={!!errors.className}
                                // sx={errors.className ? errorStyle : {}}
                            >
                                Staff Name
                            </InputLabel>
                            <Select
                                labelId="Staff Name"
                                id="staffName"
                                name="staffName"
                                value={formData.name}
                                onChange={handleChange}
                                label="Staff Name"
                                required
                                error={!!errors.name}
                                // sx={errors.className ? errorStyle : {}}
                            >
                                {staffName && staffName.length > 0 ? (
                                    staffName.map((staffName) => (
                                        <MenuItem key={staffName.id} value={staffName.name}>
                                            {staffName.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No staff Available
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.className && (
                                <FormHelperText error>{errors.className}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select
                                label="Month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                            >
                                <MenuItem value="January">January</MenuItem>
                                <MenuItem value="February">February</MenuItem>
                                <MenuItem value="March">March</MenuItem>
                                <MenuItem value="April">April</MenuItem>
                                <MenuItem value="May">May</MenuItem>
                                <MenuItem value="June">June</MenuItem>
                                <MenuItem value="July">July</MenuItem>
                                <MenuItem value="August">August</MenuItem>
                                <MenuItem value="September">September</MenuItem>
                                <MenuItem value="October">October</MenuItem>
                                <MenuItem value="November">November</MenuItem>
                                <MenuItem value="December">December</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Basic Salary"
                            name="basicSalary"
                            value={formData.basicSalary}
                            onChange={handleChange}
                            error={!!errors.basicSalary}
                            helperText={errors.basicSalary}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Deductions"
                            name="deductions"
                            value={formData.deductions}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Net Salary"
                            name="netSalary"
                            value={formData.netSalary}
                            onChange={handleChange}
                            error={!!errors.netSalary}
                            helperText={errors.netSalary}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Total Submission"
                            name="totalSubmission"
                            value={formData.totalSubmission}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    {/* Payment Mode Selection Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Payment Mode</InputLabel>
                            <Select
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handlePaymentModeChange}
                                label="Payment Mode"
                            >
                                <MenuItem value="UPI">UPI</MenuItem>
                                <MenuItem value="Cash">CASH</MenuItem>
                                <MenuItem value="ATM">DEBIT CARD</MenuItem>
                                <MenuItem value="Bank Transfer">BANK TRANSFER</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Display Transaction ID */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Transaction ID"
                            name="transactionId"
                            value={formData.transactionId}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            required
                            label="Bank Account Number"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            error={!!errors.bankAccountNumber}
                            helperText={errors.bankAccountNumber}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            required
                            label="Bank IFSC"
                            name="bankIfsc"
                            value={formData.bankIfsc}
                            onChange={handleChange}
                            error={!!errors.bankIfsc}
                            helperText={errors.bankIfsc}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            required
                            label="Bank Account Name"
                            name="bankAccountName"
                            value={formData.bankAccountName}
                            onChange={handleChange}
                            error={!!errors.bankAccountName}
                            helperText={errors.bankAccountName}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <TextField
                            label="Amount in Words"
                            name="amountInWords"
                            value={formData.amountInWords}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{readOnly: true}}
                        />
                    </Grid>

                    {renderImageUpload("payment screenshot", "payment")}

                    <Grid
                        container
                        spacing={2}
                        justifyContent="flex-end"
                        style={{marginTop: "16px"}}
                    >
                        <Grid item>
                            <DialogActions>
                                <Button variant="outlined" onClick={onCancel}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Grid>
                        <Grid item>
                            <DialogActions>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    {formData.id ? "Update salary" : "Submit salary"}
                                </Button>
                            </DialogActions>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                // onClose={handleSnackbarClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    // onClose={handleSnackbarClose}
                    severity="success"
                    sx={{width: "100%"}}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default StaffSalaryForm;

