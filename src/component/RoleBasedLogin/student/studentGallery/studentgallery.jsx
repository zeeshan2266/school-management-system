import {useSelector} from "react-redux";
import GalleryList from "../../../page/gallary/GalleryList";
import {useState} from "react";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StudentGallery = () => {
    const {galleryList} = useSelector((state) => state.gallery);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);


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
    const handleViewGallery = (gallery) => {
        setSelectedGallery(gallery);
        setOpenDetails(true);
    };
    return (
        <>
            <GalleryList
                galleryList={filteredDailyTaskList}
                showEditButton={false}
                showDeleteButton={false}
                onView={handleViewGallery}
            />
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
    )
}

export default StudentGallery;