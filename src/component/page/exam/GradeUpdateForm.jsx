import React, {useEffect, useState} from "react";
import {
    Button,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../common";

const GradeUpdateForm = () => {
    const [students, setStudents] = useState([]);
    const [examDetails, setExamDetails] = useState([]);
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector((state) => state.master.data.classSections);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [searchCriteria, setSearchCriteria] = useState({
        className: "",
        section: "",
        name: "",
        admissionNo: "",
        studentName: "",
        studentId: "",
        schoolId: schoolId,
        session,
        subjectName: "",
    });
    const [results, setResults] = useState([]);
    const [allResults, setAllResults] = useState([]); // Store the original list of results

    const calculateGrade = (total) => {
        if (total >= 90) return "A+";
        if (total >= 80) return "A";
        if (total >= 70) return "B+";
        if (total >= 60) return "B";
        if (total >= 50) return "C";
        if (total >= 40) return "D";
        return "F"; // Fail grade
    };
    const handleInputChange = (id, event) => {
        const {name, value} = event.target;
        setResults((prevResults) =>
            prevResults.map((result) => {
                if (result.id === id) {
                    const updatedResult = {...result, [name]: value};

                    // Calculate total if theory or practical values are updated
                    if (name === "theory" || name === "practical") {
                        const theory = parseFloat(updatedResult.theory) || 0;
                        const practical = parseFloat(updatedResult.practical) || 0;
                        updatedResult.total = theory + practical; // Calculate the total
                        updatedResult.grade = calculateGrade(updatedResult.total); // Calculate the grade

                    }
                    return updatedResult;
                }
                return result;
            })
        );
    };
    const handleDelete = (id) => {
        setResults((prevResults) =>
            prevResults.filter((result) => result.id !== id)
        );
    };
    const handleSubmit = () => {
        const updatedResults = results.map((result) => ({
            ...result,
            ...searchCriteria, // Add searchCriteria fields to each result;
        }));

        api
            .post("/api/results/update", updatedResults)
            .then((response) => {
                console.log("Data submitted successfully", response.data);
            })
            .catch((error) => {
                console.error("There was an error submitting the data!", error);
            });
        alert('Grade Updated...');
        setResults([]); //Clear the results after submission
        setExamDetails([]);//Clear the results after submission
        setSearchCriteria({});

    };

    async function fetchExamBySession(session) {
        try {
            const response = await api.get("/api/exams/session", {
                params: {
                    session: session,
                    schoolId: schoolId,
                },
            });
            setExamDetails(response.data);
        } catch (error) {
            console.error("Error fetching exam details:", error);
        }
    }

    const fetchExamBySessionByClassAndSection = async (className, section) => {
        try {
            const response = await api.get("/api/exams/class/section/school", {
                params: {
                    className: className || searchCriteria.className,
                    section: section || searchCriteria.section,
                    schoolId: schoolId,
                },
            });
            setExamDetails(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };
    const handleCriteriaChange = async (event) => {
        const {name, value} = event.target;
        if (!name) {
            console.error("event.target.name is undefined");
            return;
        }
        setSearchCriteria((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === "session") {
            await fetchExamBySession(value);
        }
        if (name === "className") {
            setSearchCriteria((prevState) => ({
                ...prevState,
                section: "", // Reset section when class changes
            }));
            await fetchStudents(value, "");
            await fetchExamBySessionByClassAndSection(value, "");
        } else if (name === "section") {
            await fetchStudents(searchCriteria.className, value);
            await fetchExamBySessionByClassAndSection(
                searchCriteria.className,
                value
            );
        } else if (name === "studentName") {
            if (value === "") {
                setResults(allResults); // Reset to the original list of results
            } else {
                const filteredResults = allResults.filter(
                    (result) => result.subject === value
                );
                setResults(filteredResults); // Update results to only show selected subject
            }
            const selectedStudent = students.find(
                (student) => student.studentName === value
            );
            setSearchCriteria((prevState) => ({
                ...prevState,
                admissionNo: selectedStudent?.admissionNo || "",
                studentId: selectedStudent?.id || "",
            }));
        } else if (name === "name") { // When selecting the Exam Name
            const updatedCriteria = {...searchCriteria, [name]: value};
            if (
                updatedCriteria.session &&
                updatedCriteria.className &&
                updatedCriteria.section
            ) {
                await fetchExamBySessionByClassAndSectionAndSession(
                    updatedCriteria.className,
                    updatedCriteria.section,
                    updatedCriteria.session
                );
            }
            if (
                updatedCriteria.session &&
                updatedCriteria.className &&
                updatedCriteria.section &&
                updatedCriteria.name &&
                updatedCriteria.studentId
            ) {
                try {
                    const params = {
                        session: updatedCriteria.session,
                        className: updatedCriteria.className,
                        section: updatedCriteria.section,
                        name: updatedCriteria.name,
                        studentId: updatedCriteria.studentId,
                        studentName: updatedCriteria.studentName,
                        schoolId: schoolId,
                    };
                    const response = await api.get("/api/results/exam-details", {params});
                    console.log("Exam Details:", response.data);
                    if (response.data && response.data.length > 0) {
                        console.log("result", results);
                        const filteredResults = examDetails
                            .filter((exam) => exam.name === updatedCriteria.name)
                            .flatMap((exam) =>
                                exam.subjects.map((subject, index) => ({
                                    id: index,
                                    subject: subject.name,
                                    name: exam.name,
                                    maxMarks: subject.maxMarks,
                                    minMarks: subject.minMarks,
                                    theory: "",
                                    practical: "",
                                    total: "",
                                    grade: "",
                                }))
                            );

                        setResults(filteredResults);
                    } else {
                        console.log("No data found, not setting results");
                    }
                } catch (error) {
                    console.error("Error fetching exam details:", error);
                }
            }

        } else if (name === "subjectName") { // When selecting a subject
            const filteredResults = results.filter(
                (result) => result.subject === value
            );
            setResults(filteredResults); // Update results to only show selected subject
        }
    };


    const fetchExamBySessionByClassAndSectionAndSession = async (
        className,
        section,
        session
    ) => {
        try {
            const response = await api.get("/api/exams/class/section/session", {
                params: {
                    className: className,
                    section: section,
                    session: session,
                    schoolId: schoolId, // Assuming schoolId is defined in the outer scope
                },
            });
            setExamDetails(response.data); // Update the state with the fetched exam details
        } catch (error) {
            console.error(
                "Error fetching exams by session, class, and section:",
                error
            );
        }
    };

    const fetchStudents = async (className, section) => {
        try {
            const response = await api.get("/api/students/class/section/school", {
                params: {
                    className: className || searchCriteria.className,
                    section: section || searchCriteria.section,
                    schoolId: schoolId,
                    session,
                    grade: "grade",
                },
            });
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };
    useEffect(() => {
        if (searchCriteria.name) {
            const filteredResults = examDetails
                .filter((exam) => exam.name === searchCriteria.name)
                .flatMap((exam) =>
                    exam.subjects.map((subject, index) => ({
                        id: index,
                        subject: subject.name,
                        name: exam.name,
                        maxMarks: subject.maxMarks,
                        minMarks: subject.minMarks,
                        theory: "",
                        practical: "",
                        total: "",
                        grade: "",
                    }))
                );

            setResults(filteredResults);
            console.log(results)
        }
    }, [searchCriteria.name, examDetails]);

    return (
        <Container>
            <Paper elevation={2} style={{padding: "10px"}}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="select-class-label">Select Class</InputLabel>
                            <Select
                                labelId="select-class-label"
                                id="select-class"
                                name="className"
                                value={searchCriteria.className || ""}
                                onChange={handleCriteriaChange}
                                label="Select Class"
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
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="select-section-label">Section</InputLabel>
                            <Select
                                label="section"
                                labelId="select-section"
                                id="select-section"
                                name="section"
                                value={searchCriteria.section || ""}
                                onChange={handleCriteriaChange}
                                disabled={!searchCriteria.className}
                            >
                                {classSections?.find(
                                    (cs) => cs.name === searchCriteria.className
                                )?.sections?.length > 0 ? (
                                    classSections
                                        .find((cs) => cs.name === searchCriteria.className)
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
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="select-student-label">Select Student</InputLabel>

                            <Select
                                labelId="select-student-label"
                                id="select-student"
                                name="studentName"
                                value={searchCriteria.studentName || ""}
                                onChange={handleCriteriaChange}
                                disabled={!students.length}
                                label="Select Student"
                            >
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <MenuItem key={student.id} value={student.studentName}>
                                            {student.studentName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Students Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="exam-name-label">Exam Name</InputLabel>

                            <Select
                                labelId="exam-name-label"
                                id="exam-name-select"
                                name="name"
                                value={searchCriteria.name || ""}
                                onChange={handleCriteriaChange}
                                label="Exam Name"
                            >
                                {examDetails.map((exam) => (
                                    <MenuItem key={exam.id} value={exam.name}>
                                        {exam.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="subject-label">Select Subject</InputLabel>

                            <Select
                                labelId="subject-label"
                                id="subject-select"
                                name="subjectName"
                                value={searchCriteria.subjectName || ""}
                                onChange={handleCriteriaChange}
                                label="Select Subject"
                            >
                                {results.map((result) => (
                                    <MenuItem key={result.id} value={result.subject}>
                                        {result.subject}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        {searchCriteria.className &&
                            searchCriteria.section &&
                            searchCriteria.name &&
                            searchCriteria.studentName && (
                                <Paper
                                    elevation={3}
                                    style={{
                                        padding: "20px",
                                        marginBottom: "20px",
                                        borderRadius: "10px",
                                        backgroundColor: "#f9f9f9",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" style={{
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#333"
                                            }}>
                                                Student Details
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                <strong>Student Name:</strong> {searchCriteria.studentName || "N/A"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                <strong>Class Name:</strong> {searchCriteria.className || "N/A"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                <strong>Section:</strong> {searchCriteria.section || "N/A"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                <strong>Exam Name:</strong> {searchCriteria.name || "N/A"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1">
                                                <strong>Admission No:</strong> {searchCriteria.admissionNo || "N/A"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                            )}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Exam Name</TableCell>
                                        <TableCell>Max Marks</TableCell>
                                        <TableCell>Min Marks</TableCell>
                                        <TableCell>Theory</TableCell>
                                        <TableCell>Practical</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Grade</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((field, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <TextField
                                                    value={field.subject || ""}
                                                    InputProps={{readOnly: true}}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="examName"
                                                    value={field.name || ""}
                                                    onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="maxMarks"
                                                    value={field.maxMarks || ""}
                                                    onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="minMarks"
                                                    value={field.minMarks || ""}
                                                    onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="theory"
                                                    value={field.theory || ""}
                                                    onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="practical"
                                                    value={field.practical || ""}
                                                    onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="total"
                                                    value={field.total || ""}
                                                    InputProps={{readOnly: true}} // Make total field read-only
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="grade"
                                                    value={field.grade || ""}
                                                    InputProps={{readOnly: true}} // Grade is read-only
                                                    // onChange={(e) => handleInputChange(field.id, e)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(field.id)}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );

};

export default GradeUpdateForm;