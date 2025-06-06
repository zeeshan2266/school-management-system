import React, {useEffect, useState} from "react";


import {
    Box,
    Button,
    Container,
    DialogActions,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";

const BookForm = ({book, onSubmit, onCancel}) => {

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        borrowed: "false",
        isbn: "",
        borrowedBy: "",
        borrowedEmail: "",
        price: "",
        lateFine: "",
        fine: "false",
        issueDate: "",
        returnLastDate: "",
        submittedDate: "",
        creationDateTime: null,
        totalNoPage: "",
        typeOfBinding: "",
        writtenLanguage: "",
        roomNo: "",
        rackNo: "",
        rowNo: "",
        barCode: "",
    });


    useEffect(() => {
        if (book) {
            setFormData({
                ...book,
                creationDateTime: book.creationDateTime

                    ? dayjs(book.creationDateTime).format("YYYY-MM-DD")

                    : null,
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        setErrors({...errors, [name]: ""}); // Clear error on change

        if (errors[name]) validateField(name, value); // Remove error if field becomes valid


    };

    const handleDateChange = (name, date) => {
        setFormData({...formData, [name]: date});

        setErrors({...errors, [name]: ""}); // Clear error on change

        if (errors[name]) validateField(name, date); // Remove error if date becomes valid


    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "title":
                if (!value) error = "Title is required.";
                break;
            case "author":
                if (!value) error = "Author is required.";
                break;
            case "isbn":
                if (!value) error = "ISBN is required.";
                else if (!/^\d{10,13}$/.test(value)) error = "ISBN should be 10-13 digits.";
                break;
            case "price":
                if (!value) error = "Price is required.";
                else if (isNaN(value)) error = "Price must be a number.";
                break;
            case "totalNoPage":
                if (!value) error = "Total Number of Pages is required.";
                else if (isNaN(value)) error = "Must be a number.";
                break;
            case "typeOfBinding":
                if (!value) error = "Select Type of Binding.";
                break;
            case "writtenLanguage":
                if (!value) error = "Select Written Language.";
                break;
            case "roomNo":
                if (!value) error = "Select Room No.";
                break;
            case "rackNo":
                if (!value) error = "Select Rack No.";
                break;
            case "rowNo":
                if (!value) error = "Select Row No.";
                break;
            case "barCode":
                if (!value) error = "Bar Code is required.";
                break;
            case "creationDateTime":
                if (!value) error = "Creation Date is required.";
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({...prevErrors, [name]: error}));
        return error === "";
    };
    const validate = () => {
        const fieldNames = [
            "title",
            "author",
            "isbn",

            "price",
            "totalNoPage",
            "typeOfBinding",
            "writtenLanguage",
            "roomNo",
            "rackNo",
            "rowNo",


            "barCode",
            "creationDateTime",
        ];

        let isValid = true;
        fieldNames.forEach((field) => {
            if (!validateField(field, formData[field])) isValid = false;
        });

        return isValid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            window.alert("Book added successfully!");


        }
    };

    return (
        <Container>
            <Box
                sx={{

                    maxHeight: "70vh", // Increased height to fit form properly
                    overflowY: "auto", // Enable vertical scrolling
                    p: 2, // Padding for spacing
                    border: "1px solid #ccc", // Border for visual clarity
                    borderRadius: "8px", // Rounded corners
                    position: "relative", // Ensure the form stays inside the container

                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                                error={!!errors.author}
                                helperText={errors.author}
                            />
                        </Grid>


                        <Grid item xs={12} sm={4}>

                            <TextField
                                fullWidth
                                name="creationDateTime"
                                label="Creation Date"
                                type="date"
                                value={formData.creationDateTime || ''}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                                error={!!errors.creationDateTime}
                                helperText={errors.creationDateTime}

                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="ISBN"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                error={!!errors.isbn}
                                helperText={errors.isbn}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="totalNoPage"
                                name="totalNoPage"
                                value={formData.totalNoPage}
                                onChange={handleChange}
                                error={!!errors.totalNoPage}
                                helperText={errors.totalNoPage}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="typeOfBinding"
                name="typeOfBinding"
                value={formData.typeOfBinding}
                onChange={handleChange}
              />
            </Grid> */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>

                                <InputLabel id="typeOfBinding-label">
                                    Type Of Binding
                                </InputLabel>
                                <Select
                                    labelId="typeOfBinding-label"
                                    id="typeOfBinding"
                                    name="typeOfBinding"
                                    value={formData.typeOfBinding}
                                    onChange={handleChange}
                                    label="Type Of Binding"
                                >
                                    <MenuItem value="Hardcover binding">
                                        Hardcover binding
                                    </MenuItem>

                                    <MenuItem value="spiral binding">spiral binding</MenuItem>
                                </Select>
                                {errors.typeOfBinding && <Typography color="error">{errors.typeOfBinding}</Typography>}

                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>

                                <InputLabel id="writtenLanguage-label">
                                    Written Language
                                </InputLabel>
                                <Select
                                    labelId="writtenLanguage-label"
                                    id="writtenLanguage"
                                    name="writtenLanguage"
                                    value={formData.writtenLanguage}
                                    onChange={handleChange}
                                    label="Written Language"
                                >
                                    <MenuItem value="Hindi">Hindi</MenuItem>
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Urdu">Urdu</MenuItem>
                                </Select>

                                {errors.writtenLanguage &&
                                    <Typography color="error">{errors.writtenLanguage}</Typography>}

                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="roomNo-label">Room No</InputLabel>
                                <Select
                                    labelId="roomNo-label"
                                    id="roomNo"
                                    name="roomNo"
                                    value={formData.roomNo}
                                    onChange={handleChange}
                                    label="Room No"
                                >
                                    {Array.from({length: 9}, (_, i) => i + 1).map((num) => (
                                        <MenuItem key={num} value={num}>
                                            {num}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.roomNo && <Typography color="error">{errors.roomNo}</Typography>}

                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="rowNo-label">Rack No</InputLabel>
                                <Select
                                    labelId="rackNo-label"
                                    id="rackNo"
                                    name="rackNo"
                                    value={formData.rackNo}
                                    onChange={handleChange}
                                    label="Rack No"
                                >
                                    {Array.from({length: 9}, (_, i) => i + 1).map((num) => (
                                        <MenuItem key={num} value={num}>
                                            {num}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.rackNo && <Typography color="error">{errors.rackNo}</Typography>}

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="rowNo-label">Row No</InputLabel>
                                <Select
                                    labelId="rowNo-label"
                                    id="rowNo"
                                    name="rowNo"
                                    value={formData.rowNo}
                                    onChange={handleChange}
                                    label="Row No"
                                >
                                    {Array.from({length: 9}, (_, i) => i + 1).map((num) => (
                                        <MenuItem key={num} value={num}>
                                            {num}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.rowNo && <Typography color="error">{errors.rowNo}</Typography>}

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="barCode"
                                name="barCode"
                                value={formData.barCode}
                                onChange={handleChange}
                                error={!!errors.barCode}
                                helperText={errors.barCode}
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>

                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Add Book
                        </Button>
                    </DialogActions>


                </form>
            </Box>
        </Container>
    );
};

export default BookForm;

