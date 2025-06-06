import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Button, Container, Grid, TextField, FormControl, InputLabel, Select,
     Typography, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Box,Paper } 
     from '@mui/material';
import { api, selectSchoolDetails } from "../../../../common";
import './PrintDocument.css'; // Import your custom CSS for print styles

const CharacterCertificateForm = () => {
    const userData = useSelector(selectSchoolDetails);

    const classSections = useSelector((state) => state.master.data.classSections);
    const [students, setStudents] = useState([]);
    const [openPopup, setOpenPopup] = useState(false); // State for popup
    const schoolId = userData?.id;
    const session = userData?.session;
    const [selectedStudent, setSelectedStudent] = useState('');
    const [formData, setFormData] = useState({
        className: "",
        section: "",
        studentName: "",
        certificateNo: '',
        sessionFrom: '',
        sessionTo: '',
        behavior: '',
        place: '',
        issueDate: '',
        classPassed: '',
        session: session,
    });

    useEffect(() => {
        if (formData.className && formData.section) {
            fetchStudents(formData.className, formData.section);
        }
    }, [formData.className, formData.section]);


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

    // Set student name and class dynamically when component mounts or props change

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    

    const handleReset = () => {
        setFormData({
            studentName: '', // Reset to dynamic values
            studentClass: '', // Reset to dynamic values
            certificateNo: '',
            sessionFrom: '',
            sessionTo: '',
            behavior: '',
            place: '',
            issueDate: '',
            classPassed: '',
        });
    };
    const handlePrint = () => {
        window.print();
    };
    const handleSave = () => {
        const student = students.find((s) => s.studentName === formData.studentName);
        if (student) {
            setSelectedStudent(student);
            setOpenPopup(true); // Open the dialog after saving form data
        } else {
            alert('Student not found!');
        }
    };
    
    return (
        <Container>
            <Typography variant="h5" align="center" sx={{ mb: 4 }}>
                Character Certificate
            </Typography>
            <form onSubmit={handleSave}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                name="className"
                                value={formData.className || ""}
                                onChange={handleChange}
                            >
                                {classSections.length > 0 ? (
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
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Section</InputLabel>
                            <Select
                                name="section"
                                value={formData.section || ""}
                                onChange={handleChange}
                                disabled={!formData.className}
                            >
                                {classSections.find(cs => cs.name === formData.className)?.sections?.length > 0 ? (
                                    classSections.find(cs => cs.name === formData.className).sections.map((section) => (
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
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="select-student-label">Select Student</InputLabel>
                            <Select
                                labelId="select-student-label"
                                id="select-student"
                                name="studentName"
                                value={formData.studentName || ""}
                                onChange={handleChange}
                                disabled={!formData.section}
                            >
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <MenuItem key={student.id} value={student.studentName}>
                                            {student.studentName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>No Students Available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Certificate No." name="certificateNo" value={formData.certificateNo} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Session/Year/Date From" name="sessionFrom" type="date" InputLabelProps={{ shrink: true }} value={formData.sessionFrom} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Session/Year/Date To" name="sessionTo" type="date" InputLabelProps={{ shrink: true }} value={formData.sessionTo} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Behaviour" name="behavior" value={formData.behavior} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Place" name="place" value={formData.place} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Issue Date" name="issueDate" type="date" InputLabelProps={{ shrink: true }} value={formData.issueDate} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Class Passed and Year Statement (If Needed)" name="classPassed" value={formData.classPassed} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>SAVE</Button>
                        <Button variant="contained" color="secondary" onClick={handleReset}>RESET</Button>
                    </Grid>
                </Grid>
            </form>
            {selectedStudent && typeof selectedStudent === 'object' && (
          <Dialog open={openPopup} onClose={() => setOpenPopup(false)} fullWidth maxWidth="md">
          
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
              {/* Printable Area */}
              <Paper
                  elevation={4}
                  id="printableArea"
                  sx={{
                      padding: 2,
                      textAlign: "center",
                      border: "1px solid black",
                      maxWidth: "1000px", // Ensures proper layout
                      width: "100%",
                      margin: "auto",
                      backgroundColor: "#fff",
                  }}
              >
                  {/* School Name & Address */}
                  <Typography variant="h4" color="primary" fontWeight="bold">
                      {userData?.name || "School Name"}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" mb={2}>
                      {userData?.address || "School Address"}
                  </Typography>
                 <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                 Character Certificate
                                     </Typography>
                  {/* Certificate Content */}
                  <Typography variant="body1" align="justify" sx={{ fontSize: "1rem", lineHeight: 2.5 }}>
                      This is to certify that <b>{formData.studentName}</b>, son/daughter of <b>{selectedStudent.fatherName}</b>,
                      with Registration No. <b>{formData.certificateNo}</b>, was a student at this school from 
                      <b> {formData.sessionFrom}</b> to <b>{formData.sessionTo}</b>.
                  </Typography>
      
                  <Typography variant="body1" align="justify" sx={{ fontSize: "1rem", mt: 2, lineHeight: 1.5 }}>
                      The student's behaviour was <b>{formData.behavior}</b>.  
                      We wish them success in their future endeavors.
                  </Typography>
      
                  {/* Place & Date */}
                  <Box mt={4} display="flex" justifyContent="space-between" sx={{ fontSize: "0.9rem" }}>
                      <Typography variant="body2"><b>Place:</b> {formData.place}</Typography>
                      <Typography variant="body2"><b>Date:</b> {formData.issueDate}</Typography>
                  </Box>
      
                  {/* Signature */}
                  <Typography variant="h6" align="right" mt={3} sx={{ fontWeight: "bold" }}>
                      Principal/Headmaster
                  </Typography>
              </Paper>
          </DialogContent>
      
          <DialogActions sx={{ justifyContent: "center" }}>
              <Button onClick={handlePrint} color="primary" variant="contained">PRINT</Button>
              <Button onClick={() => setOpenPopup(false)} color="secondary" variant="outlined">CLOSE</Button>
          </DialogActions>
      </Dialog>
      
       )}
        </Container>
    );
};

export default CharacterCertificateForm;