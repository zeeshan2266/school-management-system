import React, {useEffect, useState} from 'react';
import {Box,} from '@mui/material';


import {useLocation, useNavigate} from 'react-router-dom'; // Import useHistory
import {useDispatch, useSelector} from 'react-redux';
import {selectSchoolDetails} from "../../../../common";
import {fetchGallery,} from "../../../page/gallary/redux/GalleryActions";
// import BookPage from '../../../page/library-books/BookPage';
import BookList from '../../../page/library-books/BookList';

const StudentBook = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    // Handling avatar dropdown
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLogout = () => {
        handleMenuClose(); // Close the menu
        navigate.push('/logout'); // Redirect to the logout route
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const [searchQuery, setSearchQuery] = useState("");


    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const dispatch = useDispatch();

    useEffect(() => {

        if (schoolId && session) {
            dispatch(fetchGallery(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const {bookList} = useSelector((state) => state.book);
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
    const handleViewBook = (book) => {
        setSelectedBook(book);
        setOpenDetails(true);
    };
    return (
        <Box>

            <BookList
                bookList={filteredBookList}
                // onEdit={handleEditBook}
                // onDelete={handleDeleteBook}
                onView={handleViewBook}
                // onBorrow={handleBorrowBook}
                // onCheckFine={handleCheckFine}
            />


        </Box>
    );
};

export default StudentBook;