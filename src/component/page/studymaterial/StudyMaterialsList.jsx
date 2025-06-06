import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {deleteMaterial, fetchMaterials} from './redux/studyMaterialActions';
import AddEditMaterial from './AddEditMaterial';
import {selectSchoolDetails} from "../../../common";

const StudyMaterialsList = () => {
    const dispatch = useDispatch();
    const materials = useSelector((state) => state.studyMaterial.materials);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState(materials);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Track selected material for editing
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    useEffect(() => {
        dispatch(fetchMaterials(schoolId));
    }, [dispatch, schoolId]);

    useEffect(() => {
        if (materials) {
            setFilteredMaterials(
                materials.filter((material) =>
                    (material.title && material.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (material.subject && material.subject.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            );
        }
    }, [searchQuery, materials]);

    const handleDelete = (id) => {
        dispatch(deleteMaterial(id));
    };

    const handleAddNew = () => {
        setSelectedMaterial(null); // Clear selected material when adding a new one
        setIsModalOpen(true); // Open modal
    };

    const handleEdit = (material) => {
        setSelectedMaterial(material); // Set the selected material for editing
        setIsModalOpen(true); // Open modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal
        setSelectedMaterial(null); // Reset selected material
    };

    return (
        <div style={{padding: '20px'}}>
            {/* Search bar */}
            <TextField
                label="Search by Title or Subject"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                margin="normal"
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleAddNew}
                style={{marginBottom: '20px', backgroundColor: '#3f51b5', color: 'white'}}
            >
                Add New Material
            </Button>

            {/* Materials list */}
            <Grid container spacing={3}>
                {filteredMaterials.map((material) => (
                    <Grid item xs={12} sm={6} md={4} key={material.id}>
                        <Card style={{position: 'relative', height: '100%', backgroundColor: '#f5f5f5'}}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" style={{fontWeight: 'bold'}}>{material.title}</Typography>
                                </Box>
                                <Box marginTop={1}>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Subject:</strong> {material.subject}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Class Name:</strong> {material.className}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Type:</strong> {material.type}
                                    </Typography>
                                    {/* Check for file content */}
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Attachment:</strong>
                                        {material.fileContent ? (
                                            <a
                                                href={`data:application/octet-stream;base64,${btoa(String.fromCharCode(...new Uint8Array(material.fileContent)))}`}
                                                download={material.title}
                                                style={{marginLeft: '5px', textDecoration: 'underline', color: 'blue'}}
                                            >
                                                Download File
                                            </a>
                                        ) : (
                                            <span>No single attachment</span>
                                        )}
                                    </Typography>
                                    {/* Check for multiple file contents */}
                                    {material.multipleFileContents && material.multipleFileContents.length > 0 && (
                                        <Box mt={1}>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Multiple Attachments:</strong>
                                            </Typography>
                                            {material.multipleFileContents.map((fileContent, index) => (
                                                <a
                                                    key={index}
                                                    href={`data:application/octet-stream;base64,${btoa(String.fromCharCode(...new Uint8Array(fileContent)))}`}
                                                    download={`${material.title}_attachment_${index + 1}`}
                                                    style={{
                                                        display: 'block',
                                                        marginLeft: '5px',
                                                        textDecoration: 'underline',
                                                        color: 'blue'
                                                    }}
                                                >
                                                    Download Attachment {index + 1}
                                                </a>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(material.id)}
                                        style={{marginRight: '8px'}}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(material)}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Material Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedMaterial ? 'Edit Material' : 'Add New Material'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        style={{position: 'absolute', right: 8, top: 8}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddEditMaterial
                        existingMaterial={selectedMaterial}
                        onClose={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudyMaterialsList;
