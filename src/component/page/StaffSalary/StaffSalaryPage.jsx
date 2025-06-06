import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
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
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {useDispatch, useSelector} from "react-redux";
import {
    createStaffSalary,
    deleteStaffSalaryById,
    fetchStaffSalaryBySchoolSession,
    updateStaffSalary,
} from "./Redux/StaffSalaryAction";
import StaffSalaryList from "./StaffSalaryList";
import StaffSalaryForm from "./StaffSalaryForm";
import * as XLSX from "xlsx";
import ClearIcon from "@mui/icons-material/Clear";
import {selectSchoolDetails} from "../../../common";

const StaffSalaryPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [SelectedStaffSalary, setSelectedStaffSalary] = useState("");
    const [openDetails, setOpenDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    // const [staffType, setStaffType] = useState('teaching');

    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const {staffSalaries, loading, error} = useSelector(
        (state) => state.salary
    );

    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchStaffSalaryBySchoolSession(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddStaff = () => {
        setSelectedStaffSalary(null);
        setOpenForm(true);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleEditStaff = (salary) => {
        setSelectedStaffSalary(salary);
        setOpenForm(true);
    };

    const handleViewStaff = (salary) => {
        setSelectedStaffSalary(salary);
        setOpenDetails(true);
    };

    const handleFormSubmit = (formData) => {
        if (formData.id) {
            // Update existing staff salary
            dispatch(updateStaffSalary(formData.id, formData))
                .then(() => dispatch(fetchStaffSalaryBySchoolSession(schoolId, session))) // Re-fetch updated data
                .catch((error) => console.error("Error updating staff salary:", error));
        } else {
            // Create new staff salary
            dispatch(createStaffSalary(formData))
                .then(() =>
                    dispatch(fetchStaffSalaryBySchoolSession(schoolId, session))
                ) // Re-fetch updated data
                .catch((error) => console.error("Error creating staff salary:", error));
        }

        setOpenForm(false); // Close the form modal
    };

    const handleDeleteStaff = (id) => {
        dispatch(deleteStaffSalaryById(id));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDownloadExcel = () => {
        const filteredData = staffSalaries.map(
            ({
                 photo,
                 identificationDocuments,
                 educationalCertificate,
                 professionalQualifications,
                 experienceCertificates,
                 bankAccount,
                 previousEmployer,
                 ...staff
             }) => staff
        );

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
        XLSX.writeFile(workbook, "staff.xlsx");
    };

    // Ensure staffSalaries is an array before applying array methods
    const filteredStaffList = Array.isArray(staffSalaries)
        ? staffSalaries.filter((salary) => {
            const name = salary.name?.toLowerCase() || "";
            const Paymentmode = salary.paymentMode?.toLowerCase() || "";
            const totalsubmission = salary.totalSubmission?.toLowerCase() || "";
            const query = searchQuery.toLowerCase();

            return (
                name.includes(query) ||
                Paymentmode.includes(query) ||
                totalsubmission.includes(query)
            );
        })
        : [];

    console.log("filteredStaffList", filteredStaffList);

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
                            onClick={handleAddStaff}
                            style={{margin: "0 16px"}}
                        >
                            Add SALARY
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
                            <StaffSalaryList
                                staffSalary={filteredStaffList}
                                onEdit={handleEditStaff}
                                onDelete={handleDeleteStaff}
                                onView={handleViewStaff}
                            />
                        </Grid>
                    </Grid>

                    {/* Tabs for Teaching and Non-Teaching Staff */}
                    <Dialog
                        open={openForm}
                        onClose={() => setOpenForm(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        {/* <DialogTitle>{SelectedStaffSalary ? 'Edit salary' : 'Add salary'}</DialogTitle> */}

                        <DialogContent>
                            <StaffSalaryForm
                                staff={SelectedStaffSalary}
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
                        {/* <DialogTitle>Staff Details</DialogTitle> */}
                        <DialogContent>
                            {SelectedStaffSalary ? (
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
                                                {label: "Name", value: SelectedStaffSalary.name},
                                                {
                                                    label: "payment mode",
                                                    value: SelectedStaffSalary.paymentMode,
                                                },

                                                {
                                                    label: "Transaction Id",
                                                    value: SelectedStaffSalary.transactionId,
                                                },
                                                {label: "Month", value: SelectedStaffSalary.month},


                                                {
                                                    label: "Basic Salary",
                                                    value: SelectedStaffSalary.basicSalary,
                                                },
                                                {
                                                    label: "Deductions",
                                                    value: SelectedStaffSalary.deductions,
                                                },

                                                {
                                                    label: "Net Salary",
                                                    value: SelectedStaffSalary.netSalary,
                                                },
                                                {
                                                    label: "Bank Account Name",
                                                    value: SelectedStaffSalary.bankAccountName,
                                                },
                                                {
                                                    label: "Bank Account Number",
                                                    value: SelectedStaffSalary.bankAccountNumber,
                                                },
                                                {
                                                    label: "IFSC Code",
                                                    value: SelectedStaffSalary.bankIfsc,
                                                },
                                                {
                                                    label: "schoolId",
                                                    value: SelectedStaffSalary.schoolId,
                                                },
                                                {
                                                    label: "session",
                                                    value: SelectedStaffSalary.session,
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

export default StaffSalaryPage;
