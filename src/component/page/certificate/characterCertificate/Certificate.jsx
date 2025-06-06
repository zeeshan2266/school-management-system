import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, Dialog, DialogActions, DialogContent, 
    DialogTitle, Divider, Box } from '@mui/material';

const CharacterCertificateForm = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        fatherName: '',
        address: '',
        certificateNo: '',
        sessionFrom: '',
        sessionTo: '',
        behavior: '',
        place: '',
        issueDate: '',
        classPassed: '',
    });
    const [openPopup, setOpenPopup] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOpenPopup(true);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container>
            <Typography variant="h5" sx={{ mb: 4 }}>
                Character Certificate
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Certificate No." name="certificateNo" value={formData.certificateNo} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Session From" name="sessionFrom" type="date" InputLabelProps={{ shrink: true }} value={formData.sessionFrom} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Session To" name="sessionTo" type="date" InputLabelProps={{ shrink: true }} value={formData.sessionTo} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Behavior" name="behavior" value={formData.behavior} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Place" name="place" value={formData.place} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Issue Date" name="issueDate" type="date" InputLabelProps={{ shrink: true }} value={formData.issueDate} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Class Passed and Year Statement" name="classPassed" value={formData.classPassed} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" type="submit">
                             Create 
                        </Button> 
                    </Grid>
                </Grid>
            </form>
            
            <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
                <DialogTitle>Character Certificate</DialogTitle>
                <DialogContent>
                    <Container sx={{ padding: 3, border: '2px dashed black', backgroundColor: 'white', marginTop: 2 }}>
                        <Box textAlign="center" mb={2}>
                            <Typography variant="h4" color="primary">Demo Public School</Typography>
                            <Typography variant="subtitle1" color="textSecondary">37/52, Sikandra, Agra, Uttar Pradesh</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1">This is to certify that <b>{formData.studentName}</b> S/o <b>{formData.fatherName}</b> R/o <b>{formData.address}</b>, Reg. No. <b>{formData.certificateNo}</b> was the student of this school from <b>{formData.sessionFrom} to {formData.sessionTo}</b>.</Typography>
                        <Typography variant="body1" mt={2}>He/She had a <b>{formData.behavior}</b>. We wish him/her success in life.</Typography>
                        <Box display="flex" justifyContent="space-between" mt={4}>
                            <Typography variant="body2">Place: {formData.place}</Typography>
                            <Typography variant="body2">Date: {formData.issueDate}</Typography>
                        </Box>
                        <Box mt={4} textAlign="right">
                            <Typography variant="body2">Principal/Officer</Typography>
                        </Box>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePrint} color="primary">PRINT</Button>
                    <Button onClick={() => setOpenPopup(false)} color="secondary">CLOSE</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CharacterCertificateForm;
