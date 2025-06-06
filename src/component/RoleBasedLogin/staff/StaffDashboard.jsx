import Dashboard from "../../page/dashboard/Dashboard"


const StaffDashboard = () => {
   
    return (
        <>
            
<Dashboard 
showFeeSection={false} 
showAttendanceSection={true} 
onlyTeacherAttendance={true}   
showBirthdayContainer={true}
userType="Staff"  
// birthdays={staffBirthdays} 
/>
            
            </>
    )
}
export default StaffDashboard;
