import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card, CardContent, Collapse, Grid, IconButton, Skeleton, TextField, Typography} from '@mui/material';
import {Add, Delete} from '@mui/icons-material';
import {api, selectSchoolDetails} from "../../../../common";
import {addReligion, deleteReligion, fetchReligions, updateReligion} from "./redux/religionActions";

const ReligionManagement = () => {
    const dispatch = useDispatch();
    const {religions, loading} = useSelector((state) => state.religion);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;

    useEffect(() => {
        dispatch(fetchReligions());
    }, [dispatch]);

    const handleAddReligion = () => {
        dispatch(addReligion({name: '', canCreateCaste: true, castes: [], schoolId}));
    };

    const handleAddCaste = (religionIndex) => {
        const updatedReligion = {
            ...religions[religionIndex],
            castes: [...religions[religionIndex].castes, {name: ''}],
        };
        dispatch(updateReligion(updatedReligion));
    };

    const handleReligionChange = (e, index) => {
        const updatedReligion = {...religions[index], name: e.target.value};
        dispatch(updateReligion(updatedReligion));
    };

    const handleCasteChange = (e, religionIndex, casteIndex) => {
        const updatedReligion = {
            ...religions[religionIndex],
            castes: religions[religionIndex].castes.map((c, j) =>
                j === casteIndex ? {...c, name: e.target.value} : c
            ),
        };
        dispatch(updateReligion(updatedReligion));
    };

    const handleDeleteReligion = (id) => {
        dispatch(deleteReligion(id));
    };

    const handleDeleteCaste = (religionIndex, casteIndex, casteId) => {
        const updatedReligion = {
            ...religions[religionIndex],
            castes: religions[religionIndex].castes.filter((_, cIndex) => cIndex !== casteIndex),
        };
        dispatch(updateReligion(updatedReligion));
    };

    const handleSubmit = async () => {
        try {
            await api.post('/api/master/religions', religions);
            alert('Religions and castes created/updated successfully!');
        } catch (error) {
            console.error('Error creating/updating religions and castes:', error);
            alert('Error creating/updating religions and castes.');
        }
    };

    if (loading) {
        return (
            <div>
                <Skeleton variant="rectangular" height={80} style={{marginBottom: 20, borderRadius: 8}}/>
                <Skeleton variant="rectangular" height={80} style={{marginBottom: 20, borderRadius: 8}}/>
                <Skeleton variant="rectangular" height={80} style={{marginBottom: 20, borderRadius: 8}}/>
            </div>
        );
    }

    return (
        <div style={{padding: '20px'}}>
            <Typography variant="h4" gutterBottom style={{marginBottom: 20}}>
                Create/Update Religions and Castes
            </Typography>
            {religions.map((religion, index) => (
                <Card key={index}
                      style={{marginBottom: 20, borderRadius: 12, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label={`Religion ${index + 1} Name`}
                                    fullWidth
                                    value={religion.name}
                                    onChange={(e) => handleReligionChange(e, index)}
                                    variant="outlined"
                                    style={{marginBottom: 10}}
                                />
                                <IconButton color="secondary" onClick={() => handleDeleteReligion(religion.id)}>
                                    <Delete/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                {religion.castes.map((caste, casteIndex) => (
                                    <Collapse key={casteIndex} in={true} timeout="auto" unmountOnExit>
                                        <Grid container spacing={1} style={{marginBottom: 10}}>
                                            <Grid item xs={10}>
                                                <TextField
                                                    label={`Caste ${casteIndex + 1} Name`}
                                                    fullWidth
                                                    value={caste.name}
                                                    onChange={(e) => handleCasteChange(e, index, casteIndex)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDeleteCaste(index, casteIndex, caste.id)}
                                                >
                                                    <Delete/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                ))}
                                {religion.canCreateCaste && (
                                    <IconButton color="primary" onClick={() => handleAddCaste(index)}
                                                style={{marginTop: 10}}>
                                        <Add/>
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
            <Button
                onClick={handleAddReligion}
                variant="contained"
                color="primary"
                startIcon={<Add/>}
                style={{marginTop: 20}}
            >
                Add Religion
            </Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                style={{marginTop: 20}}
            >
                Submit
            </Button>
        </div>
    );
};

export default ReligionManagement;
