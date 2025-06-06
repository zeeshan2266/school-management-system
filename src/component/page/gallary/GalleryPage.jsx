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
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {useDispatch, useSelector} from "react-redux";
import {createGallery, deleteGallery, fetchGallery, updateGallery,} from "./redux/GalleryActions";
import GalleryForm from "./GalleryForm";
import * as XLSX from "xlsx";
import ClearIcon from "@mui/icons-material/Clear";
import {selectSchoolDetails} from "../../../common";
import GalleryList from "./GalleryList";

const GalleryPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;

    const {galleryList, loading, error} = useSelector((state) => state.gallery);

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchGallery(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddGallery = () => {
        setSelectedGallery(null);
        setOpenForm(true);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };
    const handleEditGallery = (gallery) => {
        console.log("On Edit Block");
        console.log(gallery);
        setSelectedGallery(gallery); // Ensure selected task is passed to form
        setOpenForm(true); // Open the form
    };

    const handleViewGallery = (gallery) => {
        setSelectedGallery(gallery);
        setOpenDetails(true);
    };
    const handleFormSubmit = (formData) => {
        if (formData.id) {
            dispatch(updateGallery(formData.id, formData));
        } else {
            dispatch(createGallery(formData));
        }
        setOpenForm(false);
    };

    const handleDeleteGallery = (id) => {
        dispatch(deleteGallery(id));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    // Ensure staffList is an array before applying array methods
    const handleDownloadExcel = () => {
        const filteredData = galleryList.map(
            ({
                 images,
                 identificationDocuments,
                 educationalCertificate,
                 professionalQualifications,
                 experienceCertificates,
                 bankAccount,
                 previousEmployer,
                 message, // Add other fields that may contain long texts
                 ...rest
             }) => ({
                ...rest, // Include only the remaining fields
            })
        );

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Gallery");
        XLSX.writeFile(workbook, "Gallery.xlsx");
    };

    const filteredDailyTaskList = Array.isArray(galleryList)
        ? galleryList.filter((gallery) => {
            const type = gallery.type?.toLowerCase() || "";
            const title = gallery.title?.toLowerCase() || "";
            const className = gallery.className?.toLowerCase() || "";
            const query = searchQuery.toLowerCase();

            return (
                type.includes(query) ||
                title.includes(query) ||
                className.includes(query)
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
                            label="Search by Type, Title, or Section"
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
                            onClick={handleAddGallery}
                            style={{margin: "0 16px"}}
                        >
                            Add Gallery
                        </Button>
                        <Tooltip title="Download all Daily Task details">
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
                            <GalleryList
                                galleryList={filteredDailyTaskList}
                                onEdit={handleEditGallery}
                                onDelete={handleDeleteGallery}
                                onView={handleViewGallery}
                            />
                        </Grid>
                    </Grid>
                    <Dialog
                        open={openForm}
                        onClose={() => setOpenForm(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>
                            {selectedGallery ? "Edit Gallery" : "Add Gallery"}
                        </DialogTitle>
                        <DialogContent>
                            <GalleryForm
                                gallery={selectedGallery}
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
                            Gallery Details
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
                            {selectedGallery ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the content
                                        alignItems: "center", // Vertically center the content
                                        textAlign: "center", // Center-align the text
                                        minHeight: "200px", // Set minimum height to prevent collapse
                                    }}
                                >
                                    <Table>
                                        <TableBody>
                                            {[
                                                {label: "Type", value: selectedGallery.type},
                                                {label: "Title", value: selectedGallery.title},
                                                {label: "videoURL", value: selectedGallery.videoURL},
                                                {
                                                    label: "description",
                                                    value: selectedGallery.description,
                                                },
                                                {
                                                    label: "schoolId",
                                                    value: selectedGallery.schoolId,
                                                },
                                                {label: "session", value: selectedGallery.session},
                                                {
                                                    label: "Date of Creation",
                                                    value: selectedGallery.createdDate,
                                                },
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
                                </Box>
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

export default GalleryPage;
