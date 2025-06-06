import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Fade,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {api, selectSchoolDetails} from '../../../common';
import DownloadIcon from "@mui/icons-material/Download";
import {styled} from "@mui/system";
import {useSelector} from "react-redux";
import {Search} from "@material-ui/icons";
import * as XLSX from "xlsx";

const TimePicker = ({label, value, onChange}) => {
    const hours = [...Array(12).keys()].map(i => String(i + 1).padStart(2, '0')); // 01 to 12
    const minutes = ['00', '15', '30', '45']; // Quarter-hour increments
    const periods = ['AM', 'PM']; // AM/PM

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel>{label} Hours</InputLabel>
                    <Select
                        value={value.hours}
                        onChange={e => onChange({...value, hours: e.target.value})}
                    >
                        {hours.map(hour => (
                            <MenuItem key={hour} value={hour}>
                                {hour}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel>{label} Minutes</InputLabel>
                    <Select
                        value={value.minutes}
                        onChange={e => onChange({...value, minutes: e.target.value})}
                    >
                        {minutes.map(minute => (
                            <MenuItem key={minute} value={minute}>
                                {minute}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel>{label} Period</InputLabel>
                    <Select
                        value={value.period}
                        onChange={e => onChange({...value, period: e.target.value})}
                    >
                        {periods.map(period => (
                            <MenuItem key={period} value={period}>
                                {period}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

const TimeTableForm = () => {

    const userData = useSelector(selectSchoolDetails);
    const classSections = useSelector(state => state.master.data.classSections || []);
    const periodsss = useSelector(state => state.master.data.periods || []);
    const subjects = useSelector(state => state.master.data.subjects || []);
    const schoolId = userData?.id;
    const session = userData?.session;
    const staffList = useSelector(state => state.master.data.staff || []);
    const [loading, setLoading] = useState(false);
    const [classSectionQuery, setClassSectionQuery] = useState(''); // State for Class and Section search
    const [teacherQuery, setTeacherQuery] = useState(''); // State for Teacher search

    const handleClassSectionChange = (event) => {
        setClassSectionQuery(event.target.value);
    };

    const handleTeacherChanges = (event) => {
        setTeacherQuery(event.target.value);
    };
    const [timeTable, setTimeTable] = useState({
        className: '',
        section: '',
        teacher: '',
        teacherId: '',
        day: '',
        subject: '',
        periods: '',
        schoolId: schoolId,
        session: session,
        today: '',
        task: '',
        timeFrom: {hours: '00', minutes: '00', period: 'AM'},
        timeTo: {hours: '00', minutes: '00', period: 'AM'},
    });
    const [timeTables, setTimeTables] = useState([]); // State to hold list of time tables
    const [tabIndex, setTabIndex] = useState(0); // State to manage tabs
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
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
    const handleChange = e => {
        setTimeTable({...timeTable, [e.target.name]: e.target.value});
    };
    const handleTimeChange = (field, value) => {
        setTimeTable({...timeTable, [field]: value});
    };
    const handleTeacherChange = (e) => {
        const selectedTeacher = staffList.find(staff => staff.name === e.target.value);
        setTimeTable({
            ...timeTable,
            teacher: selectedTeacher.name,
            teacherId: selectedTeacher.id,
        });
    };
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/api/timetable', timeTable);
            alert('Time table saved successfully!');
            await fetchTimeTables(); // Refresh the list after saving
            resetTimeTable(); // Reset the form after successful submission
        } catch (error) {
            console.error('Error saving time table:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetTimeTable = () => {
        setTimeTable({
            className: '',
            section: '',
            teacher: '',
            teacherId: '',
            day: '',
            subject: '',
            periods: '',
            schoolId: schoolId, // Keep these unchanged
            session: session, // Keep these unchanged
            today: '',
            task: '',
            timeFrom: {hours: '00', minutes: '00', period: 'AM'},
            timeTo: {hours: '00', minutes: '00', period: 'AM'},
        });
    };

    const handleEdit = table => {
        setTimeTable(table);
        setTabIndex(0); // Switch to the form tab to edit the time table
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
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const [selectedClassName, setSelectedClassName] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
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
    return (
        <Box sx={{padding: 4}}>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Time Table Tabs"
                centered
            >
                <Tab label="Create Time Table"/>
                <Tab label="View Time Tables"/>
            </Tabs>

            <Fade in={tabIndex === 0}>
                <Box sx={{display: tabIndex === 0 ? 'block' : 'none', mt: 4}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Class</InputLabel>
                                <Select
                                    name="className"
                                    value={timeTable.className}
                                    onChange={handleChange}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Section</InputLabel>
                                <Select
                                    name="section"
                                    value={timeTable.section}
                                    onChange={handleChange}
                                    disabled={!timeTable.className}
                                >
                                    {classSections?.find(cs => cs.name === timeTable.className)?.sections?.length > 0 ? (
                                        classSections
                                            .find(cs => cs.name === timeTable.className)
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Staff/Teacher</InputLabel>
                                <Select
                                    name="teacher"
                                    value={timeTable.teacher}
                                    onChange={handleTeacherChange}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Day</InputLabel>
                                <Select
                                    name="day"
                                    value={timeTable.day}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Subject</InputLabel>
                                <Select
                                    name="subject"
                                    value={timeTable.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    {subjects.map((sub) => (
                                        <MenuItem key={sub.id} value={sub.name}>
                                            {sub.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Period</InputLabel>
                                <Select
                                    name="periods"
                                    value={timeTable.periods}
                                    onChange={handleChange}
                                    required
                                >
                                    {periodsss.map((per) => (
                                        <MenuItem key={per.id} value={per.name}>
                                            {per.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TimePicker
                                label="Time From"
                                value={timeTable.timeFrom}
                                onChange={value => handleTimeChange('timeFrom', value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TimePicker
                                label="Time To"
                                value={timeTable.timeTo}
                                onChange={value => handleTimeChange('timeTo', value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="today"
                                label="Today's Date"
                                type="date"
                                fullWidth
                                value={timeTable.today}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                name="task"
                                label="Today's Task"
                                fullWidth
                                value={timeTable.task}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20}/> : null}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ml: 2}}
                                onClick={() => setTimeTable({
                                    className: '',
                                    section: '',
                                    teacher: '',
                                    day: '',
                                    subject: '',
                                    period: '',
                                    timeFrom: {hours: '00', minutes: '00', period: 'AM'},
                                    timeTo: {hours: '00', minutes: '00', period: 'AM'},
                                    today: '',
                                    task: '',
                                })}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>

            <Fade in={tabIndex === 1}>
                <Box sx={{width: '100%'}}>
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
                                            <IconButton onClick={() => handleEdit(table)}>
                                                <Edit/>
                                            </IconButton>
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
            </Fade>
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
