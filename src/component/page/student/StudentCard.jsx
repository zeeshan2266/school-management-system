import React from 'react';
import {Avatar, Card, CardContent, Grid, Typography} from '@mui/material';

const StudentCard = ({student}) => {
    const convertByteArrayToBase64 = (byteArray) => {
        return `data:image/jpeg;base64,${byteArray}`;
    };

    return (
        <Card
            sx={{
                margin: 'auto',
                padding: '16px',
                boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                maxWidth: 400,
            }}
        >
            <Grid container direction="column" alignItems="center">
                {/* Photo Section */}
                <Grid item>
                    <Avatar
                        src={student?.studentPhoto ? convertByteArrayToBase64(student.studentPhoto) : '/placeholder-image.png'}
                        alt={`${student?.studentName || 'Student'}'s photo`}
                        sx={{
                            width: 100,
                            height: 100,
                            marginBottom: 2,
                        }}
                    />
                </Grid>

                {/* Details Section */}
                <CardContent sx={{textAlign: 'left'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Student Name:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.studentName || 'Student Name'}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Parents:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography
                                variant="body2">{`${student?.fatherName || 'N/A'}, ${student?.motherName || 'N/A'}`}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Roll No:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.rollNo || 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Class:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.className || 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Class Teacher:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.classTeacher || 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Address:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.address || 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" fontWeight="bold">Bus Route:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{student?.busRoute || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Grid>
        </Card>
    );
};

export default StudentCard;
