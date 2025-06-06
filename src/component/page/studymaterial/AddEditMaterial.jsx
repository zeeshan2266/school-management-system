import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addMaterial, updateMaterial} from './redux/studyMaterialActions';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import {selectSchoolDetails} from '../../../common';

const AddEditMaterial = ({existingMaterial, onClose}) => {
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector(state => state.master.data.classSections);
    const subjects = useSelector(state => state.master.data.subjects); // Assuming subjects are fetched into state

    const [formValues, setFormValues] = useState({
        title: '',
        subject: '',
        type: '',
        description: '',
        className: '',
        grade: '',
        staffId: '',
        staffName: '',
        solutionUrl: '',
        session: userData?.session || '',
        schoolId: userData?.id || '',
        isPublished: true,
    });

    const [errors, setErrors] = useState({});
    const [fileContent, setFileContent] = useState(null);
    const [multipleFiles, setMultipleFiles] = useState([]);

    useEffect(() => {
        if (existingMaterial) {
            setFormValues({...existingMaterial});
        }
    }, [existingMaterial]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    const handleFileChange = (e) => {
        setFileContent(e.target.files[0]);
    };

    const handleMultipleFilesChange = (e) => {
        setMultipleFiles(Array.from(e.target.files));
    };

    const handleCheckboxChange = (e) => {
        setFormValues({...formValues, isPublished: e.target.checked});
    };

    const removeFile = () => {
        setFileContent(null);
    };

    const removeMultipleFile = (fileName) => {
        setMultipleFiles(multipleFiles.filter((file) => file.name !== fileName));
    };

    const downloadFile = (file) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formValues.title) tempErrors.title = 'Title is required';
        if (!formValues.subject) tempErrors.subject = 'Subject is required';
        if (!formValues.type) tempErrors.type = 'Type is required';
        if (!formValues.className) tempErrors.className = 'Class is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const materialData = {...formValues, fileContent, multipleFiles};
            if (existingMaterial) {
                dispatch(updateMaterial(existingMaterial.id, materialData));
            } else {
                dispatch(addMaterial(materialData));
            }
            onClose();
        }
    };

    return (
        <Paper elevation={3} sx={{padding: '30px', maxWidth: '700px', margin: '20px auto'}}>
            <Typography variant="h5" gutterBottom align="center">
                {existingMaterial ? 'Edit Study Material' : 'Add New Study Material'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="title"
                            label="Title"
                            value={formValues.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" margin="dense" error={!!errors.className}>
                            <InputLabel>Class Name</InputLabel>
                            <Select
                                name="className"
                                value={formValues.className}
                                onChange={handleInputChange}
                                label="Class Name"
                            >
                                {classSections && classSections.length > 0 ? (
                                    classSections.map((classSection) => (
                                        <MenuItem key={classSection.id} value={classSection.name}>
                                            {classSection.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Classes Available
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.className && <FormHelperText error>{errors.className}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    {/* Add Subject Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" margin="dense" error={!!errors.subject}>
                            <InputLabel>Subject</InputLabel>
                            <Select
                                name="subject"
                                value={formValues.subject}
                                onChange={handleInputChange}
                                label="Subject"
                            >
                                {subjects && subjects.length > 0 ? (
                                    subjects.map((subject) => (
                                        <MenuItem key={subject.id} value={subject.name}>
                                            {subject.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Subjects Available
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.subject && <FormHelperText error>{errors.subject}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" margin="dense" error={!!errors.type}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={formValues.type}
                                onChange={handleInputChange}
                                label="Type"
                            >
                                <MenuItem value="PDF">PDF</MenuItem>
                                <MenuItem value="VIDEO">Video</MenuItem>
                                <MenuItem value="ASSIGNMENT">Assignment</MenuItem>
                                <MenuItem value="QUIZ">Quiz</MenuItem>
                            </Select>
                            {errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                            margin="dense"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formValues.isPublished}
                                    onChange={handleCheckboxChange}
                                    name="isPublished"
                                />
                            }
                            label="Published"
                        />
                    </Grid>

                    {/* Single File Upload Section */}
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1" sx={{mr: 2}}>Single File:</Typography>
                            <IconButton component="label">
                                <CloudUploadIcon/>
                                <input type="file" hidden onChange={handleFileChange}/>
                            </IconButton>
                        </Box>
                        {fileContent && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <Chip
                                    label={fileContent.name}
                                    onDelete={removeFile}
                                    color="primary"
                                    icon={<IconButton
                                        onClick={() => downloadFile(fileContent)}><GetAppIcon/></IconButton>}
                                />
                            </Box>
                        )}
                    </Grid>

                    {/* Multiple Files Upload Section */}
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1" sx={{mr: 2}}>Multiple Files:</Typography>
                            <IconButton component="label">
                                <CloudUploadIcon/>
                                <input type="file" multiple hidden onChange={handleMultipleFilesChange}/>
                            </IconButton>
                        </Box>
                        {multipleFiles.length > 0 && (
                            <Box display="flex" flexDirection="column" mt={1}>
                                {multipleFiles.map((file) => (
                                    <Chip
                                        key={file.name}
                                        label={file.name}
                                        onDelete={() => removeMultipleFile(file.name)}
                                        color="primary"
                                        icon={<IconButton onClick={() => downloadFile(file)}><GetAppIcon/></IconButton>}
                                        sx={{mb: 1}}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{mt: 3}}
                        >
                            {existingMaterial ? 'Update Material' : 'Add Material'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default AddEditMaterial;
