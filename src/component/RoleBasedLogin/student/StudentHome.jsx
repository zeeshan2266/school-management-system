import React, {useState} from 'react';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import PermMediaIcon from '@mui/icons-material/PermMedia';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MenuBookIcon from '@mui/icons-material/MenuBook';
// import TodayIcon from '@mui/icons-material/Today';
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
// import CloseIcon from "@mui/icons-material/Close";
// import SideBar from "../../Sidebar/SideBar";
import {useNavigate} from 'react-router-dom'; // Import useHistory
import {styled} from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
    AccountBalanceWallet as AccountBalanceWalletIcon,
    Assessment as AssessmentIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    BarChart as BarChartIcon,
    CardMembership as CardMembershipIcon,
    DirectionsBus as DirectionsBusIcon,
    EventAvailable as EventAvailableIcon,
    ExitToApp as ExitToAppIcon,
    LibraryBooks as LibraryBooksIcon,
    MonetizationOn as MonetizationOnIcon,
    People as PeopleIcon,
    Quiz as QuizIcon,
    TableChart as TableChartIcon,
} from '@mui/icons-material';
// import { FaThLarge } from 'react-icons/fa';
// import { AnimatePresence } from 'framer-motion';
// import MenuIcon from "@mui/icons-material/Menu";
// // import Dashboard from '../../page/dashboard/Dashboard';
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// // import GalleryPage from '../../page/gallary/GalleryPage';
// import GalleryList from '../../page/gallary/GalleryList';
// import { useSelector } from 'react-redux';
// import * as XLSX from "xlsx";
// import { selectSchoolDetails } from "../../../common";
// import { useDispatch } from "react-redux";
// import { fetchGallery, } from "../../page/gallary/redux/GalleryActions";
// const StudentHome = ({ chilgdren }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
// const [anchorEl, setAnchorEl] = useState(null);
//     const [activePage, setActivePage] = useState('home');  // State to track current page
//     const [slideDirection, setSlideDirection] = useState('left');  // Control slide direction
//     // Handling avatar dropdown
// const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
// };
//     const handleLogout = () => {
//         handleMenuClose(); // Close the menu
//         navigate.push('/logout'); // Redirect to the logout route
//     };
//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };
//     // Handle page change with animation
//     const handlePageChange = (page) => {
//         setSlideDirection('left');  // Default slide to left
//         setActivePage(page);
//     };
//     // Handle back navigation
//     const handleBackNavigation = () => {
//         setSlideDirection('right');  // Slide back to the right
//         setActivePage('home');
//     };
//     // Breadcrumb navigation
//     // const breadcrumbs = (
//     //     <Breadcrumbs aria-label="breadcrumb">
//     //         <Link underline="hover" color="inherit" onClick={() => handlePageChange('home')}>
//     //             Home
//     //         </Link>
//     //         {activePage !== 'home' && <Typography color="textPrimary">{activePage}</Typography>}
//     //     </Breadcrumbs>
//     // );
//     const IconContainer = styled('div')({
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '30px',
//         height: '30px',
//         backgroundColor: '#2d2d2d',
//         borderRadius: '5px',
//     });
// const routes = [
//     {
//         path: '/',
//         name: 'Dashboard',
//         icon: <IconContainer><DashboardIcon style={{ color: 'white' }} /></IconContainer>
//     },
//     {
//         path: '/studentBooks',
//         name: 'Books',
//         icon: <IconContainer><MenuBookIcon style={{ color: 'white', fontSize: '2rem' }} /></IconContainer>
//     },
//     {
//         path: '/dailyTask',
//         name: 'Assignment /D.A',
//         icon: (
//             <IconContainer>
//                 <AssignmentTurnedInIcon style={{ color: 'white', fontSize: '2rem' }} />
//             </IconContainer>
//         )
//     },
//     {
//         path: 'gallery',
//         name: 'gallery',
//         icon: <IconContainer><FaThLarge style={{ color: 'white', fontSize: '2rem' }} /></IconContainer>
//     },
//     {
//         path: '/attendance',
//         name: 'Attendance',
//         icon: <IconContainer><EventAvailableIcon style={{ color: 'white' }} /></IconContainer>,
//         subRoutes: [
//             {
//                 path: '/attendance/student',
//                 name: 'Student',
//                 icon: <IconContainer><PeopleIcon style={{ color: 'white' }} /></IconContainer>
//             },
//             {
//                 path: '/attendance/leave',
//                 name: 'Leave',
//                 icon: <IconContainer><ExitToAppIcon style={{ color: 'white' }} /></IconContainer>
//             }
//         ]
//     },
//     {
//         path: '/feeModule',
//         name: 'Fee',
//         icon: <IconContainer><MonetizationOnIcon style={{ color: 'white' }} /></IconContainer>,
//         subRoutes: [
//             {
//                 path: '/feeModule/deposit',
//                 name: 'Fee Deposit',
//                 icon: <IconContainer><AccountBalanceWalletIcon style={{ color: 'white' }} /></IconContainer>
//             },
//             {
//                 path: '/feeModule/report',
//                 name: 'Fee Report',
//                 icon: <IconContainer><BarChartIcon style={{ color: 'white' }} /></IconContainer>
//             }
//         ]
//     },
//     {
//         path: '/exam',
//         name: 'Exam',
//         icon: <IconContainer><QuizIcon style={{ color: 'white' }} /></IconContainer>,
//         subRoutes: [
//             {
//                 path: '/exam/admit',
//                 name: 'Admit Card',
//                 icon: <IconContainer><CardMembershipIcon style={{ color: 'white' }} /></IconContainer>
//             },
//             {
//                 path: '/exam/marksheet',
//                 name: 'MarkSheet',
//                 icon: <IconContainer><AssessmentIcon style={{ color: 'white' }} /></IconContainer>
//             }
//         ]
//     },
//     {
//         path: '/messages/mail',
//         name: 'Mail',
//         icon: <IconContainer><EmailIcon style={{ color: 'white' }} /></IconContainer>
//     },
//     {
//         path: '/studymaterial',
//         name: 'Study Material',
//         icon: <IconContainer><LibraryBooksIcon style={{ color: 'white' }} /></IconContainer>
//     },
//     {
//         path: '/transport',
//         name: 'Transport',
//         icon: <IconContainer><DirectionsBusIcon style={{ color: 'white' }} /></IconContainer>
//     },
//     {
//         path: '/timeTable',
//         name: 'Time Table',
//         icon: <IconContainer><TableChartIcon style={{ color: 'white' }} /></IconContainer>
//     },
//     {
//         path: '/complaint',
//         name: 'Complain',
//         icon: <IconContainer> <ReportProblemIcon style={{ color: 'white' }} /> </IconContainer>
//     },
//     // {
//     //     path: '/help&support',
//     //     name: 'HelpAndSupport',
//     //     icon: <IconContainer> <HelpOutlineIcon style={{ color: 'white' }} /> </IconContainer>
//     // },
//     // {
//     //     path: '/settings',
//     //     name: 'Settings',
//     //     icon: <IconContainer><SettingsIcon style={{ color: 'white' }} /></IconContainer>
//     // },
//     {
//         path: '/logout',
//         name: 'Logout',
//         icon: <IconContainer><ExitToAppIcon style={{ color: 'white' }} /></IconContainer>
//     },
// ];
//     const [isOpen, setIsOpen] = useState(true);
// const showAnimation = {
//     hidden: { width: 0, opacity: 0, transition: { duration: 0.5 } },
//     show: { opacity: 1, width: "auto", transition: { duration: 0.5 } },
// };
//     // const CardTitle = styled(Typography)(({ theme }) => ({
//     //     fontSize: "22px",
//     //     fontWeight: "bold",
//     //     color: theme.palette.primary.main,
//     //     marginBottom: "12px",
//     // }));
// const toggleSidebar = () => {
//     setIsOpen(!isOpen);
// };
//     const SectionContainer = styled(Paper)(({ theme }) => ({
//         padding: "20px",
//         backgroundColor: theme.palette.background.paper,
//         borderRadius: "12px",
//         boxShadow: theme.shadows[4],
//         marginBottom: "20px",
//         animation: "slideInBottom 0.8s ease-in-out",
//         height: '100vh',
//         overflow: 'auto',
//         scrollbarWidth: 'none',
//     }));
//     const [data, setData] = useState({
//         events: [{ title: "Meeting", start: "2024-12-03", end: "2024-12-04" }],
//         holidays: [{ title: "Christmas", start: "2024-12-25", end: "2024-12-26" }],
//     });
//     const theme = createTheme();
//     const { galleryList, loading, error } = useSelector((state) => state.gallery);
//     const [searchQuery, setSearchQuery] = useState("");
//     // const handleDownloadExcel = () => {
//     //     const filteredData = GalleryList.map(
//     //         ({
//     //             images,
//     //             identificationDocuments,
//     //             educationalCertificate,
//     //             professionalQualifications,
//     //             experienceCertificates,
//     //             bankAccount,
//     //             previousEmployer,
//     //             message, // Add other fields that may contain long texts
//     //             ...rest
//     //         }) => ({
//     //             ...rest, // Include only the remaining fields
//     //         })
//     //     );
//     //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     //     const workbook = XLSX.utils.book_new();
//     //     XLSX.utils.book_append_sheet(workbook, worksheet, "Gallery");
//     //     XLSX.writeFile(workbook, "Gallery.xlsx");
//     // };
// const filteredDailyTaskList = Array.isArray(galleryList)
//     ? galleryList.filter((gallery) => {
//         const type = gallery.type?.toLowerCase() || "";
//         const title = gallery.title?.toLowerCase() || "";
//         const className = gallery.className?.toLowerCase() || "";
//         const query = searchQuery.toLowerCase();
//         return (
//             type.includes(query) ||
//             title.includes(query) ||
//             className.includes(query)
//         );
//     })
//     : [];
//     const userData = useSelector(selectSchoolDetails);
//     const schoolId = userData?.id;
//     const session = userData?.session;
//     const dispatch = useDispatch();
//     useEffect(() => {
//         if (schoolId && session) {
//             dispatch(fetchGallery(schoolId, session));
//         }
//     }, [dispatch, schoolId, session]);
//     const [openDetails, setOpenDetails] = useState(false);
//     const [selectedGallery, setSelectedGallery] = useState(null);
//     const handleViewGallery = (gallery) => {
//         setSelectedGallery(gallery);
//         setOpenDetails(true);
//     };
//     return (
// <Box>
//     {/* Sticky Header Section */}
//     <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
//         <Toolbar>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                 <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
//                     <MenuIcon />
//                 </IconButton>
//                 Student Portal
//             </Typography>
//             <IconButton onClick={handleMenuClick} color="inherit">
//                 <Avatar>
//                     <AccountCircleIcon />
//                 </Avatar>
//             </IconButton>
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//             >
//                 <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//         </Toolbar>
//     </AppBar>
//     <Grid container style={{ padding: 0, margin: 0, height: '100vh', overflow: 'hidden' }} >
//         <Grid xs={isOpen ? 2 : 1} sx={{ transition: "all 0.6s ease-in-out" }}>
//             <motion.div
//                 animate={{
//                     width: isOpen ? "230px" : "60px", transition: {
//                         duration: 1, type: "spring", damping: 10,
//                     },
//                 }}
//                 className="sidebar"
//                 style={{ height: '100vh', overflow: 'hidden' }}
//             >
//                 <section className="routes"
//                     style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', overflowX: 'hidden' }}>
//                     {routes.map((route, index) => {
//                         if (route.subRoutes) {
//                             return (<SidebarMenu
//                                 key={route.path}
//                                 setIsOpen={setIsOpen}
//                                 onClick={() => handlePageChange(route.name)}
//                                 route={route}
//                                 showAnimation={showAnimation}
//                                 isOpen={isOpen}
//                             />);
//                         }
//                         console.log(route)
//                         return (<NavLink
//                             to={route.path}
//                             key={index}
//                             className="link"
//                             activeClassName="active"
//                         >
//                             <div className="icon">{route.icon}</div>
//                             <AnimatePresence>
//                                 {isOpen && (<motion.div
//                                     variants={showAnimation}
//                                     initial="hidden"
//                                     animate="show"
//                                     exit="hidden"
//                                     className="link_text"
//                                 >
//                                     {route.name}
//                                 </motion.div>)}
//                             </AnimatePresence>
//                         </NavLink>);
//                     })}
//                 </section>
//             </motion.div>
//         </Grid>
//         <Grid ml={4} xs={isOpen ? 9 : 10} sx={{ transition: "all 1.3s ease-in-out", }} >
//             <motion.div
//                 animate={{
//                     scale: isOpen ? 1 : 1.12, // Adjust scaling effect
//                     transition: { duration: 2, type: "spring", damping: 10 },
//                 }}
//                 style={{ height: '100vh', overflow: 'auto', scrollbarWidth: 'none', }}
//             >
//                 {/* Breadcrumbs Section */}
//                 {/* <Box mt={isOpen ? 2 : 4}>
//                     {breadcrumbs}
//                 </Box> */}
//                 {/* Animated Main Content Section */}
//                 <Slide direction={slideDirection} in={true} mountOnEnter unmountOnExit>
//                     <Box p={isOpen ? 2 : 4} mt={isOpen ? 0 : 2} mb={isOpen ? 0 : 2} >
//                         {activePage === 'home' && (
//                             <>
//                                 {/* Header Section */}
//                                 <Grid container spacing={2} mt={2}>
//                                     <Grid item xs={6}>
//                                         <Card sx={{ backgroundColor: '#E0F7FA' }}>
//                                             <CardContent>
//                                                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                                                     <Box display="flex" alignItems="center">
//                                                         <AttachMoneyIcon fontSize="large" />
//                                                         <Typography variant="h6">Fees</Typography>
//                                                     </Box>
//                                                     <Typography variant="h6">₹ 8069</Typography>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={6}>
//                                         <Card sx={{ backgroundColor: '#FFE0B2' }}>
//                                             <CardContent>
//                                                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                                                     <Box display="flex" alignItems="center">
//                                                         <MenuBookIcon fontSize="large" />
//                                                         <Typography variant="h6">Syllabus</Typography>
//                                                     </Box>
//                                                     <Typography variant="h6">8/9</Typography>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                 </Grid>
//                                 {/* Quick Access Cards */}
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('School Calendar')}>
//                                             <CardContent>
//                                                 <CalendarTodayIcon fontSize="large" />
//                                                 <Typography>School Calendar</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('media')}>
//                                             <CardContent>
//                                                 <PermMediaIcon fontSize="large" />
//                                                 <Typography>Gallery</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('School Circular')}>
//                                             <CardContent>
//                                                 <SchoolIcon fontSize="large" />
//                                                 <Typography>School Circular</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('Assignment')}>
//                                             <CardContent>
//                                                 <AssignmentIcon fontSize="large" />
//                                                 <Typography>Assignment</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                 </Grid>
//                                 {/* Fee and Syllabus Section */}
//                                 {/* Additional Quick Access Cards */}
//                                 <Grid container spacing={2} mt={2}>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('Exam Schedule')}>
//                                             <CardContent>
//                                                 <TodayIcon fontSize="large" />
//                                                 <Typography>Exam Schedule</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Card onClick={() => handlePageChange('Homework')}>
//                                             <CardContent>
//                                                 <ReceiptIcon fontSize="large" />
//                                                 <Typography>Homework</Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                 </Grid>
//                             </>
//                         )}
//                         {/* School Calendar Page */}
//                         {activePage === 'School Calendar' && (
//                             <Box>
//                                 {/* Calendar Section */}
//                                 <ThemeProvider theme={theme} >
//                                     <SectionContainer>
//                                         <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue', marginBottom: '10px' }}>Calendar</Typography>
//                                         <FullCalendar
//                                             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                                             initialView="dayGridMonth"
//                                             headerToolbar={{
//                                                 left: "prev,next today",
//                                                 center: "title",
//                                                 right: "dayGridMonth,timeGridWeek,timeGridDay",
//                                             }}
//                                             events={[...data.events, ...data.holidays]}
//                                         />
//                                     </SectionContainer>
//                                 </ThemeProvider>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                             </Box>
//                         )}
//                         {/* Media Page */}
//                         {activePage === 'media' && (
//                             <Box sx={{ width: '`00%' }}>
//                                 <Box>
// <GalleryList
//     galleryList={filteredDailyTaskList}
//     showEditButton={false}
//     showDeleteButton={false}
//     onView={handleViewGallery}
// />
//                                 </Box>
//                             </Box>
//                         )}
// <Dialog
//     open={openDetails}
//     onClose={() => setOpenDetails(false)}
//     fullWidth
//     maxWidth="md"
// >
//     <DialogTitle
//         sx={{
//             textAlign: "center", // Center the title text
//             position: "relative", // Ensure the close button stays in the correct place
//         }}
//     >
//         Gallery Details
//         <IconButton
//             aria-label="close"
//             onClick={() => setOpenDetails(false)}
//             sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//             }}
//         >
//             <CloseIcon />
//         </IconButton>
//     </DialogTitle>
//     <DialogContent>
//         {selectedGallery ? (
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "center", // Horizontally center the content
//                     alignItems: "center", // Vertically center the content
//                     textAlign: "center", // Center-align the text
//                     minHeight: "200px", // Set minimum height to prevent collapse
//                 }}
//             >
//                 <Table>
//                     <TableBody>
//                         {[
//                             { label: "Type", value: selectedGallery.type },
//                             { label: "Title", value: selectedGallery.title },
//                             { label: "videoURL", value: selectedGallery.videoURL },
//                             {
//                                 label: "description",
//                                 value: selectedGallery.description,
//                             },
//                             {
//                                 label: "schoolId",
//                                 value: selectedGallery.schoolId,
//                             },
//                             { label: "session", value: selectedGallery.session },
//                             {
//                                 label: "Date of Creation",
//                                 value: selectedGallery.createdDate,
//                             },
//                         ].map((item) => (
//                             <TableRow key={item.label}>
//                                 <TableCell>
//                                     <strong>{item.label}</strong>
//                                 </TableCell>
//                                 <TableCell>{item.value || "Not available"}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </Box>
//         ) : (
//             <Skeleton variant="rectangular" width="100%" height={200} />
//         )}
//     </DialogContent>
// </Dialog>
//                         {/* School Circular Page */}
//                         {activePage === 'School Circular' && (
//                             <Box>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                                 <Typography variant="h4" mt={2}>
//                                     School Circular
//                                 </Typography>
//                                 <Typography>This is the content for the School Circular.</Typography>
//                             </Box>
//                         )}
//                         {/* Assignment Page */}
//                         {activePage === 'Assignment' && (
//                             <Box>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                                 <Typography variant="h4" mt={2}>
//                                     Assignment
//                                 </Typography>
//                                 <Typography>This is the content for the Assignment section.</Typography>
//                             </Box>
//                         )}
//                         {/* Exam Schedule Page */}
//                         {activePage === 'Exam Schedule' && (
//                             <Box>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                                 <Typography variant="h4" mt={2}>
//                                     Exam Schedule
//                                 </Typography>
//                                 <Typography>This is the content for the Exam Schedule section.</Typography>
//                             </Box>
//                         )}
//                         {/* Homework Page */}
//                         {activePage === 'Homework' && (
//                             <Box>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                                 <Typography variant="h4" mt={2}>
//                                     Homework
//                                 </Typography>
//                                 <Typography>This is the content for the Homework section.</Typography>
//                             </Box>
//                         )}
//                         {activePage === 'studentBooks' && (
//                             <Box>
//                                 <Button variant="contained" color="primary" onClick={handleBackNavigation}>
//                                     Back
//                                 </Button>
//                                 <Typography variant="h4" mt={2}>
//                                     Student Books
//                                 </Typography>
//                                 <Typography>This is the content for the Homework section.</Typography>
//                             </Box>
//                         )}
//                         {/* {activePage === 'StudentBook' && (
//                             <Box>
//                                 <Typography variant="h4" mt={2}>
//                                     StudentBooks
//                                 </Typography>
//                             <Box />
//                         )} */}
//                     </Box>
//                 </Slide>
//             </motion.div>
//         </Grid>
//     </Grid>
// </Box>
//     );
// };
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {FaThLarge} from 'react-icons/fa';
import ChatIcon from "@mui/icons-material/Chat";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VideoCallIcon from "@mui/icons-material/VideoCall";

const IconContainer = styled('div')(`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: #2d2d2d;
    border-radius: 5px;
`);
const StudentHome = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        handleMenuClose(); // Close the menu
        navigate.push('/logout'); // Redirect to the logout route
    };
    const showAnimation = {
        hidden: {width: 0, opacity: 0, transition: {duration: 0.5}},
        show: {opacity: 1, width: "auto", transition: {duration: 0.5}},
    };
    const routes = [
        {
            path: '/',
            name: 'Dashboard',
            icon: <IconContainer><DashboardIcon style={{color: 'white'}}/></IconContainer>
        },
        {
            path: '/studentBooks',
            name: 'Books',
            icon: <IconContainer><MenuBookIcon style={{color: 'white', fontSize: '2rem'}}/></IconContainer>
        },
        {
            path: '/dailyTask',
            name: 'Assignment /D.A',
            icon: (
                <IconContainer>
                    <AssignmentTurnedInIcon style={{color: 'white', fontSize: '2rem'}}/>
                </IconContainer>
            )
        },
        {
            path: 'gallery',
            name: 'gallery',
            icon: <IconContainer><FaThLarge style={{color: 'white', fontSize: '2rem'}}/></IconContainer>
        },
        {
            path: '/attendance',
            name: 'Attendance',
            icon: <IconContainer><EventAvailableIcon style={{color: 'white'}}/></IconContainer>,
            subRoutes: [
                {
                    path: '/attendance/student',
                    name: 'Student',
                    icon: <IconContainer><PeopleIcon style={{color: 'white'}}/></IconContainer>
                },
                {
                    path: '/attendance/leave',
                    name: 'Leave',
                    icon: <IconContainer><ExitToAppIcon style={{color: 'white'}}/></IconContainer>
                }
            ]
        },
        {
            path: '/feeModule',
            name: 'Fee',
            icon: <IconContainer><MonetizationOnIcon style={{color: 'white'}}/></IconContainer>,
            subRoutes: [
                {
                    path: '/feeModule/deposit',
                    name: 'Fee Deposit',
                    icon: <IconContainer><AccountBalanceWalletIcon style={{color: 'white'}}/></IconContainer>
                },
                {
                    path: '/feeModule/report',
                    name: 'Fee Report',
                    icon: <IconContainer><BarChartIcon style={{color: 'white'}}/></IconContainer>
                }
            ]
        },
        {
            path: '/exam',
            name: 'Exam',
            icon: <IconContainer><QuizIcon style={{color: 'white'}}/></IconContainer>,
            subRoutes: [

                {
                    path: '/exam/admit',
                    name: 'Admit Card',
                    icon: <IconContainer><CardMembershipIcon style={{color: 'white'}}/></IconContainer>
                },
                {
                    path: '/exam/marksheet',
                    name: 'MarkSheet',
                    icon: <IconContainer><AssessmentIcon style={{color: 'white'}}/></IconContainer>
                }
            ]
        },
        {
            path: '/communication',
            name: 'Communication',
            icon: <ChatIcon style={{color: 'white'}}/>,
            subRoutes: [
                {
                    path: '/communication/mail',
                    name: 'Mail',
                    icon: <MailOutlineIcon style={{color: 'white'}}/>
                },
                {
                    path: '/communication/chat',
                    name: 'Chat',
                    icon: <ChatBubbleOutlineIcon style={{color: 'white'}}/>
                },
                {
                    path: '/communication/meeting',
                    name: 'Meeting',
                    icon: <VideoCallIcon style={{color: 'white'}}/>
                }
            ]
        },
        {
            path: '/studymaterial',
            name: 'Study Material',
            icon: <IconContainer><LibraryBooksIcon style={{color: 'white'}}/></IconContainer>
        },
        {
            path: '/transport',
            name: 'Transport',
            icon: <IconContainer><DirectionsBusIcon style={{color: 'white'}}/></IconContainer>
        },
        {
            path: '/timeTable',
            name: 'Time Table',
            icon: <IconContainer><TableChartIcon style={{color: 'white'}}/></IconContainer>
        },
        {
            path: '/complaint',
            name: 'Complain',
            icon: <IconContainer> <ReportProblemIcon style={{color: 'white'}}/> </IconContainer>
        },
        // {
        //     path: '/help&support',
        //     name: 'HelpAndSupport',
        //     icon: <IconContainer> <HelpOutlineIcon style={{ color: 'white' }} /> </IconContainer>
        // },
        // {
        //     path: '/settings',
        //     name: 'Settings',
        //     icon: <IconContainer><SettingsIcon style={{ color: 'white' }} /></IconContainer>
        // },
        {
            path: '/logout',
            name: 'Logout',
            icon: <IconContainer><ExitToAppIcon style={{color: 'white'}}/></IconContainer>
        },

    ];


    return (
        <>
            <p></p>
        </>
    )
}

export default StudentHome;
