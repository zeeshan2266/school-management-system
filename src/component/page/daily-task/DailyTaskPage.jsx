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
import {createDailyTask, deleteDailyTask, fetchDailyTask, updateDailyTask,} from "./redux/DailyTaskActions";
import DailyTaskList from "./DailyTaskList";
import DailyTaskForm from "./DailyTaskForm";
import * as XLSX from "xlsx";
import ClearIcon from "@mui/icons-material/Clear";
import {selectSchoolDetails} from "../../../common";

const DailyTaskPage = ({items = []}) => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedDailyTask, setSelectedDailyTask] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const dispatch = useDispatch();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const {dailyTaskList, loading, error} = useSelector(
        (state) => state.dailyTask
    );
    const [imageSrc, setImageSrc] = useState(selectedDailyTask?.docs || '');

    useEffect(() => {
        // Reset the image source when selectedDailyTask changes
        setImageSrc(selectedDailyTask?.docs || '');
    }, [selectedDailyTask]);
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchDailyTask(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddDailyTask = () => {
        setSelectedDailyTask(null);
        setOpenForm(true);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setFilteredItems(items);
    };
    const handleEditDailyTask = (dailyTask) => {
        console.log("On Edit Block");
        console.log(dailyTask);
        setSelectedDailyTask(dailyTask); // Ensure selected task is passed to form
        setOpenForm(true); // Open the form
    };

    const handleViewDailyTask = (dailyTask) => {
        setSelectedDailyTask(dailyTask);
        setOpenDetails(true);
    };
    const handleFormSubmit = (formData) => {

        if (formData.id) {
            dispatch(updateDailyTask(formData.id, formData));
        } else {
            dispatch(createDailyTask(formData));
        }
        setOpenForm(false);
    };

    const handleDeleteDailyTask = (id) => {
        dispatch(deleteDailyTask(id));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log("Search Query:", e.target.value);
    };
    // Ensure staffList is an array before applying array methods
    const handleDownloadExcel = () => {
        const filteredData = dailyTaskList.map(
            ({
                 docs,
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "DailyTask");
        XLSX.writeFile(workbook, "DailyTask.xlsx");
    };

    const filteredDailyTaskList = Array.isArray(dailyTaskList)
        ? dailyTaskList.filter((dailyTask) => {
            const type = dailyTask.type?.toLowerCase() || "";
            const title = dailyTask.title?.toLowerCase() || "";
            const className = dailyTask.className?.toLowerCase() || "";
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
                            onClick={handleAddDailyTask}
                            style={{margin: "0 16px"}}
                        >
                            Add Assignment /DailyTask
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
                            <DailyTaskList
                                dailyTaskList={filteredDailyTaskList}
                                onEdit={handleEditDailyTask}
                                onDelete={handleDeleteDailyTask}
                                onView={handleViewDailyTask}
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
                            {selectedDailyTask ? "Edit Daily Task" : "Add Daily Task"}
                        </DialogTitle>
                        <DialogContent>
                            <DailyTaskForm
                                dailyTask={selectedDailyTask}
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
                            Daily Activities Details
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
                        {/* <DialogContent>
              {selectedDailyTask ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", // Horizontally center the content
                    alignItems: "center", // Vertically center the content
                    textAlign: "center", // Center-align the text
                    minHeight: "200px", // Set minimum height to prevent collapse
                  }}
                >
                  {[
                    { label: "Type", value: selectedDailyTask.type },
                    { label: "Title", value: selectedDailyTask.title },
                    {
                      label: "Message",
                      value: selectedDailyTask.message,
                    },
                    { label: "Staff Name", value: selectedDailyTask.staffName },
                    { label: "className", value: selectedDailyTask.className },
                    {
                      label: "Section",
                      value: selectedDailyTask.section,
                    },
                    {
                      label: "Date of creatation",
                      value: selectedDailyTask.createdDate,
                    },
                  ].map((item) => (
                    <Typography key={item.label} variant="body1" gutterBottom>
                      <strong>{item.label}:</strong>{" "}
                      {item.value || "Not available"}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
            </DialogContent> */}
                        <DialogContent>
                            {selectedDailyTask ? (
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
                                                {label: "Type", value: selectedDailyTask.type},
                                                {label: "Title", value: selectedDailyTask.title},
                                                {
                                                    label: "File Uploaded",
                                                    value: imageSrc ? (
                                                        <img
                                                            src={imageSrc}
                                                            alt="Uploaded Document"
                                                            onError={() => setImageSrc('/path/to/default/image.png')} // Set fallback image on error
                                                            style={{
                                                                width: '100px',
                                                                height: 'auto',
                                                                objectFit: 'contain'
                                                            }} // Adjust size as needed
                                                        />
                                                    ) : (
                                                        "No file uploaded"
                                                    ),
                                                },


                                                {label: "Message", value: selectedDailyTask.message},
                                                {
                                                    label: "Staff Name",
                                                    value: selectedDailyTask.staffName,
                                                },
                                                {
                                                    label: "Class Name",
                                                    value: selectedDailyTask.className,
                                                },
                                                {label: "Section", value: selectedDailyTask.section},
                                                {
                                                    label: "Date of Creation",
                                                    value: selectedDailyTask.createdDate,
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

export default DailyTaskPage;
