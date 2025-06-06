import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {
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
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {deleteStaffSalaryById} from "./Redux/StaffSalaryAction";

const rowColors = ["#f5f5f5", "#ffffff"];

const convertByteArrayToBase64 = (byteArray) => {


    if (!byteArray) return ''; // Handle null or undefined cases

    // Check if it's already a base64 encoded string
    if (typeof byteArray === 'string' && byteArray.startsWith('data:image')) {
        return byteArray;
    }

// If it's an actual byteArray, convert it to base64
    return `data:image/jpeg;base64,${byteArray}`;
};

const StaffSalaryList = ({staffSalary, onEdit, onView}) => {
    console.log("staffSalary", staffSalary)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [salaries, setSalaries] = useState(staffSalary)
    const [modalOpen, setModalOpen] = useState(false);


    const handleOpenModal = (id) => {
        setStaffToDelete(id);
        setModalOpen(true);
        setSelectedStaff(id);
    };

    const handleCloseModal = (id) => {
        setModalOpen(false);
        setStaffToDelete(null);
        setSelectedStaff(id)
    };

    const handleToastDelete = () => {
        if (staffToDelete) {
            dispatch(deleteStaffSalaryById(staffToDelete))
                .then(() => {
                    toast.success("Staff Salary deleted successfully.");
                    handleCloseModal();
                })
                .catch((error) => {
                    console.error("Error deleting designation:", error);
                    toast.error("Failed to delete the designation. Please try again.");
                    handleCloseModal();
                });
        }
    };

    return (
        <>
            <TableContainer component={Paper} style={{maxHeight: 520}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold"}}>Staff Name</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>payment mode</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Total Submission</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Transaction Id</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries.map((salary, index) => (
                            <TableRow
                                key={salary.id}

                                style={{backgroundColor: rowColors[index % rowColors.length]}}
                            >
                                <TableCell>{salary.name}</TableCell>
                                <TableCell>{salary.paymentMode}</TableCell>
                                <TableCell>{salary.totalSubmission}</TableCell>
                                <TableCell>{salary.transactionId}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Details" arrow>
                                        <IconButton
                                            onClick={() => onView(salary)}
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={() => onEdit(salary)}

                                            color="secondary"
                                            sx={{marginRight: 1}}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            onClick={() => handleOpenModal(salary.id)}
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                        <Dialog
                                            open={modalOpen}
                                            onClose={handleCloseModal}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                Delete Staff Salary?
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Are you sure you want to delete this Staff salary?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseModal} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleToastDelete} color="primary">
                                                    Delete
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        <ToastContainer
                                            position="top-right"
                                            autoClose={4000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                        />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default StaffSalaryList;
