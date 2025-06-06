import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const DailyTaskForm = ({dailyTask, onSubmit, onCancel}) => {
    const [formData, setFormData] = useState({
        id: "", // Ensure id is included
        type: "",
        title: "",
        message: "",
        subject: "",
        creationDateTime: dayjs().tz("Asia/Kolkata"),
        docs: null,
        staffId: "",
        staffName: "",
        className: "",
        section: "",
    });
    const localDateTime = dayjs(); // This gets the current local date and time

    const classSections = useSelector((state) => state.master.data.classSections);
    const sections = useSelector((state) => state.master.data.sections);
    useEffect(() => {
        if (dailyTask) {
            setFormData({
                ...dailyTask,
                creationDateTime: dailyTask.creationDateTime
                    ? dayjs.tz(dailyTask.creationDateTime, 'UTC').tz("Asia/Kolkata")
                    : dayjs().tz("Asia/Kolkata"), // Ensure it's initialized correctly
            });
        }
    }, [dailyTask]);


    console.log("classSections");
    console.log(classSections);
    console.log(JSON.stringify(classSections));
    const [selectedClsSecSubject, setSelectedClsSecSubject] = useState([]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleDateChange = (name, date) => {
        setFormData({...formData, [name]: date});
    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    // const handleFileChange = (e) => {
    //   const file = e.target.files[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setFormData({ ...formData, docs: reader.result }); // Store the base64 string
    //     };
    //     reader.readAsDataURL(file); // Convert the file to base64
    //   }
    // };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1]; // Remove the prefix and keep the base64 string
                setFormData({...formData, docs: base64String}); // Store the cleaned base64 string
            };
            reader.readAsDataURL(file); // Convert the file to base64
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ["type", "title", "className", "section"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
            alert(`Please fill out the following fields: ${missingFields.join(", ")}`);
            return;
        }

        // Check if message is filled with at least 2 words
        const messageWordCount = formData.message.trim().split(/\s+/).length;
        if (messageWordCount < 2) {
            alert("Please fill out the message with at least 2 or 3 words.");
            return;
        }
        // Ensure creationDateTime is in local time when submitting
        const displayLocalTime = (utcTime) => {
            return dayjs.utc(utcTime).local().format('YYYY-MM-DD HH:mm:ss'); // or any desired format
        };
        const submissionData = {
            ...formData,
            creationDateTime: localDateTime.format(), // Keep as local time for submission
        };

        // Usage
//   const localDisplayTime = displayLocalTime(submissionData.creationDateTime);
//   console.log("Displayed Local Time:", localDisplayTime);

//  console.log("Before submission (local):", localDateTime.format());
//  console.log("Converted for submission (UTC):", submissionData.creationDateTime);

        onSubmit(submissionData); // Use the modified submission data
    };
    const handleSectionChange = async (e) => {
        const {name, value} = e.target;
        // Update the form values
        const updatedFormValues = {
            ...formData,
            [name]: value,
        };
    };

    return (
        <Container>
            <Box
                sx={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    position: "relative",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="type-label">Type Of Task</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type"
                                    name="type" // This should match 'type' in formData
                                    value={formData.type} // Binding the selected value to formData.type
                                    onChange={handleChange}
                                    label="Type Of Task"
                                >
                                    <MenuItem value="Assignment">Assignment</MenuItem>
                                    <MenuItem value="Daily Activity">Daily Activity</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" component="label" color="primary">
                                Upload Document
                                <input
                                    type="file"
                                    hidden
                                    accept="application/pdf,image/*" // Restrict to PDF, images
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {formData.docs && (
                                <Typography variant="caption" display="block">
                                    File Uploaded
                                </Typography>
                            )}
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel sx={{marginLeft: "20px"}} id="className-label">Class Name</InputLabel>
                                    <Select
                                        labelId="className-label"
                                        id="className"
                                        name="className"
                                        label="Class Name"
                                        value={formData.className}
                                        onChange={handleChange}
                                        sx={{marginLeft: "20px"}}
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
                                </FormControl>
                            </Grid>


                            <Grid item xs={12} sm={6}>

                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel id="select-section-label">
                                        Select Section
                                    </InputLabel>
                                    <Select
                                        labelId="select-section-label"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        disabled={!formData.className}
                                        label="Select Section"

                                    >
                                        {classSections?.find((cs) => cs.name === formData.className)
                                            ?.sections?.length > 0 ? (
                                            classSections
                                                .find((cs) => cs.name === formData.className)
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
                            </Grid>
                        </Grid>


                        <Grid item xs={12} sm={12}>

                            <TextField
                                fullWidth
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                multiline
                                rows={4} // Adjust the number of rows as needed
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {formData.id ? "Update Daily Task" : "Add Daily Task"}

                        </Button>

                    </DialogActions>
                </form>
            </Box>
        </Container>
    );
};

export default DailyTaskForm;
