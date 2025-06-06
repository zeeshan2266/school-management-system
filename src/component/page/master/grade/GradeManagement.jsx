import React, {useEffect, useState} from "react";
import {
    Alert,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useDispatch, useSelector} from "react-redux";
import {createGrade, deleteGrade, fetchGrades} from "./redux/gradeActions";
import {selectSchoolDetails} from "../../../../common";

function GradeManagement() {
    const [newGrade, setNewGrade] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const dispatch = useDispatch();
    const grades = useSelector((state) => state.grade.grades);
    console.log("Grades in Component:", grades); // Log the grades
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchGrades(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddGrade = () => {
        if (!newGrade.trim()) {
            alert("Grade name cannot be blank.");
            return;
        }
        const gradeData = {
            name: newGrade,
            schoolId: schoolId,
            session,
        };
        dispatch(createGrade(gradeData)); // Ensure this dispatch is working correctly
        setNewGrade(""); // Reset the input field
    };

    const handleDeleteGrade = (id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this grade?"
        );
        if (confirmDelete) {
            dispatch(deleteGrade(id))
                .then(() => {
                    // Show success message after deletion
                    setSnackbarMessage("Grade deleted successfully.");
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    // Handle error if deletion fails
                    console.error("Error deleting grade:", error);
                    setSnackbarMessage("Failed to delete the grade. Please try again.");
                    setSnackbarOpen(true);
                });
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Grade Management
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: "fadeInLeft 1s"}}>
                        <Typography variant="h6" gutterBottom>
                            Add New Grade
                        </Typography>
                        <TextField
                            label="New Grade"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{marginBottom: 2}}
                        />
                        <Button
                            onClick={handleAddGrade}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Add Grade
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{padding: 3, animation: "fadeInRight 1s"}}>
                        <Typography variant="h6" gutterBottom>
                            Existing Grades
                        </Typography>
                        <List
                            sx={{
                                maxHeight: 400, // Adjust the height as needed
                                overflowY: "auto",
                                padding: 0,
                                "&::-webkit-scrollbar": {
                                    width: "0.4em",
                                },
                                "&::-webkit-scrollbar-track": {
                                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    borderRadius: 8,
                                },
                            }}
                        >
                            {grades.map((grade) => (
                                <ListItem key={grade.id}>
                                    <ListItemText primary={grade.name}/>
                                    <IconButton
                                        onClick={() => handleDeleteGrade(grade.id)}
                                        color="secondary"
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Automatically hide after 3 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "top", horizontal: "center"}} // Positioning the Snackbar at the top center
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{width: "100%"}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default GradeManagement;
