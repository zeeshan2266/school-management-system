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
    Typography
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import {useNavigate} from "react-router-dom"; // Import useNavigate
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useDispatch} from "react-redux";
import {deleteBook} from './redux/BookActions'

// Define a set of colors for alternating rows
const rowColors = ["#f5f5f5", "#ffffff"];

const BookList = ({bookList, onEdit, onDelete, onView}) => {
    const [open, setOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState(bookList); // Maintain a state for the book list
    const navigate = useNavigate(); // Initialize navigate
    const dispatch = useDispatch();
    const [bookToDelete, setBookToDelete] = useState(null);


    const handleOpenModal = (id) => {
        setBookToDelete(id);
        setOpen(true);
        setSelectedBook(id)
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBook(null);
    };

    const handleBorrowBook = (bookId) => {
        // Navigate to borrow page
        navigate(`/borrow/${bookId}`);
    };

    const handleCheckFine = (bookId) => {
        console.log("BookList Page checkFine bookId:::" + bookId);
        navigate(`/checkfine/${bookId}`);
    };
    const handleReturnBook = (bookId) => {
        navigate(`/returnbook/${bookId}`);
    };

    const handleToastDelete = () => {
        if (bookToDelete) {
            dispatch(deleteBook(bookToDelete))
                .then(() => {
                    toast.success("Book List deleted successfully.");
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
                            <TableCell style={{fontWeight: "bold"}}>Title</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Author</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>ISBN</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Price</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Available</TableCell>
                            <TableCell style={{fontWeight: "bold"}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book, index) => (
                            <TableRow
                                key={book.id}
                                style={{backgroundColor: rowColors[index % rowColors.length]}}
                            >
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                                <TableCell>{book.price}</TableCell>
                                <TableCell>{book.isAvailable}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Details" arrow>
                                        <IconButton
                                            onClick={() => onView(book)}
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Book" arrow>
                                        <IconButton
                                            onClick={() => onEdit(book)}
                                            color="secondary"
                                            sx={{marginRight: 1}}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete Book" arrow>
                                        <IconButton
                                            onClick={() => handleOpenModal(book.id)}
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Borrow Book" arrow>
                                        <IconButton
                                            onClick={() => handleBorrowBook(book.id)}
                                            color="secondary"
                                            disabled={book.isAvailable === "No"} // Disable if already borrowed or not available
                                            sx={{marginRight: 1}}
                                        >
                                            <Typography>Borrow</Typography>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Check fine" arrow>
                                        <IconButton
                                            onClick={() => handleCheckFine(book.id)}
                                            color="secondary"
                                            disabled={book.isAvailable === "Yes"}
                                            sx={{marginRight: 1}}
                                        >
                                            <Typography>CheckFine</Typography>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Return Book" arrow>
                                        <IconButton
                                            onClick={() => handleReturnBook(book.id)}
                                            color="secondary"
                                            disabled={book.isAvailable === "Yes"}
                                            sx={{marginRight: 1}}
                                        >
                                            <Typography>ReturnBook</Typography>
                                        </IconButton>
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

export default BookList;
