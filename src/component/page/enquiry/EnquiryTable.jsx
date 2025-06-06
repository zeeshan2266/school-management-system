import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"; // Import useNavigate
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    Link,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useDispatch, useSelector} from "react-redux";
import {formatDate} from "../../../commonStyle";
import {deleteEnquiry, updateEnquiry} from "./redux/enquiryActions.js";
import MasterJson from "../../masterfile/MasterJson.json";
import {GridCloseIcon} from "@mui/x-data-grid";

// Styling for modals
const modalStyle = {

    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    width: 'auto', // Set to auto for dynamic width
    maxWidth: '90%',
};

const EnquiryTable = ({filteredEnquiries}) => {
    const [studentsData, setStudentsData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [assetToDelete, setAssetToDelete] = useState(null);
    //
//   const [modalOpen, setModalOpen] = useState(false);
    //
    const enquiries = useSelector((state) => state.enquiries.enquiries) || []; // Ensure default to empty array
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const [enquiryStatusValue, setEnquiryStatusValue] = useState("");
    useEffect(() => {
        console.log(" EnquiryTable   filteredEnquiries", filteredEnquiries);
        setStudentsData(filteredEnquiries); // This will set studentsData based on the latest enquiries
    }, [filteredEnquiries]);
    //[enquiries]); // Add enquiries as a dependency

    //

    const handleOpenModal = (id) => {
        setAssetToDelete(id);
        setOpenModal(true);
        setSelectedStudent(id)
    };
    //
    const handleMenuClick = (event, student) => {
        setAnchorEl(event.currentTarget);
        console.log("Student", student);
        setSelectedStudent(student);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action) => {
        setSelectedAction(action);
        handleMenuClose();
        setOpenModal(true);


    };

    const handleCloseModal = (id) => {
        setOpenModal(false);
        setSelectedAction("");
        setSelectedStudent(id);
        setAssetToDelete(null);
    };


    const handleToastDelete = () => {
        if (selectedStudent.id) {
            dispatch(deleteEnquiry(selectedStudent.id))
                .then(() => {
                    toast.success("enquiry deleted successfully.");
                    handleCloseModal();
                })
                .catch((error) => {
                    console.error("Error deleting asset:", error);
                    toast.error("Failed to delete the asset. Please try again.");
                    handleCloseModal();
                });
        }
    };
    const handleSubmitForStatus = async (event) => {
        event.preventDefault();
        try {
            const updatedStudent = {
                ...selectedStudent,
                enquiryStatus: enquiryStatusValue, // Set the new enquiryStatus from the form
            };
            console.log("DID", updatedStudent.id);
            console.log("ID NAME", updatedStudent);
            dispatch(updateEnquiry(updatedStudent));
            alert("Status updated successfully");
            handleCloseModal(); // Close the modal after updating
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleSubmitForEdit = async (event) => {
        event.preventDefault();
        try {
            dispatch(updateEnquiry(selectedStudent));
            alert("Student details updated successfully");
            handleCloseModal(); // Close the modal after updating
        } catch (error) {
            console.error("Error updating student details:", error);
        }
    };
    const renderModalContent = () => {
        if (!selectedStudent) return null; // Return nothing if no student is selected

        const fullName = `${selectedStudent.firstName} ${selectedStudent.lastName}`; // Combine first and last name
        // Default to the current status

        switch (selectedAction) {
            case "View":
                return (
                    <>


                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#1976d2",
                                mb: 4,
                            }}
                        >
                            Student Details
                        </Typography>
                        <Grid container justifyContent="center">
                            <Grid item xs={12} sm={10} md={8}>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        maxWidth: "600px", // Set specific width for view modal
                                        width: "100%", // Ensure it takes full width of the Box
                                        mx: "auto",


                                        maxHeight: 500, // Controls vertical scroll
                                        overflowY: "auto", // Only vertical scrolling
                                        backgroundColor: "#fefefe",
                                        borderRadius: "16px",
                                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                                        padding: "16px",
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        color: "#ffffff",
                                                        fontWeight: "bold",
                                                        fontSize: "16px",
                                                        textAlign: "center",
                                                        backgroundColor: "#1565c0",
                                                    }}
                                                >
                                                    Field
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#ffffff",
                                                        fontWeight: "bold",
                                                        fontSize: "16px",
                                                        textAlign: "center",
                                                        backgroundColor: "#1565c0",
                                                    }}
                                                >
                                                    Details
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {[
                                                {label: "First Name", value: selectedStudent.firstName},
                                                {label: "Last Name", value: selectedStudent.lastName},
                                                {
                                                    label: "Phone Number", value: (
                                                        <a
                                                            href={`tel:${selectedStudent.phoneNumber}`}
                                                            style={{
                                                                color: "#1976d2",
                                                                textDecoration: "none",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {selectedStudent.phoneNumber}
                                                        </a>
                                                    )
                                                },
                                                {
                                                    label: "Email", value: (
                                                        <a
                                                            href={`mailto:${selectedStudent.email}`}
                                                            style={{
                                                                color: "#1976d2",
                                                                textDecoration: "none",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {selectedStudent.email}
                                                        </a>
                                                    )
                                                },
                                                {label: "Date of Birth", value: selectedStudent.dob || "N/A"},
                                                {label: "Class", value: selectedStudent.studentClass},
                                                {label: "Enquiry Status", value: selectedStudent.enquiryStatus},
                                                {label: "Gender", value: selectedStudent.gender},
                                                {label: "Nationality", value: selectedStudent.nationality},
                                                {
                                                    label: "Address",
                                                    value: `${selectedStudent.address}, ${selectedStudent.city}, ${selectedStudent.state}, ${selectedStudent.country} - ${selectedStudent.pincode}`
                                                },
                                                {label: "Mother's Name", value: selectedStudent.motherName},
                                                {label: "Mother's Occupation", value: selectedStudent.motherOccupation},
                                                {label: "Mother's Mobile", value: selectedStudent.motherMobile},
                                                {label: "Father's Name", value: selectedStudent.fatherName},
                                                {
                                                    label: "Father's Occupation",
                                                    value: selectedStudent.fatherOccupation || "N/A"
                                                },
                                                {label: "Father's Mobile", value: selectedStudent.fatherMobile},
                                                {
                                                    label: "Enquiry Creation Date",
                                                    value: new Date(selectedStudent.creationDateTime).toLocaleString()
                                                },
                                                {label: "Remark", value: selectedStudent.remark || "N/A"},
                                            ].map((row, index) => (
                                                <TableRow hover key={index}>
                                                    <TableCell sx={{fontWeight: "bold", width: "40%"}}>
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell>{row.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </>
                );
            case "Status":
                return (
                    <>

                        <Typography variant="h6">Editing Status for {fullName} </Typography>
                        <form onSubmit={handleSubmitForStatus}>
                            {/* Form to update student status */}
                            <TextField
                                margin="dense"
                                label="Enquiry Status"
                                select
                                fullWidth
                                value={enquiryStatusValue}
                                onChange={(e) => setEnquiryStatusValue(e.target.value)}
                                required
                            >
                                {MasterJson.enquiry.map((status) => (
                                    <MenuItem key={status.name} value={status.name}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{mt: 2}}
                            >
                                Update Status
                            </Button>
                        </form>
                    </>
                );
            case "Convert To Admission":
                return (
                    <>
                        <Typography variant="h6">
                            Convert {fullName} to Admission
                        </Typography>
                        <Typography variant="body1">
                            Are you sure you want to convert this enquiry to admission?
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // Add logic for converting enquiry to admission
                                // Navigate to StudentForm and pass the selected student data
                                navigate("/student", {state: {openForm: true}});
                                handleCloseModal(); // Close the modal after navigating

                            }}
                            sx={{mt: 2}}
                        >
                            Confirm
                        </Button>
                    </>
                );

            case "Edit":
                return (
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: "15px",
                            boxShadow: 4,
                            backgroundColor: "#ffffff",
                            maxWidth: "800px",
                            mx: "auto",
                            mt: 5,
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#1976d2",
                            }}
                        >
                            Edit Student Details
                        </Typography>
                        <form onSubmit={handleSubmitForEdit}>
                            <Box sx={{p: 2}}>
                                <Grid container spacing={3}>
                                    {/* First Name */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="First Name"
                                            value={selectedStudent.firstName}
                                            onChange={(e) =>
                                                setSelectedStudent({
                                                    ...selectedStudent,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            required
                                            InputProps={{
                                                sx: {borderRadius: "10px"},
                                            }}
                                        />
                                    </Grid>

                                    {/* Last Name */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Last Name"
                                            value={selectedStudent.lastName}
                                            onChange={(e) =>
                                                setSelectedStudent({
                                                    ...selectedStudent,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            required
                                            InputProps={{
                                                sx: {borderRadius: "10px"},
                                            }}
                                        />
                                    </Grid>

                                    {/* Phone Number */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Phone Number"
                                            value={selectedStudent.phoneNumber}
                                            onChange={(e) =>
                                                setSelectedStudent({
                                                    ...selectedStudent,
                                                    phoneNumber: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            required
                                            InputProps={{
                                                sx: {borderRadius: "10px"},
                                            }}
                                        />
                                    </Grid>

                                    {/* Gender */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                                                Gender
                                            </Typography>
                                            <RadioGroup
                                                row
                                                aria-label="gender"
                                                name="gender"
                                                value={selectedStudent.gender}
                                                onChange={(e) =>
                                                    setSelectedStudent({
                                                        ...selectedStudent,
                                                        gender: e.target.value,
                                                    })
                                                }
                                            >
                                                <FormControlLabel
                                                    value="male"
                                                    control={<Radio color="primary"/>}
                                                    label="Male"
                                                />
                                                <FormControlLabel
                                                    value="female"
                                                    control={<Radio color="primary"/>}
                                                    label="Female"
                                                />
                                                <FormControlLabel
                                                    value="other"
                                                    control={<Radio color="primary"/>}
                                                    label="Other"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {/* Email Address */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Email Address"
                                            value={selectedStudent.email}
                                            onChange={(e) =>
                                                setSelectedStudent({
                                                    ...selectedStudent,
                                                    email: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            required
                                            InputProps={{
                                                sx: {borderRadius: "10px"},
                                            }}
                                        />
                                    </Grid>

                                    {/* Date of Birth */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Date of Birth"
                                            type="date"
                                            value={selectedStudent.dob}
                                            onChange={(e) =>
                                                setSelectedStudent({
                                                    ...selectedStudent,
                                                    dob: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            required
                                            InputLabelProps={{
                                                shrink: true, // Makes the label float for date input
                                            }}
                                            InputProps={{
                                                sx: {borderRadius: "10px"},
                                            }}
                                        />
                                    </Grid>

                                    {/* Select Class */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Select Class</InputLabel>
                                            <Select
                                                label="Admission Class"
                                                value={selectedStudent.studentClass}
                                                onChange={(e) =>
                                                    setSelectedStudent({
                                                        ...selectedStudent,
                                                        studentClass: e.target.value,
                                                    })
                                                }
                                                sx={{borderRadius: "10px"}}
                                            >
                                                {MasterJson.SchoolClasses.map((status) => (
                                                    <MenuItem key={status.name} value={status.name}>
                                                        {status.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Save Button */}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{
                                                borderRadius: "12px",
                                                py: 1.5,
                                                fontWeight: "bold",
                                                textTransform: "none",
                                                fontSize: "16px",
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Box>

                );
            case "Delete":
                return (
                    <>

                        <Dialog
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            fullWidth
                            maxWidth="xs" // Reduced the modal width for a sleeker look
                            PaperProps={{
                                sx: {
                                    borderRadius: 4, // Adds a modern rounded corner effect
                                    padding: 2, // Adds internal padding for better spacing
                                    overflow: "hidden", // Removes any scroll bar
                                },
                            }}
                        >
                            <DialogContent
                                sx={{
                                    minHeight: "120px", // Slightly reduced the height for compactness
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center", // Center align text and content
                                    gap: 2, // Adds spacing between content items
                                    overflow: "hidden", // Ensures no scroll bar appears in the content
                                }}
                            >
                                <DialogContentText
                                    id="alert-dialog-description"
                                    sx={{
                                        textAlign: "center",
                                        fontSize: "1rem",
                                        fontWeight: "500",
                                        whiteSpace: "nowrap", // Prevents text wrapping
                                        overflow: "hidden", // Ensures text stays within the container
                                        textOverflow: "ellipsis", // Optional: Adds ellipsis if text overflows
                                    }}
                                >
                                    Are you sure you want to delete <strong>{fullName}</strong>?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{justifyContent: "center", gap: 1}}>
                                <Button
                                    onClick={handleCloseModal}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2, // Slightly rounded corners
                                        paddingX: 3, // Adds horizontal padding for a better button shape
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleToastDelete}
                                    color="error"
                                    variant="contained"
                                    sx={{
                                        borderRadius: 2,
                                        paddingX: 3,
                                    }}
                                >
                                    Confirm Delete
                                </Button>
                            </DialogActions>
                        </Dialog>


                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Table Display */}
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 950}} aria-label="enquiry table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>#</TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>Student</TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>Contact</TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>
                                Applied For
                            </TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>
                                Created By
                            </TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>Status</TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>Remark</TableCell>
                            <TableCell sx={{backgroundColor: "#f3f7e7"}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(studentsData) &&
                            studentsData.map((student, index) => {
                                if (!student) return null; // Handle null/undefined student objects

                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="bold">
                                                S. Name: {student.firstName} {student.lastName}
                                            </Typography>
                                            <Typography variant="body2">
                                                F. Name: {student.fatherName}
                                            </Typography>
                                            <Typography variant="body2">
                                                M. Name: {student.motherName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                Mobile No.:&nbsp;
                                                <Link
                                                    href={`tel:${student.phoneNumber}`}
                                                    color="primary"
                                                >
                                                    {student.phoneNumber}
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2">
                                                F. Mobile No.:{student.fatherMobile}
                                            </Typography>
                                            <Typography variant="body2">
                                                M. Mobile No.:{student.motherMobile}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{student.studentClass}</TableCell>
                                        <TableCell>
                                            {formatDate(student.creationDateTime)}
                                        </TableCell>
                                        <TableCell>{student.enquiryStatus} </TableCell>
                                        <TableCell>{student.remark}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(event) => handleMenuClick(event, student)}
                                            >
                                                <MoreVertIcon/>
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => handleAction("View")}>
                                                    View
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction("Status")}>
                                                    Status
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => handleAction("Convert To Admission")}
                                                >
                                                    Convert To Admission
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction("Edit")}>
                                                    Edit
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction("Delete")}>
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for Actions */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={modalStyle}>
                    {selectedStudent && renderModalContent()}
                    <button
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={handleCloseModal}
                        aria-label="Close"
                    >
                        {/* Example using Material Icons */}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#1976d2"
                            }}
                            className="material-icons"
                        >
    <GridCloseIcon/>
  
  </span>
                    </button>

                </Box>
            </Modal>
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

export default EnquiryTable;
