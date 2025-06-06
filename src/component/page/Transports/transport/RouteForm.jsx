import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material';
import {api, selectSchoolDetails} from "../../../../common";
import {MapContainer, Marker, TileLayer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useSelector} from "react-redux";

const RouteForm = ({route, open, onClose, onSave, vehicleId}) => {
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [formState, setFormState] = useState(route || {});

    useEffect(() => {
        setFormState(route || {});
    }, [route]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormState((prev) => ({...prev, [name]: value}));
    };

    const handleMapClick = (e) => {
        const {lat, lng} = e.latlng;
        setFormState((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formState.vehicleId = vehicleId;
        formState.schoolId = schoolId;
        formState.session = session;
        if (formState.id) {
            await api.put(`/api/routes/${formState.id}`, formState);
        } else {
            await api.post('/api/routes', formState);
        }
        onSave();
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{formState.id ? 'Edit Route' : 'Add Route'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Route Name"
                        name="routeName"
                        value={formState.routeName || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Type"
                        name="routeType"
                        value={formState.routeType || ''}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="origin">Origin</MenuItem>
                        <MenuItem value="destination">Destination</MenuItem>
                        <MenuItem value="middle">Middle</MenuItem>
                    </TextField>
                    <TextField
                        label="Amount"
                        name="amount"
                        value={formState.amount || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Latitude"
                        name="latitude"
                        value={formState.latitude || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        label="Longitude"
                        name="longitude"
                        value={formState.longitude || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <MapContainer
                        center={[20.9178, 83.7626]}
                        zoom={13}
                        style={{height: "300px", width: "100%", marginTop: '20px'}}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {formState.latitude && formState.longitude && (
                            <Marker position={[formState.latitude, formState.longitude]}/>
                        )}
                        <MapClickHandler/>
                    </MapContainer>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RouteForm;
