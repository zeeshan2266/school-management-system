// src/components/AssignTeacher.js
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {assignClassTeacher, fetchSections, getTeacherAssignments} from "./redux/teacherSlice";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {selectSchoolDetails} from "../../../../common";

const AssignTeacher = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const staff = useSelector(state => state.master.data?.staff || []);
    const classSections = useSelector(state => state.master?.data?.classSections || []);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);

    // Fetch teacher assignments based on the selected teacher
    useEffect(() => {
        if (selectedTeacher) {
            const teacher = staff.find((staff) => staff.id === selectedTeacher);
            dispatch(
                getTeacherAssignments({
                    schoolId,
                    session,
                    teacherId: teacher?.id,
                    teacherName: teacher?.name,
                    classId: null,
                    sectionId: null,
                    className: null,
                })
            )
                .unwrap()
                .then((data) => {
                    setAssignments(data); // Update assignments state
                    setDialogOpen(true); // Open dialog
                })
                .catch((error) => console.error("Error fetching teacher assignments:", error));
            console.log("Assignment ", assignments)
        }
    }, [selectedTeacher, staff, schoolId, session, dispatch]);

    // Fetch assignments based on selected class and section
    useEffect(() => {
        if (selectedClass && selectedSection) {
            dispatch(
                getTeacherAssignments({
                    schoolId,
                    session,
                    teacherId: null,
                    teacherName: null,
                    classId: selectedClass,
                    sectionId: selectedSection,
                    className: null,
                })
            )
                .unwrap()
                .then((data) => {
                    setAssignments(data); // Update assignments state
                    setDialogOpen(true); // Open dialog
                })
                .catch((error) => console.error("Error fetching class-section assignments:", error));
        }
    }, [selectedClass, selectedSection, schoolId, session, dispatch]);

    // Open the dialog
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    useEffect(() => {
        if (selectedClass) {
            dispatch(fetchSections(selectedClass));
        }
    }, [selectedClass, dispatch]);

    const handleAssignTeacher = () => {
        if (selectedTeacher && selectedClass && selectedSection) {
            const teacher = staff.find((staff) => staff.id === selectedTeacher);
            const selectClass = classSections.find((classn) => classn.id === selectedClass);
            const selectSection = selectClass?.sections.find((sec) => sec.id === selectedSection);
            dispatch(assignClassTeacher({
                classId: selectedClass,
                className: selectClass.name,
                sectionId: selectedSection,
                sectionName: selectSection.name,
                teacherId: selectedTeacher,
                teacherName: teacher.name,
                schoolId: schoolId,
                session: session,
            }));
            alert("Teacher assigned successfully!");
        } else {
            alert("Please select all fields before assigning a teacher.");
        }
    };

    const loading = useSelector(state => state.master?.loading);
    const error = useSelector(state => state.master?.error);

    // Loading and error handling
    if (loading) return <CircularProgress/>; // Show loading spinner
    if (error) return <Typography color="error">Error: {error}</Typography>; // Show error message

    return (
        <div>
            <h2>Assign Class Teacher</h2>

            {/* Select Teacher */}
            <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    disabled={staff.length === 0} // Disable if no teachers are available
                >
                    {staff.length > 0 ? (
                        staff.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No teachers available</MenuItem>
                    )}
                </Select>
            </FormControl>

            {/* Select Class and Section */}
            <Grid container spacing={3} alignItems="center" sx={{marginTop: '5px'}}>
                {/* Class Dropdown */}
                <Grid item xs={12} sm={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Select Class</InputLabel>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            disabled={classSections.length === 0}
                        >
                            {classSections.length > 0 ? (
                                classSections.map((classSection) => (
                                    <MenuItem key={classSection.id} value={classSection.id}>
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

                {/* Section Dropdown */}
                <Grid item xs={12} sm={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Select Section</InputLabel>
                        <Select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            disabled={!selectedClass || !classSections.find(c => c.id === selectedClass)?.sections?.length}
                        >
                            {
                                // Fetch sections based on selected class
                                classSections?.find(cs => cs.id === selectedClass)?.sections?.length > 0
                                    ? classSections
                                        .find(cs => cs.id === selectedClass)
                                        .sections.map((section) => (
                                            <MenuItem key={section.id} value={section.id}>
                                                {section.name}
                                            </MenuItem>
                                        ))
                                    : (
                                        <MenuItem value="" disabled>No Sections Available</MenuItem>
                                    )
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Assign Teacher Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAssignTeacher}
                disabled={!selectedTeacher || !selectedClass}
            >
                Assign Teacher
            </Button>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Teacher Assignments</DialogTitle>
                <DialogContent>
                    {assignments.length > 0 ? (
                        <ul>
                            {assignments.map((assignment) => (
                                <li key={assignment.id}>
                                    <strong>Teacher:</strong> {assignment.teacherName} | <strong>Class:</strong>{" "}
                                    {assignment.className} | <strong>Section:</strong> {assignment.sectionName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No assignments found.</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default AssignTeacher;
