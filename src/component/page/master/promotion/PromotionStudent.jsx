import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import {fetchStudents} from "../../student/redux/studentActions";
import {useDispatch, useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import {sessionOptions} from "../../../../commonStyle";

const PromotionStudent = () => {
    const dispatch = useDispatch();
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Current (from) Class and Section
    const [fromClass, setFromClass] = useState("");
    const [fromSection, setFromSection] = useState("");

    // Promote-to (to) Class, Section, and Session Year
    const [toClass, setToClass] = useState("");
    const [toSection, setToSection] = useState("");
    const [toSessionYear, setToSessionYear] = useState("");

    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const classSections = useSelector(
        (state) => state.master?.data?.classSections || []
    );
    const {students} = useSelector((state) => state.students || []);

    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);

    // Filter students based on "from" class and section
    useEffect(() => {
        const selectClass = classSections.find((classn) => classn.id === fromClass);
        const selectSection = selectClass?.sections.find((sec) => sec.id === fromSection);

        const filtered = students.filter((student) => {
            const classMatch = fromClass
                ? student.className === selectClass.name
                : true;
            const sectionMatch = fromSection
                ? student.section === selectSection.name
                : true;
            return classMatch && sectionMatch;
        });
        setFilteredStudents(filtered);
    }, [fromClass, fromSection, students]);

    // Handle student selection
    const handleStudentSelection = (studentId) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(studentId)
                ? prevSelected.filter((id) => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    // Handle "Select All" logic
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            const allStudentIds = filteredStudents.map((student) => student.id);
            setSelectedStudents(allStudentIds);
        }
        setSelectAll(!selectAll);
    };

    // Promote selected students
    const handlePromote = async () => {
        try {
            setLoading(true);

            const selClass = classSections.find((classn) => classn.id === toClass);
            const selSection = selClass?.sections.find((sec) => sec.id === toSection);

            await api.post(`/api/promote-students`, {
                studentIds: selectedStudents,
                schoolId,
                session,
                fromClass,
                fromSection,
                toClass,
                toSection,
                toSessionYear,
                className: selClass?.name,
                sectionName: selSection?.name,
                createdBy: userData.name,
            });
            alert("Students promoted successfully!");
            setSelectedStudents([]); // Clear selection
        } catch (error) {
            console.error("Error promoting students:", error);
            alert("Failed to promote students.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* Left Side: From and To Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{padding: 3, marginBottom: 4}}>
                        <Typography variant="h5" gutterBottom>
                            Promote Students
                        </Typography>
                        <Grid container spacing={3} alignItems="center">
                            {/* From Class and Section */}
                            <Grid item xs={12} sm={6} md={12}>
                                <FormControl fullWidth>
                                    <InputLabel>From Class</InputLabel>
                                    <Select
                                        value={fromClass}
                                        onChange={(e) => {
                                            setFromClass(e.target.value);
                                            setFromSection("");
                                        }}
                                        disabled={classSections.length === 0}
                                    >
                                        {classSections.map((cls) => (
                                            <MenuItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={12}>
                                <FormControl fullWidth>
                                    <InputLabel>From Section</InputLabel>
                                    <Select
                                        value={fromSection}
                                        onChange={(e) => setFromSection(e.target.value)}
                                        disabled={
                                            !fromClass ||
                                            !classSections.find((c) => c.id === fromClass)
                                                ?.sections?.length
                                        }
                                    >
                                        {classSections
                                            .find((c) => c.id === fromClass)
                                            ?.sections.map((section) => (
                                                <MenuItem key={section.id} value={section.id}>
                                                    {section.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper elevation={3} sx={{padding: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Promote To
                        </Typography>
                        <Grid container spacing={3}>
                            {/* To Class, Section, and Session Year */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>To Class</InputLabel>
                                    <Select
                                        value={toClass}
                                        onChange={(e) => {
                                            setToClass(e.target.value);
                                            setToSection("");
                                        }}
                                        disabled={classSections.length === 0}
                                    >
                                        {classSections.map((cls) => (
                                            <MenuItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>To Section</InputLabel>
                                    <Select
                                        value={toSection}
                                        onChange={(e) => setToSection(e.target.value)}
                                        disabled={
                                            !toClass ||
                                            !classSections.find((c) => c.id === toClass)
                                                ?.sections?.length
                                        }
                                    >
                                        {classSections
                                            .find((c) => c.id === toClass)
                                            ?.sections.map((section) => (
                                                <MenuItem key={section.id} value={section.id}>
                                                    {section.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>To Session Year</InputLabel>
                                    <Select
                                        value={toSessionYear}
                                        onChange={(e) => setToSessionYear(e.target.value)}
                                    >
                                        {sessionOptions.map((year) => (
                                            <MenuItem key={year.value} value={year.label}>
                                                {year.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Side: Students List */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{padding: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Students
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            }
                            label="Select All"
                        />
                        <List>
                            {loading ? (
                                <CircularProgress/>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <ListItem
                                        key={student.id}
                                        button
                                        onClick={() => handleStudentSelection(student.id)}
                                    >
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                        />
                                        <ListItemText
                                            primary={student.studentName}
                                            secondary={`Roll No: ${student.rollNo}`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No students available.</Typography>
                            )}
                        </List>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePromote}
                            disabled={
                                selectedStudents.length === 0 ||
                                !toClass ||
                                !toSection ||
                                !toSessionYear
                            }
                            sx={{marginTop: 2}}
                        >
                            Promote Students
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionStudent;
