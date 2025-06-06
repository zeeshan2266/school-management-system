import {useSelector} from "react-redux";
import DailyTaskList from "../../../page/daily-task/DailyTaskList";
import {useState} from "react";


const StudentAssigment = () => {
    const {dailyTaskList} = useSelector((state) => state.dailyTask);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDailyTask, setSelectedDailyTask] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);

    const filteredDailyTaskList = Array.isArray(dailyTaskList)
        ? dailyTaskList.filter((dailyTask) => {
            const type = dailyTask.type?.toLowerCase() || "";
            const title = dailyTask.title?.toLowerCase() || "";
            const className = dailyTask.className?.toLowerCase() || "";
            const query = searchQuery.toLowerCase();

            return (
                type.includes(query) ||
                title.includes(query) ||
                className.includes(query)
            );
        })
        : [];
    const handleViewDailyTask = (dailyTask) => {
        setSelectedDailyTask(dailyTask);
        setOpenDetails(true);
    };
    return (
        <>
            <DailyTaskList
                dailyTaskList={filteredDailyTaskList}

                onView={handleViewDailyTask}
            />
        </>
    )
}

export default StudentAssigment;