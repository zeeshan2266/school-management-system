import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    InputAdornment,
    Modal,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import VehicleForm from "./VehicleForm";
import RouteForm from "./RouteForm";
import RouteDetailsModal from "./RouteDetailsModal";
import {deleteVehicle, fetchVehicles} from "./redux/vehicleActions";
import * as XLSX from "xlsx";
import {useNavigate} from "react-router-dom";
import {selectSchoolDetails} from "../../../../common";

const Vehicles = () => {
    const dispatch = useDispatch();
    const {vehicles, loading, error} = useSelector((state) => state.vehicles);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRouteDetailsModalOpen, setIsRouteDetailsModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        setVehicleToDelete(id);
        setSelectedVehicle(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVehicle(null);
    };
    const handleToastDelete = () => {
        if (vehicleToDelete) {
            dispatch(deleteVehicle(vehicleToDelete))
                .then(() => {
                    toast.success("Vehicle's list deleted successfully.");
                    handleClose();
                })
                .catch((error) => {
                    console.error("Error deleting vehicle:", error);
                    toast.error("Failed to delete the vehicle. Please try again.");
                    handleClose();
                });
        }
    };
    const navigate = useNavigate();
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchVehicles(schoolId, session));
        }
    }, [dispatch, schoolId, session]);

    const handleEditVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsVehicleModalOpen(true);
    };

    const handleViewVehicle = (vehicle) => {
        navigate(`/transport/${vehicle.id}`);
    };

    const handleEditRoute = (route) => {
        setSelectedRoute(route);
        setIsRouteModalOpen(true);
    };

    const handleDeleteRoute = (id) => {
        // Implement delete route functionality
    };

    const handleViewRoute = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsRouteDetailsModalOpen(true);
    };

    const handleCloseVehicleModal = () => {
        setSelectedVehicle(null);
        setIsVehicleModalOpen(false);
    };

    const handleCloseRouteModal = () => {
        setSelectedRoute(null);
        setIsRouteModalOpen(false);
    };

    const handleCloseDetailsModal = () => {
        setSelectedVehicle(null);
        setIsDetailsModalOpen(false);
    };

    const handleCloseRouteDetailsModal = () => {
        setSelectedVehicle(null);
        setIsRouteDetailsModalOpen(false);
    };

    const handleSaveVehicle = () => {
        dispatch(fetchVehicles(schoolId, session));
        handleCloseVehicleModal();
    };

    const handleSaveRoute = () => {
        dispatch(fetchVehicles(schoolId, session));
        handleCloseRouteModal();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleDownloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            vehicles.map((vehicle) => ({
                "Reg. Number": vehicle.regNumber,
                "Vehicle Type": vehicle.vehicleType,
                "Vehicle Name": vehicle.vehicleName,
                "No. of Seats": vehicle.noOfSeats,
                "Driver Name": vehicle.driverName,
                Phone: vehicle.phone,
                Routes: vehicle.routes.map((route) => `${route.origin}`).join(", "),
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vehicles");
        XLSX.writeFile(wb, "Vehicles.xlsx");
    };

    const filteredVehicles = vehicles.filter(
        (vehicle) =>
            (vehicle.regNumber &&
                vehicle.regNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (vehicle.driverName &&
                vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (vehicle.phone && vehicle.phone.includes(searchTerm)) ||
            (vehicle.routes &&
                vehicle.routes.some(
                    (route) =>
                        route.origin &&
                        route.origin.toLowerCase().includes(searchTerm.toLowerCase())
                ))
    );

    return (
        <>
            <Container>
                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by Vehicle ID, Driver Name, Phone, Route"
                        variant="outlined"
                        size="medium"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch}>
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{flexGrow: 1, mr: 2}} // Margin right for spacing
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsVehicleModalOpen(true)}
                        sx={{mr: 2}}
                    >
                        Add Vehicle
                    </Button>
                    <Tooltip title="Download Excel" arrow>
                        <IconButton onClick={handleDownloadExcel} color="primary">
                            <DownloadIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
                <TableContainer component={Paper} sx={{height: 520}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: "bold"}}>
                                    Reg. Number
                                </TableCell>
                                <TableCell style={{fontWeight: "bold"}}>
                                    Vehicle Type
                                </TableCell>
                                <TableCell style={{fontWeight: "bold"}}>
                                    Vehicle Name
                                </TableCell>
                                <TableCell style={{fontWeight: "bold"}}>
                                    No. of Seats
                                </TableCell>
                                <TableCell style={{fontWeight: "bold", textAlign: "center"}}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton variant="text"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text"/>
                                        </TableCell>
                                        <TableCell style={{textAlign: "center"}}>
                                            <Skeleton variant="rectangular" width={100} height={30}/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredVehicles.length > 0 ? (
                                filteredVehicles.map((vehicle) => (
                                    <React.Fragment key={vehicle.id}>
                                        <TableRow>
                                            <TableCell>{vehicle.regNumber}</TableCell>
                                            <TableCell>{vehicle.vehicleType}</TableCell>
                                            <TableCell>{vehicle.vehicleName}</TableCell>
                                            <TableCell>{vehicle.noOfSeats}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>
                                                <Tooltip title="View Details" arrow>
                                                    <IconButton
                                                        onClick={() => handleViewVehicle(vehicle)}
                                                        color="primary"
                                                    >
                                                        <VisibilityIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton
                                                        onClick={() => handleEditVehicle(vehicle)}
                                                        color="secondary"
                                                    >
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        onClick={() => handleClickOpen(vehicle.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedVehicle(vehicle);
                                                        setIsRouteModalOpen(true);
                                                    }}
                                                    sx={{mr: 1}}
                                                >
                                                    {" "}
                                                    {/* Added margin-right */}
                                                    Add Route
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleViewRoute(vehicle)}
                                                >
                                                    Show Routes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No vehicles found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {isVehicleModalOpen && (
                    <VehicleForm
                        vehicle={selectedVehicle || {}}
                        open={isVehicleModalOpen}
                        onClose={handleCloseVehicleModal}
                        onSave={handleSaveVehicle}
                    />
                )}
                {isRouteModalOpen && (
                    <RouteForm
                        route={selectedRoute || {}}
                        open={isRouteModalOpen}
                        onClose={handleCloseRouteModal}
                        onSave={handleSaveRoute}
                        vehicleId={selectedVehicle?.id}
                    />
                )}
                {isDetailsModalOpen && (
                    <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
                        <Box sx={{...modalStyle}}>
                            <Typography variant="h6" component="h2">
                                Vehicle Details
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                <strong>Reg. Number:</strong> {selectedVehicle?.regNumber}
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                <strong>Vehicle Type:</strong> {selectedVehicle?.vehicleType}
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                <strong>Vehicle Name:</strong> {selectedVehicle?.vehicleName}
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                <strong>No. of Seats:</strong> {selectedVehicle?.noOfSeats}
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                <strong>Routes:</strong>
                            </Typography>
                            {selectedVehicle?.routes?.map((route) => (
                                <Typography key={route.id} sx={{mt: 1}}>
                                    {route.origin} to {route.destination}
                                </Typography>
                            ))}
                        </Box>
                    </Modal>
                )}
                {isRouteDetailsModalOpen && (
                    <RouteDetailsModal
                        open={isRouteDetailsModalOpen}
                        onClose={handleCloseRouteDetailsModal}
                        vehicle={selectedVehicle}
                        onEditRoute={handleEditRoute}
                        onDeleteRoute={handleDeleteRoute}
                    />
                )}
            </Container>
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

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default Vehicles;
