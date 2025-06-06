import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const SyllabusForm = ({currentSyllabus, onSave, onCancel}) => {
    const [syllabusDetails, setSyllabusDetails] = useState({
        subjectName: '',
        description: '',
        gradeLevel: '',
        term: '',
        teacherName: '',
        section: '',
        startDate: '',
        endDate: '',
    });

    const [topics, setTopics] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (currentSyllabus) {
            setSyllabusDetails(currentSyllabus);
            setTopics(currentSyllabus.topics || []);
        }
    }, [currentSyllabus]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSyllabusDetails(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setFormErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleTopicChange = (index, field, value) => {
        const updatedTopics = topics.map((topic, i) => {
            if (i === index) {
                return {...topic, [field]: value};
            }
            return topic;
        });
        setTopics(updatedTopics);
    };

    const addTopic = () => {
        setTopics([
            ...topics,
            {
                name: '',
                description: '',
                duration: '',
                order: (topics.length + 1).toString()
            }
        ]);
    };

    const removeTopic = (index) => {
        setTopics(topics.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const errors = {};
        if (!syllabusDetails.subjectName) errors.subjectName = 'Subject name is required';
        if (!syllabusDetails.gradeLevel) errors.gradeLevel = 'Grade level is required';
        if (!syllabusDetails.term) errors.term = 'Term is required';
        if (!syllabusDetails.teacherName) errors.teacherName = 'Teacher name is required';

        if (topics.length === 0) {
            errors.topics = 'At least one topic is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const syllabusData = {
                ...syllabusDetails,
                topics: topics.filter(topic => topic.name.trim() !== '')
            };
            onSave(syllabusData);
        }
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" sx={{mb: 4}}>
                        {currentSyllabus ? 'Edit Syllabus' : 'Create New Syllabus'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Subject Name"
                                    name="subjectName"
                                    value={syllabusDetails.subjectName}
                                    onChange={handleInputChange}
                                    error={!!formErrors.subjectName}
                                    helperText={formErrors.subjectName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={syllabusDetails.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Grade Level"
                                    name="gradeLevel"
                                    value={syllabusDetails.gradeLevel}
                                    onChange={handleInputChange}
                                    error={!!formErrors.gradeLevel}
                                    helperText={formErrors.gradeLevel}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Term"
                                    name="term"
                                    value={syllabusDetails.term}
                                    onChange={handleInputChange}
                                    error={!!formErrors.term}
                                    helperText={formErrors.term}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Teacher Name"
                                    name="teacherName"
                                    value={syllabusDetails.teacherName}
                                    onChange={handleInputChange}
                                    error={!!formErrors.teacherName}
                                    helperText={formErrors.teacherName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Section"
                                    name="section"
                                    value={syllabusDetails.section}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    name="startDate"
                                    value={syllabusDetails.startDate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    name="endDate"
                                    value={syllabusDetails.endDate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{mt: 4, mb: 2}}>
                            <Divider/>
                        </Box>

                        <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant="h5">Topics</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleIcon/>}
                                onClick={addTopic}
                                color="primary"
                            >
                                Add Topic
                            </Button>
                        </Box>

                        {formErrors.topics && (
                            <Alert severity="error" sx={{mb: 2}}>
                                {formErrors.topics}
                            </Alert>
                        )}

                        {topics.map((topic, index) => (
                            <Paper
                                key={index}
                                elevation={2}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Topic Name"
                                            value={topic.name}
                                            onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={topic.description}
                                            onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <TextField
                                            fullWidth
                                            label="Duration"
                                            value={topic.duration}
                                            onChange={(e) => handleTopicChange(index, 'duration', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Order"
                                            value={topic.order}
                                            onChange={(e) => handleTopicChange(index, 'order', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeTopic(index)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}

                        <CardActions sx={{justifyContent: 'flex-end', mt: 3, gap: 1}}>
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {currentSyllabus ? 'Update' : 'Create'} Syllabus
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SyllabusForm;