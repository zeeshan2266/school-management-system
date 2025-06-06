import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import HouseForm from './HouseForm';
import HouseList from './HouseList';
import {motion} from 'framer-motion';
import {selectSchoolDetails} from "../../../../common";
import {addHouse, deleteHouse, fetchHouses, updateHouse} from "./redux/actions";


function MainHouse() {
    const dispatch = useDispatch();
    const houses = useSelector((state) => state.house.houses);
    const [currentHouse, setCurrentHouse] = useState(null);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchHouses(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const saveHouse = (house) => {
        const schoolId = userData?.id;
        house['schoolId'] = schoolId;
        house['session'] = session;

        if (house.id) {
            dispatch(updateHouse(house));
        } else {
            dispatch(addHouse(house));
        }

        setCurrentHouse(null); // Reset form after save
    };

    const handleDelete = (id) => {
        dispatch(deleteHouse(id));
    };

    const handleEdit = (house) => {
        setCurrentHouse(house);
    };

    return (
        <Box sx={{padding: 4}}>
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            />
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Box sx={{border: '1px solid #ccc', borderRadius: 2, padding: 1}}>
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                zIndex: 1,
                                padding: '8px',
                                borderBottom: '1px solid #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            {currentHouse ? 'Edit House' : 'Add New House'}
                        </Typography>
                        <HouseForm house={currentHouse} onSave={saveHouse}/>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8} style={{maxHeight: '550px', overflowY: 'auto'}}>
                    <Box
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            padding: 1,
                            position: 'relative',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                zIndex: 1,
                                padding: '8px',
                                borderBottom: '1px solid #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            House List
                        </Typography>
                        <HouseList houses={houses} onEdit={handleEdit} onDelete={handleDelete}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MainHouse;
