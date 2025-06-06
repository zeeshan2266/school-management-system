import React, {useState} from 'react';
import {AppBar, Box, Tab, Tabs, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import ExamList from './ExamList';
import ExamForm from './ExamForm';

const ExamManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedExam, setSelectedExam] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditExam = (exam) => {
        setSelectedExam(exam);
        setTabValue(1); // Switch to the form tab for editing
    };

    const handleSave = () => {
        setSelectedExam(null);
        setTabValue(0); // Switch back to the list view
    };

    return (
        <Box sx={{bgcolor: '#f0f2f5', minHeight: '100vh', padding: 3}}>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >

                <AppBar
                    position="static"
                    elevation={6}
                    sx={{
                        bgcolor: '#1976d2', // Background color
                        padding: '0.4rem 0',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Awesome shadow effect
                        borderRadius: '8px', // Slight rounding for modern look
                        marginBottom: '1.5rem', // Space from other content
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        TabIndicatorProps={{
                            style: {
                                display: 'none', // Remove tab indicator
                            },
                        }}
                        sx={{
                            '.MuiTab-root': {
                                fontSize: '1.1rem', // Professional font size
                                fontWeight: 600, // Medium weight for clarity
                                color: '#1e293b', // Dark navy text
                                textTransform: 'none', // Maintain natural casing
                                padding: '0.6rem 1.5rem', // Adequate spacing
                                margin: '0 0.5rem', // Add separation between tabs
                                borderRadius: '6px', // Smoothly rounded edges
                                transition: 'color 0.3s ease-in-out, background 0.3s ease-in-out',
                                '&:hover': {
                                    color: '#1976d2', // Green hover text
                                    backgroundColor: '#e0e7ff', // Subtle blue hover background
                                    borderColor: '#4caf50'
                                },
                            },
                            '.Mui-selected': {
                                color: '#1e293b', // Green text for active tab
                                borderColor: '#4caf50', // Green border for active tab
                                backgroundColor: '#e0e7ff', // No background for active tab
                                fontWeight: 700, // Bold for active tab
                            },
                        }}
                    >
                        <Tab label="Exam List"/>
                        <Tab label="Add/Edit Exam"/>
                    </Tabs>
                </AppBar>

                {tabValue === 0 && (
                    <Typography component="div" role="tabpanel">
                        <ExamList onEditExam={handleEditExam}/>
                    </Typography>
                )}
                {tabValue === 1 && (
                    <Typography component="div" role="tabpanel">
                        <ExamForm examId={selectedExam?.id} onSave={handleSave}/>
                    </Typography>
                )}
            </motion.div>
        </Box>
    );
};

export default ExamManagement;
