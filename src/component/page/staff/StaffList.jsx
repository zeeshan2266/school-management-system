import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {useNavigate} from "react-router-dom";
import {deleteStaff} from "./redux/staffActions";
// Define a set of colors for alternating rows
const rowColors = [
    "#f5f5f5", // Light gray
    "#ffffff", // White
];

const StaffList = ({staffList, onEdit, onView}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    // l
    const [staffToDelete, setStaffToDelete] = useState(null); // ID of the role to delete
    const [modalOpen, setModalOpen] = useState(false);
    // l
    const navigate = useNavigate();
    const handleClickOpen = (staff) => {
        navigate(`/staff/${staff.id}`);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedStaff(null);
    };
    const handleDeleteRole = (id) => {
        dispatch(deleteStaff(id));
    };

    const handleOpenModal = (id) => {
        setStaffToDelete(id);
        setModalOpen(true);
        setSelectedStaff(id)
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setStaffToDelete(null);
    };

    const handleToastDelete = () => {
        if (staffToDelete) {
            dispatch(deleteStaff(staffToDelete))
                .then(() => {
                    toast.success("Staff deleted successfully.");
                    handleCloseModal(); // Close dialog after deletion
                })
                .catch((error) => {
                    console.error("Error deleting designation:", error);
                    toast.error("Failed to delete the designation. Please try again.");
                    handleCloseModal(); // Close dialog even on error
                });
        }
    };


    return (
        <>
            <TableContainer component={Paper} style={{maxHeight: 520}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold"}}>Name</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Post</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Phone</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Email</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Photo</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffList.map((staff, index) => (
                            <TableRow
                                key={staff.id}
                                style={{backgroundColor: rowColors[index % rowColors.length]}}
                            >
                                <TableCell>{staff.name}</TableCell>
                                <TableCell>{staff.post}</TableCell>
                                <TableCell>{staff.phone}</TableCell>
                                <TableCell>{staff.email}</TableCell>
                                <TableCell>
                                    {staff.photo ? (
                                        <img
                                            src={`data:image/jpeg;base64,${staff.photo}`}
                                            alt={staff.name}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                objectFit: "cover",
                                                borderRadius: "50%", // For circular photos

                                            }}
                                        />
                                    ) : (
                                        "No Photo"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="View Details" arrow>
                                        <IconButton
                                            onClick={() => handleClickOpen(staff)}
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={() => onEdit(staff)}
                                            color="secondary"
                                            sx={{marginRight: 1}}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            onClick={() => handleOpenModal(staff.id)}
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                        {/* verify modal for Deletion */}

                                        {/* toast for success/error messages */}
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "0",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    },
                }}
            >
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: "16px",
                        top: "16px",
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "20px",
                        overflowY: "auto",
                        gap: "20px",
                    }}
                >
                    {selectedStaff && (
                        <Box sx={{width: "100%", textAlign: "center"}}>
                            <Box
                                sx={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    margin: "0 auto",
                                }}
                            >
                                <img
                                    src={`data:image/jpeg;base64,${selectedStaff.photo}`}
                                    alt={selectedStaff.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                    }}
                                />
                            </Box>
                            <Typography variant="h5" gutterBottom>
                                {selectedStaff.name}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Typography variant="body1">
                                    <strong>Post:</strong> {selectedStaff.post}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Phone:</strong> {selectedStaff.phone}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {selectedStaff.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Department:</strong> {selectedStaff.department}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Position:</strong> {selectedStaff.position}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Bank Account Number:</strong>{" "}
                                    {selectedStaff.bankAccountNumber}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>IFSC Code:</strong> {selectedStaff.ifscCode}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Resume:</strong>{" "}
                                    {selectedStaff.resume ? "Uploaded" : "Not Uploaded"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Certificates:</strong>{" "}
                                    {selectedStaff.certificates ? "Uploaded" : "Not Uploaded"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Vehicle Type:</strong> {selectedStaff.vehicleType}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Vehicle Number:</strong> {selectedStaff.vehicleNumber}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

            </Dialog>
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 4, // Adds a modern rounded corner effect
                        padding: 2, // Adds internal padding for better spacing
                        overflow: "hidden", // Removes any scroll bar
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Staff ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this Staff ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleToastDelete}
                        color="error"
                        variant="contained"

                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {/* verify modal for Deletion */}

            {/* toastbar for success/error messages */}
            <ToastContainer
                position="top-right" // Position of the toast
                autoClose={4000} // Duration in 4 milliseconds
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable


            />
        </>
    );
};

export default StaffList;
