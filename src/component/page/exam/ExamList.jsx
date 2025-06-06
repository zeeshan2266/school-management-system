import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {motion} from "framer-motion";
import {api, selectSchoolDetails} from "../../../common";
import {useSelector} from "react-redux";

const localizer = momentLocalizer(moment);

const ExamList = ({onEditExam, onDelete, exam}) => {
    const [exams, setExams] = useState([]);
    const [view, setView] = useState("list");
    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    useEffect(() => {
        api
            .get("/api/exams", {
                params: {schoolId, session},
            })
            .then((response) => {
                setExams(response.data);
            });
    }, []);
    const toIST = (utcDate) => {
        return new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(new Date(utcDate));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) {
            return;
        }

        api.delete(`/api/exams/${id}`)
            .then(() => {
                setExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
                alert("Exam deleted successfully");
            })
            .catch((error) => {
                console.error("Failed to delete the exam:", error);
                alert("Failed to delete the exam. Please try again.");
            });
    };

    const renderTable = () => (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{bgcolor: "#f5f5f5"}}>
                        <TableRow>
                            <TableCell>Exam Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Start Date & Time</TableCell>
                            <TableCell>End Date & Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Exam Hall</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell>{exam.name}</TableCell>
                                <TableCell>{exam.type}</TableCell>
                                <TableCell>{exam.className}</TableCell>
                                <TableCell>{exam.section}</TableCell>

                                <TableCell>
                                    {moment.utc(exam.startDateTime).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm A")}
                                </TableCell>
                                <TableCell>
                                    {moment.utc(exam.endDateTime).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm A")}
                                </TableCell>
                                {/*      <TableCell>
                                    {moment(exam.startDateTime).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm A")}
                                </TableCell>
                                <TableCell>
                                    {moment(exam.endDateTime).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm A")}
                                </TableCell>*/}
                                <TableCell>{exam.duration} minutes</TableCell>
                                <TableCell>{exam.examHall}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onEditExam(exam)}
                                        >
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(exam.id)}>
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </motion.div>
    );

    const renderCalendar = () => (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <Calendar
                localizer={localizer}
                events={exams.map((exam) => ({
                    title: `${exam.name} (${exam.type})`,
                    start: new Date(exam.startDateTime),
                    end: new Date(
                        moment(exam.startDateTime)
                            .add(exam.duration, "minutes")
                            .toISOString()
                    ),
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{height: 500, marginTop: 20}}
            />
        </motion.div>
    );

    return (
        <Box sx={{padding: 2}}>
            <Grid container justifyContent="flex-end" sx={{marginBottom: 2}}>
                <Button
                    variant={view === "list" ? "contained" : "outlined"}
                    onClick={() => setView("list")}
                    sx={{marginRight: 1}}
                >
                    List View
                </Button>
                <Button
                    variant={view === "calendar" ? "contained" : "outlined"}
                    onClick={() => setView("calendar")}
                >
                    Calendar View
                </Button>
            </Grid>
            {view === "list" ? renderTable() : renderCalendar()}
        </Box>
    );

};

export default ExamList;
