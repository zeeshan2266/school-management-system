import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography} from '@mui/material';
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from 'date-fns';
import {useSelector} from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const generateDatesWithDays = (selectedDate) => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(startDate);
    const dates = eachDayOfInterval({start: startDate, end: endDate});
    return dates.map(date => ({
        day: format(date, 'd'),
        dayName: format(date, 'EEE'),
    }));
}

// Get color based on attendance status
const getStatusColor = (status) => {
    switch (status) {
        case 'Present':
            return '#28a745'; // Green for Present
        case 'Late':
            return '#ffc107'; // Amber for Late
        case 'Absent':
            return '#dc3545'; // Red for Absent
        case 'Half Day':
            return '#5bc0de'; // Light Blue for Half Day
        case 'Leave':
            return '#ff5722'; // Orange for Leave
        case 'Holiday':
            return '#6c757d'; // Gray for Holiday
        default:
            return '#ffffff'; // Light Gray for unknown or default status
    }
};

// Group attendance data by employee and calculate totals for each status
const groupAttendanceByEmployee = (attendanceList, selectedDate) => {
    const groupedData = {};
    const month = selectedDate.getMonth();
    attendanceList.forEach(attendance => {
        const {studentId, name, date, status, className, section} = attendance;
        const attendanceDate = new Date(date);

        // Filter attendance based on the selected month
        if (attendanceDate.getMonth() !== month) return;

        if (!groupedData[studentId]) {
            groupedData[studentId] = {
                name,
                className: className || 'N/A', // Default value for missing data
                section: section || 'N/A',
                attendance: {},
                totalPresent: 0,
                totalAbsent: 0,
                totalLate: 0,
                totalHalfDay: 0,
                totalLeave: 0,
                totalHoliday: 0,
            };
        }
        groupedData[studentId].attendance[date] = status;
        switch (status) {
            case 'Present':
                groupedData[studentId].totalPresent += 1;
                break;
            case 'Absent':
                groupedData[studentId].totalAbsent += 1;
                break;
            case 'Late':
                groupedData[studentId].totalLate += 1;
                break;
            case 'Half Day':
                groupedData[studentId].totalHalfDay += 1;
                break;
            case 'Leave':
                groupedData[studentId].totalLeave += 1;
                break;
            case 'Holiday':
                groupedData[studentId].totalHoliday += 1;
                break;
            default:
                break;
        }
    });
    return groupedData;
};

const AttendanceViewStudent = ({studentId, selectedDate, className, section}) => {
    const navigate = useNavigate();
    const attendanceList = useSelector(state => state.attendance.attendanceList);
    const [groupedData, setGroupedData] = useState({});
    const [showHolidayColumns, setShowHolidayColumns] = useState(false); // State to toggle visibility
    const dateToUse = selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date();
    const datesList = generateDatesWithDays(dateToUse);

    useEffect(() => {
        const filteredData = attendanceList.filter(attendance => {
            if (className && section) {
                return attendance.className === className && attendance.section === section;
            }
            if (className) {
                return attendance.className === className;
            }
            // return attendance.type === 'STUDENT';
            return true;
        });
        console.log('Filtered Data:', filteredData);

        const grouped = groupAttendanceByEmployee(filteredData, dateToUse);
        console.log('Grouped Data:', grouped);

        setGroupedData(grouped);
    }, [selectedDate, className, section, attendanceList, dateToUse]);

    // Add background color styles
    const headerStyle = {
        backgroundColor: '#343a40', // Dark gray header background
        color: '#ffffff', // White text for headers
    };
    const headerStyleH = {
        backgroundColor: '#ffffff', // Dark gray header background
        color: '#ffffff', // White text for headers
    };
    const rowStyleEven = {
        backgroundColor: '#f8f9fa', // Light gray for even rows
    };

    const rowStyleOdd = {
        backgroundColor: '#ffffff', // White for odd rows
    };

    const cellStyle = {
        textAlign: 'center',
        width: '80px', // Adjusted width for better spacing
        fontWeight: 'normal',
        padding: '10px 0', // Added padding for vertical spacing
        border: '1px solid #dee2e6', // Default border for grid effect
        borderBottom: '1px solid #000', // Thick bottom border for each cell
    };

    const cellStyleHeader = {
        textAlign: 'center',
        width: '80px',
        fontWeight: 'bold',
        padding: '10px 0',
    };

    const cellStyleNameHeader = {
        textAlign: 'center',
        width: '150px',
        fontWeight: 'bold',
        borderBottom: '1px solid #000', // Thick bottom border for name column
    };

    // Define styles for the first and last status columns with thick borders
    const firstStatusColumn = {
        borderLeft: '2px solid #000',
    };

    const lastStatusColumn = {
        borderRight: '2px solid #000',
    };

    const cellStyleDateDays = {
        textAlign: 'center',
        width: '50px',
        height: '50px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #dee2e6', // Single border for date cells
        borderBottom: '1px solid #000', // Thick bottom border for date cells
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
    };
    const expandIconStyle = {
        backgroundColor: '#f0f0f0', // Light gray background color
        padding: '8px', // Padding to make the icon look like a button
        borderRadius: '50%', // Round shape for the icon container
        display: 'inline-block', // Inline-block to fit the icon size
        transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth background color and rotation transition
        cursor: 'pointer',
    };

    const expandIconHoverStyle = {
        backgroundColor: '#007bff', // Change background to blue on hover
        transform: 'rotate(180deg)', // Rotate the icon on click
    };
    return (
        <>
            <TableContainer>
                <Table style={{tableLayout: 'fixed'}}>
                    <TableHead>
                        <TableRow style={headerStyle}>
                            <TableCell style={{...cellStyleNameHeader, ...headerStyle}}>Name</TableCell>
                            <TableCell style={{...cellStyleNameHeader, ...headerStyle}}>Class</TableCell>
                            <TableCell style={{...cellStyleNameHeader, ...headerStyle}}>Section</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>Present</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>Absent</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>Late</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>H.Day</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>Leave</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyle}}>Holiday</TableCell>
                            <TableCell style={{...cellStyleHeader, ...headerStyleH}}>
                                <div
                                    onClick={() => setShowHolidayColumns(!showHolidayColumns)}
                                    style={{
                                        ...expandIconStyle,
                                        ...(showHolidayColumns ? expandIconHoverStyle : {}),
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#007bff'; // Change background to blue on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f0f0f0'; // Reset to original background when hover ends
                                    }}
                                >

                                    <Tooltip title={showHolidayColumns ? 'Collapse Details' : 'Expand to see Details'}
                                             arrow>
                                        <ExpandMoreIcon
                                            style={{
                                                transition: 'transform 0.3s ease', // Smooth rotation transition
                                                transform: showHolidayColumns ? 'rotate(180deg)' : 'rotate(90deg)', // Rotate on state change
                                                cursor: 'pointer', // Pointer cursor for clarity
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                            </TableCell>
                            {showHolidayColumns && datesList.map((date, index) => (
                                <TableCell key={index} style={{...cellStyle, ...headerStyle}}>
                                    <div>
                                        {date.dayName}<br/>{date.day}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedData).map(([studentId, employeeData], index) => (
                            <TableRow key={index} style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}>
                                <TableCell style={{...cellStyle, ...firstStatusColumn}}>{employeeData.name}</TableCell>
                                <TableCell
                                    style={{...cellStyle, ...firstStatusColumn}}>{employeeData.className || ''}</TableCell>
                                <TableCell
                                    style={{...cellStyle, ...firstStatusColumn}}>{employeeData.section || ''}</TableCell>
                                <TableCell
                                    style={{
                                        ...cellStyle, ...firstStatusColumn,
                                        backgroundColor: getStatusColor("e")
                                    }}>{employeeData.totalPresent}</TableCell>
                                <TableCell style={{
                                    ...cellStyle,
                                    backgroundColor: getStatusColor("e")
                                }}>{employeeData.totalAbsent}</TableCell>
                                <TableCell style={{
                                    ...cellStyle,
                                    backgroundColor: getStatusColor("e")
                                }}>{employeeData.totalLate}</TableCell>
                                <TableCell style={{
                                    ...cellStyle,
                                    backgroundColor: getStatusColor("e")
                                }}>{employeeData.totalHalfDay}</TableCell>
                                <TableCell s style={{
                                    ...cellStyle,
                                    backgroundColor: getStatusColor("e")
                                }}>{employeeData.totalLeave}</TableCell>
                                <TableCell
                                    style={{
                                        ...cellStyle, ...lastStatusColumn,
                                        backgroundColor: getStatusColor("e")
                                    }}>{employeeData.totalHoliday}</TableCell>

                                <TableCell>
                                </TableCell>
                                {showHolidayColumns && datesList.map((date, idx) => {
                                    const status = employeeData.attendance[format(new Date(dateToUse.getFullYear(), dateToUse.getMonth(), date.day), 'yyyy-MM-dd')] || '';
                                    return (
                                        <TableCell key={idx}
                                                   style={{
                                                       ...cellStyleDateDays, ...firstStatusColumn,
                                                       backgroundColor: getStatusColor(status)
                                                   }}>
                                            <Tooltip
                                                title={status === 'Present' ? 'Present'
                                                    : status === 'Late' ? 'Late'
                                                        : status === 'Absent' ? 'Absent'
                                                            : status === 'Half Day' ? 'Half Day'
                                                                : status === 'Leave' ? 'Leave'
                                                                    : status === 'Holiday' ? 'Holiday'
                                                                        : ''}>
                                                <Typography>
                                                    {status === 'Present' ? 'P'
                                                        : status === 'Late' ? 'L'
                                                            : status === 'Absent' ? 'A'
                                                                : status === 'Half Day' ? 'H'
                                                                    : status === 'Leave' ? 'Lv'
                                                                        : status === 'Holiday' ? 'H'
                                                                            : ''}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};


export default AttendanceViewStudent;
