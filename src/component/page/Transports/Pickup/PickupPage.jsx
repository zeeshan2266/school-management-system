import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPickupAuthorization,
  deletePickupAuthorization,
  fetchPickupAuthorizations,
} from './redux/PickupAction';
import PickupList from './PickupList';
import PickupForm from "./PickupForm";
import * as XLSX from 'xlsx';
import ClearIcon from '@mui/icons-material/Clear';
import { selectSchoolDetails } from "../../../../common";

const PickupPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const userData = useSelector(selectSchoolDetails);
  const schoolId = userData?.id;
  const { pickupAuthorizations, loading, error } = useSelector((state) => state.pickups);
console.log("authperoization",pickupAuthorizations)
  useEffect(() => {
    if (schoolId) {
      dispatch(fetchPickupAuthorizations());
    }
  }, [dispatch, schoolId]);

  const handleAddAuthorization = () => {
    setSelectedAuth(null);
    setOpenForm(true);
  };

  const handleClearSearch = () => setSearchQuery('');

  const handleEditAuthorization = (auth) => {
    setSelectedAuth(auth);
    setOpenForm(true);
  };

  const handleViewAuthorization = (auth) => {
    setSelectedAuth(auth);
    setOpenDetails(true);
  };

  const handleFormSubmit = (formData) => {
    const operation = formData.id 
      ? dispatch(createPickupAuthorization({...formData, id: formData.id}))
      : dispatch(createPickupAuthorization(formData));

    operation
      .then(() => dispatch(fetchPickupAuthorizations()))
      .catch((error) => console.error("Operation failed:", error));

    setOpenForm(false);
  };

  const handleDownloadExcel = () => {
    const filteredData = pickupAuthorizations.map(auth => ({
      studentId: auth.studentId,
      studentName: auth.studentName,
      authorizedPerson: auth.authorizedPersonName,
      relationship: auth.relationship,
      contactNumber: auth.contactNumber,
      validFrom: new Date(auth.validFrom).toLocaleDateString(),
      validUntil: new Date(auth.validUntil).toLocaleDateString(),
      status: auth.active ? "Active" : "Inactive"
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pickups');
    XLSX.writeFile(workbook, 'pickup_authorizations.xlsx');
  };

  const filteredAuthorizations = pickupAuthorizations?.filter(auth => {
    const searchLower = searchQuery.toLowerCase();
    return (
      auth.studentName.toLowerCase().includes(searchLower) ||
      auth.authorizedPersonName.toLowerCase().includes(searchLower) ||
      auth.contactNumber.includes(searchLower)
    );
  }) || [];

  const getStatus = (validUntil, active) => {
    if (!active) return "Inactive";
    return new Date(validUntil) > new Date() ? "Active" : "Expired";
  };

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" width="100%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={40} style={{ marginTop: '16px' }} />
          <Skeleton variant="rectangular" width="100%" height={400} style={{ marginTop: '16px' }} />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            marginBottom: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 2
          }}>
            <TextField
              label="Search by Student or Authorized Person"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="search">
                      <SearchIcon />
                    </IconButton>
                    {searchQuery && (
                      <IconButton aria-label="clear" onClick={handleClearSearch}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAuthorization}
            >
              Add Authorization
            </Button>
            <Tooltip title="Download all authorizations">
              <IconButton color="primary" onClick={handleDownloadExcel}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container>
            <Grid item xs={12}>
              <PickupList
                pickupAuthorizations={filteredAuthorizations}
                onEdit={handleEditAuthorization}
                onView={handleViewAuthorization}
              />
            </Grid>
          </Grid>

          <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
            <DialogTitle>{selectedAuth ? 'Edit Authorization' : 'New Authorization'}</DialogTitle>
            <DialogContent>
              <PickupForm
                pickup={selectedAuth}
                onSubmit={handleFormSubmit}
                onCancel={() => setOpenForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="md">
            <DialogTitle>Authorization Details</DialogTitle>
            <DialogContent>
              {selectedAuth ? (
                <Table>
                  <TableBody>
                    {[
                      { label: "Student", value: `${selectedAuth.studentName} (ID: ${selectedAuth.studentId})` },
                      { label: "Authorized Person", value: `${selectedAuth.authorizedPersonName} (${selectedAuth.relationship})` },
                      { label: "Contact", value: `${selectedAuth.contactNumber}` },
                      { label: "ID Proof", value: `${selectedAuth.idProofType}: ${selectedAuth.idProofNumber}` },
                      { label: "Validity", value: `${new Date(selectedAuth.validFrom).toLocaleDateString()} - ${new Date(selectedAuth.validUntil).toLocaleDateString()}` },
                      { label: "Status", value: getStatus(selectedAuth.validUntil, selectedAuth.active) },
                      { label: "One-Time", value: selectedAuth.isOneTime ? "Yes" : "No" }
                    ].map((item) => (
                      <TableRow key={item.label}>
                        <TableCell><strong>{item.label}</strong></TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default PickupPage;