import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip
} from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { deletePickupAuthorization } from "./redux/PickupAction";

const rowColors = ["#f5f5f5", "#ffffff"];

const PickupList = ({ pickupAuthorizations, onEdit, onView }) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [authToDelete, setAuthToDelete] = useState(null);
// const {pickupAuthorizations}=useSelector
  const handleOpenModal = (id) => {
    setAuthToDelete(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAuthToDelete(null);
  };

  const handleDelete = () => {
    if (authToDelete) {
      dispatch(deletePickupAuthorization(authToDelete))
        .then(() => {
          toast.success("Authorization deleted successfully");
          handleCloseModal();
        })
        .catch((error) => {
          toast.error("Failed to delete authorization");
          handleCloseModal();
        });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatus = (validUntil, active) => {
    if (!active) return { label: "Inactive", color: "error" };
    const now = new Date();
    return new Date(validUntil) > now 
      ? { label: "Active", color: "success" }
      : { label: "Expired", color: "warning" };
  };

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 520 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Student</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Authorized Person</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Validity Dates</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pickupAuthorizations.map((auth, index) => (
              <TableRow
                key={auth.id}
                style={{ backgroundColor: rowColors[index % rowColors.length] }}
              >
                <TableCell>
                  <div>{auth.studentName}</div>
                  <small>ID: {auth.studentId}</small>
                </TableCell>
                <TableCell>
                  <div>{auth.authorizedPersonName}</div>
                  <small>{auth.relationship}</small>
                </TableCell>
                <TableCell>
                  <div>{auth.contactNumber}</div>
                  <small>{auth.idProofType}: {auth.idProofNumber}</small>
                </TableCell>
                <TableCell>
                  {formatDate(auth.validFrom)} - {formatDate(auth.validUntil)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatus(auth.validUntil, auth.active).label}
                    color={getStatus(auth.validUntil, auth.active).color}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details" arrow>
                    <IconButton
                      onClick={() => onView(auth)}
                      color="primary"
                      sx={{ marginRight: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Authorization" arrow>
                    <IconButton
                      onClick={() => onEdit(auth)}
                      color="secondary"
                      sx={{ marginRight: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Authorization" arrow>
                    <IconButton
                      onClick={() => handleOpenModal(auth.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Authorization?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this pickup authorization?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
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

export default PickupList;