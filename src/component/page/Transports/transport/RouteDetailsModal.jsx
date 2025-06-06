import React, {useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Modal,
    Step,
    StepLabel,
    Stepper,
    Tooltip,
    Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const RouteDetailsModal = ({open, onClose, vehicle, onEditRoute, onDeleteRoute}) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
// Extract the first and last stops if routes are available
    const firstStop = vehicle?.routes?.[0]?.routeName;
    const lastStop = vehicle?.routes?.[vehicle.routes.length - 1]?.routeName;
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{...modalStyle, width: 600, maxHeight: '90vh', overflow: 'auto'}}>
                <Typography variant="h6" component="h2">
                    Routes for {vehicle?.regNumber} from {firstStop} to {lastStop}
                </Typography>
                {vehicle?.routes?.length > 0 ? (
                    <>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {vehicle.routes.map((route, index) => (
                                <Step key={route.id}>
                                    <StepLabel>{route.routeName}</StepLabel>
                                    <Box sx={{mt: 2}}>
                                        <Typography variant="subtitle1">{route.routeName} </Typography>
                                        <Tooltip title="View Route" arrow>
                                            <IconButton onClick={() => onEditRoute(route)} color="primary">
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Route" arrow>
                                            <IconButton onClick={() => onEditRoute(route)} color="secondary">
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Route" arrow>
                                            <IconButton onClick={() => onDeleteRoute(route.id)} color="error">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Typography variant="subtitle2" sx={{mt: 2}}>Students/Staff:</Typography>
                                        <List>
                                            {route.person?.map((person) => (
                                                <ListItem key={person.id}>
                                                    <ListItemText
                                                        primary={` (${person.stId}) ${person.name} (${person.type})`}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={activeStep === vehicle.routes.length - 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography sx={{mt: 2}}>No routes available for this vehicle.</Typography>
                )}
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto'
};

export default RouteDetailsModal;
