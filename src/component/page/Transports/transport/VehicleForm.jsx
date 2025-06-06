import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material';
import {api, selectSchoolDetails} from "../../../../common";
import {useSelector} from "react-redux";

const VehicleForm = ({vehicle, open, onClose, onSave}) => {
    const staff = useSelector(state => state.master.data?.staff || []);
    const [formState, setFormState] = useState(vehicle);
    const [driverStaff, setDriverStaff] = useState([]);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    // List of vehicle types
    const vehicleTypes = ["Van", "Bus", "Car"];
    // List of vehicle statuses
    const vehicleStatuses = ["Active", "Inactive", "Under Maintenance"];

    useEffect(() => {
        setFormState(vehicle);
        // Filter staff whose post is "driver"
        const filteredDrivers = staff.filter((member) =>
            member.role?.toLowerCase() === "driver"
        );
        setDriverStaff(filteredDrivers);
    }, [vehicle, staff]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormState((prev) => ({...prev, [name]: value, schoolId, session}));
    };

    const handleDriverChange = (e, type) => {
        const selectedDriverId = e.target.value;
        const selectedDriver = driverStaff.find(driver => driver.id === selectedDriverId);
        const driverKey = type === 'primary' ? 'vehicleDriverName' : 'coDriverName';
        const mobileKey = type === 'primary' ? 'vehicleDriverMobile' : 'coDriverMobile';
        const idKey = type === 'primary' ? 'driverId' : 'coDriverId';

        if (selectedDriver) {
            setFormState((prev) => ({
                ...prev,
                [driverKey]: selectedDriver.name,
                [mobileKey]: selectedDriver.phone,
                [idKey]: selectedDriver.id
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                [driverKey]: '',
                [mobileKey]: '',
                [idKey]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formState.id) {
            await api.put(`/api/vehicles/${formState.id}`, formState);
        } else {
            await api.post('/api/vehicles', formState);
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{formState.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Reg. Number"
                        name="regNumber"
                        value={formState.regNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Type"
                        name="vehicleType"
                        select
                        value={formState.vehicleType || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {vehicleTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Vehicle Name"
                        name="vehicleName"
                        value={formState.vehicleName || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="No. of Seats"
                        name="noOfSeats"
                        value={formState.noOfSeats || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Engine Number"
                        name="vehicleEngineNumber"
                        value={formState.vehicleEngineNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Chassis Number"
                        name="vehicleChasesNumber"
                        value={formState.vehicleChasesNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Pollution Certificate"
                        name="pollutionCertificate"
                        value={formState.pollutionCertificate || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Pollution Certificate Renewal Date"
                        name="pollutionCertificateRenewalDate"
                        type="date"
                        value={formState.pollutionCertificateRenewalDate || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        label="Fitness Certificate Renewal Date"
                        name="fitnessCertificateRenewalDate"
                        type="date"
                        value={formState.fitnessCertificateRenewalDate || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        label="Vehicle Status"
                        name="vehicleStatus"
                        select
                        value={formState.vehicleStatus || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {vehicleStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Primary Driver Selection */}
                    <TextField
                        label="Vehicle Driver Name"
                        name="vehicleDriverId"
                        select
                        value={driverStaff.find(driver => driver.name === formState.vehicleDriverName)?.id || ''}
                        onChange={(e) => handleDriverChange(e, 'primary')}
                        fullWidth
                        margin="normal"
                    >
                        {driverStaff.map((driver) => (
                            <MenuItem key={driver.id} value={driver.id}>
                                {driver.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Vehicle Driver Mobile"
                        name="vehicleDriverMobile"
                        value={formState.vehicleDriverMobile || ''}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Driver Id"
                        name="driverId"
                        value={formState.driverId || ''}
                        fullWidth
                        margin="normal"
                        disabled
                    />

                    {/* Co-Driver Selection */}
                    <TextField
                        label="Co-Driver Name"
                        name="coDriverId"
                        select
                        value={driverStaff.find(driver => driver.name === formState.coDriverName)?.id || ''}
                        onChange={(e) => handleDriverChange(e, 'co')}
                        fullWidth
                        margin="normal"
                    >
                        {driverStaff.map((driver) => (
                            <MenuItem key={driver.id} value={driver.id}>
                                {driver.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Co-Driver Mobile"
                        name="coDriverMobile"
                        value={formState.coDriverMobile || ''}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Co-Driver Id"
                        name="coDriverId"
                        value={formState.coDriverId || ''}
                        fullWidth
                        margin="normal"
                        disabled
                    />

                    <TextField
                        label="Other Info"
                        name="otherInfo"
                        value={formState.otherInfo || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
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

export default VehicleForm;
