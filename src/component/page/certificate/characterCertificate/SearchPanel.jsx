import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { api, selectSchoolDetails } from "../../../../common";

import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

const SearchPanel = () => {
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector((state) => state.master.data.classSections);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const schoolId = userData?.id;
    const session = userData?.session;

    const [searchCriteria, setSearchCriteria] = useState({
        className: "",
        section: "",
        studentName: "",
        schoolId: schoolId,
        session: session,
    });

    useEffect(() => {
        if (searchCriteria.className && searchCriteria.section) {
            fetchStudents(searchCriteria.className, searchCriteria.section);
        }
    }, [searchCriteria.className, searchCriteria.section]);

    const fetchStudents = async (className, section) => {
        try {
            const response = await api.get("/api/students/class/section/school", {
                params: { className, section, schoolId, session },
            });

            if (response.data?.length > 0) {
                setStudents(response.data);
            } else {
                setStudents([]);  // Set to empty if no students found
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]); // Ensure students is not undefined
        }
    };

    const handleCriteriaChange = (event) => {
        const { name, value } = event.target;
        setSearchCriteria((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        console.log("Searching for student:", searchCriteria.studentName);
        console.log("Available students:", students);

        const student = students.find(
            (s) => s.studentName.toLowerCase() === searchCriteria.studentName.toLowerCase()
        );

        if (student) {
            setSelectedStudent(student);
            console.log("Student found:", student);
        } else {
            alert('Student not found!');
            setSelectedStudent(null);
        }
    };

    const handleReset = () => {
        setSearchCriteria({
            className: "",
            section: "",
            studentName: "",
        });
        setSelectedStudent(null);
        setStudents([]);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                {/* Class Selection */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Select Class</InputLabel>
                        <Select
                            name="className"
                            value={searchCriteria.className || ""}
                            onChange={handleCriteriaChange}
                        >
                            {classSections?.length > 0 ? (
                                classSections.map((classSection) => (
                                    <MenuItem key={classSection.id} value={classSection.name}>
                                        {classSection.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>No Classes Available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Section Selection */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Select Section</InputLabel>
                        <Select
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
                                <MenuItem value="" disabled>No Sections Available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Student Name Input */}
                <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-student-label">Select Student</InputLabel>
                
                                            <Select
                                                labelId="select-student-label"
                                                id="select-student"
                                                name="studentName"
                                                value={searchCriteria.studentName || ""}
                                                onChange={handleCriteriaChange}
                                                disabled={!searchCriteria.section}
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

                {/* Buttons */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        SEARCH
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleReset}>
                        RESET
                    </Button>
                </Grid>
            </Grid>

            {/* Display Selected Student */}
            {selectedStudent && (
                <Box mt={2} p={2} border={1} borderRadius={2}>
                    <h3>Student Found:</h3>
                    <p><strong>Name:</strong> {selectedStudent.studentName}</p>
                    <p><strong>Class:</strong> {selectedStudent.class}</p>
                    <p><strong>Section:</strong> {selectedStudent.section}</p>
                </Box>
            )}
        </Box>
    );
};

export default SearchPanel;
