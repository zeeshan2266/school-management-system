import React from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const student = {
    name: 'Rahul Kumar',
    schoolName: 'Demo SSMS School',
    startYear: '2023',
    endYear: '2024',
    conduct: 'Good',
    place: 'Agra',
    date: '01 Aug 2024',
};
const CharacterCertificates = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{maxWidth: '800px', margin: 'auto', padding: 2, border: '2px dashed black', position: 'relative'}}>
            <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
                CHARACTER CERTIFICATE
            </Typography>

            <Box sx={{mt: 4}}>
                <Typography variant="body1" gutterBottom>
                    This is to certify that <strong>{student.name}</strong> was the student
                    of <strong>{student.schoolName}</strong>
                    during the year from <strong>{student.startYear}</strong> to <strong>{student.endYear}</strong>.
                    His/Her character and conduct were <strong>{student.conduct}</strong> during his/her stay in this
                    institution.
                </Typography>
            </Box>

            <Grid container sx={{mt: 4}}>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        Place: {student.place}
                    </Typography>
                    <Typography variant="body1">
                        Date: {student.date}
                    </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                    <Typography variant="body1">Head Master / Principal</Typography>
                    <Typography variant="body1">Gazetted Officer</Typography>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                startIcon={<PrintIcon/>}
                sx={{mt: 4, position: 'absolute', bottom: 0, right: 0}}
                onClick={handlePrint}
            >
                Print
            </Button>
        </Box>
    );
};

export default CharacterCertificates;
