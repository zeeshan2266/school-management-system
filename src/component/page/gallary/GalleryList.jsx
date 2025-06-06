import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useDispatch} from "react-redux";
import {deleteGallery} from "./redux/GalleryActions";

// Define a set of colors for alternating rows
const rowColors = ["#f5f5f5", "#ffffff"];

const GalleryList = ({galleryList, onEdit, onDelete, onView, showDeleteButton = true, showEditButton = true}) => {
    const [open, setOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [gallerys, setDailyTasks] = useState(galleryList);
    const [galaryToDelete, setGalaryToDelete] = useState(null);

    const dispatch = useDispatch();

    const handleClickOpen = (id) => {
        setGalaryToDelete(id);
        setSelectedGallery(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGallery(null);
    };

    const handleToastDelete = () => {
        if (galaryToDelete) {
            dispatch(deleteGallery(galaryToDelete))
                .then(() => {
                    toast.success("Galary List deleted successfully.");
                    handleClose();
                })
                .catch((error) => {
                    console.error("Error deleting Galary:", error);
                    toast.error("Failed to delete the Galary. Please try again.");
                    handleClose();
                });
        }
    };

    return (
        <>
            <TableContainer component={Paper} style={{maxHeight: 520}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold"}}>Type</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Title</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>videoURL</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>description</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>schoolId</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>session</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>CreatedDate</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Actions</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gallerys.map((gallery, index) => (
                            <TableRow
                                key={gallery.id}
                                style={{backgroundColor: rowColors[index % rowColors.length]}}
                            >
                                <TableCell>{gallery.type}</TableCell>
                                <TableCell>{gallery.title}</TableCell>
                                <TableCell>{gallery.videoURL}</TableCell>
                                <TableCell>{gallery.description}</TableCell>
                                <TableCell>{gallery.schoolId}</TableCell>
                                <TableCell>{gallery.session}</TableCell>
                                <TableCell>{gallery.createdDate}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Details" arrow>
                                        <IconButton
                                            onClick={() => onView(gallery)}
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip title="Edit Gallery" arrow>
                    <IconButton
                      onClick={() => onEdit(gallery)}
                      color="secondary"
                      sx={{ marginRight: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip> */}
                                    {showEditButton && ( // Conditionally render Edit button
                                        <Tooltip title="Edit Gallery" arrow>
                                            <IconButton
                                                onClick={() => onEdit(gallery)}
                                                color="secondary"
                                                sx={{marginRight: 1}}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {/* <Tooltip title="Delete Gallery" arrow>
                    <IconButton
                      onClick={() => handleClickOpen(gallery.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip> */}
                                    {showDeleteButton && ( // Conditionally render Delete button
                                        <Tooltip title="Delete Gallery" arrow>
                                            <IconButton
                                                onClick={() => handleClickOpen(gallery.id)}
                                                color="error"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
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
                        minHeight: "100px", // Slightly reduced the height for compactness
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
                        Are you sure you want to delete ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center", gap: 1}}>
                    <Button
                        onClick={handleClose}
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

export default GalleryList;
