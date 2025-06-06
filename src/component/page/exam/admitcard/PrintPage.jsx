import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSchools} from '../../../MainPage/schools/redux/schoolActions'; // Corrected import path
import {Box, Button, Card, CardContent, Container, Grid, IconButton, Typography} from '@mui/material';
import {ArrowBack} from '@mui/icons-material'; // Added `ArrowBack`
import {motion} from 'framer-motion';

import './PrintPage.css'; // <-- Import the CSS here
// Animation variants using Framer Motion
const cardVariants = {
    hidden: {opacity: 0, y: 50},
    visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
};

const PrintPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const dispatch = useDispatch();
    const {students, exams = []} = location.state || {students: [], exams: []};
    const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student for printing
    const {schools} = useSelector((state) => state.schoolState || {});
    useEffect(() => {
        dispatch(fetchSchools());
    }, [dispatch]);

    // Effect to trigger the print dialog after setting the selected student
    useEffect(() => {
        if (selectedStudent) {
            setTimeout(() => {
                window.print();
                setSelectedStudent(null);
            }, 500); // Small delay to allow rendering before print
        }
    }, [selectedStudent]);

    // Function to handle print per student
    const handlePrint = (student) => {
        setSelectedStudent(student);
    };

    return (
        <Container sx={{marginTop: 4}}>
            {/* Back Button */}
            <Box sx={{display: 'flex', alignItems: 'center', marginBottom: 2}}>
                <IconButton onClick={() => navigate(-1)} color="primary"> {/* Navigate back */}
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h6" sx={{marginLeft: 1}}>
                    Back
                </Typography>
            </Box>
            <Typography variant="h4" gutterBottom align="center">
                Selected Student Details
            </Typography>
            {schools?.length > 0 ? (
                schools.map((school) => (
                    <li>{school.name}</li>
                ))
            ) : (
                <Typography>No schools available</Typography>
            )}
            {/* Grid layout for student cards */}
            <Grid container spacing={4}>
                {students.map((student, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>

                        {/* Motion wrapper for card animation */}
                        <motion.div variants={cardVariants} initial="hidden" animate="visible">
                            <Card elevation={3} sx={{borderRadius: '16px'}}>
                                {/* School Details */}
                                <Box sx={{textAlign: "center", marginBottom: 2}}>
                                    <Typography variant="h4">Demo Public School</Typography>
                                    <Typography variant="h6">37/52, Sikandra, Agra, Uttar Pradesh</Typography>
                                </Box>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {student.studentName}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Class:</strong> {student.className}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Section:</strong> {student.section}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Roll Number:</strong> {student.rollNo}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Father Name:</strong> {student.fatherName}
                                    </Typography>

                                    <Grid container spacing={4}>

                                        {exams.length > 0 ? (
                                            exams.map((exam, index) => (
                                                <Grid item xs={12} key={index}>

                                                    <Box sx={{marginTop: 4}}>
                                                        <Typography variant="h6">Date Sheet</Typography>
                                                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                                            <thead>
                                                            <tr>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>Date/Day
                                                                </th>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>Subject
                                                                </th>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>Duration
                                                                </th>

                                                            </tr>
                                                            </thead>
                                                            <tbody>

                                                            <tr>
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>{exam.startDateTime}</td>
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>{exam.subject}</td>
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px'
                                                                }}>{exam.duration}</td>

                                                            </tr>


                                                            </tbody>
                                                        </table>
                                                    </Box>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Grid item xs={12}>
                                                < Typography variant="body1" color="error">
                                                    No exam details available.
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>


                                    {/* Print button for each student */}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{marginTop: 2}}
                                        onClick={() => handlePrint(student)}
                                    >
                                        Print
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
            {/* Display Exam Information */}
            {/* <Grid container spacing={4}>
           
                {exams.length > 0 ? (
                    exams.map((exam, index) => (
                        <Grid item xs={12} key={index}>
                            
                    <Box sx={{marginTop: 4}}>
                        <Typography variant="h6">Date Sheet</Typography>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th style={{border: '1px solid black', padding: '8px'}}>Date/Day</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Time</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Class</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Subject</th>
                            </tr>
                            </thead>
                            <tbody>
                            
                                    <tr>
                                        <td style={{border: '1px solid black', padding: '8px'}}>{exam.startDateTime}</td>
                                        <td style={{border: '1px solid black', padding: '8px'}}>{exam.time}</td>
                                        <td style={{border: '1px solid black', padding: '8px'}}>{exam.sclass}</td>
                                        <td style={{border: '1px solid black', padding: '8px'}}>{exam.subject}</td>
                                    </tr>
                                
                            
                            </tbody>
                        </table>
                    </Box>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        < Typography variant="body1" color="error">
                            No exam details available.
                        </Typography>
                    </Grid>
                )}
            </Grid> */}

            <div style={{visibility: 'hidden', position: 'absolute', top: '-9999px'}}>

                {selectedStudent && <PrintSingleStudent student={selectedStudent} exams={exams}/>}
            </div>

        </Container>
    );
};

const PrintSingleStudent = ({students, exams}) => {

    return (
        <Container>
            <Card elevation={3} sx={{borderRadius: "16px", padding: "20px"}}>
                <CardContent>
                    {/* School Details */}
                    <Box sx={{textAlign: "center", marginBottom: 2}}>
                        <Typography variant="h4">Demo Public School</Typography>
                        <Typography variant="h6">37/52, Sikandra, Agra, Uttar Pradesh</Typography>
                    </Box>

                    {/* Student Info */}
                    <Grid container spacing={4}>
                        {students.map((student, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card elevation={3} sx={{borderRadius: "12px"}}>
                                    <CardContent>
                                        {/* Student Details */}
                                        <Typography variant="body1">
                                            <strong>Roll No.:</strong> {student.rollNo}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Student Name:</strong> {student.studentName}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Class:</strong> {student.className}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Section:</strong> {student.section}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Father Name:</strong> {student.fatherName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Exam Date Sheet */}
                    <Typography variant="h6" gutterBottom>
                        Date Sheet
                    </Typography>
                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr>
                            <th style={{border: "1px solid black", padding: "8px"}}>Date/Day</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Time</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Class</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Subject</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exams.length > 0 ? (
                            exams.map((exam, index) => (
                                <tr key={index}>
                                    <td style={{border: "1px solid black", padding: "8px"}}>
                                        {exam.startDateTime}
                                    </td>
                                    <td style={{border: "1px solid black", padding: "8px"}}>
                                        {exam.time}
                                    </td>
                                    <td style={{border: "1px solid black", padding: "8px"}}>
                                        {exam.sclass}
                                    </td>
                                    <td style={{border: "1px solid black", padding: "8px"}}>
                                        {exam.subject}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{textAlign: "center", padding: "8px"}}>
                                    No date sheet available
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PrintPage;
