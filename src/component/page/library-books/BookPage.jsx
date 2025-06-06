import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {useDispatch, useSelector} from "react-redux";
import {createBook, createBorrowBook, deleteBook, fetchBOOK, updateBook,} from "./redux/BookActions";
import BookForm from "./BookForm";
import BookList from "./BookList";
import * as XLSX from "xlsx";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import {selectSchoolDetails} from "../../../common";

const BookPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const {bookList, loading, error} = useSelector((state) => state.book);

    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;


    useEffect(() => {
        dispatch(fetchBOOK(schoolId, session));
    }, [dispatch, schoolId, session]);

    const handleAddBook = () => {
        setSelectedBook(null);
        setOpenForm(true);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setOpenForm(true);
    };

    const handleViewBook = (book) => {
        setSelectedBook(book);
        setOpenDetails(true);
    };

    const handleBorrowBook = (book) => {
        setSelectedBook(book);
        setOpenDetails(true);
        dispatch(createBorrowBook(book));
    };
    const handleCheckFine = (book) => {
        setSelectedBook(book);
        setOpenDetails(true);
    };
    const handleFormSubmit = (formData) => {
        if (formData.id) {
            dispatch(updateBook(formData.id, formData));
        } else {
            dispatch(createBook(formData));
        }
        setOpenForm(false);
    };

    const handleDeleteBook = (id) => {
        dispatch(deleteBook(id));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDownloadExcel = () => {
        const filteredData = bookList.map(
            ({
                 photo,
                 identificationDocuments,
                 educationalCertificate,
                 professionalQualifications,
                 experienceCertificates,
                 bankAccount,
                 previousEmployer,
                 ...book
             }) => book
        );

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Book");
        XLSX.writeFile(workbook, "Book.xlsx");
    };

    // Ensure staffList is an array before applying array methods
    const filteredBookList = Array.isArray(bookList)
        ? bookList.filter((book) => {
            const title = book.title?.toLowerCase() || "";
            const author = book.author?.toLowerCase() || "";
            const isbn = book.isbn?.toLowerCase() || "";
            const query = searchQuery.toLowerCase();

            return (
                title.includes(query) ||
                author.includes(query) ||
                isbn.includes(query)
            );
        })
        : [];

    return (
        <Container maxWidth="lg">
            {loading ? (
                <Box>
                    <Skeleton variant="rectangular" width="100%" height={40}/>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={40}
                        style={{marginTop: "16px"}}
                    />
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={400}
                        style={{marginTop: "16px"}}
                    />
                </Box>
            ) : error ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            marginBottom: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <TextField
                            label="Search by Name, Phone, or Email"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearch}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="search">
                                            <SearchIcon/>
                                        </IconButton>
                                        {searchQuery && (
                                            <IconButton
                                                aria-label="clear"
                                                onClick={handleClearSearch}
                                            >
                                                <ClearIcon/>
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            sx={{flexGrow: 1}}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddBook}
                            style={{margin: "0 16px"}}
                        >
                            Add Book
                        </Button>
                        <Tooltip title="Download all staff details">
                            <IconButton
                                aria-label="download"
                                color="primary"
                                onClick={handleDownloadExcel}
                            >
                                <FileDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Grid container>
                        <Grid item xs={12}>
                            <BookList
                                bookList={filteredBookList}
                                onEdit={handleEditBook}
                                onDelete={handleDeleteBook}
                                onView={handleViewBook}
                                onBorrow={handleBorrowBook}
                                onCheckFine={handleCheckFine}
                            />
                        </Grid>
                    </Grid>
                    <Dialog
                        open={openForm}
                        onClose={() => setOpenForm(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>{selectedBook ? "Edit Book" : "Add Book"}</DialogTitle>
                        <DialogContent>
                            <BookForm
                                book={selectedBook}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setOpenForm(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openDetails}
                        onClose={() => setOpenDetails(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle
                            sx={{
                                textAlign: "center", // Center the title text
                                position: "relative", // Ensure the close button stays in the correct place
                            }}
                        >
                            Book Details
                            <IconButton
                                aria-label="close"
                                onClick={() => setOpenDetails(false)}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                }}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            {selectedBook ? (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            {[
                                                {label: "Title", value: selectedBook.title},
                                                {label: "Author", value: selectedBook.author},
                                                {label: "ISBN", value: selectedBook.isbn},
                                                {label: "Borrowed", value: selectedBook.borrowed},
                                                {
                                                    label: "Borrowed By",
                                                    value: selectedBook.borrowedBy,
                                                },
                                                {
                                                    label: "Borrowed Email",
                                                    value: selectedBook.borrowedEmail,
                                                },
                                                {label: "Price", value: selectedBook.price},
                                                {label: "Late Fine", value: selectedBook.lateFine},
                                                {label: "Issue Date", value: selectedBook.issueDate},
                                                {
                                                    label: "Return Last Date",
                                                    value: selectedBook.returnLastDate,
                                                },
                                                {
                                                    label: "Creation Date Time",
                                                    value: selectedBook.creationDateTime,
                                                },
                                                {
                                                    label: "Total No. of Pages",
                                                    value: selectedBook.totalNoPage,
                                                },
                                                {
                                                    label: "Type of Binding",
                                                    value: selectedBook.typeOfBinding,
                                                },
                                                {
                                                    label: "Written Language",
                                                    value: selectedBook.writtenLanguage,
                                                },
                                                {label: "Room No.", value: selectedBook.roomNo},
                                                {label: "Rack No.", value: selectedBook.rackNo},
                                                {label: "Row No.", value: selectedBook.rowNo},
                                                {label: "Barcode", value: selectedBook.barCode},
                                            ].map((item) => (
                                                <TableRow key={item.label}>
                                                    <TableCell>
                                                        <strong>{item.label}</strong>
                                                    </TableCell>
                                                    <TableCell>{item.value || "Not available"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Skeleton variant="rectangular" width="100%" height={200}/>
                            )}
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default BookPage;
