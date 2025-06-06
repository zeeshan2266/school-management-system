import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
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
    Typography,
} from "@mui/material";
import {useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../common";

const Marksheet = () => {
    // Get user details and school info from Redux
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const classSections = useSelector((state) => state.master.data.classSections);

    // State for search criteria and fetched data
    const [searchCriteria, setSearchCriteria] = useState({
        className: "",
        section: "",
        examName: "",
        studentName: "",
        schoolId: schoolId,
        session: session,
    });
    const [examDetails, setExamDetails] = useState([]); // for exam dropdown
    const [students, setStudents] = useState([]); // for student dropdown
    const [marks, setMarks] = useState([]); // marks data to display in table

    // Fetch exam details when the session changes
    useEffect(() => {
        if (session) {
            fetchExamDetails(session);
        }
    }, [session]);

    // When class and section are selected, fetch the list of students
    useEffect(() => {
        if (searchCriteria.className && searchCriteria.section) {
            fetchStudents(searchCriteria.className, searchCriteria.section);
        }
    }, [searchCriteria.className, searchCriteria.section]);

    // --- API CALLS ---

    // Fetch exam details for a given session
    const fetchExamDetails = async (sessionVal) => {
        try {
            const response = await api.get("/api/exams/session", {
                params: {session: sessionVal, schoolId},
            });
            setExamDetails(response.data || []);
        } catch (error) {
            console.error("Error fetching exam details:", error);
        }
    };

    // Fetch students for the selected class and section
    const fetchStudents = async (className, section) => {
        try {
            const response = await api.get("/api/students/class/section/school", {
                params: {className, section, schoolId, session},
            });
            setStudents(response.data || []);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // --- HANDLERS ---

    // Update search criteria when an input value changes
    const handleCriteriaChange = (event) => {
        const {name, value} = event.target;
        setSearchCriteria((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // When user clicks "Search", fetch marks using the search criteria
    const handleSearch = async () => {
        try {
            // Adjust the endpoint and parameters as needed.
            const response = await api.get("/api/marks/search", {
                params: searchCriteria,
            });
            console.log("Marks response:", response.data);
            setMarks(response.data || []);
        } catch (error) {
            console.error("Error fetching marks:", error);
        }
    };

    // Print handler
    const handlePrint = () => {
        window.print();
    };

    return (
        <Container>
            <Box sx={{padding: 2}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Marksheet
                </Typography>
                {/* Search Filters */}
                <Paper sx={{padding: 2, marginBottom: 2}}>
                    <Grid container spacing={2}>
                        {/* Class Selector */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Class</InputLabel>
                                <Select
                                    name="className"
                                    value={searchCriteria.className}
                                    onChange={handleCriteriaChange}
                                    label="Class"
                                >
                                    {classSections && classSections.length > 0 ? (
                                        classSections.map((cs) => (
                                            <MenuItem key={cs.id} value={cs.name}>
                                                {cs.name}
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
                        {/* Section Selector */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Section</InputLabel>
                                <Select
                                    name="section"
                                    value={searchCriteria.section}
                                    onChange={handleCriteriaChange}
                                    label="Section"
                                    disabled={!searchCriteria.className}
                                >
                                    {classSections &&
                                    classSections.find(
                                        (cs) => cs.name === searchCriteria.className
                                    ) &&
                                    classSections
                                        .find((cs) => cs.name === searchCriteria.className)
                                        .sections?.map((sec) => (
                                        <MenuItem key={sec.id} value={sec.name}>
                                            {sec.name}
                                        </MenuItem>
                                    )) ? (
                                        classSections
                                            .find((cs) => cs.name === searchCriteria.className)
                                            .sections.map((sec) => (
                                            <MenuItem key={sec.id} value={sec.name}>
                                                {sec.name}
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
                        {/* Exam Selector */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Exam Name</InputLabel>
                                <Select
                                    name="examName"
                                    value={searchCriteria.examName}
                                    onChange={handleCriteriaChange}
                                    label="Exam Name"
                                >
                                    {examDetails && examDetails.length > 0 ? (
                                        examDetails.map((exam) => (
                                            <MenuItem key={exam.id} value={exam.name}>
                                                {exam.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="" disabled>
                                            No Exams Available
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Student Selector */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Student Name</InputLabel>
                                <Select
                                    name="studentName"
                                    value={searchCriteria.studentName}
                                    onChange={handleCriteriaChange}
                                    label="Student Name"
                                    disabled={!students || students.length === 0}
                                >
                                    {students && students.length > 0 ? (
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
                    </Grid>
                    <Box sx={{marginTop: 2, textAlign: "center"}}>
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Box>
                </Paper>
                {/* Marks Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{bgcolor: "#f5f5f5"}}>
                            <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Max Marks</TableCell>
                                <TableCell>Min Marks</TableCell>
                                <TableCell>Obtained Marks</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {marks && marks.length > 0 ? (
                                marks.map((mark) => (
                                    <TableRow key={mark.id}>
                                        <TableCell>{mark.studentName}</TableCell>
                                        <TableCell>{mark.subject}</TableCell>
                                        <TableCell>{mark.maxMarks}</TableCell>
                                        <TableCell>{mark.minMarks}</TableCell>
                                        <TableCell>{mark.obtainedMarks}</TableCell>
                                        <TableCell>{mark.grade}</TableCell>
                                        <TableCell>
                                            {mark.obtainedMarks >= mark.minMarks ? "Pass" : "Fail"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No marks available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{marginTop: 2, textAlign: "center"}}>
                    <Button variant="contained" color="primary" onClick={handlePrint}>
                        Print Marksheet
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Marksheet;