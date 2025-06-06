import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    styled,
    Typography,
    useTheme,
    CardContent,Avatar
} from "@mui/material";
import { ListItemAvatar } from "@material-ui/core";
// import StudentList from '../student/StudentList';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AttachMoney, Event, Notifications } from "@mui/icons-material";
import { api } from "../../../../src/common";
import { Cake } from "@mui/icons-material";
import InboxIcon from "@mui/icons-material/Inbox"; 
import { Celebration, CalendarToday, Email, Phone,Inbox ,} from '@mui/icons-material';

// Add this utility function outside your component
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
const bounceAnimation = `
  @keyframes bounce {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`;

const BouncingButton = styled(Button)(({ theme }) => ({
    animation: "bounce 1s infinite",
    "@keyframes bounce": bounceAnimation,
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: theme.shadows[4],
    },
}));
const DashboardContainer = styled(Box)(({ theme }) => ({
    padding: "20px",
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    animation: "fadeIn 1s ease-in-out",
    borderRadius: "12px",
}));

const DashboardCard = styled(Card)(({ theme }) => ({
    padding: "20px",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: theme.shadows[4],
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: theme.shadows[8],
    },
}));

const SectionContainer = styled(Paper)(({ theme }) => ({
    padding: "20px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "12px",
    boxShadow: theme.shadows[4],
    marginBottom: "20px",
    animation: "slideInBottom 0.8s ease-in-out",
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    fontSize: "22px",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginBottom: "12px",
}));

const Legend = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
}));

const IconSection = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
}));
const LegendItem = styled(Box)(({ color }) => ({
    display: "flex",
    alignItems: "center",
    gap: "5px",
    "&::before": {
        content: '""',
        display: "block",
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        backgroundColor: color,
    },
}));


const Dashboard = ({ showAttendanceSection = true, showFeeSection = true , onlyTeacherAttendance ,showBirthdayContainer=true,userType}) => {
    const [birthdays, setBirthdays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [staff,setStaff]=useState([]);

    const [teachingCount, setTeachingCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const[present,setPresent]=useState(0)
    const [student,setStudent]=useState(0)
    const [attendance, setAttendance] = useState([]);

    // TOtal present
    const[studentPresent,setStudentPresent]=useState(0)
    const[staffPresent,setStaffPresent]=useState(0)
    const[teacherPresent,setTeacherPresent]=useState(0)
    console.log("staffprenset",staffPresent)
        const [selectedStaff, setSelectedStaff] = useState('');
    

    console.log("studentPresent",studentPresent)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
const [FeeAmounts,setFeeAmounts]=useState([]);
  console.log("setFeeAmounts",FeeAmounts)
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/api/notifications/filter");
                setNotifications(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

 useEffect(()=>{
    const fetchFeedeposit = async ()=>{
        try{
            const response =await api.get("/api/fees/fee-deposit/search");
            setFeeAmounts(response.data);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false)
        }
    }
    fetchFeedeposit();
 },[])

    // useEffect(() => {
    //     const fetchBirthdays = async () => {
    //         try {
    //             const response = await api.get("/api/birthdays");
    //             setBirthdays(response.data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchBirthdays();
    // }, []);


   useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await api.get("/api/birthdays");
        
        // Filter birthdays based on userType with case-insensitive comparison
        const filteredData = userType
          ? response.data.filter(b => 
              b.type?.toLowerCase() === userType.toLowerCase()
            )
          : response.data;

        setBirthdays(filteredData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch birthdays");
        setBirthdays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [userType]); // Re-fetch when userType changes

      console.log("birthdasy",birthdays)
    useEffect(() => {
        const fetchStaff = async () => {
          try {
            const response = await api.get('/api/staff');
            // Set the complete staff list
            const allStaff = response.data;
          
            setStaff(allStaff);
            // Filter the staff with post === 'teaching' and count them
            const teachingStaff = allStaff.filter(member => member.staffType
                ===
                "Teaching");
            setTeachingCount(teachingStaff.length);
            const nonteachingStaff = allStaff.filter(member => member.staffType
                ===
                "Non-Teaching");
                setStaffCount(nonteachingStaff.length);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchStaff();
      }, []);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await api.get("/api/students");
                setStudent(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, []);

    useEffect(() => {
        const fetchPresent = async () => {
            try {
                const response = await api.get("/api/attendance");
                const allpresent = response.data
                setPresent(allpresent);
                const studentPresent = allpresent.filter(member =>
                    member.type === "STUDENT" ? member.status === "Present" : false
                  );
                  setStudentPresent(studentPresent.length);
                  const staffPresent = allpresent.filter(member =>
                    member.type === "STAFF" ? member.status === "Present" : false
                  ); 
                  setStaffPresent(staffPresent.length);
                //    const teacherPresent = allpresent.filter(member =>
                //     member.type === "STUDENT" ? member.status === "Present" : false
                //   );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPresent();
    }, []);
console.log("present",present)
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await api.get('/api/master/holidays')
                setHolidays(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHolidays();
    }, []);
    
   

    const attendanceList = useSelector(
        (state) => state.attendance.attendanceList || []
    );

    // Calculate the number of present students
    const presentStudents = attendanceList.filter(
        (record) => record.status === "Present" && record.type == "STUDENT"
    ).length;
    const presentStaff = attendanceList.filter(
        (record) => record.status === "Present" && record.type === "STAFF"
      ).length;
    const presentTeachers = attendanceList.filter(
        (record) => record.status === "Present" && record.type == "TEACHER"
    ).length;
    const theme = useTheme();
   
    const [progress, setProgress] = useState(0);
    const [presentPercentage, setPresentPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1; // Increment progress
                } else {
                    clearInterval(interval); // Clear interval when target is reached
                    return prev; // Return the final value
                }
            });
        }, 50); // Adjust the interval time for smoother or faster loading

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);



    return (
        <DashboardContainer
        sx={{
    backgroundImage: "linear-gradient(135deg, #fdfbfb 10%, #ebedee 100%)",

        }}>
            {/* Circular Progress Section */}

           {showAttendanceSection && (
    <SectionContainer>
        <Grid container spacing={3}>
            {[
                { title: "Teachers", total: teachingCount, present: presentTeachers },
                { title: "Support Staff", total: staffCount, present: staffPresent },
                { title: "Students", total: student.length, present: studentPresent },
            ].map((item, index) => {
                const presentPercentage = Math.round((item.present / item.total) * 100);
          
                return (
                    <Grid item xs={12} sm={4} key={index}>
                        <DashboardCard sx={{
                           backgroundImage: "linear-gradient(135deg, #fdfbfb 10%, #ebedee 100%)",
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                            }
                        }}>
                            <CardTitle sx={{
                                fontSize: "1.25rem",
                                fontWeight: 600,
                                textAlign: "center",
                                color: 'primary.main',
                                mb: 2,
                                background: 'linear-gradient(45deg, #0A4C81 30%, #2196F3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {item.title}
                            </CardTitle>

                            <Box sx={{
                                width: "50%",
                                height: "50%",
                                margin: "0 auto",
                                position: 'relative'
                            }}>
                                <CircularProgressbar
                                    value={presentPercentage}
                                    text={`${presentPercentage}%`}
                                    styles={buildStyles({
                                        textSize: "16px",
                                        pathTransitionDuration: 0.5,
                                        pathColor: `url(#gradient-${index})`,
                                        trailColor: "rgba(227, 242, 253, 0.3)",
                                        textColor: "#0A4C81",
                                        strokeLinecap: "square",
                                    })}
                                />
                                <svg style={{ height: 0 }}>
                                    <defs>
                                        <linearGradient
                                            id={`gradient-${index}`}
                                            gradientTransform="rotate(90)"
                                        >
                                            <stop offset="0%" stopColor="#0A4C81" />
                                            <stop offset="100%" stopColor="#2196F3" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </Box>

                            <Legend sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 2,
                                mb: 1
                            }}>
                                <LegendItem sx={{
                                    '&::before': {
                                        background: '#0A4C81',
                                        opacity: 0.9
                                    }
                                }}>
                                    Present
                                </LegendItem>
                                <LegendItem sx={{
                                    '&::before': {
                                        background: 'rgba(227, 242, 253, 0.5)'
                                    }
                                }}>
                                    Absent
                                </LegendItem>
                            </Legend>

                            <Box sx={{
                                textAlign: 'center',
                                mt: 2,
                                '& > *': { lineHeight: 1.4 }
                            }}>
                                <Typography variant="h6" sx={{
                                    color: "text.secondary",
                                    fontWeight: 500
                                }}>
                                    Total: {item.total}
                                </Typography>
                                <Typography variant="subtitle1" sx={{
                                    color: "#2196F3",
                                    fontWeight: 700,
                                    letterSpacing: 0.5
                                }}>
                                    Present: {item.present}
                                </Typography>
                            </Box>
                        </DashboardCard>
                    </Grid>
                );
            })}
        </Grid>
    </SectionContainer>
)}





            {/* Fee, Holiday, Notifications, and Birthdays Combined Section */}
            <SectionContainer
  sx={{
    backgroundImage: "linear-gradient(135deg, #fdfbfb 10%, #ebedee 100%)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    p: 2,
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    },
  }}
>
<CardTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 700,
        px: 3,
        pt: 2,
        pb: 1,
        color: '#0A4C81',
        borderBottom: '2px solid rgba(10,76,129,0.1)',
        background: 'linear-gradient(90deg, rgba(33,150,243,0.05) 0%, rgba(255,255,255,0) 100%)',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
            content: '""',
            width: 4,
            height: 24,
            background: '#2196F3',
            borderRadius: 2,
            mr: 2
        }
    }}>
    Important Updates
  </CardTitle>
  <Grid container spacing={3}>
                    {/* Fees Payment */}

                    {showFeeSection && (
                        <Grid item xs={12} sm={6} md={3}>
                            <DashboardCard>
                                <SectionHeader>
                                    <IconButton color="primary">
                                        <AttachMoney />
                                    </IconButton>
                                    <Typography variant="h6">Pending Fee Payments</Typography>
                                </SectionHeader>
                                {/* <ul>
                {fees.length > 0 ? (
                    fees.map((fee) => (
                        <li key={fee.id}>
                            <h1>
                            {fee.studenName}
                            {fee.totalAmount}
                            </h1>
                          

                        </li>
                    ))
                ) : (
                    <p>No fee records found.</p>
                )}
            </ul> */}
                                {/*     <div style={{maxHeight: "200px", overflowY: "auto"}}>
                                <Grid container spacing={2}>
                                    {feeDeposits
                                        .slice()
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .map((deposit) => (
                                            <Grid item xs={12} key={deposit.id}>
                                                <Card
                                                    variant="outlined"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "16px",
                                                        borderRadius: "12px",
                                                        borderColor: "#e0e0e0",
                                                        transition: "box-shadow 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.boxShadow =
                                                            "0 4px 20px rgba(0, 0, 0, 0.1)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.boxShadow = "none")
                                                    }
                                                >
                                                    <Avatar
                                                        style={{
                                                            backgroundColor: "#3f51b5",
                                                            color: "#fff",
                                                            marginRight: "16px",
                                                        }}
                                                    >
                                                        {deposit.studentName[0]}
                                                    </Avatar>
                                                    <CardContent style={{flexGrow: 1, padding: 0}}>
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            style={{fontWeight: "bold"}}
                                                        >
                                                            {deposit.studentName}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            color="textSecondary"
                                                            style={{
                                                                marginTop: "8px",
                                                                display: "flex",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            ₹{" "}
                                                            <span style={{marginLeft: "4px"}}>
                        {deposit.totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                      </span>
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            style={{marginTop: "4px"}}
                                                        >
                                                            {new Date(deposit.date).toLocaleDateString("en-IN", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                </Grid>
                            </div>*/}
                                <BouncingButton variant="contained" color="primary" fullWidth>
                                    View All
                                </BouncingButton>
                            </DashboardCard>
                        </Grid>
                    )}



                    {/* Holidays */}
                    <Grid item xs={12} sm={6} md={3}>
    <DashboardCard
        sx={{
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.9) 100%)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }
        }}
    >
        <SectionHeader sx={{ mb: 1, alignItems: 'center' }}>
            <IconButton 
                color="secondary" 
                sx={{
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    p: 1.5,
                    mr: 1.5,
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }
                }}
            >
                <Event sx={{ color: 'common.white' }} />
            </IconButton>
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 600,
                    background: '-webkit-linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Upcoming Holidays
            </Typography>
        </SectionHeader>
        <List dense sx={{ pt: 0 }}>
            {holidays.map((holiday, index) => (
                <ListItem 
                    key={index}
                    sx={{
                        px: 2,
                        py: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(255,107,107,0.05)',
                            borderLeft: '3px solid #FF6B6B',
                            transform: 'translateX(4px)'
                        }
                    }}
                >
                    <ListItemText
                        primary={
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontWeight: 500,
                                    color: 'text.primary'
                                }}
                            >
                                {holiday.title}
                            </Typography>
                        }
                        secondary={
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.3,
                                    mt: 0.5
                                }}
                            >
                                From: {holiday.start}<br />
                                To: {holiday.end}
                            </Typography>
                        }
                        sx={{ m: 0 }}
                    />
                </ListItem>
            ))}
        </List>
    </DashboardCard>
</Grid>

                    {/* Notifications */}
                    <Grid item xs={12} sm={6} md={3}>
    <DashboardCard sx={{
        // background: 'linear-gradient(145deg, rgba(231, 231, 231, 0.9) 0%, rgb(251, 253, 255) 100%)',
        backgroundImage: "linear-gradient(135deg, #fdfbfb 10%, #ebedee 100%)",
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(33,150,243,0.12)'
        }
    }}>
        <SectionHeader sx={{
            p: 2,
            borderBottom: '1px solid rgba(33,150,243,0.1)',
            background: 'linear-gradient(90deg, rgba(33,150,243,0.1) 0%, rgba(255,255,255,0) 100%)'
        }}>
            <IconButton sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                color: 'white',
                mr: 1.5,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 2px 6px rgba(33,150,243,0.3)'
                }
            }}>
                <Notifications sx={{ 
                    fontSize: 26,
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                }} />
            </IconButton>
            <Typography variant="h6" sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Notifications
            </Typography>
        </SectionHeader>

        <Box
      sx={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(33,150,243,0.03) 10px, rgba(33,150,243,0.03) 20px)",
        flexDirection: "column",
        p: 2,
      }}
    >
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              '& svg': { fontSize: 24, mr: 1, color: "#BBDEFB" },
            }}
          >
            <InboxIcon sx={{ fontSize: 40, color: "#E3F2FD" }} />
            <Box
              component="span"
              sx={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}
            >
              {notif.message}
            </Box>
          </Typography>
        ))
      ) : (
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            '& svg': { fontSize: 24, mr: 1, color: "#BBDEFB" },
          }}
        >
          <InboxIcon sx={{ fontSize: 40, color: "#E3F2FD" }} />
          <Box
            component="span"
            sx={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(0,0,0,0.4)" }}
          >
            No new notifications
          </Box>
        </Typography>
      )}
    </Box>
    </DashboardCard>
</Grid>
                    {/* Birthdays */}
                    {/* <Grid item xs={12} sm={6} md={3}>
    <DashboardCard sx={{
        background: 'linear-gradient(145deg, rgba(255,245,240,0.9) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
        }
    }}>
        <SectionHeader sx={{ p: 2, borderBottom: '1px solid rgba(255,152,0,0.2)' }}>
            <IconButton sx={{
                background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                color: 'white',
                mr: 1.5,
                '&:hover': {
                    transform: 'rotate(-10deg) scale(1.0)',
                    boxShadow: '0 2px 6px rgba(255,152,0,0.3)'
                }
            }}>
                <Celebration sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography variant="h6" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Upcoming Birthdays
            </Typography>
        </SectionHeader>

        <Box sx={{ 
            maxHeight: 200, 
            overflowY: 'auto',
            p: 1.5,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,152,0,0.4)',
                borderRadius: 3
            }
        }}>
            {birthdays.map((birthday, index) => (
                <Paper key={index} sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                    borderLeft: '4px solid #FF9800',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: '0 2px 8px rgba(255,152,0,0.1)'
                    }
                }}>
                    <ListItem alignItems="center" sx={{ p: 0 }}>
                        <ListItemAvatar sx={{ minWidth: 48 }}>
                            <Avatar sx={{ 
                                bgcolor: 'rgba(25, 0, 255, 0.1)', 
                                color: '#FF9800',
                                width: 40, 
                                height: 40 
                            }}>
                                <Cake sx={{ fontSize: 20 }} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    lineHeight: 1.2
                                }}>
                                    {birthday.name}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mt: 0.5
                                }}>
                                    {birthday.type}
                                </Typography>
                            }
                        />
                    </ListItem>

                    <Box sx={{ 
                        ml: 6,
                        display: 'grid',
                        gap: 0.5,
                        "& .MuiTypography-root": {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }
                    }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <CalendarToday sx={{ fontSize: 14, color: '#FF9800' }} />
                            {new Date(birthday.dob).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary',textOverflow: 'ellipsis',  overflow: 'hidden', }}>
                            <Email sx={{ fontSize: 14, color: '#FF9800',    }} />
                            {birthday.email}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <Phone sx={{ fontSize: 14, color: '#FF9800',}} />
                            {birthday.phone}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    </DashboardCard>
</Grid> */}
{showBirthdayContainer && (
<Grid item xs={12} sm={6} md={3}>
  <DashboardCard
    sx={{
      background:
        "linear-gradient(145deg, rgba(30,144,255,0.9) 0%, rgba(255,255,255,0.9) 100%)",
      backdropFilter: "blur(6px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
      },
    }}
  >
    <SectionHeader
      sx={{
        p: 2,
        borderBottom: "1px solid rgba(30,144,255,0.2)",
      }}
    >
      <IconButton
        sx={{
          background:
            "linear-gradient(45deg, rgba(30,144,255,1) 30%, rgba(255,255,255,1) 90%)",
          color: "white",
          mr: 1.5,
          "&:hover": {
            transform: "rotate(-10deg) scale(1.0)",
            boxShadow: "0 2px 6px rgba(30,144,255,0.3)",
          },
        }}
      >
        <Celebration sx={{ fontSize: 28 }} />
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background:
            "linear-gradient(45deg, rgba(30,144,255,1) 30%, rgba(255,255,255,1) 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Upcoming Birthdays
      </Typography>
    </SectionHeader>

    <Box
      sx={{
        maxHeight: 200,
        overflowY: "auto",
        p: 1.5,
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(30,144,255,0.4)",
          borderRadius: 3,
        },
      }}
    >
      {birthdays.map((birthday, index) => (
        <Paper
          key={index}
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            background: "rgba(255,255,255,0.7)",
            transition: "all 0.2s ease",
            "&:hover": {
                borderLeft: "4px solid rgba(30,144,255,1)",
              transform: "translateX(4px)",
              boxShadow: "0 2px 8px rgba(30,144,255,0.1)",
            },
          }}
        >
          <ListItem alignItems="center" sx={{ p: 0 }}>
            <ListItemAvatar sx={{ minWidth: 48 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(30,144,255,0.1)",
                  color: "rgba(30,144,255,1)",
                  width: 40,
                  height: 40,
                }}
              >
                <Cake sx={{ fontSize: 20 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {birthday.name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {birthday.type}
                </Typography>
              }
            />
          </ListItem>

          <Box
            sx={{
              ml: 6,
              display: "grid",
              gap: 0.5,
              "& .MuiTypography-root": {
                display: "flex",
                alignItems: "center",
                gap: 1,
              },
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <CalendarToday
                sx={{ fontSize: 14, color: "rgba(30,144,255,1)" }}
              />
              {new Date(birthday.dob).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <Email sx={{ fontSize: 14, color: "rgba(30,144,255,1)" }} />
              {birthday.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Phone sx={{ fontSize: 14, color: "rgba(30,144,255,1)" }} />
              {birthday.phone}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  </DashboardCard>
</Grid>


   ) }
                </Grid>
            </SectionContainer>
   
            {/* Calendar Section */}
            <SectionContainer>
                <CardTitle>Calendar</CardTitle>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    // events={[...data.events, ...data.holidays]}
                />
            </SectionContainer>
        </DashboardContainer>
    );
};
export default Dashboard;