import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    DialogActions,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {useSelector} from "react-redux";
import dayjs from "dayjs";

const GalleryForm = ({gallery, onSubmit, onCancel}) => {
    const [formData, setFormData] = useState({
        id: "",
        type: "", // image/video
        images: null,
        videoURL: "",
        title: "",
        description: "",
        schoolId: "",
        session: "",
        creationDateTime: "",
    });
    const [errors, setErrors] = useState({});

    const classSections = useSelector((state) => state.master.data.classSections);
    const sections = useSelector((state) => state.master.data.sections);

    useEffect(() => {
        if (gallery) {
            setFormData({
                ...gallery,
                creationDateTime: gallery.creationDateTime
                    ? dayjs(gallery.creationDateTime)
                    : null,
            });
        }
    }, [gallery]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleDateChange = (name, date) => {
        setFormData({...formData, [name]: date});
    };

    const handleClose = () => {
        if (onCancel) onCancel();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1]; // Remove the prefix and keep the base64 string
                setFormData({...formData, images: base64String}); // Store the cleaned base64 string
            };
            reader.readAsDataURL(file); // Convert the file to base64
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic
        const newErrors = {};
        if (!formData.type) newErrors.type = "Type is required.";
        if (!formData.title) newErrors.title = "Title is required.";
        if (!formData.images) newErrors.images = "image is required.";


        // If there are validation errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If validation passes, call the onSubmit function with the form data
        try {
            await onSubmit(formData); // Pass the formData to the onSubmit function
            console.log("Form submitted successfully:", formData);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };
    return (
        <Container>
            <Box
                sx={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    position: "relative",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Type"
                                >
                                    <MenuItem value="image">Image</MenuItem>
                                    <MenuItem value="video">Video</MenuItem>

                                </Select>
                                {errors.type && <span style={{color: "red"}}>{errors.type}</span>}

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                            />
                            {errors.title && <span style={{color: "red"}}>{errors.title}</span>}
                        </Grid>

                        {/* Conditionally render the image upload section if type is 'image' */}
                        {formData.type === "image" && (
                            <Grid item xs={12} sm={12}>
                                <Button variant="contained" component="label" color="primary">
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*" // Restrict to images
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {errors.images && <span style={{color: "red"}}>{errors.images}</span>}

                                {formData.images && (
                                    <Typography variant="caption" display="block">
                                        Image Uploaded
                                    </Typography>
                                )}
                            </Grid>
                        )}

                        {/* Conditionally render the video URL input section if type is 'vedio' */}
                        {formData.type === "vedio" && (
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Video URL"
                                    name="videoURL"
                                    value={formData.videoURL}
                                    onChange={handleChange}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4} // Adjust the number of rows as needed
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {formData.id ? "Update Gallery" : "Add Gallery"}
                        </Button>
                    </DialogActions>
                </form>
            </Box>
        </Container>
    );
};

export default GalleryForm;
