import React, {useEffect, useState} from 'react';
import {Alert, Button, Container, Grid, IconButton, Snackbar, TextField, Tooltip} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import {deleteStudent, fetchStudents, saveStudent} from './redux/studentActions';

const Student = () => {
    const dispatch = useDispatch();
    const {students} = useSelector((state) => state.students);
    const navigate = useNavigate();
    const location = useLocation();
    const [openForm, setOpenForm] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // For Snackbar
    const [submitted, setSubmitted] = useState(false); // To track form submission
    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);
    useEffect(() => {
        // Filter students based on search query, ignoring photo fields
        const filtered = students.filter((student) => {
            const {studentPhoto, fatherPhoto, motherPhoto, ...otherFields} = student;
            return Object.values(otherFields).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredStudents(filtered);
    }, [students, searchQuery]);
// Open the modal if "openForm" state is passed via navigation
    useEffect(() => {
        if (location.state?.openForm) {
            setOpenForm(true);
        }
    }, [location.state]);
    const handleSave = (student) => {
        dispatch(saveStudent(student));
        setOpenForm(false);
        setSubmitted(true); // Mark form as submitted
    };
    // Ensure Snackbar only shows after the form is closed and submitted
    useEffect(() => {
        if (!openForm && submitted) {
            setSnackbarOpen(true); // Show Snackbar after form submission
            setSubmitted(false); // Reset submitted state
        }
    }, [openForm, submitted]);
    useEffect(() => {
        // Close snackbar when location changes
        return () => {
            setSnackbarOpen(false);
        };
    }, [location]);
// Close snackbar when the component unmounts
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setSnackbarOpen(false);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    const handleEdit = (student) => {
        setEditStudent(student);
        setOpenForm(true);
    };
    const handleDelete = (id) => {
        dispatch(deleteStudent(id));
    };
    const handleView = (student) => {
        navigate(`/student/${student.id}`);
    };
    const handleAddNewStudent = () => {
        setEditStudent(null);  // Clear any previously selected student data
        setOpenForm(true);
    };
    const handleClearSearch = () => {
        setSearchQuery('');
    };
    const handleDownload = () => {
        // Prepare student data, excluding photo fields, for Excel export
        const dataToExport = students.map(({studentPhoto, fatherPhoto, motherPhoto, ...otherFields}) => otherFields);
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "students.xlsx");
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Close Snackbar
    };
    return (
        <Container>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by Student Name, Mobile, Parent Name, Class Section, Roll, Admission Number, Vehicle ID, Route ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton>
                                    <SearchIcon/>
                                </IconButton>
                            ),
                            endAdornment: searchQuery && (
                                <IconButton onClick={handleClearSearch}>
                                    <ClearIcon/>
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewStudent}
                        fullWidth
                    >
                        Add New Student
                    </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Tooltip title="Download Students as Excel">
                        <IconButton onClick={handleDownload}>
                            <DownloadIcon/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            {/* Student List */}
            <StudentList
                studentList={filteredStudents}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleView={handleView}
            />
            {/* Snackbar for Success Message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                sx={{position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)'}}
            ><Alert
                onClose={handleSnackbarClose}
                severity="success"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    minWidth: '300px'
                }}
            >
                Congratulations, the student has been successfully added!
            </Alert>
            </Snackbar>
            <StudentForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                handleSave={handleSave}
                studentData={editStudent}
            />
        </Container>
    );
};

export default Student;
