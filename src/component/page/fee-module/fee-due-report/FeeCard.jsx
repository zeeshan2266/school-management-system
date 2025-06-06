import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    Paper,
    Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export const FeeCard = ({feeData, student, months}) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getStatusColor = (status) => {
        return status === 'Paid' ? '#4caf50' : '#ff9800';
    };

    const formattedDate = new Date(feeData.creationDateTime).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const paidMonth = months.find(month => feeData[month] === true);

    return (
        <Card
            elevation={3}
            sx={{
                mb: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 8
                }
            }}
        >
            <CardHeader
                avatar={
                    <Avatar sx={{
                        bgcolor: 'primary.main',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.1)'
                        }
                    }}>
                        <SchoolIcon/>
                    </Avatar>
                }
                action={
                    <IconButton
                        onClick={handleExpandClick}
                        sx={{
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}
                    >
                        <KeyboardArrowDownIcon/>
                    </IconButton>
                }
                title={
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Typography variant="h6">{student?.studentName}</Typography>
                        <Chip
                            label={feeData.status}
                            size="small"
                            sx={{
                                bgcolor: getStatusColor(feeData.status),
                                color: 'white',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    </Box>
                }
                subheader={
                    <Grid container spacing={1} sx={{mt: 1}}>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Class: {student?.className}-{student?.section}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Admission No: {student?.admissionNo}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Roll No: {feeData.rollNo}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Total Due: ₹{feeData.allTotalAmount}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Created: {formattedDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Paid Month: {paidMonth || 'None'}
                            </Typography>
                        </Grid>
                    </Grid>
                }
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Student Details Section */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.01)'
                                    }
                                }}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 3}}>
                                    <PersonIcon color="primary"/>
                                    <Typography variant="h6" color="primary">
                                        Student Details
                                    </Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    {/* Parents Information */}
                                    <Grid item xs={12}>
                                        <Box sx={{mb: 2}}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Parents Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Father's
                                                        Name</Typography>
                                                    <Typography
                                                        variant="body1">{student.fatherName || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Mother's
                                                        Name</Typography>
                                                    <Typography
                                                        variant="body1">{student.motherName || 'N/A'}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    {/* Contact Information */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                            Contact Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                                    <EmailIcon fontSize="small" color="action"/>
                                                    <Typography variant="body2">
                                                        Student: {student.email || 'N/A'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <PhoneIcon fontSize="small" color="action"/>
                                                    <Typography variant="body2">
                                                        Mobile: {student.mobileNo || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Father's
                                                    Contact</Typography>
                                                <Typography
                                                    variant="body2">{student.fatherMobile
                                                    || 'N/A'}</Typography>
                                                <Typography
                                                    variant="body2">{student.fatherEmailAddress || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Mother's
                                                    Contact</Typography>
                                                <Typography
                                                    variant="body2">{student.motherMobile
                                                    || 'N/A'}</Typography>
                                                <Typography
                                                    variant="body2">{student.motherEmailAddress || 'N/A'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Additional Information */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                            Additional Information
                                        </Typography>
                                        <Typography variant="body2">Session: {feeData.session}</Typography>
                                        <Typography variant="body2">Created: {formattedDate}</Typography>
                                        <Typography variant="body2">Paid Month: {paidMonth || 'None'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Fee Details Section */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.01)'
                                    }
                                }}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 3}}>
                                    <PaymentIcon color="primary"/>
                                    <Typography variant="h6" color="primary">
                                        Fee Breakdown
                                    </Typography>
                                </Box>

                                {/* Fee Amounts */}
                                {Object.entries(feeData.feeAmounts).map(([feeType, amount]) => (
                                    <Box
                                        key={feeType}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 1,
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: 'grey.50',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                bgcolor: 'grey.100'
                                            }
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {feeType.replace(/([A-Z])/g, ' $1').trim()}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            ₹{amount}
                                        </Typography>
                                    </Box>
                                ))}

                                <Divider sx={{my: 2}}/>

                                {/* Additional Fees */}
                                {(feeData.transportAmount > 0 || feeData.lateAmount > 0) && (
                                    <Box sx={{mb: 2}}>
                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                            Additional Charges
                                        </Typography>
                                        {feeData.transportAmount > 0 && (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: 'grey.50'
                                            }}>
                                                <Typography variant="body2">Transport Fee</Typography>
                                                <Typography variant="body2">₹{feeData.transportAmount}</Typography>
                                            </Box>
                                        )}
                                        {feeData.lateAmount > 0 && (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: 'grey.50'
                                            }}>
                                                <Typography variant="body2">Late Fee</Typography>
                                                <Typography variant="body2">₹{feeData.lateAmount}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}

                                {/* Total */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px dashed rgba(0, 0, 0, 0.12)'
                                }}>
                                    <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                        ₹{feeData.allTotalAmount}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Remarks Section */}
                        {feeData.remarks && (
                            <Grid item xs={12}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: 'warning.light',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.01)'
                                        }
                                    }}
                                >
                                    <Typography variant="subtitle2" gutterBottom>Remarks</Typography>
                                    <Typography variant="body2">{feeData.remarks}</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
};