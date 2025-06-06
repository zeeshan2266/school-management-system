import React from 'react';
import {Container, CssBaseline, Grid, Typography} from '@mui/material';
import CharacterCertificateForm from './CharacterCertificateForm';
import SearchPanel from './SearchPanel';
import CertificateView from './CertificateView';

const certificates = [
    {
        id: 1,
        studentName: 'Rahul Kumar / Rajesh Kumar',
        class: '1stA',
        session: '2023 To 2024',
        behavior: 'Good',
        place: 'Agra',
        issueDate: '01 Aug 2024',
    },
    {
        id: 2,
        studentName: 'Firoz Khan / Mr. Rajib',
        class: '1stA',
        session: '2023 To 2024',
        behavior: 'Good',
        place: 'Agra',
        issueDate: '01 Aug 2024',
    },
    {
        id: 3,
        studentName: 'Km Neha / Rajeev Kumar',
        class: '1stA',
        session: '22-02-2023 To 22-02-2024',
        behavior: 'Very Good',
        place: 'Patel Nagar, Delhi',
        issueDate: '22 Feb 2024',
    },
];

function CharacterCertificate() {
    return (
        <>
            <CssBaseline/>
            <Container>
                <Grid container spacing={4} mt={2}>
                    
                       
                  
                </Grid>
            </Container>
            <Container>
                <Typography variant="h4" sx={{mb: 4, mt: 4}}>
                    
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                       
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default CharacterCertificate;
