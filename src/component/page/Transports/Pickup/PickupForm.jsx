import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem
} from "@mui/material";
import dayjs from "dayjs";

const PickupForm = ({ pickup, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    rollNumber: "",
    className: "",
    section: "",
    classTeacher: "",
    parentId: "",
    fatherName: "",
    motherName: "",
    guardianName: "",
    parentContactNumber: "",
    authorizedPersonName: "",
    relationship: "",
    contactNumber: "",
    idProofType: "Aadhar",
    idProofNumber: "",
    isOneTime: true,
    validFrom: dayjs().format("YYYY-MM-DDTHH:mm"),
    validUntil: dayjs().add(1, 'day').format("YYYY-MM-DDTHH:mm"),
    active: true
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const idProofTypes = ["Aadhar", "PAN", "Driving License", "Passport", "Other"];
  const relationships = ["Parent", "Relative", "Family Friend", "Driver", "Other"];

  useEffect(() => {
    if (pickup) {
      setFormData({
        ...pickup,
        // Convert numbers to strings for form inputs
        studentId: pickup.studentId?.toString() || "",
        parentId: pickup.parentId?.toString() || "",
        // Format dates
        validFrom: pickup.validFrom ? dayjs(pickup.validFrom).format("YYYY-MM-DDTHH:mm") : "",
        validUntil: pickup.validUntil ? dayjs(pickup.validUntil).format("YYYY-MM-DDTHH:mm") : ""
      });
    }
  }, [pickup]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle numeric fields
    let processedValue = value;
    if (name === 'studentId' || name === 'parentId') {
      processedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    validateField(name, type === 'checkbox' ? checked : processedValue);
  };

  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'studentId':
        if (!value) error = "Student ID is required";
        else if (!/^\d+$/.test(value)) error = "Must be a valid number";
        break;
      case 'studentName':
        if (!value.trim()) error = "Student name is required";
        break;
      case 'authorizedPersonName':
        if (!value.trim()) error = "Authorized person name is required";
        break;
      case 'contactNumber':
        if (!/^\d{10}$/.test(value)) error = "Invalid 10-digit phone number";
        break;
      case 'validUntil':
        if (dayjs(value).isBefore(formData.validFrom)) {
          error = "Must be after start date";
        }
        break;
      case 'parentContactNumber':
        if (value && !/^\d{10}$/.test(value)) error = "Invalid 10-digit phone number";
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const fieldsToValidate = [
      'studentId', 
      'studentName',
      'authorizedPersonName',
      'contactNumber',
      'validUntil'
    ];

    const newErrors = fieldsToValidate.reduce((acc, field) => {
      acc[field] = validateField(field, formData[field]);
      return acc;
    }, {});

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const cleanFormData = (data) => {
    const cleaned = { ...data };

    // Convert numbers
    cleaned.studentId = parseInt(data.studentId, 10);
    cleaned.parentId = data.parentId ? parseInt(data.parentId, 10) : null;

    // Convert dates to ISO
    cleaned.validFrom = new Date(data.validFrom).toISOString();
    cleaned.validUntil = new Date(data.validUntil).toISOString();

    // Convert empty strings to null for optional fields
    const optionalFields = [
      'rollNumber', 'className', 'section', 'classTeacher',
      'fatherName', 'motherName', 'guardianName', 'parentContactNumber',
      'idProofNumber'
    ];

    optionalFields.forEach(field => {
      cleaned[field] = cleaned[field]?.trim() || null;
    });

    return cleaned;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError("");
  
  if (!validateForm()) return;

  try {
    const submissionData = {
      ...formData,
      studentId: Number(formData.studentId),
      parentId: formData.parentId ? Number(formData.parentId) : null,
      // Convert dates to ISO format without milliseconds
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString()
    };

    await onSubmit(submissionData);
    
    // ... success handling ...
  } catch (error) {
    setServerError(error.message || "Submission failed. Please try again.");
  }
};

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {pickup?.id ? "Edit" : "New"} Pickup Authorization
        </Typography>

        {/* Display server errors */}
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Student Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              error={!!errors.studentId}
              helperText={errors.studentId}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Student Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              error={!!errors.studentName}
              helperText={errors.studentName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class Name"
              name="className"
              value={formData.className}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class Teacher"
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleChange}
            />
          </Grid>

          {/* Parent Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mother's Name"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Guardian's Name"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Parent Contact Number"
              name="parentContactNumber"
              value={formData.parentContactNumber}
              onChange={handleChange}
              error={!!errors.parentContactNumber}
              helperText={errors.parentContactNumber}
              inputProps={{ inputMode: 'tel', pattern: '[0-9]{10}' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Parent ID (optional)"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>

          {/* Authorized Person Details */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Authorized Person Name"
              name="authorizedPersonName"
              value={formData.authorizedPersonName}
              onChange={handleChange}
              error={!!errors.authorizedPersonName}
              helperText={errors.authorizedPersonName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
            >
              {relationships.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              inputProps={{ inputMode: 'tel', pattern: '[0-9]{10}' }}
            />
          </Grid>

          {/* ID Proof Details */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="ID Proof Type"
              name="idProofType"
              value={formData.idProofType}
              onChange={handleChange}
            >
              {idProofTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Proof Number"
              name="idProofNumber"
              value={formData.idProofNumber}
              onChange={handleChange}
            />
          </Grid>

          {/* Validity Dates */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid From"
              type="datetime-local"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid Until"
              type="datetime-local"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              error={!!errors.validUntil}
              helperText={errors.validUntil}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Checkboxes */}
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox
                name="isOneTime"
                checked={formData.isOneTime}
                onChange={handleChange}
              />}
              label="One-time Authorization"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />}
              label="Active"
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Grid item>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              {pickup?.id ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PickupForm;