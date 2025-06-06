import React, {useEffect, useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
    Assessment as AssessmentIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Badge as BadgeIcon,
    Book as BookIcon,
    CardMembership as CardMembershipIcon,
    Dashboard as DashboardIcon,
    DirectionsBus as DirectionsBusIcon,
    EventAvailable as EventAvailableIcon,
    ExitToApp as ExitToAppIcon,
    Grade as GradeIcon,
    Group as GroupIcon,
    Mail as MailIcon,
    Notifications as NotificationsIcon,
    Quiz as QuizIcon,
    School as SchoolIcon,
    Settings as SettingsIcon,
    SettingsApplications as SettingsApplicationsIcon,
    SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';
import GradingIcon from '@mui/icons-material/Grading';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import {AnimatePresence, motion} from 'framer-motion';
import SidebarMenu from '../../Sidebar/SidebarMenu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';
import '../../Sidebar/SideBar.css';
import {Avatar, Badge, Box, Menu, MenuItem, Tooltip} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import {fetchAllData} from "../../page/dashboard/redux/masterActions";
import {selectSchoolDetails} from "../../../common";
import {FaThLarge} from 'react-icons/fa';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ChatIcon from '@mui/icons-material/Chat';

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: #2d2d2d;
    border-radius: 5px;
`;

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        icon: <IconContainer><DashboardIcon style={{color: 'white'}}/></IconContainer>
    },
    // {
    //     path: '/enquiry',
    //     name: 'Enquiry',
    //     icon: <IconContainer><SearchIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {
    //     path: '/student',
    //     name: 'Student',
    //     icon: <IconContainer><SchoolIcon style={{color: 'white'}}/></IconContainer>
    // },
    {
        path: '/staff',
        name: 'Staff',
        icon: <IconContainer><GroupIcon style={{color: 'white'}}/></IconContainer>
    },

    // {

    //     path: '/salary',
    //     name: 'Staff Salary',
    //     icon: <IconContainer><CurrencyRupeeOutlinedIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {


    //     path: '/book',
    //     name: 'Book',
    //     icon: <IconContainer><MenuBookIcon style={{color: 'white', fontSize: '2rem'}}/></IconContainer>
    // },
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
        path: '/gallery',
        name: 'Gallery',
        icon: <IconContainer><FaThLarge style={{color: 'white', fontSize: '2rem'}}/></IconContainer>
    },
    {
        path: '/attendance',
        name: 'Attendance',
        icon: <IconContainer><EventAvailableIcon style={{color: 'white'}}/></IconContainer>,
        subRoutes: [
            {
                path: '/attendance/staff',
                name: 'Staff',
                icon: <IconContainer><BadgeIcon style={{color: 'white'}}/></IconContainer>
            },
            // {
            //     path: '/attendance/student',
            //     name: 'Student',
            //     icon: <IconContainer><PeopleIcon style={{color: 'white'}}/></IconContainer>
            // },
            {
                path: '/attendance/leave',
                name: 'Leave',
                icon: <IconContainer><ExitToAppIcon style={{color: 'white'}}/></IconContainer>
            }
        ]
    },
    // {
    //     path: '/feeModule',
    //     name: 'Fee',
    //     icon: <IconContainer><MonetizationOnIcon style={{color: 'white'}}/></IconContainer>,
    //     subRoutes: [
    //         {
    //             path: '/feeModule/feeType',
    //             name: 'Create Fee Type',
    //             icon: <IconContainer><ReceiptIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/feeModule/amount',
    //             name: 'Set Fee Amount',
    //             icon: <IconContainer><LayersIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/feeModule/deposit',
    //             name: 'Fee Deposit',
    //             icon: <IconContainer><AccountBalanceWalletIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/feeModule/report',
    //             name: 'Fee Report',
    //             icon: <IconContainer><BarChartIcon style={{color: 'white'}}/></IconContainer>
    //         }/*,
    //         {
    //             path: '/feeModule/due/report',
    //             name: 'Fee Due Report',
    //             icon: <IconContainer><BarChartIcon style={{color: 'white'}}/></IconContainer>
    //         }*/
    //     ]
    // },
    // {
    //     path: '/master',
    //     name: 'Master',
    //     icon: <IconContainer><SettingsApplicationsIcon style={{color: 'white'}}/></IconContainer>,
    //     subRoutes: [
    //         {
    //             path: '/master/class',
    //             name: 'Class-Section',
    //             icon: <IconContainer><ClassIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/master/subject',
    //             name: 'Subject',
    //             icon: <IconContainer><BookIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/master/designation',
    //             name: 'Designation',
    //             icon: <IconContainer><SupervisorAccountIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         // {
    //         //     path: '/master/house',
    //         //     name: 'House',
    //         //     icon: <IconContainer><HomeIcon style={{color: 'white'}}/></IconContainer>
    //         // },
    //         // {
    //         //     path: '/master/event',
    //         //     name: 'Calendar Event',
    //         //     icon: <IconContainer><EventNoteIcon style={{color: 'white'}}/></IconContainer>
    //         // },
    //         // {
    //         //     path: '/master/holiday',
    //         //     name: 'Set Holiday',
    //         //     icon: <IconContainer><BeachAccessIcon style={{color: 'white'}}/></IconContainer>
    //         // },
    //         {
    //             path: '/master/period',
    //             name: 'Period',
    //             icon: <IconContainer><ScheduleIcon style={{color: 'white'}}/></IconContainer>,
    //         },
    //         {
    //             path: '/master/grade',
    //             name: 'Grade',
    //             icon: <IconContainer><GradingIcon style={{color: 'white'}}/></IconContainer>,
    //         },
    //         {
    //             path: '/master/syllabus',
    //             name: 'Syllabus',
    //             icon: <IconContainer><GradingIcon style={{color: 'white'}}/></IconContainer>,
    //         },
    //         // {
    //         //     path: '/master/assing/class/teacher',
    //         //     name: 'Class Teacher',
    //         //     icon: <IconContainer><PersonAddIcon style={{color: 'white'}}/></IconContainer>,
    //         // },
    //         // {
    //         //     path: '/master/promotion',
    //         //     name: 'Promotion',
    //         //     icon: <IconContainer><TrendingUpIcon style={{color: 'white'}}/></IconContainer>,
    //         // }
    //     ]
    // },
    {
        path: '/exam',
        name: 'Exam',
        icon: <IconContainer><QuizIcon style={{color: 'white'}}/></IconContainer>,
        subRoutes: [
            // {
            //     path: '/exam/create/edit',
            //     name: 'Create/Edit Exam',
            //     icon: <IconContainer><EditIcon style={{color: 'white'}}/></IconContainer>
            // },
            // {
            //     path: '/exam/admit',
            //     name: 'Admit Card',
            //     icon: <IconContainer><CardMembershipIcon style={{color: 'white'}}/></IconContainer>
            // },
            {
                path: '/exam/result',
                name: 'Grading',
                icon: <IconContainer><GradeIcon style={{color: 'white'}}/></IconContainer>
            },
            // {
            //     path: '/exam/marksheet',
            //     name: 'MarkSheet',
            //     icon: <IconContainer><AssessmentIcon style={{color: 'white'}}/></IconContainer>
            // }
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
    /*  {
          path: '/question',
          name: 'Question(MCQ)',
          icon: <IconContainer><QuizIcon style={{color: 'white'}}/></IconContainer>
      },*/
    // {
    //     path: '/studymaterial',
    //     name: 'Study Material',
    //     icon: <IconContainer><LibraryBooksIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {
    //     path: '/report',
    //     name: 'Report',
    //     icon: <IconContainer><BarChartIcon style={{color: 'white'}}/></IconContainer>,
    //     subRoutes: [
    //         {
    //             path: '/report/bonafide',
    //             name: 'Bonafide',
    //             icon: <IconContainer><VerifiedUserIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/report/character',
    //             name: 'Character',
    //             icon: <IconContainer><DescriptionIcon style={{color: 'white'}}/></IconContainer>
    //         }
    //     ]
    // },
    // {
    //     path: '/certificate',
    //     name: 'Certificate',
    //     icon: <IconContainer><SchoolIcon style={{color: 'white'}}/></IconContainer>,
    //     subRoutes: [
    //         {
    //             path: '/certificate/bonafide',
    //             name: 'Bonafide',
    //             icon: <IconContainer><VerifiedUserIcon style={{color: 'white'}}/></IconContainer>
    //         },
    //         {
    //             path: '/certificate/character',
    //             name: 'Character',
    //             icon: <IconContainer><AccountCircleIcon style={{color: 'white'}}/></IconContainer>
    //         }
    //     ]
    // },
    {
        path: '/transport',
        name: 'Transport',
        icon: <IconContainer><DirectionsBusIcon style={{color: 'white'}}/></IconContainer>
    },
    // {
    //     path: '/timeTable',
    //     name: 'Time Table',
    //     icon: <IconContainer><TableChartIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {
    //     path: '/expenses',
    //     name: 'Expenses',
    //     icon: <IconContainer><MoneyOffIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {
    //     path: '/academics',
    //     name: 'Academics',
    //     icon: <IconContainer><SchoolIcon style={{color: 'white'}}/></IconContainer>
    // },
    // {
    //     path: '/asset',
    //     name: 'Assets',
    //     icon: <IconContainer> <BusinessIcon style={{color: 'white'}}/> </IconContainer>
    // },
    {
        path: '/complaint',
        name: 'Complain',
        icon: <IconContainer> <ReportProblemIcon style={{color: 'white'}}/> </IconContainer>
    },
    {
        path: '/help&support',
        name: 'HelpAndSupport',
        icon: <IconContainer> <HelpOutlineIcon style={{color: 'white'}}/> </IconContainer>
    },
    {
         path: '/settings',
         name: 'Settings',
         icon: <IconContainer><SettingsIcon style={{color: 'white'}}/></IconContainer>
     },
    {
        path: '/logout',
        name: 'Logout',
        icon: <IconContainer><ExitToAppIcon style={{color: 'white'}}/></IconContainer>
    },

];


const settings = [
    {name: 'Dashboard', path: '/'},
    {name: 'Profile', path: '/profile'},
    {name: 'Logout', path: '/logout'}
];

const StaffMain = ({children}) => {
    const dispatch = useDispatch();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [notificationsCount, setNotificationsCount] = useState(5);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const schoolData = useSelector((state) => state.school?.schools);


    const userData = useSelector(selectSchoolDetails);
    const schoolId = userData?.id;
    const session = userData?.session;
    const [previousRoute, setPreviousRoute] = useState('');
    const allowedRoutes = ['Enquiry', 'Staff', 'Student', 'Class-Section', 'Subject', 'Religion', 'House',
        'Role', 'Holiday', 'Event', 'Period', 'grade',
        '/master/subject', '/master/religion'
        , '/master/house', '/master/role', '/master/holiday', '/master/event', '/master/period', '/master/grade'];
    useEffect(() => {
        const currentRouteName = getRouteName();
        if (allowedRoutes.includes(previousRoute)) {
            // Call API if switching from one allowed route to another
            if (previousRoute !== currentRouteName) {
                callYourApiFunction();
            }
        }
        setPreviousRoute(currentRouteName);
        console.log("CurrentRouteName", currentRouteName);
    }, [location, routes, previousRoute]);

    const callYourApiFunction = async () => {
        console.log('Before fetchAllData');
        await dispatch(fetchAllData(schoolId, session));
        console.log('After fetchAllData');
    };
    const convertByteArrayToBase64 = (byteArray) => {
        return `data:image/jpeg;base64,${byteArray}`;
    };
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    const StatusIndicator = styled.div`
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #fff; // White border to ensure visibility against different backgrounds
        display: inline-block;
        background-color: ${(props) => (props.isOnline ? 'green' : 'red')};
    `;

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const getRouteName = () => {
        const route = routes.find(r => r && r.path === location.pathname); // Add null check
        if (route) {
            return route.name;
        } else {
            for (const mainRoute of routes) {
                if (mainRoute.subRoutes) {
                    const subRoute = mainRoute.subRoutes.find(sr => sr && sr.path === location.pathname); // Add null check
                    if (subRoute) {
                        return subRoute.name;
                    }
                }
            }
        }
        return 'Dashboard';
    };

    const showAnimation = {
        hidden: {width: 0, opacity: 0, transition: {duration: 0.5}},
        show: {opacity: 1, width: "auto", transition: {duration: 0.5}},
    };

    const handleSettingsItemClick = (path) => {
        handleCloseUserMenu();
        navigate(path);
    };

    return (<>
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}} onClick={toggleSidebar}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div" sx={{flexGrow: 1}}>
                    {getRouteName()}
                </Typography>
                <Box sx={{flexGrow: 0, display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <Tooltip
                        title={isOnline ? "You are online" : "You are offline. Please check your internet connection."}>
                        <StatusIndicator isOnline={isOnline}/>
                    </Tooltip>
                    {schoolData && (
                        <Typography variant="body1" sx={{color: 'inherit', marginRight: '16px'}}>
                            {schoolData.name}
                        </Typography>
                    )}
                    {session && (
                        <Typography variant="body1" sx={{color: 'inherit', marginRight: '16px'}}>
                            {session}
                        </Typography>
                    )}
                    <Tooltip title="Messages">
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon/>
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Updates">
                        <IconButton color="inherit">
                            <Badge badgeContent={notificationsCount} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar
                                alt="User Avatar"
                                src={userData?.logo ? convertByteArrayToBase64(userData.logo) : null}
                                style={{
                                    width: "40px",
                                    height: "40px", // Set the height of the avatar
                                    objectFit: "contain", // Ensure the logo fits within the avatar without cropping
                                    borderRadius: "50%", // Makes the avatar circular
                                    border: "1px solid #ccc", // Optional: Adds a subtle border for better visibility
                                    overflow: "hidden", // Ensures content stays inside the circle
                                }}
                            >
                                {!userData?.logo && schoolData?.name
                                    ? schoolData.name.charAt(0).toUpperCase()
                                    : null}
                            </Avatar>


                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                        keepMounted
                        transformOrigin={{vertical: 'top', horizontal: 'right'}}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting.name} onClick={() => handleSettingsItemClick(setting.path)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        <div className="main-container">
            <motion.div
                animate={{
                    width: isOpen ? "230px" : "60px", transition: {
                        duration: 0.5, type: "spring", damping: 10,
                    },
                }}
                className="sidebar"
                style={{height: '100vh', overflow: 'hidden'}}
            >
                <section className="routes"
                         style={{height: 'calc(100vh - 64px)', overflowY: 'auto', overflowX: 'hidden'}}>
                    {routes.map((route, index) => {
                        if (route.subRoutes) {
                            return (<SidebarMenu
                                key={route.path}
                                setIsOpen={setIsOpen}
                                route={route}
                                showAnimation={showAnimation}
                                isOpen={isOpen}
                            />);
                        }
                        return (<NavLink
                            to={route.path}
                            key={index}
                            className="link"
                            activeClassName="active"
                        >
                            <div className="icon">{route.icon}</div>
                            <AnimatePresence>
                                {isOpen && (<motion.div
                                    variants={showAnimation}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="link_text"
                                >
                                    {route.name}
                                </motion.div>)}
                            </AnimatePresence>
                        </NavLink>);
                    })}
                </section>
            </motion.div>
            <main style={{height: 'calc(100vh - 64px)', overflowY: 'auto', overflowX: 'hidden'}}>
                {children}
            </main>
        </div>
    </>);
};

export default StaffMain;
