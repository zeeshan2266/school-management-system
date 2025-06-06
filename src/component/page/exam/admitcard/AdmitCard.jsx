import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import "./AdmitCard.css";
import {useSelector} from "react-redux";
import {api, selectSchoolDetails} from "../../../../common";
import {Pagination} from "@mui/lab";
import {useNavigate} from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";


const AdmitCard = ({exam}) => {
        const [activeTab, setActiveTab] = useState(0);
        const [admitCardData, setAdmitCardData] = useState([]);
        const [students, setStudents] = useState([]);
        const [examDetails, setExamDetails] = useState([]);
        const [exams, setExams] = useState([]);
        const userData = useSelector(selectSchoolDetails);
        const classSections = useSelector((state) => state.master.data.classSections);
        const schoolId = userData?.id;
        const session = userData?.session;
        const [selectedStudents, setSelectedStudents] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;
        const navigate = useNavigate(); // Use this for navigation to the print page
        const [searchCriteria, setSearchCriteria] = useState({
            className: "",
            section: "",
            name: "",
            admissionNo: "",
            studentName: "",
            session: "",
            studentId: "",
            schoolId: schoolId,
            session
        });
        const [selectedAdmitCards, setSelectedAdmitCards] = useState([]);
        useEffect(() => {
            api
                .get("/api/exams", {
                    params: {schoolId, session},
                })
                .then((response) => {
                    setExams(response.data);
                });
        }, []);
        const handleCriteriaChange = (event) => {
            const {name, value} = event.target;
            if (!name) {
                console.error("event.target.name is undefined");
                return;
            }
            setSearchCriteria((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };
        useEffect(() => {
            const fetchExamNames = async () => {
                try {
                    const {className, section, session} = searchCriteria;

                    // Fetch exams based on criteria or fetch all exams for the school
                    const response = await api.get('/api/exams', {
                        params: {
                            className: className || "",
                            section: section || "",
                            session: session || "",
                            schoolId,
                        },
                    });
                    console.log("Exam Details Response:", response.data);

                    if (response.data && response.data.length > 0) {
                        setExamDetails(response.data || []); // Populate exam dropdown
                    } else {
                        setExamDetails([]); // Clear if no data
                    }

                    // Fetch students if class or section are selected
                    if (className || section) {
                        const studentResponse = await api.get('/api/students/class/section/school/admit', {
                            params: {
                                className: className || "",
                                section: section || "",
                                schoolId,
                                session: session || "",
                            },
                        });

                        if (studentResponse.data && studentResponse.data.length > 0) {
                            setStudents(studentResponse.data); // Populate student list
                        } else {
                            setStudents([]); // Clear student list if no data
                        }
                    } else {
                        setStudents([]); // Clear students if no criteria
                    }
                } catch (error) {
                    console.error("Error fetching exam or student data:", error);
                }
            };

            fetchExamNames();
        }, [searchCriteria, schoolId]);

// Trigger only once when the module loads
        // useEffect(() => {
        //     const fetchExamNames = async () => {
        //         const { className, section, session } = searchCriteria;

        //         if (className && session || section) {
        //             try {
        //                 const response = await api.get('/api/exams/admit', {
        //                     params: {
        //                         className,
        //                         section,
        //                         session,
        //                         schoolId,
        //                     },
        //                 });

        //                 if (response.data && response.data.length > 0) {
        //                     setExamDetails(response.data);
        //                     const studentResponse = await api.get('/api/students/class/section/school/admit', {
        //                         params: {
        //                             className,
        //                             section,
        //                             schoolId, session
        //                         },
        //                     });
        //                     if (studentResponse.data && studentResponse.data.length > 0) {

        //                         setStudents(studentResponse.data);
        //                     }
        //                 }
        //             } catch
        //             (error) {
        //                 console.error("Error fetching exam names:", error);
        //             }
        //         }
        //     };

        //     fetchExamNames();
        // }, [searchCriteria.className, searchCriteria.section, searchCriteria.session, schoolId]
        // )
        //     ;
        const handleCheckboxChange = (student) => {
            setSelectedStudents((prevSelected) =>
                prevSelected.includes(student)
                    ? prevSelected.filter((s) => s !== student) // Remove student if already selected
                    : [...prevSelected, student] // Add student if not already selected
            );
        };
        // const handleCheckboxChange = (e, admitCard) => {
        //     if (e.target.checked) {
        //         setSelectedAdmitCards([...selectedAdmitCards, admitCard]);
        //     } else {
        //         setSelectedAdmitCards(selectedAdmitCards.filter(card => card.rollNumber !== admitCard.rollNumber));
        //     }
        // };
        const handleSelectAllChange = (e) => {
            if (e.target.checked) {
                // Select all students on the current page
                const allOnPage = paginatedStudents.filter((student) => !selectedStudents.includes(student));
                setSelectedStudents((prevSelected) => [...prevSelected, ...allOnPage]);
            } else {
                // Deselect all students on the current page
                const remainingStudents = selectedStudents.filter(
                    (student) => !paginatedStudents.includes(student)
                );
                setSelectedStudents(remainingStudents);
            }
        };

        // const handleSelectAllChange = (e) => {
        //     if (e.target.checked) {
        //         setSelectedAdmitCards(admitCardData);
        //     } else {
        //         setSelectedAdmitCards([]);
        //     }
        // };

        const handleReset = async () => {
            // Reset the search criteria
            setSearchCriteria({
                className: "",
                section: "",
                name: "",
                admissionNo: "",
                studentName: "",
                session: "",
                studentId: "",
                schoolId: schoolId, // Retain schoolId for API fetching
            });

            // Clear related states
            setStudents([]);
            setAdmitCardData([]);
            setSelectedAdmitCards([]);
            setSelectedStudents([]);

            // Fetch exam details for the dropdown
            try {
                const response = await api.get('/api/exams/admit', {
                    params: {schoolId}, // Fetch all exams for the school
                });

                if (response.data && response.data.length > 0) {
                    setExamDetails(response.data); // Populate exam dropdown
                } else {
                    setExamDetails([]); // Clear dropdown if no data
                }
            } catch (error) {
                console.error("Error fetching exam details after reset:", error);

                setExamDetails([]);
            }
        };


        const handleChangePage = (event, newPage) => {
            setCurrentPage(newPage);
        };

        // Handle student selection
        const handleSelectStudent = (student) => {
            setSelectedStudents((prevSelected) =>
                prevSelected.includes(student)
                    ? prevSelected.filter((s) => s !== student)
                    : [...prevSelected, student]
            );
        };

        // Handle print button click
        const handlePrint = () => {
            if (selectedStudents.length > 0) {
                // Navigate to the print page with selected students
                navigate('/exam/print', {state: {students: selectedStudents, exams: examDetails}});
            } else {
                alert('No students selected!');
            }
        };


        // Get the paginated students
        const paginatedStudents = students.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        const debounce = (func, delay) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => func(...args), delay);
            };
        };

        const handleGeneratePDF = () => {
            // Ensure that there are selected students
            if (selectedStudents.length === 0) {
                alert("No students selected!");
                return;
            }

            // Check for duplicate entries in selectedStudents
            const uniqueStudents = [...new Set(selectedStudents)];

            // Create a new jsPDF instance
            const doc = new jsPDF();

            uniqueStudents.forEach((student, index) => {
                if (index > 0) {
                    doc.addPage(); // Add a new page for every student except the first
                }

                // Header
                doc.setFontSize(18).setFont("helvetica", "bold");
                doc.text(userData?.name || "Board of Secondary Education", 105, 20, {
                    align: "center",
                });
                doc.setFontSize(14).text(
                    "HIGHER SECONDARY SCHOOL CERTIFICATE EXAMINATION (10+2)",
                    105,
                    30,
                    {align: "center"}
                );
                doc.text("ADMIT CARD", 105, 40, {align: "center"});
                // Student Details
                const detailsStartY = 50;
                doc.setFontSize(12).setFont("helvetica", "normal");
                doc.text(`Roll Number: ${student.rollNo || "N/A"}`, 10, detailsStartY);
                doc.text(`Candidate's Name: ${student.studentName || "N/A"}`, 10, detailsStartY + 10);
                doc.text(`Father's Name: ${student.fatherName || "N/A"}`, 10, detailsStartY + 20);
                doc.text(`D.O.B: ${student.dob || "N/A"}`, 10, detailsStartY + 30);
                doc.text(`Admission No: ${student.admissionNo || "N/A"}`, 105, detailsStartY);
                doc.text(`Class: ${student.className || "N/A"}`, 105, detailsStartY + 10);
                doc.text(`Section: ${student.section || "N/A"}`, 105, detailsStartY + 20);
                doc.text(`Gender: ${student.gender || "N/A"}`, 105, detailsStartY + 30);

                // Exam Details
                const studentExamDetails = examDetails.filter(
                    (exam) =>
                        exam.className === student.className &&
                        exam.section === student.section
                );

                if (studentExamDetails.length > 0) {
                    doc.text("Exam Details:", 10, detailsStartY + 40);
                    const tableData = studentExamDetails.flatMap((exam) =>
                        exam.subjects.map((subject) => [
                            subject.name || "N/A",
                            subject.startDate
                                ? new Date(subject.startDate).toLocaleDateString()
                                : "N/A",
                            subject.startDate
                                ? new Date(subject.startDate).toLocaleTimeString()
                                : "N/A",
                            subject.roomNo || "N/A",
                        ])
                    );

                    doc.autoTable({
                        startY: detailsStartY + 50,
                        head: [["Subject", "Date", "Time", "Hall Number"]],
                        body: tableData,
                        theme: "grid",
                        styles: {fontSize: 10, cellPadding: 3},
                    });
                } else {
                    doc.text("No Exam Details Available.", 10, detailsStartY + 40);
                }

                // Footer
                const footerY = doc.lastAutoTable.finalY + 20;
                doc.setFontSize(10).setFont("helvetica", "italic");
                doc.text("This is a system-generated admit card.", 105, footerY, {align: "center"});
            });

            // Save the final PDF
            doc.save("Admit_Cards.pdf");
        };

        const handleDebouncedGeneratePDF = debounce(handleGeneratePDF, 300);
        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                label="Select Class"
                                name="className"
                                value={searchCriteria.className || ""}
                                onChange={handleCriteriaChange}
                            >
                                {classSections && classSections.length > 0 ? (
                                    classSections.map((classSection) => (
                                        <MenuItem key={classSection.id} value={classSection.name}>
                                            {classSection.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Classes Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel>Section</InputLabel>
                            <Select
                                label="Section"
                                name="section"
                                value={searchCriteria.section || ""}
                                onChange={handleCriteriaChange}
                                disabled={!searchCriteria.className}
                            >
                                {classSections
                                    ?.find((cs) => cs.name === searchCriteria.className)?.sections?.length > 0 ? (
                                    classSections
                                        .find((cs) => cs.name === searchCriteria.className)
                                        .sections.map((section) => (
                                        <MenuItem key={section.id} value={section.name}>
                                            {section.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Sections Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/*     <Grid item xs={3}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Session Year</InputLabel>
                            <Select
                                name="session"
                                value={searchCriteria.session || ""}
                                onChange={handleCriteriaChange}
                                label="Session Year"
                            >
                                {session.map((session) => (
                                    <MenuItem key={session} value={session}>
                                        {session}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>*/}
                    <Grid item xs={2}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Exam Name</InputLabel>
                            <Select
                                label="Exam Name"
                                name="name"
                                value={searchCriteria.name || ""}
                                onChange={handleCriteriaChange}
                            >
                                {examDetails.length > 0 ? (
                                    examDetails.map((exam) => (
                                        <MenuItem key={exam.id} value={exam.name}>
                                            {exam.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Exam Available
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" color="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
                <Paper elevation={3} className="admit-card-display-paper">
                    <Typography variant="h6">Select Admit Cards for Printing</Typography>
                    {/* <FormControlLabel
                        control={<Checkbox onChange={handleSelectAllChange}/>}
                        label="Select All"
                    /> */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={
                                    paginatedStudents.length > 0 &&
                                    paginatedStudents.every((student) => selectedStudents.includes(student))
                                }
                                indeterminate={
                                    paginatedStudents.some((student) => selectedStudents.includes(student)) &&
                                    !paginatedStudents.every((student) => selectedStudents.includes(student))
                                }
                                onChange={handleSelectAllChange}
                            />
                        }
                        label="Select All"
                    />
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Select</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Section</TableCell>
                                    <TableCell>Roll Number</TableCell>

                                    <TableCell>Admission No</TableCell>
                                    <TableCell>Father Name</TableCell>
                                    <TableCell>Gender</TableCell>
                                    {/* Add more columns as necessary */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedStudents.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedStudents.includes(student)}
                                                onChange={() => handleSelectStudent(student)}
                                            />
                                        </TableCell>
                                        <TableCell>{student.studentName}</TableCell>
                                        <TableCell>{student.className}</TableCell>
                                        <TableCell>{student.section}</TableCell>
                                        <TableCell>{student.rollNo}</TableCell>
                                        <TableCell>{student.admissionNo}</TableCell>
                                        <TableCell>{student.fatherName}</TableCell>
                                        <TableCell>{student.gender}</TableCell>

                                        {/* Render more cells as necessary */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    <Pagination
                        count={Math.ceil(students.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        sx={{marginTop: 2}}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDebouncedGeneratePDF}
                        sx={{marginTop: 2}}
                    >
                        Print Selected
                    </Button>
                </Paper>
            </Container>
        );
    }
;

export default AdmitCard;