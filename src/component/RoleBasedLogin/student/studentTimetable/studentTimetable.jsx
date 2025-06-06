import React, {useEffect, useState} from 'react';
import {
    Box,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {api, selectSchoolDetails} from '../../../../common';
import DownloadIcon from "@mui/icons-material/Download";
import {styled} from "@mui/system";
import {useSelector} from "react-redux";
import {Search} from "@material-ui/icons";
import * as XLSX from "xlsx";

const TimeTableForm = () => {
    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector(state => state.master.data.classSections || []);
    const staffList = useSelector(state => state.master.data.staff || []);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [timeTables, setTimeTables] = useState([]); // State to hold list of time tables
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [selectedClassName, setSelectedClassName] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    // Fetch time tables on component mount
    useEffect(() => {
        fetchTimeTables();
    }, []);

    const fetchTimeTables = async () => {
        try {
            const response = await api.get('/api/timetable', {
                params: {schoolId, session}
            });
            setTimeTables(response.data);
        } catch (error) {
            console.error('Error fetching time tables:', error);
        }
    };

    const handleDelete = async id => {
        if (window.confirm('Are you sure you want to delete this time table?')) {
            try {
                await api.delete(`/api/timetable/${id}`);
                alert('Time table deleted successfully!');
                fetchTimeTables(); // Refresh the list after deleting
            } catch (error) {
                console.error('Error deleting time table:', error);
            }
        }
    };

    const handleDownload = () => {
        try {
            const data = filteredTimeTables.map(table => ({
                Class: table.className,
                Section: table.section,
                Teacher: table.teacher,
                Day: table.day,
                Subject: table.subject,
                Period: table.periods,
                'Time From': `${table.timeFrom.hours}:${table.timeFrom.minutes} ${table.timeFrom.period}`,
                'Time To': `${table.timeTo.hours}:${table.timeTo.minutes} ${table.timeTo.period}`
            }));
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetables');
            const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
            const blob = new Blob([wbout], {type: 'application/octet-stream'});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'timetables.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading time tables:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClassChange = (event) => {
        const className = event.target.value;
        setSelectedClassName(className);
        setSelectedSection('');
    };

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    const handleTeacherChangeBySearch = (event) => {
        setSelectedTeacher(event.target.value);
    };

    const filteredTimeTables = timeTables.filter((table) => {
        const matchesClassName = selectedClassName ? table.className?.toLowerCase() === selectedClassName.toLowerCase() : true;
        const matchesSection = selectedSection ? table.section?.toLowerCase() === selectedSection.toLowerCase() : true;
        const matchesTeacher = selectedTeacher ? table.teacher?.toLowerCase() === selectedTeacher.toLowerCase() : true;
        const matchesSearchQuery = searchQuery
            ? (table.className?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (table.section?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (table.teacher?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (table.day?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (table.periods?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            : true;

        return matchesClassName && matchesSection && matchesTeacher && matchesSearchQuery;
    });

    return (
        <Box sx={{padding: 4}}>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                sx={{mb: 2}}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search/>
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Class</InputLabel>
                        <Select
                            name="className"
                            value={selectedClassName}
                            onChange={handleClassChange}
                            label="Class"
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

                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Section</InputLabel>
                        <Select
                            name="section"
                            value={selectedSection}
                            onChange={handleSectionChange}
                            label="Section"
                        >
                            {classSections?.find(cs => cs.name === selectedClassName)?.sections?.length > 0 ? (
                                classSections
                                    .find(cs => cs.name === selectedClassName)
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

                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Teacher</InputLabel>
                        <Select
                            name="teacher"
                            value={selectedTeacher}
                            onChange={handleTeacherChangeBySearch}
                            label="Teacher"
                            required
                        >
                            {staffList.map((staff) => (
                                <MenuItem key={staff.id} value={staff.name}>
                                    {`${staff.name} (${staff.post})`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <StyledTableContainer component={Paper} style={{maxHeight: 400, overflowY: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Class</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Section</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Teacher</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Day</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Subject</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Period</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Time From</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Time To</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Date</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Task</StyledTableCell>
                            <StyledTableCell style={{fontWeight: 'bold'}}>Actions</StyledTableCell>
                            <StyledTableCell>
                                <Tooltip title="Download as Excel">
                                    <StyledIconButton onClick={handleDownload} style={{color: '#1976d2'}}>
                                        <DownloadIcon/>
                                    </StyledIconButton>
                                </Tooltip>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTimeTables.map(table => (
                            <TableRow key={table.id}>
                                <TableCell>{table.className}</TableCell>
                                <TableCell>{table.section}</TableCell>
                                <TableCell>{table.teacher}</TableCell>
                                <TableCell>{table.day}</TableCell>
                                <TableCell>{table.subject}</TableCell>
                                <TableCell>{table.periods}</TableCell>
                                <TableCell>{`${table.timeFrom.hours}:${table.timeFrom.minutes} ${table.timeFrom.period}`}</TableCell>
                                <TableCell>{`${table.timeTo.hours}:${table.timeTo.minutes} ${table.timeTo.period}`}</TableCell>
                                <TableCell>{table.today}</TableCell>
                                <TableCell>{table.task}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(table.id)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </Box>
    );
};

export default TimeTableForm;

const StyledTableContainer = styled(TableContainer)`
    margin-top: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
`;

const StyledTableCell = styled(TableCell)`
    font-weight: bold;
    background-color: #004d40;
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #00695c;
    }
`;

const StyledIconButton = styled(IconButton)`
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
        transform: scale(1.1);
        color: #004d40;
    }
`;