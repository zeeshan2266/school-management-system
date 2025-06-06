import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Skeleton,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {Add, Delete} from '@mui/icons-material';
import {addClass, addSection, fetchClasses, removeClass, submitClasses, updateClass} from './redux/Action';
import {selectSchoolDetails} from '../../../../common';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClassSection = () => {
    const dispatch = useDispatch();
    const {classes, loading} = useSelector((state) => state.classes);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    const [modalOpen, setModalOpen] = useState(false);
    const [ClassSection, setClassSection] = useState(null);

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchClasses(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleClassChange = (e, index) => {
        const updatedClasses = classes.map((c, i) =>
            i === index ? {...c, name: e.target.value, schoolId, session} : c
        );
        dispatch(updateClass({index, updatedClass: updatedClasses[index]}));
    };

    const handleSectionChange = (e, classIndex, sectionIndex) => {
        const updatedClasses = classes.map((c, i) =>
            i === classIndex
                ? {
                    ...c,
                    sections: c.sections.map((s, j) =>
                        j === sectionIndex ? {...s, name: e.target.value, schoolId, session} : s
                    ),
                }
                : c
        );
        dispatch(updateClass({index: classIndex, updatedClass: updatedClasses[classIndex]}));
    };

    const isValidClassName = (name) => /^[a-zA-Z0-9 ]*$/.test(name) && name.trim() !== '';
    const isValidSectionName = (name) => /^[a-zA-Z0-9 ]*$/.test(name) && name.trim() !== '';

    const isFormValid = () => {
        return classes.every(
            (schoolClass) =>
                isValidClassName(schoolClass.name) &&
                schoolClass.sections.every((section) => isValidSectionName(section.name))
        );
    };

    const handleOpenModal = (id) => {
        setClassSection(id);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setClassSection(null);
    };

    const handleToastDelete = () => {
        if (ClassSection) {
            dispatch(removeClass(ClassSection))
                .then(() => {
                    toast.success('Class Section deleted successfully.');
                    handleCloseModal();
                })
                .catch((error) => {
                    console.error('Error deleting Class Section:', error);
                    toast.error('Failed to delete the class section. Please try again.');
                    handleCloseModal();
                });
        }
    };

    if (loading) {
        return (
            <div>
                {[1, 2, 3].map((_, idx) => (
                    <Skeleton
                        key={idx}
                        variant="rectangular"
                        height={80}
                        sx={{
                            marginBottom: 2,
                            borderRadius: 2,
                            animation: 'pulse 1.5s infinite ease-in-out',
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <Box sx={{padding: 3, backgroundColor: '#f5f5f5', borderRadius: 2}}>
            <Typography variant="h4" sx={{marginBottom: 3, fontWeight: 'bold'}}>
                Create/Update Classes and Sections
            </Typography>
            {classes.map((schoolClass, index) => (
                <Card
                    key={index}
                    sx={{
                        marginBottom: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label={`Class ${index + 1} Name`}
                                    fullWidth
                                    value={schoolClass.name}
                                    onChange={(e) => handleClassChange(e, index)}
                                    variant="outlined"
                                    error={!isValidClassName(schoolClass.name)}
                                    helperText={
                                        !isValidClassName(schoolClass.name)
                                            ? schoolClass.name.trim() === ''
                                                ? 'Enter your class name'
                                                : 'Invalid class name'
                                            : ''
                                    }
                                />
                                <Tooltip title="Delete Class" placement="top">
                                    <IconButton
                                        color="error"
                                        sx={{marginTop: 1}}
                                        onClick={() => handleOpenModal(schoolClass.id)}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                {schoolClass.sections.map((section, secIndex) => (
                                    <Collapse key={secIndex} in={true} timeout="auto" unmountOnExit>
                                        <Grid container spacing={2} sx={{marginBottom: 1}}>
                                            <Grid item xs={10}>
                                                <TextField
                                                    label={`Section ${secIndex + 1} Name`}
                                                    fullWidth
                                                    value={section.name}
                                                    onChange={(e) => handleSectionChange(e, index, secIndex)}
                                                    variant="outlined"
                                                    error={!isValidSectionName(section.name)}
                                                    helperText={
                                                        !isValidSectionName(section.name)
                                                            ? section.name.trim() === ''
                                                                ? 'Enter your section name'
                                                                : 'Invalid section name'
                                                            : ''
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Tooltip title="Delete Section" placement="top">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleOpenModal(section.id)}
                                                    >
                                                        <Delete/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                ))}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<Add/>}
                                    onClick={() => dispatch(addSection(index))}
                                    sx={{marginTop: 2}}
                                >
                                    Add Section
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
            <Button
                onClick={() => dispatch(addClass({name: '', sections: [], schoolId: schoolId}))}
                variant="contained"
                color="primary"
                startIcon={<Add/>}
                sx={{
                    marginTop: 2,
                    marginRight: 1,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                Add Class
            </Button>
            <Button
                onClick={() => dispatch(submitClasses(classes, schoolId, session))}
                variant="contained"
                color="secondary"
                disabled={!isFormValid()}
                sx={{
                    marginTop: 2,
                    backgroundColor: 'secondary.main',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'secondary.dark',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    },
                    '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'grey.100',
                        cursor: 'not-allowed',
                    },
                }}
            >
                Submit
            </Button>


            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>Delete Class Section?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Class Section?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleToastDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
            />
        </Box>
    );
};

export default ClassSection;

















































