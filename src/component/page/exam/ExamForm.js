import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {api, selectSchoolDetails} from "../../../common";
import {motion} from "framer-motion";
import {useSelector} from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

const ExamForm = ({examId, onSave}) => {
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector((state) => state.master.data.classSections);
    const [errors, setErrors] = useState({});
    const subjectOptions = useSelector((state) => state.master.data.subjects);
    const schoolId = userData?.id;
    const session = userData?.session;
    const today = new Date().toISOString().slice(0, 16);
    const [exam, setExam] = useState({
        name: "",
        type: "",
        className: "",
        section: "",
        subjects: [
            {
                name: "",
                maxMarks: "",
                minMarks: "",
                startDate: dayjs(),
                endDate: dayjs(),
                roomNo: "",
            },
        ],
        startDate: dayjs(),
        endDate: dayjs(),
        duration: 0,
        examHall: "",
        schoolId: schoolId,
        session: session,
    });

    useEffect(() => {
        if (examId) {
            api.get(`/api/exams/${examId}`).then((response) => {
                setExam({
                    ...response.data,
                    startDate: dayjs(response.data.startDate),
                    endDate: dayjs(response.data.endDate),
                    subjects: response.data.subjects.map((subject) => ({
                        ...subject,
                        maxMarks: subject.maxMarks || "",
                        minMarks: subject.minMarks || "",
                        startDate: dayjs(subject.startDate),
                        endDate: dayjs(subject.endDate),
                        roomNo: subject.roomNo || "",
                    })),
                    session: response.data.session || session,
                });
            });
        }
    }, [examId, session]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setExam({...exam, [name]: value});

        // Clear or validate error inline
        if (name === "duration" && value > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                duration: "",
            }));
        }

        if (name === "examHall" && value.trim()) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                examHall: "",
            }));
        }

        if (name === "name" && value.trim() === "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: "Exam name is required.",
            }));
        } else if (name === "name") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: "",
            }));
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = exam.subjects.map((subject, i) =>
            i === index ? {...subject, [field]: value} : subject
        );
        setExam({...exam, subjects: updatedSubjects});


        // Optionally clear errors for the field
        if (errors[`subjects.${index}.${field}`]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`subjects.${index}.${field}`]: "",
            }));
        }
    };

    // const handleAddSubject = () => {
    //   setExam({
    //     ...exam,
    //     subjects: [
    //       ...exam.subjects,
    //       {
    //         name: "",
    //         maxMarks: "",
    //         minMarks: "",
    //         startDate: dayjs(),
    //         endDate: dayjs(),
    //         roomNo: "",
    //       },
    //     ],
    //   });
    // };
    const handleAddSubject = () => {
        setExam((prev) => ({
            ...prev,
            subjects: [
                ...prev.subjects,
                {
                    name: "",
                    maxMarks: "",
                    minMarks: "",
                    startDate: dayjs(),
                    endDate: dayjs(),
                    roomNo: "",
                },
            ],
        }));
    };
    // const handleRemoveSubject = (index) => {
    //   const updatedSubjects = exam.subjects.filter((_, i) => i !== index);
    //   setExam({ ...exam, subjects: updatedSubjects });
    // };

    const handleRemoveSubject = (index) => {
        setExam((prev) => {
            const updatedSubjects = prev.subjects.filter((_, i) => i !== index);
            console.log("Updated Subjects after removal:", updatedSubjects);
            return {...prev, subjects: updatedSubjects};
        });
    };


    const validateFields = () => {
        const validationErrors = {};
        if (!exam.name) validationErrors.name = "Exam name is required.";
        if (!exam.duration || exam.duration <= 0) {
            validationErrors.duration = "Duration must be greater than 0";
        }
        if (!exam.examHall) validationErrors.examHall = "Exam hall is required.";
        if (!exam.startDate || !dayjs(exam.startDate).isAfter(dayjs()))
            validationErrors.startDate = "Start date must be in the future.";
        if (!exam.endDate || !dayjs(exam.endDate).isAfter(exam.startDate))
            validationErrors.endDate = "End date must be after start date.";

        if (exam.subjects.some((subject) => !subject.roomNo)) {
            validationErrors.roomNo = "Room number is required for all subjects";
        }
        exam.subjects.forEach((subject, index) => {
            if (!subject.name) {
                validationErrors[`subjects.${index}.name`] = "Subject name is required";
            }
            if (!subject.maxMarks)
                validationErrors[`subjects.${index}.maxMarks`] =
                    "Max marks are required.";
            if (!subject.minMarks)
                validationErrors[`subjects.${index}.minMarks`] =
                    "Min marks are required.";
            if (
                subject.maxMarks &&
                subject.minMarks &&
                parseFloat(subject.minMarks) >= parseFloat(subject.maxMarks)
            ) {
                validationErrors[`subjects.${index}.minMarks`] =
                    "Min marks must be less than max marks.";
                validationErrors[`subjects.${index}.maxMarks`] =
                    "Max marks must be greater than min marks.";
            }
            if (!subject.startDate || !dayjs(subject.startDate).isAfter(dayjs()))
                validationErrors[`subjects.${index}.startDate`] =
                    "Subject start date must be in the future.";
            if (
                !subject.endDate ||
                !dayjs(subject.endDate).isAfter(subject.startDate)
            )
                validationErrors[`subjects.${index}.endDate`] =
                    "Subject end date must be after start date.";

            if (!subject.roomNo || !subject.roomNo.trim() === "") {
                validationErrors[`subjects.${index}.roomNo`] = "Room number is required";
            }
        });

        return validationErrors;
    };

    const handleSave = async () => {
        const validationErrors = validateFields();
        console.log("Validation Errors:", validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            console.log("Submitting exam data:", exam);
            const response = examId
                ? await api.put(`/api/exams/${examId}`, exam)
                : await api.post("/api/exams", exam);

            console.log("API Response:", response);
            onSave();
        } catch (error) {
            console.error("API Error:", error);
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        padding: 4,
                        boxShadow: 5,
                        maxWidth: 700,
                        margin: "auto",
                        marginTop: 4,
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        align="center"
                        color="secondary"
                    >
                        {examId ? "Edit Exam" : "Create New Exam"}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Exam Details */}
                        <Grid item xs={12}>
                            <TextField
                                label="Exam Name"
                                name="name"
                                value={exam.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                color="secondary"
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Exam Type</InputLabel>
                                <Select
                                    name="type"
                                    value={exam.type}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    label="Exam Type"
                                >
                                    <MenuItem value="Written">Written</MenuItem>
                                    <MenuItem value="Oral">Oral</MenuItem>
                                    <MenuItem value="Practical">Practical</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Class</InputLabel>
                                <Select
                                    name="className"
                                    value={exam.className}
                                    onChange={handleChange}
                                    label="Class"
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
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Section</InputLabel>
                                <Select
                                    name="section"
                                    value={exam.section}
                                    onChange={handleChange}
                                    label="Section"
                                >
                                    {classSections?.find((cs) => cs.name === exam.className)
                                        ?.sections?.length > 0 ? (
                                        classSections
                                            .find((cs) => cs.name === exam.className)
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

                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    padding: 2,
                                    boxShadow: 3,
                                    border: "1px dashed gray", // Adds a dashed border
                                }}
                            >
                                {exam.subjects.map((subject, index) => (
                                    <Paper
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            padding: 2,
                                            marginBottom: 2,
                                            position: "relative",
                                            boxShadow: 2,
                                            border: "1px dashed gray", // Adds a dashed border
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleRemoveSubject(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                margin: -2.5,
                                                backgroundColor: "black",
                                                color: "white",
                                                "&:hover": {
                                                    backgroundColor: "darkgray",
                                                },
                                            }}
                                        >
                                            {" "}
                                            <CloseIcon/>
                                        </IconButton>
                                        <Grid container spacing={2}>
                                            {/* Subject Dropdown */}
                                            {/* <Grid item xs={12} sm={6}>

                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel>Subject</InputLabel>
                                                    <Select
                                                        value={subject.name}
                                                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                                                        input={<OutlinedInput/>}
                                                        label="Subject"
                                                    >
                                                        {subjectOptions?.map((subj) => (
                                                            <MenuItem key={subj.id} value={subj.name}>
                                                                {subj.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid> */}

                                            <Grid item xs={12} sm={6}>
                                                <FormControl
                                                    fullWidth
                                                    variant="outlined"
                                                    error={!!errors[`subjects.${index}.name`]}
                                                >
                                                    {/* Assign a unique ID to the label */}
                                                    <InputLabel id={`subject-label-${index}`}>
                                                        Subject
                                                    </InputLabel>
                                                    <Select
                                                        labelId={`subject-label-${index}`}
                                                        id={`subject-select-${index}`}
                                                        value={subject.name || ""}
                                                        onChange={(e) =>
                                                            handleSubjectChange(index, "name", e.target.value)
                                                        }
                                                        label="Subject"
                                                    >
                                                        {subjectOptions?.map((subj) => (
                                                            <MenuItem key={subj.id} value={subj.name}>
                                                                {subj.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {/* Helper text for validation errors */}
                                                    {errors[`subjects.${index}.name`] && (
                                                        <FormHelperText>
                                                            {errors[`subjects.${index}.name`]}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>

                                            {/* Max Marks */}
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Max Marks"
                                                    type="number"
                                                    value={subject.maxMarks}
                                                    onChange={(e) =>
                                                        handleSubjectChange(
                                                            index,
                                                            "maxMarks",
                                                            e.target.value
                                                        )
                                                    }
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    color="secondary"
                                                    error={!!errors[`subjects.${index}.maxMarks`]}
                                                    helperText={errors[`subjects.${index}.maxMarks`]}
                                                />
                                            </Grid>
                                            {/* Min Marks */}
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Min Marks"
                                                    type="number"
                                                    value={subject.minMarks}
                                                    onChange={(e) =>
                                                        handleSubjectChange(
                                                            index,
                                                            "minMarks",
                                                            e.target.value
                                                        )
                                                    }
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    color="secondary"
                                                    error={!!errors[`subjects.${index}.minMarks`]}
                                                    helperText={errors[`subjects.${index}.minMarks`]}
                                                />
                                            </Grid>
                                            {/* Start Date & Time */}
                                            <Grid item xs={12} sm={6}>
                                                <DateTimePicker
                                                    label="Start Date & Time"
                                                    value={subject.startDate}
                                                    onChange={(newValue) =>
                                                        handleSubjectChange(
                                                            index,
                                                            "startDate", newValue
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                                   error={!!errors[`subjects.${index}.startDate`]}
                                                                   helperText={errors[`subjects.${index}.startDate`]}
                                                                   fullWidth required

                                                        />
                                                    )}
                                                    minDate={dayjs()}
                                                    color="secondary"
                                                />
                                            </Grid>
                                            {/* End Date & Time */}
                                            <Grid item xs={12} sm={6}>
                                                <DateTimePicker
                                                    label="End Date & Time"
                                                    value={subject.endDate}
                                                    onChange={(newValue) =>
                                                        handleSubjectChange(
                                                            index,
                                                            "endDate",
                                                            newValue
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                                   error={!!errors[`subjects.${index}.endDate`]}
                                                                   helperText={errors[`subjects.${index}.endDate`]}
                                                                   fullWidth

                                                        />
                                                    )}
                                                    minDate={subject.startDate || dayjs()} // Prevents dates before startDate
                                                    color="secondary"
                                                />
                                            </Grid>
                                            {/* Room Number */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Room Number"
                                                    value={subject.roomNo}
                                                    onChange={(e) =>
                                                        handleSubjectChange(index, "roomNo", e.target.value)
                                                    }
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    color="secondary"
                                                    error={!!errors[`subjects.${index}.roomNo`]}
                                                    helperText={errors[`subjects.${index}.roomNo`]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                                {/* Add Subject Button */}
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleAddSubject}
                                        sx={{marginTop: 2}}
                                        fullWidth
                                    >
                                        Add Subject
                                    </Button>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Start Date & Time"
                                value={exam.startDate}
                                onChange={(newValue) => setExam({...exam, startDate: newValue})}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        error={!!errors.startDate}
                                        helperText={errors.startDate}
                                    />
                                )}
                                minDate={dayjs()} // Prevents past dates
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                label="End Date & Time"
                                value={exam.endDate}
                                onChange={(newValue) => setExam({...exam, endDate: newValue})}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        error={!!errors.endDate}
                                        helperText={errors.endDate}
                                    />
                                )}
                                minDate={exam.startDate || dayjs()} // Prevents dates before startDate

                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Duration (in minutes)"
                                type="number"
                                name="duration"
                                value={exam.duration}
                                onChange={handleChange}

                                fullWidth
                                required
                                variant="outlined"
                                color="secondary"

                                error={!!errors.duration}
                                helperText={errors.duration}

                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Exam Hall"
                                name="examHall"
                                value={exam.examHall}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                color="secondary"
                                error={!!errors.examHall}
                                helperText={errors.examHall}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                // onClick={handleSave}
                                onClick={() => {
                                    handleSave();
                                }}
                                fullWidth
                                sx={{marginTop: 2}}
                            >
                                Save Exam
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </motion.div>
        </LocalizationProvider>
    );

};

export default ExamForm;
