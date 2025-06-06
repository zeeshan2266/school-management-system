import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function HouseList({houses, onEdit, onDelete}) {
    const [open, setOpen] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleDelete = (house) => {
        setHouseToDelete(house);
        setOpen(true);
    };

    const handleConfirmDelete = () => {
        if (houseToDelete) {
            onDelete(houseToDelete.id); // Trigger the delete callback
        }
        setOpen(false);
        setHouseToDelete(null);
        setSnackbarOpen(true); // Show snackbar after delete
    };

    const handleCancelDelete = () => {
        setOpen(false);
        setHouseToDelete(null); // Clear the houseToDelete state

    };
    // Close the snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    return (
        <Box sx={{maxHeight: 300, overflowY: 'auto'}}>
            <List>
                {houses.map(house => (
                    <ListItem key={house.id} sx={{backgroundColor: house.color, marginBottom: 2, borderRadius: 2}}>
                        <ListItemText
                            primary={house.name}
                            secondary={house.description}
                        />
                        <Box>
                            <IconButton onClick={() => onEdit(house)} color="primary">
                                <EditIcon/>
                            </IconButton>
                            <IconButton onClick={() => handleDelete(house)} color="secondary">
                                <DeleteIcon/>
                            </IconButton>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <Dialog
                open={open}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete House?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this house?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar for success message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Hide after 3 seconds
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}} // Position at the top center

            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
                    House deleted successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default HouseList;
