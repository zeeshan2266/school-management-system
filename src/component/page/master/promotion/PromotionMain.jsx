import React, {useState} from 'react';
import {Box, Tab, Tabs} from '@mui/material';
import PromotionStudent from './PromotionStudent';
import PromotionStaff from './PromotionStaff';
import PromotionSchool from "./PromotionSchool";

const PromotionMain = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{width: '100%', p: 2}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    centered
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Student Promotions"/>
                    <Tab label="Staff Promotions"/>
                    <Tab label="School Promotions"/>
                </Tabs>
            </Box>
            <Box sx={{mt: 2}}>
                {selectedTab === 0 && <PromotionStudent/>}
                {selectedTab === 1 && <PromotionStaff/>}
                {selectedTab === 2 && <PromotionSchool/>}
            </Box>
        </Box>
    );
};

export default PromotionMain;
