import MenuIcon from "@mui/icons-material/Menu";
import {AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import SidebarMenu from "../../../Sidebar/SidebarMenu";
import {NavLink, useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
import React, {useState} from "react";
import styled from "styled-components";
import {FaThLarge} from "react-icons/fa";
import ChatIcon from "@mui/icons-material/Chat";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VideoCallIcon from "@mui/icons-material/VideoCall";

const StudentSidebar = ({children}) => {

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
        navigate('/logout'); // Redirect to the logout route
    };
    const showAnimation = {
        hidden: {width: 0, opacity: 0, transition: {duration: 0.5}},
        show: {opacity: 1, width: "auto", transition: {duration: 0.5}},
    };
    const IconContainer = styled('div')(`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background-color: #2d2d2d;
        border-radius: 5px;
    `);
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
            path: '/studentAssigment',
            name: 'Assignment /D.A',
            icon: (
                <IconContainer>
                    <AssignmentTurnedInIcon style={{color: 'white', fontSize: '2rem'}}/>
                </IconContainer>
            )
        },
        {
            path: 'studentGallery',
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
            path: '/studentTransport',
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
        <div>
            <Box>
                {/* Sticky Header Section */}
                <AppBar position="sticky" sx={{backgroundColor: '#1976d2'}}>
                    <Toolbar>
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}
                                        onClick={toggleSidebar}>
                                <MenuIcon/>
                            </IconButton>
                            Student Portal
                        </Typography>
                        <IconButton onClick={handleMenuClick} color="inherit">
                            <Avatar>
                                <AccountCircleIcon/>
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
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
                        {/* <h2>hellp</h2> */}
                    </main>
                </div>


            </Box>
        </div>
    )
}

export default StudentSidebar;