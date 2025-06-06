import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Box, Container, Fade, Tab, Tabs, Typography} from '@mui/material';
import {api} from '../../../../common';
import CurrentLocation from './CurrentLocation';

const VehicleDetails = () => {
    const {vehicleId} = useParams();
    const dispatch = useDispatch();
    const [vehicle, setVehicle] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/vehicles/${vehicleId}`);
                setVehicle(response.data);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };
        fetchData();
    }, [dispatch, vehicleId]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (!vehicle) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Vehicle Details</Typography>
            <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Details"/>
                <Tab label="Current Location"/>
                <Tab label="Routes"/>
                <Tab label="History"/>
            </Tabs>

            <Box sx={{padding: 2}}>
                <Fade in={tabIndex === 0} timeout={300}>
                    <div>
                        <Typography><strong>Reg. Number:</strong> {vehicle.regNumber}</Typography>
                        <Typography><strong>Vehicle Type:</strong> {vehicle.vehicleType}</Typography>
                        <Typography><strong>Vehicle Name:</strong> {vehicle.vehicleName}</Typography>
                        <Typography><strong>No. of Seats:</strong> {vehicle.noOfSeats}</Typography>
                        <Typography><strong>Driver Name:</strong> {vehicle.driverName}</Typography>
                        <Typography><strong>Phone:</strong> {vehicle.phone}</Typography>
                    </div>
                </Fade>

                <Fade in={tabIndex === 1} timeout={300}>
                    <div>
                        <CurrentLocation vehicleId={vehicleId}/>
                    </div>
                </Fade>

                <Fade in={tabIndex === 2} timeout={300}>
                    <div>
                        <Typography variant="h6">Routes:</Typography>
                        {vehicle.routes?.length > 0 ? (
                            vehicle.routes.map(route => (
                                <Typography key={route.id}>
                                    {route.origin} to {route.destination}
                                </Typography>
                            ))
                        ) : (
                            <Typography>No routes available.</Typography>
                        )}
                    </div>
                </Fade>

                <Fade in={tabIndex === 3} timeout={300}>
                    <div>
                        <Typography variant="h6">History:</Typography>
                        <Typography>No history available.</Typography>
                    </div>
                </Fade>
            </Box>
        </Container>
    );
};

export default VehicleDetails;
