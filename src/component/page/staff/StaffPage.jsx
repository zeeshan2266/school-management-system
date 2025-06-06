import React, {useEffect, useState} from 'react';
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
    TextField,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useDispatch, useSelector} from 'react-redux';
import {createStaff, deleteStaff, fetchStaff, updateStaff} from './redux/staffActions';
import StaffForm from './StaffForm';
import StaffList from './StaffList';
import * as XLSX from 'xlsx';
import ClearIcon from '@mui/icons-material/Clear';
import {selectSchoolDetails} from "../../../common";

const StaffPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [staffType, setStaffType] = useState('teaching');
    const dispatch = useDispatch();
    const {staffList, loading, error} = useSelector((state) => state.staff);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchStaff(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleAddStaff = () => {
        setSelectedStaff(null);
        setOpenForm(true);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleEditStaff = (staff) => {
        setSelectedStaff(staff);
        setOpenForm(true);
    };

    const handleViewStaff = (staff) => {
        setSelectedStaff(staff);
        setOpenDetails(true);
    };

    const handleFormSubmit = (formData) => {
        if (formData.id) {
            dispatch(updateStaff(formData.id, formData));
        } else {
            dispatch(createStaff(formData));
        }
        setOpenForm(false);
    };

    const handleDeleteStaff = (id) => {
        dispatch(deleteStaff(id));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDownloadExcel = () => {
        const filteredData = staffList.map(
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff');
        XLSX.writeFile(workbook, 'staff.xlsx');
    };

    // Ensure staffList is an array before applying array methods
    const filteredStaffList = Array.isArray(staffList)
        ? staffList.filter((staff) => {
            const name = staff.name?.toLowerCase() || '';
            const phone = staff.phone?.toLowerCase() || '';
            const email = staff.email?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();

            return name.includes(query) || phone.includes(query) || email.includes(query);
        })
        : [];


    return (
        <Container maxWidth="lg">
            {loading ? (
                <Box>
                    <Skeleton variant="rectangular" width="100%" height={40}/>
                    <Skeleton variant="rectangular" width="100%" height={40} style={{marginTop: '16px'}}/>
                    <Skeleton variant="rectangular" width="100%" height={400} style={{marginTop: '16px'}}/>
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Alert severity="error">{error}</Alert>
                </Box>
            ) : (
                <>
                    <Box sx={{marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
                                            <IconButton aria-label="clear" onClick={handleClearSearch}>
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
                            style={{margin: '0 16px'}}
                        >
                            Add Staff
                        </Button>
                        <Tooltip title="Download all staff details">
                            <IconButton aria-label="download" color="primary" onClick={handleDownloadExcel}>
                                <FileDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Grid container>
                        <Grid item xs={12}>
                            <StaffList
                                staffList={filteredStaffList}
                                onEdit={handleEditStaff}
                                onDelete={handleDeleteStaff}
                                onView={handleViewStaff}
                            />
                        </Grid>
                    </Grid>

                    {/* Tabs for Teaching and Non-Teaching Staff */}
                    <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
                        <DialogTitle>{selectedStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
                        <DialogContent>


                            <StaffForm
                                staff={selectedStaff}
                                staffType={staffType} // Pass the selected staff type to the form
                                onSubmit={handleFormSubmit}
                                onCancel={() => setOpenForm(false)}
                            />


                        </DialogContent>
                    </Dialog>

                    <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="md">
                        <DialogTitle>Staff Details</DialogTitle>
                        <DialogContent>
                            {selectedStaff ? (
                                <Box>
                                    {/* Render the selectedStaff details */}
                                    {/* Details mapping logic */}
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

export default StaffPage;
