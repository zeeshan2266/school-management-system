import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Box, Button, Grid, IconButton, InputAdornment, Skeleton, TextField, Tooltip, Typography,} from "@mui/material";
import {fetchEnquiries} from "./redux/enquiryActions.js";
import AddEnquiryForm from "./AddEnquiryForm";
import * as XLSX from "xlsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ClearIcon from "@mui/icons-material/Clear";
import EnquiryTable from "./EnquiryTable";
import {selectSchoolDetails} from "../../../common";

export const Enquiry = () => {
    const dispatch = useDispatch();
    const {enquiries, loading, error} = useSelector((state) => state.enquiries);
    const [searchQuery, setSearchQuery] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        if (schoolId && session) {
            dispatch(fetchEnquiries(schoolId, session)); // Pass schoolId and session
        }
    }, [dispatch, schoolId, session]);
    // Ensure enquiries is an array before filtering
    const filteredEnquiries = Array.isArray(enquiries)
        ? enquiries.filter((enquiry) => {
            const name = enquiry.firstName?.toLowerCase().trim() || "";
            //const parentsName = enquiry.fatherName?.toLowerCase().trim() || '';
            const fatherName = enquiry.fatherName?.toLowerCase().trim() || ""; // Add father's name
            const motherName = enquiry.motherName?.toLowerCase().trim() || "";
            const phoneNumber = enquiry.phoneNumber.toString().trim() || "";
            const query = searchQuery.toLowerCase().trim();

            return (
                name.includes(query) ||
                fatherName.includes(query) ||
                motherName.includes(query) ||
                // parentsName.includes(query) ||
                phoneNumber.includes(query)
            );
        })
        : [];
    console.log("filteredEnquries", filteredEnquiries);
    console.log("loading", loading);
    console.log("error", error);

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredEnquiries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
        XLSX.writeFile(workbook, "enquiries.xlsx");
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };
    const highlightText = (text, query) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, "gi")); // Split text into matching and non-matching parts
        return parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span
                        key={index}
                        style={{backgroundColor: "yellow", fontWeight: "bold"}}
                    >
          {part}
        </span>
                ) : (
                    part
                )
        );
    };
    return (
        <Box sx={{p: 2}}>
            <Grid container alignItems="center" spacing={2}>
                {/* Search Bar */}
                <Grid item xs={12} sm={8} md={7}>
                    <TextField
                        label="Search By Name, Parents Name, And Phone Number"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && dispatch(fetchEnquiries(schoolId, session))
                        }
                        sx={{
                            mb: 1, // Adds 2px margin to the bottom
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear search"
                                        onClick={handleClearSearch}
                                        edge="end"
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Add New Enquiry Button */}
                <Grid item xs={6} sm={2} md={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => setOpenForm(true)}
                        sx={{
                            height: "100%", // Keeps height consistent with the search bar
                            maxWidth: "150px", // Further reduced width
                            fontSize: "0.875rem", // Slightly smaller text for a compact look
                            paddingX: 1.5, // Reduced padding for better spacing
                        }}
                    >
                        Add Enquiry
                    </Button>
                </Grid>

                {/* Download Icon */}
                <Grid item xs={6} sm={2} md={2}>
                    <Tooltip title="Download as Excel">
                        <IconButton
                            aria-label="download"
                            color="primary"
                            onClick={handleDownloadExcel}
                            sx={{
                                width: "40px", // Reduced button width
                                height: "40px", // Ensures a consistent square shape
                                borderRadius: 2, // Optional: Slightly rounded corners
                            }}
                        >
                            <FileDownloadIcon/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            {/* Conditional Rendering for Data Loading/Error/Table */}
            {loading ? (
                <Box>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                        style={{marginBottom: "16px"}}
                    />
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                        style={{marginBottom: "16px"}}
                    />
                    <Skeleton variant="rectangular" width="100%" height={400}/>
                </Box>
            ) : error ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <Typography color="error">Error: {error}</Typography>
                </Box>
            ) : (
                <Box>
                    <EnquiryTable
                        filteredEnquiries={filteredEnquiries.map((enquiry) => ({
                            ...enquiry,
                            firstName: highlightText(enquiry.firstName || "", searchQuery),
                            fatherName: highlightText(enquiry.fatherName || "", searchQuery),
                            motherName: highlightText(enquiry.motherName || "", searchQuery),
                            phoneNumber: highlightText(
                                enquiry.phoneNumber.toString() || "",
                                searchQuery
                            ),
                        }))}
                    />
                </Box>
            )}

            {/* Add Enquiry Form */}
            <AddEnquiryForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                refreshData={() => dispatch(fetchEnquiries(schoolId, session))}
            />
        </Box>
    );
};
