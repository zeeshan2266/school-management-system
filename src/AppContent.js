import "./App.css";
import {Route, Routes} from "react-router-dom";
import React from "react";
import Dashboard from "./component/page/dashboard/Dashboard";
import TimeTable from "./component/page/TimeTable";
import Academics from "./component/page/Academics";
import {Logout} from "./component/page/Logout";
import Expenses from "./component/page/expenses/Expenses";
import SideBar from "./component/Sidebar/SideBar";
import School from "./component/MainPage/schools/School";
import {Enquiry} from "./component/page/enquiry/Enquiry";
import {LandingPage} from "./component/MainPage/LandingPage";
import MainStudentAttendance from "./component/page/attendance/student/MainStudentAttendance";
import MainStaffAttendance from "./component/page/attendance/staff/MainStaffAttendance";
import StaffPage from "./component/page/staff/StaffPage";
import StaffDetails from "./component/page/staff/StaffDetails";
import Vehicles from "./component/page/Transports/transport/Vehicles";
import Student from "./component/page/student/Student";
import StudentDetails from "./component/page/student/StudentDetails";
import ClassSection from "./component/page/master/classsection/ClassSection";
import SubjectManagement from "./component/page/master/asignsubject/SubjectManagement";
import ReligionManagement from "./component/page/master/religion/ReligionManagement";
import MainHouse from "./component/page/master/house/MainHouse";
import DesignationManagement from "./component/page/master/roleresponsibility/DesignationManagement";
import HolidayManagement from "./component/page/master/holiday/HolidayManagement";
import EventManagement from "./component/page/master/event/EventManagement";
import TimeTableForm from "./component/page/timetable/TimeTableForm";
import PeriodManagement from "./component/page/master/periods/PeriodManagement";
import ExamManagement from "./component/page/exam/ExamManagement";
import GradeUpdateForm from "./component/page/exam/GradeUpdateForm";
import AdmitCard from "./component/page/exam/admitcard/AdmitCard";
import MarkSheet from "./component/page/exam/Marksheet";
import PrintPage from "./component/page/exam/admitcard/PrintPage";
import VehicleDetails from "./component/page/Transports/transport/VehicleDetails";
import LeaveManagement from "./component/page/attendance/leave/LeaveManagement";
import BookPage from "./component/page/library-books/BookPage";
import BorrowBook from "./component/page/library-books/BorrowBook";
import CheckFine from "./component/page/library-books/CheckFine";
import ReturnBook from "./component/page/library-books/ReturnBook";
import BonafideCertificate from "./component/page/certificate/bonafideCertificate/BonafideCertificate";
import CharacterCertificate from "./component/page/certificate/characterCertificate/CharacterCertificateForm";
import Profile from "./component/page/Profile";
import {useSelector} from "react-redux";
import StudentHome from "./component/RoleBasedLogin/student/StudentHome";
import StaffDashboard from "./component/RoleBasedLogin/staff/StaffDashboard";
import StaffMain from "../src/component/RoleBasedLogin/staff/StaffMain";
import DailyTaskPage from "./component/page/daily-task/DailyTaskPage";
import StudyMaterialsList from "./component/page/studymaterial/StudyMaterialsList";
import AddEditMaterial from "./component/page/studymaterial/AddEditMaterial";
import GalleryPage from "./component/page/gallary/GalleryPage";
import StaffSalaryPage from "./component/page/StaffSalary/StaffSalaryPage";
import SchoolAssetPage from "./component/page/SchoolAsset/SchoolAssetPage";
import HelpAndSupport from "./component/page/help&support/HelpAndSupport";
import Complian from "./component/page/complain/Compliant";
import Question from "./component/page/questionmcq/Question";
import AssignTeacher from "./component/page/master/assignteacher/AssignTeacher";
import PromotionMain from "./component/page/master/promotion/PromotionMain";
import GradeManagement from "./component/page/master/grade/GradeManagement";
import SyllabusComponent from "./component/page/master/syllabus/SyllabusList";
import FeeType from "./component/page/fee-module/fee-type/FeeType";
import FeeDeposit from "./component/page/fee-module/fee-deposit/FeeDeposit";
import SetFeeAmount from "./component/page/fee-module/fee-amout-set/SetFeeAmount";
import UpdatePassord from "./component/MainPage/UpdatePassword";
import FeeDueReport from "./component/page/fee-module/fee-due-report/FeeDueReport";
import MailService from "./component/page/communication/mail/MailService";
import ChatApp from "./component/page/communication/chat/ChatApp";
import AttendanceStaff from "./component/page/attendance/staff/AttendanceStaff";
import TestingWebRTC from "./component/page/TestWebRTC/TestingWebRTC";
import VideoRoom from "./component/page/communication/videoconference/VideoRoom";
import TransportPickup from "./component/page/Transports/Pickup/PickupPage"
import ExamMCQDashboard from "./component/page/master/mcq/ExamMCQDashboard";


LandingPage.propTypes = {};
export const AppContent = ({
                               flag,
                               handleBooleanChange,
                               setFlag,
                               userRole,
                           }) => {
    const user = useSelector((state) => state.userActual.userData);

    function getRoutesForStaff() {
        return (
            <>
                <Route path="/" element={<StaffDashboard/>}/>
                <Route path="/staff" element={<StaffPage/>}/>
                <Route path="/dailyTask" element={<DailyTaskPage/>}/>
                <Route path="/gallery" element={<GalleryPage/>}/>
                <Route path="/communication/mail" element={<MailService/>}/>
                <Route path="/communication/chat" element={<ChatApp/>}/>
                <Route path="/communication/meeting" element={<VideoRoom/>}/>
                <Route path="/attendance/staff" element={<AttendanceStaff/>}/>
                <Route path="/attendance/leave" element={<MainStaffAttendance/>}/>
                <Route path="/transport" element={<Vehicles/>}/>
                <Route path="/exam/result" element={<GradeUpdateForm/>}/>
                <Route path="/complaint" element={<Complian/>}/>
                <Route path="/help&support" element={<HelpAndSupport/>}/>
                <Route path="/settings" element={<TestingWebRTC/>}/>
                <Route path="/logout" element={<Logout setFlag={setFlag}/>}/>
            </>
        );
    }


    function getRoutesForStudent() {
        return (
            <>
                <Route path="/" element={<StudentHome/>}/>
                <Route path="/student" element={<Student/>}/>
                <Route path="/logout" element={<Logout setFlag={setFlag}/>}/>
            </>
        );
    }

    // Function to return routes based on the user role
    function getRoutesByRole() {
        if (
            user.role === "admin" ||
            user.role === "Admin" ||
            user.role === "super admin" ||
            user.role === "Super Admin" ||
            user.role === "super_admin"

        ) {
            return <SideBar>{getRoutesAndElement()}</SideBar>;
        } else if (user.role === "Teacher" || user.role === "teacher") {
            return (

                <StaffMain>
                    <Routes>
                        {getRoutesForStaff()}
                    </Routes>
                </StaffMain>
            );
        } else if (user.role === "Student" || user.role === "student") {
            return (
                <Routes>
                    {" "}
                    {/* Wrap routes for Student inside <Routes> */}
                    {getRoutesForStudent()}
                </Routes>
            );
        } else {
            return (
                <Routes>
                    {" "}
                    {/* Return a fallback route wrapped in <Routes> */}
                    <Route path="*" element={<div>Role not found</div>}/>
                </Routes>
            );
        }
    }

    function getRoutesAndElement() {
        return (
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/enquiry" element={<Enquiry/>}/>
                <Route path="/school" element={<School/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/student" element={<Student/>}/>


                <Route path="/student/:id" element={<StudentDetails/>}/>
                <Route path="/staff" element={<StaffPage/>}/>
                {/* <Route path="/staff-details" element={<StaffPage/>}/> */}
                <Route path="/staff/:staffId" element={<StaffDetails/>}/>

                <Route path="/book" element={<BookPage/>}/>
                <Route path="/borrow/:bookId" element={<BorrowBook/>}/>
                <Route path="/checkfine/:bookId" element={<CheckFine/>}/>
                <Route path="/returnbook/:bookId" element={<ReturnBook/>}/>
                <Route path="/dailyTask" element={<DailyTaskPage/>}/>
                <Route path="/transport/transports" element={<Vehicles/>}/>
                <Route path="/transport/Pickup" element={<TransportPickup/>}/>

                <Route path="/transport/:vehicleId" element={<VehicleDetails/>}/>
                <Route path="/gallery" element={<GalleryPage/>}/>

                <Route path="/attendance/staff" element={<MainStaffAttendance/>}/>
                <Route path="/attendance/student" element={<MainStudentAttendance/>}/>
                <Route path="/attendance/leave" element={<LeaveManagement/>}/>

                <Route path="/question" element={<Question/>}/>

                <Route path="/master/class" element={<ClassSection/>}/>
                <Route path="/master/subject" element={<SubjectManagement/>}/>
                <Route path="/master/religion" element={<ReligionManagement/>}/>
                <Route path="/master/house" element={<MainHouse/>}/>
                <Route path="/master/designation" element={<DesignationManagement/>}/>
                <Route path="/master/holiday" element={<HolidayManagement/>}/>
                <Route path="/master/event" element={<EventManagement/>}/>
                <Route path="/master/period" element={<PeriodManagement/>}/>
                <Route path="/master/grade" element={<GradeManagement/>}/>
                <Route path="/master/syllabus" element={<SyllabusComponent/>}/>
                <Route path="/master/promotion" element={<PromotionMain/>}/>
                <Route
                    path="/master/assing/class/teacher"
                    element={<AssignTeacher/>}
                />

                <Route path="/messages/mail" element={<MailService/>}/>
                {/*<Route path="/messages/chat" element={<MainChat/>}/>
                <Route path="/messages/notice" element={<StaffNotice/>}/>*/}

                <Route path="/exam/mcq" element={<ExamMCQDashboard/>}/>
                <Route path="/exam/create/edit" element={<ExamManagement/>}/>
                <Route path="/exam/result" element={<GradeUpdateForm/>}/>
                <Route path="/exam/admit" element={<AdmitCard/>}/>
                <Route path="/exam/print" element={<PrintPage/>}/>
                <Route path="/exam/marksheet" element={<MarkSheet/>}/>

                <Route path="/certificate/bonafide" element={<BonafideCertificate/>}/>
                <Route
                    path="/certificate/character"
                    element={<CharacterCertificate/>}
                />

                <Route path="/timeTable" element={<TimeTableForm/>}/>

                <Route path="/feeModule/feeType" element={<FeeType/>}/>
                <Route path="/feeModule/amount" element={<SetFeeAmount/>}/>
                <Route path="/feeModule/deposit" element={<FeeDeposit/>}/>
                <Route path="/feeModule/report" element={<FeeDueReport/>}/>
                <Route path="/feeModule/due/report" element={<FeeDueReport/>}/>

                <Route path="/timeTable" element={<TimeTable/>}/>
                <Route path="/expenses" element={<Expenses/>}/>
                <Route path="/academics" element={<Academics/>}/>

                <Route path="/asset" element={<SchoolAssetPage/>}/>
                <Route path="/salary" element={<StaffSalaryPage/>}/>

                <Route path="/complaint" element={<Complian/>}/>
                <Route path="/help&support" element={<HelpAndSupport/>}/>

                <Route path="/communication/mail" element={<MailService/>}/>
                <Route path="/communication/chat" element={<ChatApp/>}/>
                <Route path="/communication/meeting" element={<VideoRoom/>}/>

                <Route path="/settings" element={<TestingWebRTC/>}/>
                <Route path="/studymaterial" element={<StudyMaterialsList/>}/>
                <Route path="/addEditMaterial" element={<AddEditMaterial/>}/>

                <Route path="/logout" element={<Logout setFlag={setFlag}/>}/>
                <Route path="*" element={<> not found</>}/>
            </Routes>
        );
    }

    return (
        <>
            <>
                {flag ? (
                    <div>
                        <Routes>
                            <Route
                                path="/"
                                target="_blank"
                                element={<LandingPage onBooleanChange={handleBooleanChange}/>}
                            />
                            <Route path="/forgot" element={<UpdatePassord/>}/>
                        </Routes>
                    </div>
                ) : (
                    <div>{getRoutesByRole()}</div>
                )}
            </>
        </>
    );
};

