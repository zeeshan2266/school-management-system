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
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {useNavigate} from "react-router-dom";
import {deleteStudent} from "./redux/studentActions";

const convertByteArrayToBase64 = (byteArray) => {


    if (!byteArray) return ''; // Handle null or undefined cases

    // Check if it's already a base64 encoded string
    if (typeof byteArray === 'string' && byteArray.startsWith('data:image')) {
        return byteArray;
    }

    // If it's an actual byteArray, convert it to base64
    return `data:image/jpeg;base64,${byteArray}`;
};

const StudentList = ({
                         studentList,
                         handleEdit,
                         handleDelete,
                         handleView,
                         loading,
                     }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [boxOpen, setBoxOpen] = useState(false);

    const navigate = useNavigate();

    const handleClickOpen = (student) => {
        navigate(`/student/${student.id}`);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStudent(null);
    };

    const handleOpenBox = (id) => {
        setStudentToDelete(id);
        setBoxOpen(true);
        setSelectedStudent(id)
    };
    const handleCloseBox = () => {
        setBoxOpen(false);
        setStudentToDelete(null);
    };
    const handleToastifyDelete = () => {
        if (studentToDelete) {
            dispatch(deleteStudent(studentToDelete))
                .then(() => {
                    toast.success("Student deleted successfully.");
                    handleCloseBox(); // Close dialog after deletion
                })
                .catch((error) => {
                    console.error("Error deleting designation:", error);
                    toast.error("Failed to delete the designation. Please try again.");
                    handleCloseBox(); // Close dialog even on error
                });
        }
    };

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 520,
                    overflowX: "auto",
                    "@media (max-width:600px)": {
                        maxHeight: "auto",
                        overflowX: "scroll",
                    },
                }}

            >
                {loading ? (
                    <Box>
                        {/* Skeleton for the table header */}
                        <Skeleton
                            variant="rectangular"
                            height={40}
                            sx={{marginBottom: 1}}
                        />
                        {/* Skeleton for the table rows */}
                        {Array.from(new Array(5)).map((_, index) => (
                            <Skeleton
                                variant="rectangular"
                                height={40}
                                key={index}
                                sx={{marginBottom: 1}}
                            />
                        ))}
                    </Box>
                ) : (
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>Photo</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Name</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Parents</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Roll No</TableCell>

                                <TableCell sx={{fontWeight: "bold"}}>class</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Class Teacher</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Address</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Bus Route</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentList.map((student, index) => (
                                <TableRow
                                    key={student.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Alternating row colors
                                        borderBottom: "1px solid #ddd", // Border line for each row
                                    }}
                                >
                                    <TableCell>
                                        <img
                                            src={
                                                convertByteArrayToBase64(student.studentPhoto) ||
                                                "/path/to/default/image.png"
                                            }
                                            alt={`${student.studentName}'s photo`}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                objectFit: "cover",
                                                borderRadius: "50%", // For circular photos
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell>{`${student.fatherName}, ${student.motherName}`}</TableCell>
                                    <TableCell>{student.rollNo}</TableCell>

                                    <TableCell>{student.className}</TableCell>
                                    <TableCell>{student.classTeacher}</TableCell>

                                    <TableCell>{student.address}</TableCell>
                                    <TableCell>{student.busRoute}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View Details" arrow>
                                            <IconButton
                                                onClick={() => handleClickOpen(student)}
                                                color="primary"
                                                sx={{marginRight: 1}}
                                            >
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                onClick={() => handleEdit(student)}
                                                color="secondary"
                                                sx={{marginRight: 1}}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                onClick={() => handleOpenBox(student.id)}
                                                color="error"
                                                sx={{marginRight: 1}}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>

                                            {/* toast for success/error messages */}
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* verify modal for Deletion */}
            <Dialog
                open={boxOpen}
                onClose={handleCloseBox}
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
                    Delete Student ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this Student ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBox} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleToastifyDelete}
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


            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <DialogTitle>
                    Student Details
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
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    margin: "0 auto",
                                    mb: 2,
                                }}
                            >
                                <img
                                    src={convertByteArrayToBase64(selectedStudent.studentPhoto)}
                                    alt={`${selectedStudent.studentName}'s photo`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%", // For circular photos
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2fr",
                                    gap: "10px",
                                    width: "100%",
                                    maxWidth: "600px",
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold">
                                    Name:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedStudent.studentName}
                                </Typography>

                                <Typography variant="body1" fontWeight="bold">
                                    Parents:
                                </Typography>
                                <Typography
                                    variant="body1">{`${selectedStudent.fatherName}, ${selectedStudent.motherName}`}</Typography>

                                <Typography variant="body1" fontWeight="bold">
                                    Roll No:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedStudent.rollNo}
                                </Typography>


                                <Typography variant="body1" fontWeight="bold">Class:</Typography>
                                <Typography variant="body1">{selectedStudent.className}</Typography>


                                <Typography variant="body1" fontWeight="bold">
                                    Class Teacher:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedStudent.classTeacher}
                                </Typography>

                                <Typography variant="body1" fontWeight="bold">
                                    Address:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedStudent.address}
                                </Typography>

                                <Typography variant="body1" fontWeight="bold">
                                    Bus Route:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedStudent.busRoute}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
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
        </>
    );
};

export default StudentList;
