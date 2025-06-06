import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import {Delete, Edit} from '@mui/icons-material';
import {api, selectSchoolDetails} from '../../../../common'; // Assume you have a configured API instance
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './SubjectManagement.css';
import {useDispatch, useSelector} from "react-redux"; // Create this CSS file for animations

const SubjectManagement = () => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [subjectName, setSubjectName] = useState('');
    const [isActivity, setIsActivity] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [editingSubjectId, setEditingSubjectId] = useState(null);


    const [modalOpen, setModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    // const [assets, setAssets] = useState(schoolAssets);
    const [selectedAsset, setSelectedAsset] = useState(null);


    const [selectAll, setSelectAll] = useState(false); // New state variable
    const [open, setOpen] = useState(false); // State to manage dropdown open/close

    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        const fetchClassesAndSubjects = async () => {
            if (schoolId && session) {
                try {
                    const classesResponse = await api.get('/api/master/class', {

                        params: {schoolId, session}
                    });
                    const subjectsResponse = await api.get('/api/master/subject', {
                        params: {schoolId, session}
                    });
                    setClasses(classesResponse.data);
                    setSubjects(subjectsResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
        fetchClassesAndSubjects();
    }, [dispatch, schoolId, session]);
    const handleAddOrUpdateSubject = async () => {
        if (!subjectName.trim()) {
            alert('Subject name is required!');
            return;
        }
        try {
            if (editingSubjectId) {
                await api.put(`/api/master/subject/${editingSubjectId}`, {
                    name: subjectName,
                    isActivity,
                    schoolId,
                    session
                });
                setSubjects(subjects.map(subject =>
                    subject.id === editingSubjectId ? {
                        ...subject, name: subjectName, isActivity,
                        schoolId,
                        session
                    } : subject
                ));
                alert('Subject updated successfully!');
                setEditingSubjectId(null);
            } else {
                const newSubject = await api.post('/api/master/subject/save', {
                    name: subjectName,
                    isActivity,
                    schoolId,
                    session
                });
                setSubjects([...subjects, newSubject.data]);
                alert('Subject added successfully!');
            }
            setSubjectName('');
            setIsActivity(false);

            // Fetch updated subjects list
            const subjectsResponse = await api.get('/api/master/subject', {
                params: {schoolId, session}
            });
            setSubjects(subjectsResponse.data); // Update the subjects list with fresh data
        } catch (error) {
            console.error('Error adding/updating subject:', error);
            // alert('Error adding/updating subject.');
            alert('Duplicate not allow.');
        }
    };

    const handleAssignSubjects = async () => {
        if (!selectedClass || !selectedSection || selectedSubjects.length === 0) {
            alert('Please select class, section, and at least one subject!');
            return;
        }
        try {
            await api.post(`/api/master/classes/${selectedClass}/sections/${selectedSection}/subjects`, selectedSubjects);
            alert('Subjects assigned successfully!');

            // Refresh data
            const classesResponse = await api.get('/api/master/class', {
                params: {schoolId, session}

            });
            setClasses(classesResponse.data);

            // Optionally clear selections after assignment
            setSelectedClass('');
            setSelectedSection('');
            setSelectedSubjects([]);


            // Close dropdown
            setOpen(false);

        } catch (error) {
            console.error('Error assigning subjects:', error);
            alert('Error assigning subjects.');
        }
    };
    const handleEditSubject = (subject) => {
        setSubjectName(subject.name);
        setIsActivity(subject.isActivity);
        setEditingSubjectId(subject.id);
        setTabIndex(0);
    };


    const handleRemoveSubject = async (selectedClass, sectionId, subjectId) => {
        try {
            await api.delete(`/api/master/classes/${selectedClass}/sections/${sectionId}/subjects/${subjectId}`);
            const updatedClasses = classes.map(cls => {
                if (cls.id === selectedClass) {
                    return {
                        ...cls,
                        sections: cls.sections.map(section => {
                            if (section.id === sectionId) {
                                return {
                                    ...section,
                                    subjects: section.subjects.filter(subject => subject.id !== subjectId)
                                };
                            }
                            return section;
                        })
                    };
                }
                return cls;
            });
            setClasses(updatedClasses);
            alert('Subject removed successfully!');
        } catch (error) {
            console.error('Error removing subject:', error);
            alert('Error removing subject.');
        }
    };
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        if (newValue === 1) { // Reset fields when switching to "Assign Subject to Class"
            setSelectedClass('');
            setSelectedSection('');
            setSelectedSubjects([]);
            setSelectAll(false);
            setOpen(false); // Close dropdown, if necessary
        }
    };
    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        setSelectedSubjects(checked ? subjects.map((subject) => subject.id) : []);

    };
    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedSubjects(value);
        setSelectAll(value.length === subjects.length); // Update selectAll based on selection
    };

    // const handleCloseDropdown = () => {
    //     setTimeout(() => setOpen(false), 100);  // Delay by 100ms
    // };

    const handleOpenModal = (id) => {
        setAssetToDelete(id);
        setModalOpen(true);
        setSelectedAsset(id)
    };

    const handleCloseModal = (id) => {
        setModalOpen(false);
        setAssetToDelete(null);
        setSelectedAsset(id)
    };

    const handleToastDelete = async () => {
        if (assetToDelete) {
            try {
                // Delete the asset via API
                await api.delete(`/api/master/subject/${assetToDelete}`);

                // Update the state to reflect the deleted asset
                setSubjects((prevSubjects) => prevSubjects.filter(subject => subject.id !== assetToDelete));

                // Show success message
                toast.success("Subject deleted successfully.");
            } catch (error) {
                console.error("Error deleting subject:", error);

                // Show error message
                toast.error("Failed to delete the subject. Please try again.");
            } finally {
                // Close the modal in both success and failure cases
                handleCloseModal();
            }
        }
    };

    return (<>
            <Box>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="subject management tabs"
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                >

                    <Tab label={tabIndex === 0 ? "Edit Subject" : "Add New Subject"}/>
                    <Tab label="Assign Subject to Class"/>
                </Tabs>
                <TransitionGroup>
                    <CSSTransition key={tabIndex} timeout={300} classNames="tab-content">
                        <Box>
                            {tabIndex === 0 && (
                                <Box p={3}>
                                    <Grid container spacing={3}>
                                        {/* Left Half - Form for adding or editing a subject */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">
                                                {editingSubjectId ? "Edit Subject" : "Add New Subject"}
                                            </Typography>
                                            <TextField
                                                label="Subject Name"
                                                value={subjectName}
                                                onChange={(e) => setSubjectName(e.target.value)}
                                                fullWidth
                                                required
                                                margin="normal"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={isActivity}

                                                                   onChange={(e) => setIsActivity(e.target.checked)}/>}
                                                label="Select if Subject is Activity"
                                            />
                                            <Button onClick={handleAddOrUpdateSubject} variant="contained"
                                                    color="primary">
                                                {editingSubjectId ? "Update" : "Save"}
                                            </Button>
                                        </Grid>

                                        {/* Right Half - List of existing subjects */}

                                        <Grid item xs={12} md={6} style={{maxHeight: '520px', overflowY: 'auto'}}>
                                            <Typography variant="h6">Existing Subjects</Typography>
                                            <List>
                                                <TransitionGroup>
                                                    {subjects.map((subject) => (
                                                        <CSSTransition key={subject.id} timeout={500}

                                                                       classNames="subject-item">
                                                            <ListItem
                                                                key={subject.id}
                                                                style={{
                                                                    backgroundColor: '#f5f5f5',
                                                                    marginBottom: '8px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                className="subject-list-item"
                                                            >
                                                                <ListItemText
                                                                    primary={subject.name}
                                                                    secondary={subject.isActivity ? 'Activity' : 'Subject'}

                                                                    style={{color: subject.isActivity ? '#1976d2' : '#333'}} // Custom color for activity
                                                                />
                                                                <ListItemSecondaryAction>
                                                                    <IconButton edge="end"
                                                                                onClick={() => handleEditSubject(subject)}>
                                                                        <Edit color="primary"/>
                                                                    </IconButton>
                                                                    <IconButton edge="end"
                                                                                onClick={() => handleOpenModal(subject.id)}>
                                                                        <Delete color="secondary"/>
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </CSSTransition>
                                                    ))}
                                                </TransitionGroup>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                            {tabIndex === 1 && (
                                <Box p={3}>
                                    <Grid container spacing={3}>
                                        {/* Left Half - Form for assigning subjects */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Assign Subject to Class</Typography>

                                            <FormControl fullWidth margin="normal" variant="outlined">
                                                <InputLabel>Select Class</InputLabel>
                                                <Select
                                                    label="Select Class" // Attach label to ensure proper positioning

                                                    value={selectedClass}
                                                    onChange={(e) => {
                                                        setSelectedClass(e.target.value);
                                                        setSelectedSection('');
                                                    }}
                                                >
                                                    {classes.map(schoolClass => (
                                                        <MenuItem key={schoolClass.id} value={schoolClass.id}>
                                                            {schoolClass.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {selectedClass && (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Select Section</InputLabel>
                                                    <Select

                                                        label="Select Section" // Attach label to maintain spacing
                                                        value={selectedSection}
                                                        onChange={(e) => setSelectedSection(e.target.value)}
                                                    >
                                                        {classes.find(c => c.id === selectedClass)?.sections.map(section => (
                                                            <MenuItem key={section.id} value={section.id}>
                                                                {section.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}


                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Select Subjects</InputLabel>
                                                <Select
                                                    multiple
                                                    label="Select Subjects" // Attach label for consistency

                                                    value={selectedSubjects}
                                                    onChange={handleChange}
                                                    open={open}
                                                    onOpen={() => setOpen(true)}
                                                    onClose={() => setOpen(false)}
                                                    // onChange={(e) => setSelectedSubjects(e.target.value)}
                                                    renderValue={(selected) =>
                                                        selected.map((id) => subjects.find((subject) => subject.id === id)?.name || '').join(', ')}
                                                >
                                                    <MenuItem>
                                                        {/* <IconButton onClick={handleCloseDropdown} size="small">
                                                        <CloseIcon />
                                                    </IconButton> */}
                                                        <Checkbox checked={selectAll} onChange={handleSelectAll}/>
                                                        <ListItemText primary="Select All" sx={{fontWeight: 'bold'}}/>
                                                    </MenuItem>
                                                    {subjects.map(subject => (
                                                        <MenuItem key={subject.id} value={subject.id}>
                                                            <Checkbox
                                                                checked={selectedSubjects.indexOf(subject.id) > -1}/>
                                                            <ListItemText
                                                                primary={subject.name}/> {/* Display the subject name */}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Button onClick={handleAssignSubjects} variant="contained" color="primary">
                                                Assign Subject to Class
                                            </Button>
                                        </Grid>

                                        {/* Right Half - Display current assignments */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" mb={2}>Current Class-Section-Subject
                                                Assignments</Typography>
                                            <Box className="assignments-container"

                                                 style={{maxHeight: '460px', overflowY: 'auto'}}>
                                                {classes.map(schoolClass => (
                                                    <Box key={schoolClass.id} className="class-container" mb={3}>
                                                        <Typography variant="h6" className="class-title">
                                                            Class: {schoolClass.name}
                                                        </Typography>
                                                        <Box className="sections-container" pl={2}>
                                                            {schoolClass.sections.map(section => (
                                                                <Box key={section.id} className="section-container"
                                                                     mb={2}>
                                                                    <Typography variant="subtitle1"

                                                                                className="section-title">
                                                                        Section: {section.name}
                                                                    </Typography>
                                                                    <List className="subjects-list">
                                                                        {section.subjects.map(subject => (
                                                                            <ListItem key={subject.id}

                                                                                      className="subject-item">
                                                                                <ListItemText primary={subject.name}/>
                                                                                <ListItemSecondaryAction>
                                                                                    <IconButton
                                                                                        edge="end"
                                                                                        onClick={() => handleRemoveSubject(schoolClass.id, section.id, subject.id)}
                                                                                    >
                                                                                        <Delete/>
                                                                                    </IconButton>
                                                                                </ListItemSecondaryAction>
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </CSSTransition>
                </TransitionGroup>
            </Box>
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Subject?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this Subject?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" variant='outlined'>
                        Cancel
                    </Button>
                    <Button onClick={handleToastDelete} color="error" variant='contained'>
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
        </>
    );
};

export default SubjectManagement;
