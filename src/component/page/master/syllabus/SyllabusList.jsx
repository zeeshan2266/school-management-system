import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SyllabusForm from './SyllabusForm';
import {api} from '../../../../common';

const SyllabusList = () => {
    const [syllabi, setSyllabi] = useState([]);
    const [filteredSyllabi, setFilteredSyllabi] = useState([]);
    const [selectedSyllabus, setSelectedSyllabus] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = `/api/syllabus`;

    useEffect(() => {
        fetchSyllabi();
    }, []);

    useEffect(() => {
        setFilteredSyllabi(
            syllabi.filter((syllabus) =>
                syllabus.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [syllabi, searchTerm]);

    const fetchSyllabi = () => {
        api
            .get(API_URL)
            .then((response) => {
                setSyllabi(response.data);
                setFilteredSyllabi(response.data);
            })
            .catch((error) => console.error('Error fetching syllabi:', error));
    };

    const handleSave = (syllabus) => {
        if (selectedSyllabus) {
            api
                .post(API_URL, syllabus)
                .then(() => fetchSyllabi())
                .catch((error) => console.error('Error creating syllabus:', error));
        } else {
            api
                .post(API_URL, syllabus)
                .then(() => fetchSyllabi())
                .catch((error) => console.error('Error creating syllabus:', error));
        }
    };

    const handleEdit = (syllabus) => {
        setSelectedSyllabus(syllabus);
    };

    const handleDelete = (id) => {
        axios
            .delete(`${API_URL}/${id}`)
            .then(() => fetchSyllabi())
            .catch((error) => console.error('Error deleting syllabus:', error));
    };

    const handleCancel = () => {
        setSelectedSyllabus(null); // Reset when cancel is clicked
    };

    const handleAdd = () => {
        setSelectedSyllabus(true); // Ensure the form is empty when adding a new syllabus
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Syllabus Management
            </Typography>

            {selectedSyllabus ? (
                <SyllabusForm
                    currentSyllabus={selectedSyllabus}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <Grid container alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Search Syllabus"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddCircleIcon/>}
                                onClick={handleAdd} // Ensure this properly opens the add form
                            >
                                Add Syllabus
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="h5" gutterBottom>
                        Syllabi List
                    </Typography>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject Name</TableCell>
                                    <TableCell>Grade Level</TableCell>
                                    <TableCell>Term</TableCell>
                                    <TableCell>Teacher Name</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSyllabi.map((syllabus) => (
                                    <TableRow key={syllabus.id}>
                                        <TableCell>{syllabus.subjectName}</TableCell>
                                        <TableCell>{syllabus.gradeLevel}</TableCell>
                                        <TableCell>{syllabus.term}</TableCell>
                                        <TableCell>{syllabus.teacherName}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(syllabus)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDelete(syllabus.id)}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default SyllabusList;
