import React, {useEffect,useState} from 'react';
import {Box, Button, FormControl,InputLabel,Select,Card, Grid, MenuItem, TextField, Typography} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import {useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import './PrintDocument.css'; // Import your custom CSS for print styles


const BonafideCertificate = () => {
    
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const classSections = useSelector((state) => state.master.data.classSections);
    const userData = useSelector(selectSchoolDetails);

    const schoolId = userData?.id;
    const session = userData?.session;
const [searchCriteria, setSearchCriteria] = useState({
        className: "",
        section: "",
        studentName: "",
        studentId: "",
        schoolId: schoolId,
        session,
       
    });
    const [students, setStudents] = useState([]);
    useEffect(() => {
            if (searchCriteria.className && searchCriteria.section) {
                fetchStudents(searchCriteria.className, searchCriteria.section);
            }
        }, [searchCriteria.className, searchCriteria.section]);
    
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
    const handlePrint = () => {
         
        window.print(); // Open print dialog
        
    };
    
    const handleSearch = () => {
        const student = students.find(
            (s) => s.studentName === searchCriteria.studentName
        );
    
        if (student) {
            setSelectedStudent(student);
        } else {
            alert('Student not found!');
            setSelectedStudent(null);
        }
    };
    
    const handleCriteriaChange = (event) => {
        const {name, value} = event.target;
        setSearchCriteria((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <Box sx={{maxWidth: '900px', margin: 'auto', padding: 2}}>
            <Box sx={{mb: 4}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Bonafide Certificate
                </Typography>

                <Grid container spacing={2} sx={{mb: 2}}>
                <Grid item xs={4}>
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
                    <Grid item xs={4}>
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
                </Grid>

                <Button variant="contained" color="primary" onClick={handleSearch} sx={{mr: 2}}>
                    Search
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setSelectedStudent('')}>
                    Reset
                </Button>
            </Box>

            {selectedStudent && typeof selectedStudent === 'object' && (
                <Card id="printableArea" sx={{padding: 3, marginTop: 3, boxShadow: 3}}>
                    <Box sx={{textAlign: 'center', mb: 2}}>
                        <Typography variant="h4" color="primary">
                        {userData?.name || "School Name"}
                        </Typography>
                        <Typography variant="h6" color="secondary">
                        {userData?.address || "School Address"}
                        </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                        BONAFIDE CERTIFICATE
                    </Typography>

                    <Typography variant="body1" paragraph>
                        This is to certify that Mr./Ms. <strong>{selectedStudent.studentName}</strong> S/o D/o of {' '}
                        <strong>{selectedStudent.fatherName}</strong> is a bonafide student of this school/college,
                        qualified/studying
                        in the class {' '} <strong>{selectedStudent.className}</strong> admission no.{' '}
                        <strong>{selectedStudent.admissionNo}</strong> during the academic year{' '}
                        <strong>{selectedStudent.session}</strong> and his/her D.O.B according to school record
                        is{' '}
                        <strong>{selectedStudent.dob}</strong> as per the record produced to us.
                    </Typography>

                    <Typography variant="body1" sx={{mt: 2}}>
                        Date: {new Date().toLocaleDateString()}
                    </Typography>

                    <Typography variant="body1" textAlign="right" sx={{mt: 4}}>
                        Auth. Signatory
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<PrintIcon/>}
                        sx={{mt: 4, width: '100%'}}
                        onClick={handlePrint}
                    >
                        Print
                    </Button>
                </Card>
            )}
        </Box>
    );
};

export default BonafideCertificate;
